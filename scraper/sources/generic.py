"""
Generic property scraper - best-effort fallback for smaller European portals.
Works by fetching a search URL and attempting to extract listings using common
HTML patterns (price patterns, area patterns, property links).
"""
import re
import json
import logging
import random
import time
from typing import List, Optional
from datetime import datetime
from urllib.parse import urlparse
from .base import BaseScraper

logger = logging.getLogger("euronest.scraper")

CITY_COORDS = {
    "Budapest": [47.4979, 19.0402],
    "Bucharest": [44.4268, 26.1025],
    "Cluj-Napoca": [46.7712, 23.6236],
    "Zagreb": [45.8150, 15.9819],
    "Split": [43.5081, 16.4402],
    "Dubrovnik": [42.6507, 18.0944],
    "Copenhagen": [55.6761, 12.5683],
    "Stockholm": [59.3293, 18.0686],
    "Gothenburg": [57.7089, 11.9746],
    "Oslo": [59.9139, 10.7522],
    "Tallinn": [59.4370, 24.7536],
    "Riga": [56.9496, 24.1052],
    "Vilnius": [54.6872, 25.2797],
    "Limassol": [34.7071, 33.0226],
    "Paphos": [34.7754, 32.4245],
}

# Price patterns for various currencies
PRICE_PATTERNS = [
    # Euro amounts
    r'\u20ac\s*([\d.,\s]+)',
    r'([\d.,\s]+)\s*\u20ac',
    # Krone/Krona amounts (DKK, SEK, NOK)
    r'([\d.,\s]+)\s*(?:kr|DKK|SEK|NOK)',
    # Forint (HUF)
    r'([\d.,\s]+)\s*(?:Ft|HUF)',
    # Lei (RON)
    r'([\d.,\s]+)\s*(?:lei|RON)',
    # Kuna (HRK) / now EUR for Croatia
    r'([\d.,\s]+)\s*(?:kn|HRK)',
    # Polish zloty (PLN)
    r'([\d.,\s]+)\s*(?:z\u0142|PLN)',
    # Czech crown (CZK)
    r'([\d.,\s]+)\s*(?:K\u010d|CZK)',
    # Generic large number with currency symbol nearby
    r'(?:price|cena|pris|hinta)\s*[:.]?\s*([\d.,\s]+)',
]

# Approximate exchange rates to EUR
CURRENCY_RATES = {
    "DKK": 0.134, "SEK": 0.087, "NOK": 0.089,
    "HUF": 0.0026, "RON": 0.20, "HRK": 0.13,
    "PLN": 0.22, "CZK": 0.040,
}

# Area patterns across languages
AREA_PATTERNS = [
    r'(\d+)\s*(?:m\u00b2|m2|sq\.?\s*m|kvm|neli\u00f6)',
    r'(\d+)\s*(?:sqm|SQM)',
]


