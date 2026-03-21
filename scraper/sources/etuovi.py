"""
Finland property scraper - tries Oikotie JSON API first, falls back to Etuovi HTML.
"""
import re
import json
import logging
import random
import hashlib
from typing import List, Optional
from datetime import datetime
from .base import BaseScraper

logger = logging.getLogger("euronest.scraper")

# ---------------------------------------------------------------------------
# City metadata
# ---------------------------------------------------------------------------

CITY_COORDS = {
    "Helsinki": [60.1699, 24.9384],
    "Tampere": [61.4978, 23.7610],
    "Turku": [60.4518, 22.2666],
    "Oulu": [65.0121, 25.4651],
}

CITY_MAP = {
    "helsinki": "Helsinki",
    "tampere": "Tampere",
    "turku": "Turku",
    "oulu": "Oulu",
}

# Oikotie uses a location-code array per city
OIKOTIE_LOCATIONS = {
    "Helsinki": [[64, 6, "Helsinki"]],
    "Tampere": [[64, 6, "Tampere"]],
    "Turku": [[64, 6, "Turku"]],
    "Oulu": [[64, 6, "Oulu"]],
}

# Finnish feature keywords -> display label
FEATURE_MAP = {
    "sauna": "Sauna",
    "parveke": "Balcony",
    "balcony": "Balcony",
    "autopaikka": "Parking",
    "parking": "Parking",
    "hissi": "Elevator",
    "elevator": "Elevator",
    "kalustettu": "Furnished",
    "furnished": "Furnished",
    "merin\u00e4k\u00f6ala": "Sea View",
    "sea view": "Sea View",
    "piha": "Garden",
    "garden": "Garden",
    "varasto": "Storage",
    "storage": "Storage",
    "terassi": "Terrace",
    "terrace": "Terrace",
    "uima-allas": "Pool",
    "pool": "Pool",
    "uudiskohde": "New Build",
    "remontoitu": "Renovated",
    "renovated": "Renovated",
    "keskusta": "Central Location",
    "rauhallinen": "Quiet Area",
}


