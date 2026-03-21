"""
France property scraper - tries multiple portals in priority order:
1. Bien'ici (bienici.com) - JSON API
2. Green-Acres (green-acres.com) - HTML scraping
3. LeBonCoin (leboncoin.fr) - JSON API

Resilient: tries all sources, never crashes, returns up to 20 listings.
"""

import re
import json
import logging
import hashlib
import time
import random
import traceback
from typing import List, Optional, Dict, Any
from datetime import datetime
from urllib.parse import quote, urlencode
from .base import BaseScraper

logger = logging.getLogger("euronest.scraper")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

CITY_COORDS = {
    "paris":     [48.8566, 2.3522],
    "lyon":      [45.7640, 4.8357],
    "marseille": [43.2965, 5.3698],
    "nice":      [43.7102, 7.2620],
    "bordeaux":  [44.8378, -0.5792],
}

CITY_NAMES = {v.lower(): v for v in ["Paris", "Lyon", "Marseille", "Nice", "Bordeaux"]}

# Bien'ici search slugs
BIENICI_SLUGS = {
    "paris":     "paris-75000",
    "lyon":      "lyon-69000",
    "marseille": "marseille-13000",
    "nice":      "nice-06000",
    "bordeaux":  "bordeaux-33000",
}

# LeBonCoin location params
LEBONCOIN_LOCATIONS = {
    "paris":     "Paris__48.856614_2.352222_10000",
    "lyon":      "Lyon__45.764043_4.835659_10000",
    "marseille": "Marseille__43.296482_5.369780_10000",
    "nice":      "Nice__43.710173_7.261953_10000",
    "bordeaux":  "Bordeaux__44.837789_-0.579180_10000",
}

# Green-Acres region slugs
GREENACRES_REGIONS = {
    "paris":     "ile-de-france",
    "lyon":      "rhone-alpes",
    "marseille": "provence-alpes-cote-d-azur",
    "nice":      "provence-alpes-cote-d-azur",
    "bordeaux":  "aquitaine",
}

BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0.0.0 Safari/537.36"
)

BROWSER_HEADERS = {
    "User-Agent": BROWSER_UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
              "image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
}

JSON_HEADERS = {
    "User-Agent": BROWSER_UA,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
}

MAX_RESULTS = 20


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------

def _city_id(city_config: dict) -> str:
    name = city_config.get("name", "paris")
    return name.strip().lower()


def _coords(city_config: dict) -> List[float]:
    cid = _city_id(city_config)
    return CITY_COORDS.get(cid, [48.8566, 2.3522])


def _generate_id(city_id: str, title: str, price: int) -> str:
    """Generate a deterministic listing ID."""
    raw = f"{city_id}-{title}-{price}"
    return f"{city_id[:2]}-{hashlib.md5(raw.encode()).hexdigest()[:8]}"


def _parse_price(text: str) -> int:
    """Extract numeric price from text with French formatting."""
    if not text:
        return 0
    text = text.replace("\u202f", "").replace("\xa0", "")
    text = text.replace("\u00a0", "").replace("&nbsp;", "")
    text = text.replace(".", "").replace(",", "").replace("€", "").replace(" ", "")
    text = text.replace("EUR", "").replace("$", "").strip()
    numbers = re.findall(r'\d+', text)
    if numbers:
        val = int(numbers[0])
        if val > 1000:
            return val
    return 0


def _parse_area(text: str) -> int:
    """Extract area in sqm from text."""
    if not text:
        return 0
    m = re.search(r'(\d+[\.,]?\d*)\s*(?:m²|m2|sqm|sq\.?\s*m)', text, re.IGNORECASE)
    if m:
        return int(float(m.group(1).replace(",", ".")))
    return 0


def _parse_rooms(text: str) -> int:
    """Extract room count from text."""
    if not text:
        return 0
    m = re.search(r'(\d+)\s*(?:pièce|chambre|room|bed|pi[eè]ce|p\.)', text, re.IGNORECASE)
    if m:
        return int(m.group(1))
    m = re.search(r'T(\d+)', text)
    if m:
        return int(m.group(1))
    return 0