class GenericScraper(BaseScraper):
    """Generic best-effort scraper for smaller European property portals."""

    def __init__(self):
        super().__init__("generic")

    def scrape(self, city_config: dict) -> list:
        """Scrape property listings using generic patterns."""
        city_name = city_config.get("name", "Unknown")
        search_url = city_config.get("search_url", "")
        if not search_url:
            logger.warning("[generic] No search_url in city config")
            return []

        results = []
        try:
            # Parse base domain
            parsed = urlparse(search_url)
            homepage = f"{parsed.scheme}://{parsed.netloc}"

            # Step 1: visit homepage for cookies
            logger.info(f"[generic] Establishing session via {homepage}")
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                          "image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            })

            try:
                home_resp = self.session.get(homepage, timeout=12)
                logger.info(f"[generic] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[generic] Homepage request failed: {e}")

            time.sleep(random.uniform(1.5, 3.0))

            # Step 2: set navigation headers
            self.session.headers.update({
                "Referer": homepage + "/",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
                "Cache-Control": "max-age=0",
                "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
            })

            # Step 3: fetch search page
            logger.info(f"[generic] Fetching search: {search_url}")
            soup = self._get_page(search_url)
            if not soup:
                logger.warning("[generic] Failed to fetch search results")
                return []

            # Try JSON extraction first
            results = self._try_json_extraction(soup, city_config, homepage)

            if not results:
                # HTML parsing with generic patterns
                results = self._parse_generic_html(soup, city_config, homepage)

        except Exception as e:
            logger.warning(f"[generic] Scrape failed for {city_name}: {e}")

        return results[:20]

    def _try_json_extraction(self, soup, city_config: dict, homepage: str) -> list:
        """Try to extract listings from embedded JSON data."""
        results = []

        try:
            # Try __NEXT_DATA__
            next_data = soup.select_one("script#__NEXT_DATA__")
            if next_data and next_data.string:
                data = json.loads(next_data.string)
                props = data.get("props", {}).get("pageProps", {})
                listings = self._find_listings_in_dict(props)
                if listings:
                    logger.info(f"[generic] Found {len(listings)} in __NEXT_DATA__")
                    for item in listings[:20]:
                        listing = self._parse_json_listing(item, city_config, homepage)
                        if listing:
                            results.append(listing)
                    return results

            # Try JSON-LD
            for script in soup.select('script[type="application/ld+json"]'):
                if script.string:
                    try:
                        ld = json.loads(script.string)
                        items = ld if isinstance(ld, list) else [ld]
                        for item in items:
                            if isinstance(item, dict) and item.get("@type") in (
                                "RealEstateListing", "Product", "Offer",
                                "Apartment", "House", "Residence"
                            ):
                                listing = self._parse_json_listing(item, city_config, homepage)
                                if listing:
                                    results.append(listing)
                    except json.JSONDecodeError:
                        pass

        except Exception as e:
            logger.debug(f"[generic] JSON extraction error: {e}")

        return results

    def _find_listings_in_dict(self, data: dict, depth: int = 0) -> list:
        """Recursively find an array of listings in a nested dict."""
        if depth > 5 or not isinstance(data, dict):
            return []

        for key in ("listings", "results", "items", "ads", "properties", "estates", "hits"):
            val = data.get(key)
            if isinstance(val, list) and len(val) >= 2:
                # Check that items look like listings (dicts with price-like keys)
                if isinstance(val[0], dict):
                    return val

        # Go one level deeper
        for key, val in data.items():
            if isinstance(val, dict):
                found = self._find_listings_in_dict(val, depth + 1)
                if found:
                    return found
            elif isinstance(val, list) and val and isinstance(val[0], dict) and len(val) >= 2:
                # Check if this looks like a listings array
                sample = val[0]
                if any(k in sample for k in ("price", "url", "id", "title", "address")):
                    return val

        return []

    def _parse_json_listing(self, item: dict, city_config: dict, homepage: str) -> Optional[dict]:
        """Parse a generic JSON listing item."""
        if not isinstance(item, dict):
            return None

        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # URL
        source_url = ""
        for key in ("url", "link", "href", "detailUrl", "canonical"):
            val = item.get(key)
            if val and isinstance(val, str):
                if val.startswith("/"):
                    source_url = homepage + val
                elif val.startswith("http"):
                    source_url = val
                break
        if not source_url:
            item_id = item.get("id") or item.get("slug") or ""
            if item_id:
                source_url = f"{homepage}/listing/{item_id}"
        if not source_url:
            return None

        # Title
        title = ""
        for key in ("title", "name", "address", "heading", "description"):
            val = item.get(key)
            if val and isinstance(val, str) and len(val) > 3:
                title = val
                break
        if not title:
            title = f"Property in {city_name}"

        # Price (try to get EUR)
        price = self._extract_price_from_json(item, city_config)
        if not price or price < 20000 or price > 5000000:
            return None

        # Area
        area = 0
        for key in ("area", "size", "livingArea", "surface", "floorArea", "areaInM2"):
            raw = item.get(key)
            if isinstance(raw, (int, float)) and raw > 10:
                area = int(raw)
                break
        if not area:
            area = 55

        # Rooms
        rooms = 2
        for key in ("rooms", "bedrooms", "numberOfRooms", "roomCount"):
            raw = item.get(key)
            if isinstance(raw, (int, float)) and raw > 0:
                rooms = int(raw)
                break

        # Image
        image_url = self._extract_image_from_json(item)

        # Coordinates
        base = CITY_COORDS.get(city_name, [48.0, 16.0])
        coords = [
            round(base[0] + random.uniform(-0.02, 0.02), 4),
            round(base[1] + random.uniform(-0.02, 0.02), 4),
        ]

        avg_rent = city_config.get("avg_rent_sqm", 12)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, str(title), price)

        return {
            "id": listing_id,
            "cityId": city_id,
            "title": str(title)[:120],
            "type": "studio" if area < 35 else "apartment",
            "price": price,
            "areaSqm": area,
            "rooms": rooms,
            "bathrooms": max(1, rooms // 2),
            "floor": random.randint(1, 5),
            "yearBuilt": 2000,
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": ["Investment Property"],
            "source": "generic",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": str(item.get("address", "") or title)[:120],
            "neighborhood": city_name,
        }

    def _extract_price_from_json(self, item: dict, city_config: dict) -> int:
        """Extract price from JSON item, converting to EUR if needed."""
        price = 0
        for key in ("price", "askingPrice", "totalPrice", "salesPrice", "mainValue"):
            raw = item.get(key)
            if isinstance(raw, dict):
                raw = raw.get("value") or raw.get("amount") or raw.get("mainValue") or 0
            if isinstance(raw, (int, float)) and raw > 1000:
                price = int(raw)
                break
            elif isinstance(raw, str):
                cleaned = re.sub(r'[^\d]', '', raw)
                if cleaned:
                    price = int(cleaned)
                    break
        if not price:
            return 0

        # Detect currency and convert if needed
        currency = ""
        for key in ("currency", "priceCurrency"):
            val = item.get(key, "")
            if val:
                currency = str(val).upper()
                break

        if not currency:
            # Guess from search URL or country
            country = city_config.get("country", "")
            currency_map = {
                "hungary": "HUF", "romania": "RON", "croatia": "HRK",
                "poland": "PLN", "czech-republic": "CZK",
                "denmark": "DKK", "sweden": "SEK", "norway": "NOK",
            }
            currency = currency_map.get(country, "EUR")

        if currency != "EUR" and currency in CURRENCY_RATES:
            price = int(price * CURRENCY_RATES[currency])

        return price

    def _extract_image_from_json(self, item: dict) -> str:
        """Extract image URL from a JSON item."""
        for key in ("imageUrl", "mainPhoto", "thumbnail", "image", "photo"):
            val = item.get(key)
            if isinstance(val, str) and val.startswith("http"):
                return val

        for key in ("images", "photos", "media", "pictures"):
            val = item.get(key)
            if isinstance(val, list) and val:
                first = val[0]
                if isinstance(first, str) and first.startswith("http"):
                    return first
                if isinstance(first, dict):
                    url = first.get("url") or first.get("src") or first.get("href") or ""
                    if url.startswith("http"):
                        return url

        return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

    def _parse_generic_html(self, soup, city_config: dict, homepage: str) -> list:
        """Parse HTML using generic patterns to find property listings."""
        results = []
        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # Strategy: find all links that could be property listings
        # then extract price and area from their container elements
        all_links = soup.select("a[href]")
        listing_containers = []
        seen_hrefs = set()

        # Property link patterns
        link_patterns = [
            r'/(?:detail|listing|property|apartment|flat|estate|ogloszenie|inzetat|annonce|bolig|bostad|objekt)',
            r'/(?:for-sale|na-prodej|eladó|de-vanzare|na-sprzedaz|till-salu|til-salgs)',
            r'/(?:classified|ad|offer|oferta|annons)',
            r'/\d{5,}',  # numeric IDs in path
        ]

        for a in all_links:
            href = a.get("href", "")
            if not href or href in seen_hrefs or href == "#":
                continue
            if len(href) < 10:
                continue

            is_listing_link = any(re.search(pat, href, re.IGNORECASE) for pat in link_patterns)
            if not is_listing_link:
                continue

            seen_hrefs.add(href)

            # Get the containing element (usually a card/article)
            container = (
                a.find_parent("article") or
                a.find_parent("li") or
                a.find_parent("div", class_=True) or
                a
            )

            # Build full URL
            if href.startswith("/"):
                full_url = homepage + href
            elif href.startswith("http"):
                full_url = href
            else:
                continue

            listing_containers.append((container, full_url))

        logger.info(f"[generic] Found {len(listing_containers)} potential listing containers")

        for container, source_url in listing_containers[:30]:
            try:
                listing = self._parse_generic_container(container, source_url, city_config)
                if listing:
                    results.append(listing)
                    if len(results) >= 20:
                        break
            except Exception as e:
                logger.debug(f"[generic] Container parse error: {e}")
                continue

        return results

    def _parse_generic_container(self, container, source_url: str, city_config: dict) -> Optional[dict]:
        """Parse a generic HTML container to extract listing data."""
        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")
        country = city_config.get("country", "")

        text = container.get_text(separator=" ")
        if len(text) < 20:
            return None

        # Extract price
        price = 0
        for pattern in PRICE_PATTERNS:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                num_str = m.group(1).replace(" ", "").replace("\xa0", "").replace(",", ".").strip()
                # Handle European format: 185.000 (dots as thousands)
                if re.match(r'^\d{1,3}(\.\d{3})+$', num_str):
                    price = int(num_str.replace(".", ""))
                else:
                    try:
                        price = int(float(num_str))
                    except ValueError:
                        cleaned = re.sub(r'[^\d]', '', num_str)
                        if cleaned:
                            price = int(cleaned)
                if price:
                    break

        if not price:
            return None

        # Convert to EUR if needed
        currency_map = {
            "hungary": ("HUF", 0.0026), "romania": ("RON", 0.20),
            "croatia": ("HRK", 0.13), "denmark": ("DKK", 0.134),
            "sweden": ("SEK", 0.087), "norway": ("NOK", 0.089),
            "estonia": ("EUR", 1.0), "latvia": ("EUR", 1.0),
            "lithuania": ("EUR", 1.0), "cyprus": ("EUR", 1.0),
        }
        if country in currency_map:
            curr, rate = currency_map[country]
            if curr != "EUR" and price > 50000:
                # Likely in local currency
                price = int(price * rate)

        if price < 20000 or price > 5000000:
            return None

        # Extract area
        area = 0
        for pattern in AREA_PATTERNS:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                val = int(m.group(1))
                if 10 <= val <= 500:
                    area = val
                    break
        if not area:
            area = 55

        # Title
        title = ""
        for sel in ["h2", "h3", "h4", "a[title]", ".title", "strong"]:
            el = container.select_one(sel)
            if el:
                t = el.get("title") or el.get_text(strip=True)
                if t and len(t) > 5 and len(t) < 200:
                    title = t
                    break
        if not title:
            # Use first meaningful text
            title = text[:100].strip()
        if not title or len(title) < 5:
            title = f"Property in {city_name}"

        # Rooms
        rooms = 2
        m = re.search(r'(\d+)\s*(?:bed|room|szoba|camer|v\u00e6relse|rum|soverom|pokoi|pokoj)', text, re.IGNORECASE)
        if m:
            val = int(m.group(1))
            if 1 <= val <= 10:
                rooms = val

        # Image
        img = container.select_one("img[src]") or container.select_one("img[data-src]")
        image_url = ""
        if img:
            image_url = img.get("src") or img.get("data-src") or ""
            if image_url:
                if image_url.startswith("//"):
                    image_url = "https:" + image_url
                elif image_url.startswith("/"):
                    parsed = urlparse(source_url)
                    image_url = f"{parsed.scheme}://{parsed.netloc}{image_url}"
        if not image_url or not image_url.startswith("http"):
            image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

        # Coordinates
        base = CITY_COORDS.get(city_name, [48.0, 16.0])
        coords = [
            round(base[0] + random.uniform(-0.02, 0.02), 4),
            round(base[1] + random.uniform(-0.02, 0.02), 4),
        ]

        # Property type
        prop_type = "apartment"
        if area < 35:
            prop_type = "studio"
        elif any(w in text.lower() for w in ("house", "villa", "h\u00e1z", "casa", "hus", "dom")):
            prop_type = "house"

        avg_rent = city_config.get("avg_rent_sqm", 12)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, title, price)

        return {
            "id": listing_id,
            "cityId": city_id,
            "title": title[:120],
            "type": prop_type,
            "price": price,
            "areaSqm": area,
            "rooms": rooms,
            "bathrooms": max(1, rooms // 2),
            "floor": random.randint(1, 5),
            "yearBuilt": 2000,
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": ["Investment Property"],
            "source": "generic",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": city_name,
            "neighborhood": city_name,
        }
