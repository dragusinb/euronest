"""
Sreality.cz scraper for Czech Republic property listings.
Uses the Sreality JSON API at https://www.sreality.cz/api/cs/v2/estates.
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
    "Prague": [50.0755, 14.4378],
    "Brno": [49.1951, 16.6068],
}

HOMEPAGE = "https://www.sreality.cz"
API_BASE = "https://www.sreality.cz/api/cs/v2/estates"

# Sreality location IDs (region_entity_id)
LOCATION_IDS = {
    "Prague": "10",
    "Brno": "116",
}


class SrealityScraper(BaseScraper):
    """Scraper for sreality.cz (Czech Republic) listings via JSON API."""

    def __init__(self):
        super().__init__("sreality")

    def scrape(self, city_config: dict) -> list:
        """Scrape property listings from Sreality."""
        city_name = city_config.get("name", "Unknown")
        results = []

        try:
            # Step 1: visit homepage for cookies
            logger.info(f"[sreality] Establishing session via {HOMEPAGE}")
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9,cs;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            })

            try:
                home_resp = self.session.get(HOMEPAGE, timeout=12)
                logger.info(f"[sreality] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[sreality] Homepage request failed: {e}")

            time.sleep(random.uniform(1.5, 3.0))

            # Step 2: set API headers
            self.session.headers.update({
                "Referer": HOMEPAGE + "/",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
            })

            # Step 3: call the Sreality API
            results = self._scrape_api(city_config)

            if not results:
                # Fallback: scrape HTML search page
                search_url = city_config.get("search_url", "")
                if search_url:
                    logger.info("[sreality] API returned no results, trying HTML")
                    results = self._scrape_html(search_url, city_config)

        except Exception as e:
            logger.warning(f"[sreality] Scrape failed for {city_name}: {e}")

        return results[:20]

    def _scrape_api(self, city_config: dict) -> list:
        """Fetch listings from Sreality JSON API."""
        results = []
        city_name = city_config.get("name", "Unknown")
        location_id = LOCATION_IDS.get(city_name, "")

        params = {
            "category_main_cb": 1,      # flats
            "category_type_cb": 1,      # sale
            "per_page": 20,
            "page": 1,
        }
        if location_id:
            params["locality_region_id"] = location_id

        try:
            logger.info(f"[sreality] Calling API: {API_BASE}")
            time.sleep(random.uniform(1.0, 2.5))

            resp = self.session.get(API_BASE, params=params, timeout=15)
            logger.info(f"[sreality] API status: {resp.status_code}")

            if resp.status_code != 200:
                logger.warning(f"[sreality] API returned {resp.status_code}")
                return []

            data = resp.json()
            estates = data.get("_embedded", {}).get("estates", []) or data.get("results", []) or data.get("estates", [])

            if not estates:
                logger.warning(f"[sreality] No estates in API response")
                return []

            logger.info(f"[sreality] Found {len(estates)} estates in API")

            for estate in estates[:20]:
                listing = self._parse_api_estate(estate, city_config)
                if listing:
                    results.append(listing)

        except Exception as e:
            logger.warning(f"[sreality] API error: {e}")

        return results

    def _parse_api_estate(self, estate: dict, city_config: dict) -> Optional[dict]:
        """Parse a single estate from the Sreality API response."""
        if not isinstance(estate, dict):
            return None

        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # Hash ID for URL
        hash_id = estate.get("hash_id") or estate.get("id") or ""
        if not hash_id:
            return None

        # Sreality detail URL
        seo = estate.get("seo", {})
        locality = seo.get("locality", "") or city_name.lower()
        source_url = f"https://www.sreality.cz/en/detail/sale/flat/{locality}/{hash_id}"

        # Title / name
        title = estate.get("name") or estate.get("locality") or f"Apartment in {city_name}"

        # Price
        price = 0
        price_val = estate.get("price") or estate.get("price_czk", {}).get("value_raw", 0)
        if isinstance(price_val, (int, float)):
            price = int(price_val)
        elif isinstance(price_val, dict):
            price = int(price_val.get("value_raw", 0) or price_val.get("value", 0) or 0)
        # Sreality prices are in CZK; convert to EUR (approx 1 EUR = 25 CZK)
        if price > 500000:  # likely CZK
            price = int(price / 25)
        if not price or price < 20000 or price > 5000000:
            return None

        # Area from labels array
        area = 0
        labels = estate.get("labels", []) or []
        for label in labels:
            if isinstance(label, str):
                m = re.search(r'(\d+)\s*m', label)
                if m:
                    val = int(m.group(1))
                    if 10 <= val <= 500:
                        area = val
                        break

        # Try name/title for area
        if not area:
            m = re.search(r'(\d+)\s*(?:m\u00b2|m2)', str(title), re.IGNORECASE)
            if m:
                area = int(m.group(1))
        if not area or area < 10:
            area = 55

        # Rooms from name (e.g., "2+kk", "3+1")
        rooms = 2
        m = re.search(r'(\d+)\+', str(title) + " " + str(estate.get("name", "")))
        if m:
            val = int(m.group(1))
            if 1 <= val <= 10:
                rooms = val

        # Image
        image_url = ""
        img_links = estate.get("_links", {}).get("images", []) or estate.get("images", [])
        if isinstance(img_links, list) and img_links:
            first = img_links[0]
            if isinstance(first, dict):
                image_url = first.get("href") or first.get("url") or first.get("src") or ""
            elif isinstance(first, str):
                image_url = first
        if not image_url:
            image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

        # Coordinates
        gps = estate.get("gps") or {}
        lat = gps.get("lat", 0) or 0
        lon = gps.get("lon", 0) or 0
        if lat and lon:
            coords = [float(lat), float(lon)]
        else:
            base = CITY_COORDS.get(city_name, [50.0755, 14.4378])
            coords = [
                round(base[0] + random.uniform(-0.02, 0.02), 4),
                round(base[1] + random.uniform(-0.02, 0.02), 4),
            ]

        # Location
        locality_text = estate.get("locality") or city_name
        address = str(locality_text)[:120]
        neighborhood = city_name

        # Property type
        prop_type = "apartment"
        if area < 35:
            prop_type = "studio"

        avg_rent = city_config.get("avg_rent_sqm", 16)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

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
            "floor": random.randint(1, 5),
            "yearBuilt": 2000,
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": ["Investment Property"],
            "source": "sreality",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": address,
            "neighborhood": neighborhood,
        }

    def _scrape_html(self, search_url: str, city_config: dict) -> list:
        """Fallback: scrape HTML search results from Sreality."""
        results = []
        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        soup = self._get_page(search_url)
        if not soup:
            return []

        # Find listing cards
        selector_attempts = [
            "div[class*='property']",
            "div[class*='estate']",
            "a[href*='/detail/']",
        ]
        cards = []
        for sel in selector_attempts:
            cards = soup.select(sel)
            if cards and len(cards) >= 2:
                break

        logger.info(f"[sreality] Found {len(cards)} HTML cards")

        for card in cards[:20]:
            try:
                source_url = ""
                link = card.select_one("a[href*='/detail/']") or card.select_one("a[href]")
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

                text = card.get_text()
                title = ""
                for sel in ["h2", "h3", "span[class*='name']"]:
                    el = card.select_one(sel)
                    if el:
                        t = el.get_text(strip=True)
                        if t and len(t) > 3:
                            title = t
                            break
                if not title:
                    title = f"Property in {city_name}"

                price = 0
                m = re.search(r'([\d\s]+)\s*(?:K\u010d|CZK|\u20ac)', text)
                if m:
                    raw = int(m.group(1).replace(" ", "").replace("\xa0", ""))
                    price = int(raw / 25) if raw > 500000 else raw
                if not price or price < 20000 or price > 5000000:
                    continue

                area = 55
                m = re.search(r'(\d+)\s*(?:m\u00b2|m2)', text, re.IGNORECASE)
                if m:
                    val = int(m.group(1))
                    if 10 <= val <= 500:
                        area = val

                rooms = 2
                m = re.search(r'(\d+)\+', text)
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

                base = CITY_COORDS.get(city_name, [50.0755, 14.4378])
                coords = [
                    round(base[0] + random.uniform(-0.02, 0.02), 4),
                    round(base[1] + random.uniform(-0.02, 0.02), 4),
                ]

                avg_rent = city_config.get("avg_rent_sqm", 16)
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
                    "source": "sreality",
                    "sourceUrl": source_url,
                    "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
                    "address": title[:120],
                    "neighborhood": city_name,
                })

            except Exception as e:
                logger.debug(f"[sreality] HTML card parse error: {e}")
                continue

        return results