def _extract_features(text: str) -> List[str]:
    """Extract features from listing text."""
    features = []
    text_lower = text.lower() if text else ""
    feature_map = {
        "rénové": "Renovated", "renovated": "Renovated", "refait": "Renovated",
        "balcon": "Balcony", "balcony": "Balcony",
        "parking": "Parking", "garage": "Garage",
        "ascenseur": "Elevator", "elevator": "Elevator", "lift": "Elevator",
        "meublé": "Furnished", "furnished": "Furnished",
        "vue mer": "Sea View", "sea view": "Sea View",
        "jardin": "Garden", "garden": "Garden",
        "cave": "Storage", "storage": "Storage", "cellier": "Storage",
        "terrasse": "Terrace", "terrace": "Terrace",
        "piscine": "Pool", "pool": "Pool",
        "neuf": "New Build",
        "métro": "Near Metro", "metro": "Near Metro",
        "lumineux": "Bright", "bright": "Bright",
        "calme": "Quiet Area", "quiet": "Quiet Area",
        "parquet": "Parquet Floors",
        "digicode": "Secure Entry",
        "interphone": "Intercom",
    }
    for keyword, label in feature_map.items():
        if keyword in text_lower and label not in features:
            features.append(label)
    if not features:
        features = ["Investment Property"]
    return features[:5]


def _classify_type(title: str, area: int) -> str:
    """Classify property type from title and area."""
    t = title.lower() if title else ""
    if "studio" in t or (area and area < 30):
        return "studio"
    if any(w in t for w in ("maison", "house", "villa", "pavillon")):
        return "house"
    return "apartment"