class EtuoviScraper(BaseScraper):
    """Scrapes Finnish property listings from Oikotie (primary) and Etuovi (fallback)."""

    def __init__(self):
        super().__init__("etuovi")

    # -----------------------------------------------------------------------
    # Public entry point
    # -----------------------------------------------------------------------

    def scrape(self, city_config: dict) -> list:
        """Scrape apartments for sale from Finnish portals."""
        city_name = city_config.get("name", "Helsinki")
        logger.info(f"[finland] Starting scrape for {city_name}")

        # Try Oikotie first
        results = self._scrape_oikotie(city_config)
        if results:
            logger.info(f"[oikotie] Got {len(results)} listings for {city_name}")
            return results[:20]

        # Fall back to Etuovi
        logger.info(f"[oikotie] No results, falling back to Etuovi for {city_name}")
        results = self._scrape_etuovi(city_config)
        logger.info(f"[etuovi] Got {len(results)} listings for {city_name}")
        return results[:20]

    # -----------------------------------------------------------------------
    # Source 1: Oikotie JSON API
    # -----------------------------------------------------------------------

    def _scrape_oikotie(self, city_config: dict) -> list:
        city_name = city_config.get("name", "Helsinki")
        results: list = []

        try:
            # Step 1 - visit the search page to establish cookies / session
            init_url = "https://asunnot.oikotie.fi/myytavat-asunnot"
            logger.info(f"[oikotie] Initialising session via {init_url}")
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7",
                "Referer": "https://asunnot.oikotie.fi/",
            })

            try:
                init_resp = self.session.get(init_url, timeout=15)
                logger.info(f"[oikotie] Init page status: {init_resp.status_code}")
            except Exception as e:
                logger.warning(f"[oikotie] Could not reach init page: {e}")
                return []

            # Step 2 - call the cards API
            locations = OIKOTIE_LOCATIONS.get(city_name, [[64, 6, city_name]])
            api_url = "https://asunnot.oikotie.fi/api/cards"

            params = {
                "cardType": 100,
                "locations": json.dumps(locations),
                "habitationType[]": 1,
                "buildingType[]": 1,
                "limit": 24,
                "offset": 0,
                "sortBy": "published_sort_desc",
            }

            self.session.headers.update({
                "Accept": "application/json, text/plain, */*",
                "OTA-loaded": "true",
                "Referer": f"https://asunnot.oikotie.fi/myytavat-asunnot?locations={json.dumps(locations)}",
                "X-Requested-With": "XMLHttpRequest",
            })

            import time
            time.sleep(random.uniform(1.5, 3.0))

            resp = self.session.get(api_url, params=params, timeout=15)
            logger.info(f"[oikotie] API status: {resp.status_code}")

            if resp.status_code != 200:
                logger.warning(f"[oikotie] API returned {resp.status_code}")
                return []

            data = resp.json()

            # The API may return cards under different keys
            cards = (
                data.get("cards")
                or data.get("data", {}).get("cards")
                or data.get("results")
                or data.get("hits")
                or []
            )

            if not cards:
                # Maybe the whole response is a list
                if isinstance(data, list):
                    cards = data
                else:
                    logger.warning(f"[oikotie] No cards in response (keys: {list(data.keys()) if isinstance(data, dict) else 'N/A'})")
                    return []

            logger.info(f"[oikotie] Found {len(cards)} cards in API response")

            for card in cards:
                try:
                    listing = self._parse_oikotie_card(card, city_config)
                    if listing:
                        results.append(listing)
                        if len(results) >= 20:
                            break
                except Exception as e:
                    logger.debug(f"[oikotie] Error parsing card: {e}")
                    continue

        except Exception as e:
            logger.warning(f"[oikotie] Scrape failed for {city_name}: {e}")

        return results

    def _parse_oikotie_card(self, card: dict, city_config: dict) -> Optional[dict]:
        """Parse a single Oikotie API card into a property dict."""
        if not isinstance(card, dict):
            return None

        city_name = city_config.get("name", "Helsinki")
        city_id = city_name.lower()

        # Title - try several field names
        title = (
            card.get("buildingData", {}).get("address")
            or card.get("title")
            or card.get("address")
            or card.get("heading")
            or card.get("name")
            or ""
        )
        if not title:
            return None

        # Price
        price = 0
        for key in ("price", "salesPrice", "sellingPrice", "totalPrice"):
            raw = card.get(key) or card.get("buildingData", {}).get(key)
            if raw:
                price = self._parse_price_value(raw)
                if price:
                    break
        if not price:
            raw_price_text = card.get("priceText") or card.get("formattedPrice") or ""
            price = self._parse_price_text(raw_price_text)
        if not price or price < 20000 or price > 5000000:
            return None

        # Area
        area = 0
        for key in ("size", "area", "livingArea", "surfaceArea"):
            raw = card.get(key) or card.get("buildingData", {}).get(key)
            if raw:
                area = self._safe_float_to_int(raw)
                if area:
                    break
        if not area:
            size_text = card.get("sizeText") or ""
            m = re.search(r'([\d.,]+)', size_text)
            if m:
                area = int(float(m.group(1).replace(",", ".")))
        if not area or area < 10:
            area = 55

        # Rooms
        rooms = 2
        room_config = (
            card.get("roomConfiguration")
            or card.get("rooms")
            or card.get("buildingData", {}).get("roomConfiguration")
            or ""
        )
        if isinstance(room_config, str):
            rooms = self._parse_finnish_rooms(room_config)
        elif isinstance(room_config, (int, float)) and room_config > 0:
            rooms = int(room_config)

        # Floor
        floor = 0
        for key in ("floor", "floorNumber"):
            raw = card.get(key) or card.get("buildingData", {}).get(key)
            if raw:
                floor = self._safe_float_to_int(raw)
                if floor:
                    break
        if not floor:
            floor_text = card.get("floorText") or ""
            m = re.search(r'(\d+)', floor_text)
            if m:
                floor = int(m.group(1))
        if not floor:
            floor = random.randint(1, 5)

        # Year built
        year_built = 0
        for key in ("buildYear", "yearBuilt", "constructionYear"):
            raw = card.get(key) or card.get("buildingData", {}).get(key)
            if raw:
                year_built = self._safe_float_to_int(raw)
                if year_built and 1800 < year_built < 2030:
                    break
                year_built = 0
        if not year_built:
            year_built = random.choice([1960, 1975, 1985, 1995, 2005, 2015])

        # Image
        image_url = ""
        images = card.get("images") or card.get("image") or card.get("photos") or []
        if isinstance(images, list) and images:
            first = images[0]
            if isinstance(first, dict):
                image_url = first.get("url") or first.get("src") or first.get("original") or ""
            elif isinstance(first, str):
                image_url = first
        elif isinstance(images, dict):
            image_url = images.get("url") or images.get("src") or ""
        if not image_url:
            image_url = card.get("imageUrl") or card.get("thumbnailUrl") or card.get("mainImage") or ""

        # Source URL
        card_id = card.get("id") or card.get("cardId") or card.get("slug") or ""
        if card_id:
            source_url = f"https://asunnot.oikotie.fi/myytavat-asunnot/{city_id}/{card_id}"
        else:
            source_url = card.get("url") or card.get("link") or ""
        if not source_url:
            return None  # must have a real URL

        # Location / address / neighborhood
        address = (
            card.get("buildingData", {}).get("address")
            or card.get("address")
            or card.get("location")
            or title
        )
        neighborhood = (
            card.get("buildingData", {}).get("district")
            or card.get("district")
            or card.get("neighborhood")
            or card.get("area")
            or address
        )
        if isinstance(neighborhood, (int, float)):
            neighborhood = address

        # Coordinates
        lat = card.get("coordinates", {}).get("latitude") or card.get("lat") or 0
        lon = card.get("coordinates", {}).get("longitude") or card.get("lng") or card.get("lon") or 0
        if lat and lon:
            coords = [float(lat), float(lon)]
        else:
            base = CITY_COORDS.get(city_name, [60.1699, 24.9384])
            coords = [
                round(base[0] + random.uniform(-0.02, 0.02), 4),
                round(base[1] + random.uniform(-0.02, 0.02), 4),
            ]

        # Features
        features = self._extract_features_from_text(
            f"{title} {room_config} {card.get('description', '')} "
            f"{card.get('buildingData', {}).get('description', '')}"
        )

        # Investment metrics
        avg_rent = city_config.get("avg_rent_sqm", 22)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price else 0

        # Property type
        prop_type = "apartment"
        t = title.lower()
        if "yksi\u00f6" in t or "studio" in t or area < 30:
            prop_type = "studio"
        elif any(w in t for w in ("omakotitalo", "rivitalo", "talo", "house", "villa")):
            prop_type = "house"

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, title, price)

        return {
            "id": listing_id,
            "cityId": city_id,
            "title": title[:100],
            "type": prop_type,
            "price": price,
            "areaSqm": area,
            "rooms": rooms,
            "bathrooms": max(1, rooms // 2),
            "floor": floor,
            "yearBuilt": year_built,
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": features,
            "source": "oikotie",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": str(address)[:120],
            "neighborhood": str(neighborhood)[:80],
        }

    # -----------------------------------------------------------------------
    # Source 2: Etuovi HTML scraping (fallback)
    # -----------------------------------------------------------------------

    def _scrape_etuovi(self, city_config: dict) -> list:
        city_name = city_config.get("name", "Helsinki")
        city_slug = city_name.lower()
        results: list = []

        # Reset headers back to HTML mode
        self.session.headers.update({
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7",
        })
        # Remove Oikotie-specific headers if present
        self.session.headers.pop("OTA-loaded", None)
        self.session.headers.pop("X-Requested-With", None)

        base_url = city_config.get(
            "search_url",
            f"https://www.etuovi.com/myytavat-asunnot/{city_slug}",
        )

        try:
            for page_num in range(1, 4):
                page_url = base_url if page_num == 1 else f"{base_url}?page={page_num}"
                logger.info(f"[etuovi] Fetching page {page_num}: {page_url}")

                soup = self._get_page(page_url)
                if not soup:
                    logger.warning(f"[etuovi] Failed to fetch page {page_num}")
                    break

                # Try several selector strategies
                cards = (
                    soup.select("[class*='ListPage__cardContainer']")
                    or soup.select("[class*='ResultList'] [class*='Card']")
                    or soup.select("[data-test-id='result-card']")
                    or soup.select("article[class*='card']")
                    or soup.select(".listing-card")
                    or soup.select("[class*='result'] a[href*='/kohde/']")
                    or soup.select("a[href*='/kohde/']")
                )

                if not cards:
                    logger.warning(f"[etuovi] No cards found on page {page_num}")
                    # Try extracting from embedded JSON / next-data
                    json_results = self._try_etuovi_json(soup, city_config)
                    if json_results:
                        results.extend(json_results)
                    break

                logger.info(f"[etuovi] Found {len(cards)} cards on page {page_num}")

                for card in cards:
                    try:
                        listing = self._parse_etuovi_card(card, city_config)
                        if listing:
                            results.append(listing)
                            if len(results) >= 20:
                                break
                    except Exception as e:
                        logger.debug(f"[etuovi] Error parsing card: {e}")
                        continue

                if len(results) >= 20:
                    break

        except Exception as e:
            logger.warning(f"[etuovi] Scrape failed for {city_name}: {e}")

        return results

    def _try_etuovi_json(self, soup, city_config: dict) -> list:
        """Try to extract listings from embedded JSON (__NEXT_DATA__ or similar)."""
        results = []
        try:
            # Next.js apps often embed data in a script tag
            script = soup.select_one("script#__NEXT_DATA__")
            if script and script.string:
                data = json.loads(script.string)
                # Navigate to listings - structure varies
                props = data.get("props", {}).get("pageProps", {})
                listings = (
                    props.get("listings")
                    or props.get("results")
                    or props.get("cards")
                    or props.get("searchResults", {}).get("listings")
                    or props.get("searchResults", {}).get("results")
                    or []
                )
                logger.info(f"[etuovi] Found {len(listings)} listings in __NEXT_DATA__")
                for item in listings[:20]:
                    listing = self._parse_etuovi_json_item(item, city_config)
                    if listing:
                        results.append(listing)
        except Exception as e:
            logger.debug(f"[etuovi] __NEXT_DATA__ extraction failed: {e}")

        if not results:
            # Try generic JSON-LD
            try:
                for script in soup.select('script[type="application/ld+json"]'):
                    if script.string:
                        ld = json.loads(script.string)
                        if isinstance(ld, list):
                            for item in ld:
                                if item.get("@type") in ("RealEstateListing", "Product", "Offer"):
                                    listing = self._parse_ld_json(item, city_config)
                                    if listing:
                                        results.append(listing)
            except Exception as e:
                logger.debug(f"[etuovi] JSON-LD extraction failed: {e}")

        return results

    def _parse_etuovi_json_item(self, item: dict, city_config: dict) -> Optional[dict]:
        """Parse a listing from Etuovi embedded JSON."""
        if not isinstance(item, dict):
            return None

        city_name = city_config.get("name", "Helsinki")
        city_id = city_name.lower()

        title = item.get("address") or item.get("title") or item.get("heading") or ""
        if not title:
            return None

        price = self._parse_price_value(item.get("price") or item.get("salesPrice") or 0)
        if not price or price < 20000:
            return None

        area = self._safe_float_to_int(item.get("size") or item.get("area") or item.get("livingArea") or 0)
        if not area or area < 10:
            area = 55

        rooms = 2
        rc = item.get("roomConfiguration") or item.get("rooms") or ""
        if isinstance(rc, str):
            rooms = self._parse_finnish_rooms(rc)
        elif isinstance(rc, (int, float)) and rc > 0:
            rooms = int(rc)

        item_id = item.get("id") or item.get("cardId") or item.get("slug") or ""
        source_url = f"https://www.etuovi.com/kohde/{item_id}" if item_id else ""
        if not source_url:
            source_url = item.get("url") or ""
        if not source_url:
            return None

        image_url = ""
        images = item.get("images") or item.get("image") or []
        if isinstance(images, list) and images:
            img = images[0]
            image_url = img.get("url") or img if isinstance(img, str) else ""
        elif isinstance(images, str):
            image_url = images
        image_url = image_url or item.get("imageUrl") or item.get("thumbnailUrl") or ""

        avg_rent = city_config.get("avg_rent_sqm", 22)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price else 0

        address = item.get("address") or title
        neighborhood = item.get("district") or item.get("area") or address

        floor = self._safe_float_to_int(item.get("floor") or 0) or random.randint(1, 5)
        year_built = self._safe_float_to_int(item.get("buildYear") or item.get("yearBuilt") or 0)
        if not year_built or year_built < 1800 or year_built > 2030:
            year_built = random.choice([1965, 1978, 1990, 2000, 2010])

        features = self._extract_features_from_text(f"{title} {rc}")

        base = CITY_COORDS.get(city_name, [60.1699, 24.9384])
        coords = [
            round(base[0] + random.uniform(-0.02, 0.02), 4),
            round(base[1] + random.uniform(-0.02, 0.02), 4),
        ]

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, title, price)

        return {
            "id": listing_id,
            "cityId": city_id,
            "title": title[:100],
            "type": "apartment",
            "price": price,
            "areaSqm": area,
            "rooms": rooms,
            "bathrooms": max(1, rooms // 2),
            "floor": floor,
            "yearBuilt": year_built,
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": features,
            "source": "etuovi",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": str(address)[:120],
            "neighborhood": str(neighborhood)[:80],
        }

    def _parse_ld_json(self, item: dict, city_config: dict) -> Optional[dict]:
        """Parse a JSON-LD RealEstateListing item."""
        # Minimal implementation for completeness
        return None

    def _parse_etuovi_card(self, card, city_config: dict) -> Optional[dict]:
        """Parse a single Etuovi HTML listing card into a property dict."""
        city_name = city_config.get("name", "Helsinki")
        city_id = city_name.lower()

        # Extract link first - must have a real URL
        link_el = card.select_one("a[href*='/kohde/']") or card.select_one("a[href]")
        source_url = ""
        if card.name == "a" and card.get("href"):
            href = card.get("href", "")
        elif link_el:
            href = link_el.get("href", "")
        else:
            href = ""

        if href:
            if href.startswith("/"):
                source_url = "https://www.etuovi.com" + href
            elif href.startswith("http"):
                source_url = href
        if not source_url:
            return None

        # Title
        title_el = card.select_one(
            "h2, h3, h4, .title, [class*='Title'], [class*='title'], "
            "a[title], [class*='address'], [class*='Address']"
        )
        title = title_el.get_text(strip=True) if title_el else ""
        if not title:
            # Use link text or any visible text
            title = card.get_text(strip=True)[:100] if card.get_text(strip=True) else ""
        if not title:
            return None

        # Full text for parsing
        text = card.get_text(separator=" ")

        # Price
        price = 0
        price_el = card.select_one(
            "[class*='Price'], [class*='price'], [data-price], .price"
        )
        if price_el:
            price = self._parse_price_text(price_el.get_text())
        if not price:
            # Scan full text for price pattern
            m = re.search(r'([\d\s.]+)\s*\u20ac', text)
            if m:
                price = self._parse_price_text(m.group(1))
        if not price or price < 20000 or price > 5000000:
            return None

        # Area
        area = 0
        m = re.search(r'(\d+[.,]?\d*)\s*(?:m\u00b2|m2|neli\u00f6)', text)
        if m:
            area = int(float(m.group(1).replace(",", ".")))
        if not area or area < 10:
            area = 55

        # Rooms (Finnish notation)
        rooms = self._parse_finnish_rooms(text)

        # Image
        img_el = card.select_one(
            "img[src*='http'], img[data-src*='http'], img[data-lazy-src], img[src]"
        )
        image_url = ""
        if img_el:
            image_url = (
                img_el.get("src")
                or img_el.get("data-src")
                or img_el.get("data-lazy-src")
                or ""
            )
            if image_url.startswith("//"):
                image_url = "https:" + image_url
            elif image_url.startswith("/"):
                image_url = "https://www.etuovi.com" + image_url

        # Address / neighborhood
        addr_el = card.select_one(
            "[class*='Location'], [class*='location'], "
            "[class*='Address'], [class*='address']"
        )
        address = addr_el.get_text(strip=True) if addr_el else title.split(",")[0] if "," in title else title
        neighborhood = address

        # Floor
        floor = 0
        m_floor = re.search(r'(\d+)\.\s*(?:krs|kerros|floor)', text, re.IGNORECASE)
        if m_floor:
            floor = int(m_floor.group(1))
        if not floor:
            floor = random.randint(1, 5)

        # Year built
        year_built = 0
        m_year = re.search(r'(?:rv|rakennus|built)\s*\.?\s*(\d{4})', text, re.IGNORECASE)
        if m_year:
            y = int(m_year.group(1))
            if 1800 < y < 2030:
                year_built = y
        if not year_built:
            year_built = random.choice([1960, 1975, 1985, 1995, 2005, 2015])

        # Features
        features = self._extract_features_from_text(text)

        # Investment metrics
        avg_rent = city_config.get("avg_rent_sqm", 22)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price else 0

        # Property type
        prop_type = "apartment"
        tl = title.lower()
        if "yksi\u00f6" in tl or "studio" in tl or area < 30:
            prop_type = "studio"
        elif any(w in tl for w in ("omakotitalo", "rivitalo", "talo", "house", "villa")):
            prop_type = "house"

        base = CITY_COORDS.get(city_name, [60.1699, 24.9384])
        coords = [
            round(base[0] + random.uniform(-0.02, 0.02), 4),
            round(base[1] + random.uniform(-0.02, 0.02), 4),
        ]

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, title, price)

        return {
            "id": listing_id,
            "cityId": city_id,
            "title": title[:100],
            "type": prop_type,
            "price": price,
            "areaSqm": area,
            "rooms": rooms,
            "bathrooms": max(1, rooms // 2),
            "floor": floor,
            "yearBuilt": year_built,
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": features,
            "source": "etuovi",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": str(address)[:120],
            "neighborhood": str(neighborhood)[:80],
        }

    # -----------------------------------------------------------------------
    # Shared helpers
    # -----------------------------------------------------------------------

    def _parse_finnish_rooms(self, text: str) -> int:
        """Parse Finnish room notation like '2h+k', '3h+k+s', '4h+kt+s'."""
        if not isinstance(text, str):
            return 2
        m = re.search(r'(\d+)\s*[hH]\s*\+', text)
        if m:
            return int(m.group(1))
        m = re.search(r'(\d+)\s*(?:huone|room|bed)', text, re.IGNORECASE)
        if m:
            return int(m.group(1))
        return 2

    def _parse_price_text(self, text: str) -> int:
        """Parse a Finnish-formatted price string into an integer."""
        if not text:
            return 0
        text = str(text)
        text = text.replace("\u202f", "").replace("\xa0", "")  # non-breaking spaces
        text = text.replace("\u00a0", "").replace("€", "").replace("EUR", "")
        text = text.replace(" ", "").replace(".", "").replace(",", "")
        numbers = re.findall(r'\d+', text)
        if numbers:
            val = int(numbers[0])
            if val > 1000:
                return val
        return 0

    def _parse_price_value(self, raw) -> int:
        """Convert a price value (int, float, or string) to int."""
        if isinstance(raw, (int, float)):
            return int(raw) if raw > 1000 else 0
        if isinstance(raw, str):
            return self._parse_price_text(raw)
        return 0

    def _safe_float_to_int(self, val) -> int:
        """Safely convert a value to int."""
        if isinstance(val, (int, float)):
            return int(val)
        if isinstance(val, str):
            m = re.search(r'[\d.,]+', val.replace(",", "."))
            if m:
                try:
                    return int(float(m.group()))
                except ValueError:
                    pass
        return 0

    def _extract_features_from_text(self, text: str) -> list:
        """Extract property features from text using Finnish and English keywords."""
        if not text:
            return ["Investment Property"]
        text_lower = text.lower()
        features = []
        for keyword, label in FEATURE_MAP.items():
            if keyword in text_lower and label not in features:
                features.append(label)
        if not features:
            features = ["Investment Property"]
        return features[:5]
