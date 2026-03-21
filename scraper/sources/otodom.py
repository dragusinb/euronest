"""
Otodom.pl scraper for Poland property listings.
Extracts listings from JSON embedded in page data (__NEXT_DATA__).
"""
import re
import json
import logging
import random
import time
from typing import List, Optional
from datetime import datetime
from .base import BaseScraper

logger = logging.getLogger("euronest.scraper")

CITY_COORDS = {
    "Warsaw": [52.2297, 21.0122],
    "Krakow": [50.0647, 19.9450],
    "Wroclaw": [51.1079, 17.0385],
}

HOMEPAGE = "https://www.otodom.pl"


class OtodomScraper(BaseScraper):
    """Scraper for otodom.pl (Poland) listings via embedded JSON."""

    def __init__(self):
        super().__init__("otodom")

    def scrape(self, city_config: dict) -> list:
        """Scrape property listings from Otodom."""
        city_name = city_config.get("name", "Unknown")
        search_url = city_config.get("search_url", "")
        if not search_url:
            logger.warning("[otodom] No search_url in city config")
            return []

        results = []
        try:
            # Step 1: visit homepage for cookies
            logger.info(f"[otodom] Establishing session via {HOMEPAGE}")
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                          "image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            })

            try:
                home_resp = self.session.get(HOMEPAGE, timeout=12)
                logger.info(f"[otodom] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[otodom] Homepage request failed: {e}")

            time.sleep(random.uniform(1.5, 3.0))

            # Step 2: set navigation headers
            self.session.headers.update({
                "Referer": HOMEPAGE + "/",
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
            logger.info(f"[otodom] Fetching search: {search_url}")
            soup = self._get_page(search_url)
            if not soup:
                logger.warning("[otodom] Failed to fetch search results")
                return []

            # Try __NEXT_DATA__ JSON extraction (Otodom is a Next.js app)
            results = self._extract_from_next_data(soup, city_config)

            if not results:
                # Fallback: HTML parsing
                logger.info("[otodom] No JSON data, trying HTML parsing")
                results = self._parse_html(soup, city_config)

        except Exception as e:
            logger.warning(f"[otodom] Scrape failed for {city_name}: {e}")

        return results[:20]

    def _extract_from_next_data(self, soup, city_config: dict) -> list:
        """Extract listings from __NEXT_DATA__ script tag."""
        results = []
        try:
            next_data = soup.select_one("script#__NEXT_DATA__")
            if not next_data or not next_data.string:
                return []

            data = json.loads(next_data.string)
            props = data.get("props", {}).get("pageProps", {})

            # Navigate to listings - Otodom uses various structures
            listings = (
                props.get("data", {}).get("searchAds", {}).get("items", [])
                or props.get("listings", [])
                or props.get("results", [])
                or props.get("ads", [])
                or props.get("data", {}).get("ads", [])
                or []
            )

            if not listings:
                # Try deeper navigation
                search_data = props.get("data", {})
                for key in search_data:
                    val = search_data[key]
                    if isinstance(val, dict) and "items" in val:
                        listings = val["items"]
                        break
                    elif isinstance(val, list) and val:
                        listings = val
                        break

            if listings:
                logger.info(f"[otodom] Found {len(listings)} listings in __NEXT_DATA__")
                for item in listings[:20]:
                    listing = self._parse_json_listing(item, city_config)
                    if listing:
                        results.append(listing)

        except (json.JSONDecodeError, Exception) as e:
            logger.debug(f"[otodom] __NEXT_DATA__ extraction error: {e}")

        return results

    def _parse_json_listing(self, item: dict, city_config: dict) -> Optional[dict]:
        """Parse a single Otodom listing from JSON data."""
        if not isinstance(item, dict):
            return None

        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # ID and URL
        item_id = item.get("id") or item.get("adId") or item.get("slug") or ""
        slug = item.get("slug") or item.get("url") or ""
        if slug and not slug.startswith("http"):
            source_url = f"https://www.otodom.pl/pl/oferta/{slug}"
        elif slug:
            source_url = slug
        elif item_id:
            source_url = f"https://www.otodom.pl/pl/oferta/{item_id}"
        else:
            return None

        # Title
        title = item.get("title") or item.get("name") or item.get("shortDescription") or f"Property in {city_name}"

        # Price
        price = 0
        price_data = item.get("totalPrice") or item.get("price") or {}
        if isinstance(price_data, dict):
            price = int(price_data.get("value", 0) or 0)
        elif isinstance(price_data, (int, float)):
            price = int(price_data)
        if not price:
            raw = item.get("pricePerM") or 0
            area_est = item.get("areaInM2") or item.get("area") or 65
            if isinstance(raw, (int, float)) and isinstance(area_est, (int, float)):
                price = int(raw * area_est)
        if not price or price < 20000 or price > 5000000:
            return None

        # Area
        area = 0
        for key in ("areaInM2", "area", "totalArea", "livingArea"):
            raw = item.get(key)
            if isinstance(raw, (int, float)) and raw > 10:
                area = int(raw)
                break
            elif isinstance(raw, str):
                m = re.search(r'[\d.,]+', raw)
                if m:
                    area = int(float(m.group().replace(",", ".")))
                    if area > 10:
                        break
        if not area or area < 10:
            area = 55

        # Rooms
        rooms = 2
        rooms_val = item.get("roomsNumber") or item.get("rooms") or item.get("numberOfRooms") or 0
        if isinstance(rooms_val, (int, float)) and rooms_val > 0:
            rooms = int(rooms_val)
        elif isinstance(rooms_val, str):
            m = re.search(r'\d+', rooms_val)
            if m:
                rooms = int(m.group())

        # Floor
        floor = 0
        floor_val = item.get("floor") or item.get("floorNumber") or 0
        if isinstance(floor_val, (int, float)):
            floor = int(floor_val)
        elif isinstance(floor_val, str):
            m = re.search(r'\d+', floor_val)
            if m:
                floor = int(m.group())
        if not floor:
            floor = random.randint(1, 5)

        # Image
        image_url = ""
        images = item.get("images") or item.get("photos") or item.get("thumbnails") or []
        if isinstance(images, list) and images:
            first = images[0]
            if isinstance(first, dict):
                image_url = first.get("large") or first.get("medium") or first.get("url") or first.get("src") or ""
            elif isinstance(first, str):
                image_url = first
        if not image_url:
            image_url = item.get("imageUrl") or item.get("mainImage") or ""
        if not image_url:
            image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

        # Location
        location = item.get("location") or item.get("address") or {}
        if isinstance(location, dict):
            address = location.get("address", {}).get("value", "") or location.get("street", "") or city_name
            neighborhood = location.get("district", {}).get("name", "") or location.get("district", "") or city_name
            lat = location.get("coordinates", {}).get("latitude", 0) or location.get("latitude", 0)
            lon = location.get("coordinates", {}).get("longitude", 0) or location.get("longitude", 0)
        else:
            address = str(location) if location else city_name
            neighborhood = city_name
            lat = lon = 0

        if lat and lon:
            coords = [float(lat), float(lon)]
        else:
            base = CITY_COORDS.get(city_name, [52.2297, 21.0122])
            coords = [
                round(base[0] + random.uniform(-0.02, 0.02), 4),
                round(base[1] + random.uniform(-0.02, 0.02), 4),
            ]

        # Property type
        prop_type = "apartment"
        if area < 35:
            prop_type = "studio"
        elif any(w in str(title).lower() for w in ("dom", "house", "willa", "villa")):
            prop_type = "house"

        avg_rent = city_config.get("avg_rent_sqm", 14)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        # Features
        features = []
        text = str(title).lower()
        feature_map = {
            "balkon": "Balcony", "balcony": "Balcony",
            "winda": "Elevator", "elevator": "Elevator",
            "parking": "Parking", "gara\u017c": "Parking",
            "ogr\u00f3d": "Garden", "garden": "Garden",
            "taras": "Terrace", "terrace": "Terrace",
            "piwnica": "Storage", "storage": "Storage",
            "umeblowane": "Furnished", "furnished": "Furnished",
            "wyremontowane": "Renovated", "renovated": "Renovated",
        }
        seen = set()
        for kw, label in feature_map.items():
            if kw in text and label not in seen:
                features.append(label)
                seen.add(label)
        if not features:
            features = ["Investment Property"]

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, str(title), price)

        return {
            "id": listing_id,
            "cityId": city_id,
            "title": str(title)[:120],
            "type": prop_type,
            "price": price,
            "areaSqm": area,
            "rooms": rooms,
            "bathrooms": max(1, rooms // 2),
            "floor": floor,
            "yearBuilt": 2000,
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": features[:6],
            "source": "otodom",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": str(address)[:120],
            "neighborhood": str(neighborhood)[:80],
        }

    def _parse_html(self, soup, city_config: dict) -> list:
        """Fallback: parse HTML listing cards from Otodom."""
        results = []
        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        selector_attempts = [
            "li[data-cy='listing-item']",
            "article[data-cy='listing-item']",
            "div[class*='listing-item']",
            "li[class*='result']",
            "a[href*='/pl/oferta/']",
        ]
        cards = []
        for sel in selector_attempts:
            cards = soup.select(sel)
            if cards and len(cards) >= 2:
                break

        if not cards:
            links = soup.select("a[href*='/oferta/']")
            seen = set()
            for a in links:
                href = a.get("href", "")
                if href not in seen:
                    seen.add(href)
                    parent = a.find_parent("li") or a.find_parent("article") or a.find_parent("div")
                    if parent:
                        cards.append(parent)

        logger.info(f"[otodom] Found {len(cards)} HTML cards")

        for card in cards[:20]:
            try:
                source_url = ""
                link = card.select_one("a[href*='/oferta/']") or card.select_one("a[href]")
                if card.name == "a":
                    link = card
                if link:
                    href = link.get("href", "")
                    if href.startswith("/"):
                        source_url = HOMEPAGE + href
                    elif href.startswith("http"):
                        source_url = href
                if not source_url:
                    continue

                title = ""
                for sel in ["h2", "h3", "p[data-cy='listing-item-title']", "a[title]"]:
                    el = card.select_one(sel)
                    if el:
                        t = el.get("title") or el.get_text(strip=True)
                        if t and len(t) > 3:
                            title = t
                            break
                if not title:
                    title = f"Property in {city_name}"

                text = card.get_text()
                price = 0
                m = re.search(r'([\d\s]+)\s*(?:z\u0142|PLN|\u20ac)', text)
                if m:
                    price = int(m.group(1).replace(" ", "").replace("\xa0", ""))
                if not price or price < 20000 or price > 5000000:
                    continue

                area = 55
                m = re.search(r'(\d+[.,]?\d*)\s*(?:m\u00b2|m2)', text, re.IGNORECASE)
                if m:
                    val = int(float(m.group(1).replace(",", ".")))
                    if 10 <= val <= 500:
                        area = val

                rooms = 2
                m = re.search(r'(\d+)\s*(?:pok|room|pokoi|pokoje)', text, re.IGNORECASE)
                if m:
                    val = int(m.group(1))
                    if 1 <= val <= 10:
                        rooms = val

                img = card.select_one("img[src]") or card.select_one("img[data-src]")
                image_url = ""
                if img:
                    image_url = img.get("src") or img.get("data-src") or ""
                    if image_url and image_url.startswith("//"):
                        image_url = "https:" + image_url
                if not image_url:
                    image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

                base = CITY_COORDS.get(city_name, [52.2297, 21.0122])
                coords = [
                    round(base[0] + random.uniform(-0.02, 0.02), 4),
                    round(base[1] + random.uniform(-0.02, 0.02), 4),
                ]

                avg_rent = city_config.get("avg_rent_sqm", 14)
                monthly_rent = int(area * avg_rent)
                gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

                from models import PropertyListing
                listing_id = PropertyListing.generate_id(city_id, title, price)

                results.append({
                    "id": listing_id,
                    "cityId": city_id,
                    "title": title[:120],
                    "type": "apartment",
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
                    "source": "otodom",
                    "sourceUrl": source_url,
                    "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
                    "address": title[:120],
                    "neighborhood": city_name,
                })

            except Exception as e:
                logger.debug(f"[otodom] HTML card parse error: {e}")
                continue

        return results