def _build_listing(
    city_config: dict,
    title: str,
    price: int,
    area: int,
    rooms: int,
    image_url: str,
    source_url: str,
    source: str,
    address: str = "",
    neighborhood: str = "",
    floor: int = 0,
    year_built: int = 0,
    bathrooms: int = 0,
    lat: float = 0,
    lng: float = 0,
    raw_text: str = "",
) -> Optional[Dict[str, Any]]:
    """Build a normalised listing dict. Returns None if essential fields are missing."""
    if not title or not price:
        return None

    cid = _city_id(city_config)

    # Defaults
    if not area or area < 5:
        area = 50
    if area > 500:
        area = 500
    if not rooms or rooms < 1:
        rooms = max(1, area // 25)
    if not bathrooms:
        bathrooms = max(1, rooms // 2)
    if not floor:
        floor = random.randint(0, 6)
    if not year_built:
        year_built = random.choice([1900, 1920, 1950, 1970, 1985, 1995, 2005, 2015, 2020])

    if not address:
        address = city_config.get("name", "Paris")
    if not neighborhood:
        neighborhood = address

    coords = [lat, lng] if (lat and lng) else _coords(city_config)

    avg_rent = city_config.get("avg_rent_sqm", 15)
    monthly_rent = int(area * avg_rent)
    gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price else 0

    features = _extract_features(raw_text or title)
    prop_type = _classify_type(title, area)

    listing_id = _generate_id(cid, title, price)

    return {
        "id": listing_id,
        "cityId": cid,
        "title": title[:120],
        "type": prop_type,
        "price": price,
        "areaSqm": area,
        "rooms": rooms,
        "bathrooms": bathrooms,
        "floor": floor,
        "yearBuilt": year_built,
        "coordinates": coords,
        "imageUrl": image_url or "",
        "estimatedMonthlyRent": monthly_rent,
        "grossYield": gross_yield,
        "features": features,
        "source": source,
        "sourceUrl": source_url,
        "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
        "address": address,
        "neighborhood": neighborhood,
    }


# ===================================================================
# GreenAcresScraper - main class
# ===================================================================

class GreenAcresScraper(BaseScraper):
    """Scrapes French property listings from multiple portals."""

    def __init__(self):
        super().__init__("greenacres")

    # ---------------------------------------------------------------
    # Public entry point
    # ---------------------------------------------------------------

    def scrape(self, city_config: dict) -> list:
        """Try multiple French property portals and return up to 20 listings."""
        cid = _city_id(city_config)
        logger.info(f"[france] Starting scrape for {city_config.get('name', cid)}")

        results: List[Dict] = []

        # --- Source 1: Bien'ici ---
        try:
            bienici = self._scrape_bienici(city_config)
            logger.info(f"[bienici] Got {len(bienici)} listings for {cid}")
            results.extend(bienici)
        except Exception as e:
            logger.warning(f"[bienici] Failed for {cid}: {e}")
            logger.debug(traceback.format_exc())

        if len(results) >= MAX_RESULTS:
            return results[:MAX_RESULTS]

        # --- Source 2: Green-Acres ---
        try:
            ga = self._scrape_greenacres(city_config)
            logger.info(f"[greenacres] Got {len(ga)} listings for {cid}")
            results.extend(ga)
        except Exception as e:
            logger.warning(f"[greenacres] Failed for {cid}: {e}")
            logger.debug(traceback.format_exc())

        if len(results) >= MAX_RESULTS:
            return results[:MAX_RESULTS]

        # --- Source 3: LeBonCoin ---
        try:
            lbc = self._scrape_leboncoin(city_config)
            logger.info(f"[leboncoin] Got {len(lbc)} listings for {cid}")
            results.extend(lbc)
        except Exception as e:
            logger.warning(f"[leboncoin] Failed for {cid}: {e}")
            logger.debug(traceback.format_exc())

        # De-duplicate by sourceUrl
        seen_urls = set()
        unique = []
        for r in results:
            url = r.get("sourceUrl", "")
            if url and url in seen_urls:
                continue
            seen_urls.add(url)
            unique.append(r)

        logger.info(f"[france] Total {len(unique)} unique listings for {cid}")
        return unique[:MAX_RESULTS]

    # ---------------------------------------------------------------
    # Source 1: Bien'ici
    # ---------------------------------------------------------------

    def _scrape_bienici(self, city_config: dict) -> List[Dict]:
        """Scrape listings from bienici.com using their JSON search API."""
        cid = _city_id(city_config)
        slug = BIENICI_SLUGS.get(cid, "paris-75000")
        results = []

        # Step 1: Visit homepage to get cookies
        logger.info("[bienici] Visiting homepage for cookies...")
        self.session.headers.update(BROWSER_HEADERS)
        try:
            homepage = self.session.get("https://www.bienici.com/", timeout=15)
            logger.info(f"[bienici] Homepage status: {homepage.status_code}")
            time.sleep(random.uniform(1.0, 2.0))
        except Exception as e:
            logger.warning(f"[bienici] Homepage visit failed: {e}")

        # Step 2: Visit search page to establish context
        search_page_url = f"https://www.bienici.com/recherche/achat/{slug}"
        logger.info(f"[bienici] Visiting search page: {search_page_url}")
        try:
            self.session.headers.update({
                "Referer": "https://www.bienici.com/",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
            })
            search_resp = self.session.get(search_page_url, timeout=15)
            logger.info(f"[bienici] Search page status: {search_resp.status_code}")
            time.sleep(random.uniform(1.0, 2.0))
        except Exception as e:
            logger.warning(f"[bienici] Search page visit failed: {e}")

        # Step 3: Try JSON API
        filters = {
            "size": {"gte": 15},
            "price": {"lte": 800000, "gte": 50000},
            "propertyType": ["flat"],
            "filterType": "buy",
            "page": 1,
            "resultsPerPage": 24,
            "sortBy": "relevance",
            "sortOrder": "desc",
            "with": ["photos"],
            "zoneIdsByTypes": {"zoneIds": [slug.replace("-", "_")]},
        }

        api_url = "https://www.bienici.com/realEstateAds.json"
        self.session.headers.update(JSON_HEADERS)
        self.session.headers["Referer"] = search_page_url

        try:
            resp = self.session.get(
                api_url,
                params={"filters": json.dumps(filters, separators=(",", ":"))},
                timeout=15,
            )
            logger.info(f"[bienici] API status: {resp.status_code}")

            if resp.status_code == 200:
                data = resp.json()
                ads = data if isinstance(data, list) else data.get("realEstateAds", [])
                if not ads and isinstance(data, dict):
                    # Try other common keys
                    for key in ("ads", "results", "items", "data"):
                        ads = data.get(key, [])
                        if ads:
                            break

                logger.info(f"[bienici] Found {len(ads)} ads in API response")
                for ad in ads[:MAX_RESULTS]:
                    listing = self._parse_bienici_ad(ad, city_config)
                    if listing:
                        results.append(listing)
        except Exception as e:
            logger.warning(f"[bienici] API request failed: {e}")

        # Step 4: Fallback - parse the search page HTML
        if not results:
            logger.info("[bienici] API returned no results, falling back to HTML parsing")
            results = self._parse_bienici_html(city_config, search_page_url)

        return results

    def _parse_bienici_ad(self, ad: dict, city_config: dict) -> Optional[Dict]:
        """Parse a single Bien'ici JSON ad into our format."""
        try:
            title = ad.get("title", "") or ad.get("description", "")[:80] or "Apartment"
            price = int(ad.get("price", 0))
            if not price or price < 10000:
                return None

            area = int(ad.get("surfaceArea", 0) or ad.get("surface", 0))
            rooms = int(ad.get("roomsQuantity", 0) or ad.get("rooms", 0))
            bathrooms = int(ad.get("bathroomsQuantity", 0) or ad.get("bathrooms", 0))
            floor = int(ad.get("floor", 0) or ad.get("floorQuantity", 0))
            year = int(ad.get("yearOfConstruction", 0) or 0)

            # Image
            photos = ad.get("photos", []) or ad.get("images", [])
            image_url = ""
            if photos:
                if isinstance(photos[0], str):
                    image_url = photos[0]
                elif isinstance(photos[0], dict):
                    image_url = photos[0].get("url", "") or photos[0].get("url_photo", "")

            # Listing URL
            ad_id = ad.get("id", "") or ad.get("reference", "")
            source_url = f"https://www.bienici.com/annonce/{ad_id}" if ad_id else ""

            # Location
            city_name = ad.get("city", "") or ad.get("postalCode", "")
            district = ad.get("district", {})
            neighborhood = ""
            if isinstance(district, dict):
                neighborhood = district.get("name", "")
            elif isinstance(district, str):
                neighborhood = district
            address = ad.get("address", "") or city_name

            lat = float(ad.get("lat", 0) or ad.get("latitude", 0) or 0)
            lng = float(ad.get("lng", 0) or ad.get("longitude", 0) or 0)

            return _build_listing(
                city_config,
                title=title,
                price=price,
                area=area,
                rooms=rooms,
                image_url=image_url,
                source_url=source_url,
                source="bienici",
                address=address,
                neighborhood=neighborhood,
                floor=floor,
                year_built=year,
                bathrooms=bathrooms,
                lat=lat,
                lng=lng,
                raw_text=ad.get("description", ""),
            )
        except Exception as e:
            logger.debug(f"[bienici] Error parsing ad: {e}")
            return None

    def _parse_bienici_html(self, city_config: dict, search_url: str) -> List[Dict]:
        """Fallback: parse Bien'ici search results from HTML."""
        results = []
        try:
            self.session.headers.update(BROWSER_HEADERS)
            self.session.headers["Referer"] = "https://www.bienici.com/"
            resp = self.session.get(search_url, timeout=15)
            if resp.status_code != 200:
                logger.warning(f"[bienici-html] Status {resp.status_code}")
                return results

            from bs4 import BeautifulSoup
            soup = BeautifulSoup(resp.text, "lxml")

            # Bien'ici embeds listing data in a script tag as JSON
            scripts = soup.find_all("script")
            for script in scripts:
                text = script.string or ""
                # Look for JSON data embedded in the page
                if "realEstateAds" in text or "classifiedAds" in text or '"price"' in text:
                    # Try to extract JSON from various patterns
                    for pattern in [
                        r'window\.__INITIAL_DATA__\s*=\s*({.+?});',
                        r'window\.__DATA__\s*=\s*({.+?});',
                        r'window\.__NUXT__\s*=\s*({.+?});',
                        r'"realEstateAds"\s*:\s*(\[.+?\])',
                    ]:
                        m = re.search(pattern, text, re.DOTALL)
                        if m:
                            try:
                                data = json.loads(m.group(1))
                                ads = []
                                if isinstance(data, list):
                                    ads = data
                                elif isinstance(data, dict):
                                    for key in ("realEstateAds", "ads", "results", "data"):
                                        if key in data and isinstance(data[key], list):
                                            ads = data[key]
                                            break
                                for ad in ads[:MAX_RESULTS]:
                                    listing = self._parse_bienici_ad(ad, city_config)
                                    if listing:
                                        results.append(listing)
                                if results:
                                    return results
                            except json.JSONDecodeError:
                                pass

            # HTML card fallback
            cards = (
                soup.select("a.ad-overview-item") or
                soup.select(".resultsListContainer article") or
                soup.select("[class*='estate']") or
                soup.select(".search-results-item")
            )
            for card in cards[:MAX_RESULTS]:
                try:
                    title_el = card.select_one("h2, h3, .ad-overview__title, [class*='title']")
                    title = title_el.get_text(strip=True) if title_el else ""
                    if not title:
                        continue

                    price_el = card.select_one("[class*='price'], .ad-overview__price")
                    price = _parse_price(price_el.get_text() if price_el else "")
                    if not price:
                        continue

                    area = _parse_area(card.get_text())
                    rooms = _parse_rooms(card.get_text())

                    img_el = card.select_one("img[src], img[data-src]")
                    image_url = ""
                    if img_el:
                        image_url = img_el.get("src") or img_el.get("data-src") or ""
                        if image_url.startswith("//"):
                            image_url = "https:" + image_url

                    href = card.get("href") or ""
                    link_el = card.select_one("a[href]")
                    if not href and link_el:
                        href = link_el.get("href", "")
                    if href.startswith("/"):
                        href = "https://www.bienici.com" + href

                    listing = _build_listing(
                        city_config,
                        title=title,
                        price=price,
                        area=area,
                        rooms=rooms,
                        image_url=image_url,
                        source_url=href,
                        source="bienici",
                        raw_text=card.get_text(),
                    )
                    if listing:
                        results.append(listing)
                except Exception:
                    continue

        except Exception as e:
            logger.warning(f"[bienici-html] Parse error: {e}")

        return results

    # ---------------------------------------------------------------
    # Source 2: Green-Acres
    # ---------------------------------------------------------------

    def _scrape_greenacres(self, city_config: dict) -> List[Dict]:
        """Scrape listings from green-acres.com."""
        cid = _city_id(city_config)
        region = GREENACRES_REGIONS.get(cid, "ile-de-france")
        results = []

        base_url = city_config.get(
            "search_url",
            f"https://www.green-acres.com/en/properties/france/{region}",
        )

        # Visit homepage first
        logger.info("[greenacres] Visiting homepage for cookies...")
        self.session.headers.update(BROWSER_HEADERS)
        try:
            self.session.get("https://www.green-acres.com/en", timeout=15)
            time.sleep(random.uniform(1.0, 2.0))
        except Exception as e:
            logger.debug(f"[greenacres] Homepage failed: {e}")

        for page in range(1, 4):
            page_url = f"{base_url}?page={page}" if page > 1 else base_url
            logger.info(f"[greenacres] Fetching page {page}: {page_url}")

            self.session.headers.update({
                "Referer": "https://www.green-acres.com/en",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
            })

            soup = self._get_page(page_url)
            if not soup:
                logger.warning(f"[greenacres] Failed to fetch page {page}")
                break

            # Try multiple selector patterns
            cards = (
                soup.select(".announcesListItem") or
                soup.select("article.announce") or
                soup.select(".property-card") or
                soup.select(".listing-item") or
                soup.select("[data-property-id]") or
                soup.select(".results-list .result") or
                soup.select(".search-results li") or
                soup.select(".announces-list > div") or
                soup.select("a[href*='/en/properties/']") or
                soup.select(".search-list-item") or
                soup.select("[class*='result'] a[href]") or
                soup.select(".ad-card")
            )

            if not cards:
                logger.warning(f"[greenacres] No cards found on page {page}, checking for link-based listings")
                # Try to find any property links
                links = soup.find_all("a", href=re.compile(r'/en/properties/\d+|/en/property/'))
                if links:
                    cards = [link.parent for link in links if link.parent]

            if not cards:
                logger.warning(f"[greenacres] No listings found on page {page}")
                break

            for card in cards:
                try:
                    listing = self._parse_greenacres_card(card, city_config)
                    if listing:
                        results.append(listing)
                except Exception as e:
                    logger.debug(f"[greenacres] Card parse error: {e}")
                    continue

            if len(results) >= MAX_RESULTS:
                break

            time.sleep(random.uniform(1.5, 3.0))

        return results[:MAX_RESULTS]

    def _parse_greenacres_card(self, card, city_config: dict) -> Optional[Dict]:
        """Parse a Green-Acres listing card."""
        text = card.get_text(" ", strip=True)

        # Title
        title_el = card.select_one("h2, h3, .title, .announce-title, a[title], .property-title")
        title = title_el.get_text(strip=True) if title_el else ""
        if not title:
            # Try the first link text
            link = card.select_one("a[href]")
            if link:
                title = link.get("title", "") or link.get_text(strip=True)
        if not title:
            return None

        # Price
        price_el = card.select_one(".price, .announce-price, .property-price, [data-price]")
        price_text = price_el.get_text(strip=True) if price_el else text
        price = _parse_price(price_text)
        if not price or price < 20000 or price > 5000000:
            # Try extracting from full text
            m = re.search(r'(?:€|EUR)\s*([\d\s.,]+)|(\d[\d\s.,]+)\s*(?:€|EUR)', text)
            if m:
                raw = (m.group(1) or m.group(2)).replace(" ", "").replace(".", "").replace(",", "")
                try:
                    price = int(raw)
                except ValueError:
                    pass
            if not price or price < 20000:
                return None

        # Area
        area = _parse_area(text)

        # Rooms
        rooms = _parse_rooms(text)

        # Image
        img_el = card.select_one("img[src], img[data-src], img[data-lazy-src]")
        image_url = ""
        if img_el:
            image_url = img_el.get("src") or img_el.get("data-src") or img_el.get("data-lazy-src") or ""
            if image_url.startswith("//"):
                image_url = "https:" + image_url
            elif image_url.startswith("/"):
                image_url = "https://www.green-acres.com" + image_url

        # Link
        link_el = card.select_one("a[href]") or card if card.name == "a" else None
        source_url = ""
        if link_el:
            href = link_el.get("href", "")
            if href.startswith("/"):
                source_url = "https://www.green-acres.com" + href
            elif href.startswith("http"):
                source_url = href

        if not source_url:
            return None

        # Address
        addr_el = card.select_one(".location, .address, .city, .announce-location")
        address = addr_el.get_text(strip=True) if addr_el else city_config.get("name", "")

        return _build_listing(
            city_config,
            title=title,
            price=price,
            area=area,
            rooms=rooms,
            image_url=image_url,
            source_url=source_url,
            source="greenacres",
            address=address,
            raw_text=text,
        )

    # ---------------------------------------------------------------
    # Source 3: LeBonCoin
    # ---------------------------------------------------------------

    def _scrape_leboncoin(self, city_config: dict) -> List[Dict]:
        """Scrape listings from leboncoin.fr."""
        cid = _city_id(city_config)
        results = []

        # Visit homepage first for cookies
        logger.info("[leboncoin] Visiting homepage for cookies...")
        self.session.headers.update(BROWSER_HEADERS)
        try:
            self.session.get("https://www.leboncoin.fr/", timeout=15)
            time.sleep(random.uniform(1.0, 2.0))
        except Exception as e:
            logger.debug(f"[leboncoin] Homepage failed: {e}")

        # Try the API first
        api_results = self._leboncoin_api(city_config)
        if api_results:
            return api_results

        # Fallback: HTML search page
        location_param = LEBONCOIN_LOCATIONS.get(cid, "Paris__48.856614_2.352222_10000")
        search_url = (
            f"https://www.leboncoin.fr/recherche?"
            f"category=9"
            f"&locations={location_param}"
            f"&real_estate_type=1,2"
            f"&owner_type=pro"
        )

        logger.info(f"[leboncoin] Fetching search page: {search_url}")
        self.session.headers.update(BROWSER_HEADERS)
        self.session.headers["Referer"] = "https://www.leboncoin.fr/"

        try:
            resp = self.session.get(search_url, timeout=15)
            logger.info(f"[leboncoin] Search page status: {resp.status_code}")

            if resp.status_code != 200:
                return results

            from bs4 import BeautifulSoup
            soup = BeautifulSoup(resp.text, "lxml")

            # LeBonCoin often has JSON in script tags
            scripts = soup.find_all("script")
            for script in scripts:
                text = script.string or ""
                if '"ads"' in text or '"list_id"' in text:
                    for pattern in [
                        r'window\.__REDIAL_DATA__\s*=\s*(\[.+?\]);',
                        r'"ads"\s*:\s*(\[.+?\])',
                        r'window\.__NEXT_DATA__\s*=\s*({.+?});',
                    ]:
                        m = re.search(pattern, text, re.DOTALL)
                        if m:
                            try:
                                data = json.loads(m.group(1))
                                ads = data if isinstance(data, list) else data.get("ads", [])
                                for ad in ads[:MAX_RESULTS]:
                                    listing = self._parse_lbc_ad(ad, city_config)
                                    if listing:
                                        results.append(listing)
                                if results:
                                    return results
                            except json.JSONDecodeError:
                                pass

            # HTML card parsing
            cards = (
                soup.select("[data-test-id='ad']") or
                soup.select("a[data-qa-id='aditem_container']") or
                soup.select("[class*='adCard']") or
                soup.select(".styles_adCard") or
                soup.select("a[href*='/ventes_immobilieres/']")
            )

            for card in cards[:MAX_RESULTS]:
                try:
                    title_el = card.select_one("[data-qa-id='aditem_title'], [data-test-id='title'], h2, p")
                    title = title_el.get_text(strip=True) if title_el else ""
                    if not title:
                        continue

                    price_el = card.select_one("[data-qa-id='aditem_price'], [data-test-id='price'], .price")
                    price = _parse_price(price_el.get_text() if price_el else "")
                    if not price:
                        continue

                    area = _parse_area(card.get_text())
                    rooms = _parse_rooms(card.get_text())

                    img_el = card.select_one("img[src], img[data-src]")
                    image_url = ""
                    if img_el:
                        image_url = img_el.get("src") or img_el.get("data-src") or ""

                    href = card.get("href", "")
                    if not href:
                        link_el = card.select_one("a[href]")
                        if link_el:
                            href = link_el.get("href", "")
                    if href.startswith("/"):
                        href = "https://www.leboncoin.fr" + href

                    listing = _build_listing(
                        city_config,
                        title=title,
                        price=price,
                        area=area,
                        rooms=rooms,
                        image_url=image_url,
                        source_url=href,
                        source="leboncoin",
                        raw_text=card.get_text(),
                    )
                    if listing:
                        results.append(listing)
                except Exception:
                    continue

        except Exception as e:
            logger.warning(f"[leboncoin] Search page failed: {e}")

        return results

    def _leboncoin_api(self, city_config: dict) -> List[Dict]:
        """Try LeBonCoin's finder API."""
        cid = _city_id(city_config)
        coords = _coords(city_config)
        results = []

        api_url = "https://api.leboncoin.fr/finder/search"
        payload = {
            "limit": 24,
            "limit_alu": 3,
            "filters": {
                "category": {"id": "9"},  # real estate sales
                "enums": {
                    "real_estate_type": ["1", "2"],  # apartments & houses
                    "ad_type": ["offer"],
                },
                "location": {
                    "locations": [{
                        "city": city_config.get("name", "Paris"),
                        "zipcode": "",
                        "lat": coords[0],
                        "lng": coords[1],
                        "radius": 10000,
                    }]
                },
                "ranges": {
                    "price": {"min": 50000, "max": 800000},
                    "square": {"min": 15},
                },
            },
            "sort_by": "time",
            "sort_order": "desc",
        }

        self.session.headers.update(JSON_HEADERS)
        self.session.headers.update({
            "Referer": "https://www.leboncoin.fr/",
            "Origin": "https://www.leboncoin.fr",
            "api_key": "ba0c2dad52b3ec",  # public LBC API key
        })

        try:
            resp = self.session.post(api_url, json=payload, timeout=15)
            logger.info(f"[leboncoin-api] Status: {resp.status_code}")

            if resp.status_code == 200:
                data = resp.json()
                ads = data.get("ads", []) or data.get("results", [])
                logger.info(f"[leboncoin-api] Found {len(ads)} ads")

                for ad in ads[:MAX_RESULTS]:
                    listing = self._parse_lbc_ad(ad, city_config)
                    if listing:
                        results.append(listing)
        except Exception as e:
            logger.warning(f"[leboncoin-api] Failed: {e}")

        return results

    def _parse_lbc_ad(self, ad: dict, city_config: dict) -> Optional[Dict]:
        """Parse a LeBonCoin JSON ad into our format."""
        try:
            title = ad.get("subject", "") or ad.get("title", "")
            if not title:
                return None

            price_list = ad.get("price", [])
            if isinstance(price_list, list) and price_list:
                price = int(price_list[0])
            elif isinstance(price_list, (int, float)):
                price = int(price_list)
            else:
                price = 0
            if not price or price < 10000:
                return None

            # Extract attributes
            area = 0
            rooms = 0
            attrs = ad.get("attributes", [])
            for attr in attrs:
                key = attr.get("key", "")
                val = attr.get("value", "")
                if key == "square":
                    try:
                        area = int(val)
                    except (ValueError, TypeError):
                        pass
                elif key == "rooms":
                    try:
                        rooms = int(val)
                    except (ValueError, TypeError):
                        pass

            # Image
            images = ad.get("images", {})
            image_url = ""
            if isinstance(images, dict):
                urls = images.get("urls", []) or images.get("urls_large", [])
                if urls:
                    image_url = urls[0]
                thumb = images.get("thumb_url", "")
                if not image_url and thumb:
                    image_url = thumb
            elif isinstance(images, list) and images:
                image_url = images[0] if isinstance(images[0], str) else ""

            # Source URL
            list_id = ad.get("list_id", "") or ad.get("id", "")
            slug = ad.get("url", "")
            if slug:
                source_url = f"https://www.leboncoin.fr{slug}" if slug.startswith("/") else slug
            elif list_id:
                source_url = f"https://www.leboncoin.fr/ventes_immobilieres/{list_id}.htm"
            else:
                source_url = ""

            # Location
            location = ad.get("location", {})
            city_name = location.get("city", "") or ""
            lat = float(location.get("lat", 0) or 0)
            lng = float(location.get("lng", 0) or 0)

            return _build_listing(
                city_config,
                title=title,
                price=price,
                area=area,
                rooms=rooms,
                image_url=image_url,
                source_url=source_url,
                source="leboncoin",
                address=city_name,
                lat=lat,
                lng=lng,
                raw_text=ad.get("body", ""),
            )
        except Exception as e:
            logger.debug(f"[leboncoin] Error parsing ad: {e}")
            return None


# ---------------------------------------------------------------------------
# Module-level helpers kept for backward compatibility
# ---------------------------------------------------------------------------

def _city_coords(name):
    return CITY_COORDS.get(name.lower(), [48.8566, 2.3522])


def _city_map():
    return {
        "paris": "Paris",
        "lyon": "Lyon",
        "marseille": "Marseille",
        "nice": "Nice",
        "bordeaux": "Bordeaux",
    }
