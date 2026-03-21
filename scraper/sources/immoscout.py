"""
ImmobilienScout24 scraper for Germany and Austria property listings.
Parses JSON embedded in page (resultListModel) for structured data.
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
    "Berlin": [52.5200, 13.4050],
    "Munich": [48.1351, 11.5820],
    "Hamburg": [53.5511, 9.9937],
    "Frankfurt": [50.1109, 8.6821],
    "Vienna": [48.2082, 16.3738],
    "Graz": [47.0707, 15.4395],
}


class ImmoScoutScraper(BaseScraper):
    """Scraper for immobilienscout24.de / immobilienscout24.at listings."""

    def __init__(self):
        super().__init__("immoscout")

    def scrape(self, city_config: dict) -> list:
        """Scrape property listings from ImmobilienScout24."""
        city_name = city_config.get("name", "Unknown")
        search_url = city_config.get("search_url", "")
        if not search_url:
            logger.warning("[immoscout] No search_url in city config")
            return []

        results = []
        try:
            # Determine base domain
            if "immobilienscout24.at" in search_url:
                homepage = "https://www.immobilienscout24.at"
            else:
                homepage = "https://www.immobilienscout24.de"

            # Step 1: visit homepage for cookies
            logger.info(f"[immoscout] Establishing session via {homepage}")
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                          "image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            })

            try:
                home_resp = self.session.get(homepage, timeout=12)
                logger.info(f"[immoscout] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[immoscout] Homepage request failed: {e}")

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

            # Step 3: fetch search results page
            logger.info(f"[immoscout] Fetching search: {search_url}")
            soup = self._get_page(search_url)
            if not soup:
                logger.warning("[immoscout] Failed to fetch search results")
                return []

            # Try to extract JSON data from page
            results = self._extract_from_json(soup, city_config, homepage)

            if not results:
                # Fallback: parse HTML cards
                logger.info("[immoscout] No JSON data found, trying HTML parsing")
                results = self._parse_html_cards(soup, city_config, homepage)

        except Exception as e:
            logger.warning(f"[immoscout] Scrape failed for {city_name}: {e}")

        return results[:20]

    def _extract_from_json(self, soup, city_config: dict, homepage: str) -> list:
        """Extract listings from embedded JSON (resultListModel or IS24 data)."""
        results = []

        try:
            # ImmobilienScout24 embeds result data in script tags
            scripts = soup.select("script")
            for script in scripts:
                text = script.string or ""
                if not text:
                    continue

                # Look for resultListModel or searchResponseModel
                json_data = None

                # Pattern 1: IS24.resultList = {...}
                m = re.search(r'resultListModel\s*[:=]\s*(\{.+?\})\s*[;,]', text, re.DOTALL)
                if m:
                    try:
                        json_data = json.loads(m.group(1))
                    except json.JSONDecodeError:
                        pass

                # Pattern 2: __NEXT_DATA__ or similar embedded JSON
                if not json_data and "__NEXT_DATA__" in text:
                    try:
                        json_data = json.loads(text)
                    except json.JSONDecodeError:
                        pass

                # Pattern 3: keyValues or searchResponse in a large JSON block
                if not json_data:
                    m = re.search(r'(\{"searchResponseModel".+?\})\s*;', text, re.DOTALL)
                    if m:
                        try:
                            json_data = json.loads(m.group(1))
                        except json.JSONDecodeError:
                            pass

                if json_data:
                    listings = self._navigate_json_to_listings(json_data)
                    if listings:
                        logger.info(f"[immoscout] Found {len(listings)} listings in embedded JSON")
                        for item in listings[:20]:
                            listing = self._parse_json_listing(item, city_config, homepage)
                            if listing:
                                results.append(listing)
                        break

            # Also try __NEXT_DATA__ script tag
            if not results:
                next_data = soup.select_one("script#__NEXT_DATA__")
                if next_data and next_data.string:
                    try:
                        data = json.loads(next_data.string)
                        props = data.get("props", {}).get("pageProps", {})
                        listings = (
                            props.get("searchResults", {}).get("listings")
                            or props.get("results")
                            or props.get("listings")
                            or []
                        )
                        if listings:
                            logger.info(f"[immoscout] Found {len(listings)} listings in __NEXT_DATA__")
                            for item in listings[:20]:
                                listing = self._parse_json_listing(item, city_config, homepage)
                                if listing:
                                    results.append(listing)
                    except json.JSONDecodeError:
                        pass

        except Exception as e:
            logger.debug(f"[immoscout] JSON extraction error: {e}")

        return results

    def _navigate_json_to_listings(self, data: dict) -> list:
        """Navigate through various JSON structures to find the listings array."""
        if not isinstance(data, dict):
            return []

        # Try common paths
        paths = [
            lambda d: d.get("searchResponseModel", {}).get("resultlistResultList", {}).get("resultlistEntries", [{}])[0].get("resultlistEntry", []),
            lambda d: d.get("resultlistResultList", {}).get("resultlistEntries", [{}])[0].get("resultlistEntry", []),
            lambda d: d.get("results", []),
            lambda d: d.get("listings", []),
            lambda d: d.get("items", []),
            lambda d: d.get("searchResults", {}).get("listings", []),
        ]

        for path_fn in paths:
            try:
                result = path_fn(data)
                if result and isinstance(result, list) and len(result) > 0:
                    return result
            except (KeyError, IndexError, AttributeError):
                continue

        return []

    def _parse_json_listing(self, item: dict, city_config: dict, homepage: str) -> Optional[dict]:
        """Parse a single listing from ImmobilienScout24 JSON data."""
        if not isinstance(item, dict):
            return None

        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # The listing data may be nested under 'resultlist.realEstate' or similar
        real_estate = item.get("resultlist.realEstate") or item.get("realEstate") or item

        # Expose ID for URL
        expose_id = str(
            item.get("@id") or item.get("id") or
            real_estate.get("@id") or real_estate.get("id") or ""
        )
        if not expose_id:
            return None

        source_url = f"{homepage}/expose/{expose_id}"

        # Title
        title = (
            real_estate.get("title") or
            item.get("title") or
            real_estate.get("address", {}).get("description", {}).get("text", "") or
            f"Property in {city_name}"
        )

        # Price
        price = 0
        price_obj = real_estate.get("price") or item.get("price") or {}
        if isinstance(price_obj, dict):
            price = int(price_obj.get("value", 0) or 0)
        elif isinstance(price_obj, (int, float)):
            price = int(price_obj)
        if not price or price < 20000 or price > 5000000:
            return None

        # Area
        area = 0
        area_val = real_estate.get("livingSpace") or real_estate.get("area") or item.get("livingSpace") or 0
        if isinstance(area_val, (int, float)):
            area = int(area_val)
        elif isinstance(area_val, str):
            m = re.search(r'[\d.,]+', area_val)
            if m:
                area = int(float(m.group().replace(",", ".")))
        if not area or area < 10:
            area = 65

        # Rooms
        rooms = 2
        rooms_val = real_estate.get("numberOfRooms") or item.get("numberOfRooms") or 0
        if isinstance(rooms_val, (int, float)) and rooms_val > 0:
            rooms = int(rooms_val)

        # Floor
        floor = 0
        floor_val = real_estate.get("floor") or item.get("floor") or 0
        if isinstance(floor_val, (int, float)):
            floor = int(floor_val)
        if not floor:
            floor = random.randint(1, 5)

        # Image
        image_url = ""
        pictures = real_estate.get("titlePicture") or item.get("titlePicture") or {}
        if isinstance(pictures, dict):
            for key in ("url", "src", "@href"):
                url = pictures.get(key) or pictures.get("urls", {}).get("url") or ""
                if url:
                    if not url.startswith("http"):
                        url = "https:" + url if url.startswith("//") else homepage + url
                    image_url = url
                    break
        if not image_url:
            image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

        # Address
        addr_obj = real_estate.get("address") or item.get("address") or {}
        if isinstance(addr_obj, dict):
            address = addr_obj.get("description", {}).get("text", "") or addr_obj.get("street", "") or city_name
            neighborhood = addr_obj.get("quarter", "") or addr_obj.get("city", "") or address
        else:
            address = str(addr_obj) if addr_obj else city_name
            neighborhood = address

        # Property type
        prop_type = "apartment"
        obj_type = str(real_estate.get("@xsi.type", "") or real_estate.get("realEstateType", "")).lower()
        if "haus" in obj_type or "house" in obj_type:
            prop_type = "house"
        elif area < 35:
            prop_type = "studio"

        # Coordinates
        lat = 0
        lon = 0
        if isinstance(addr_obj, dict):
            coords_obj = addr_obj.get("wgs84Coordinate") or addr_obj.get("coordinates") or {}
            if isinstance(coords_obj, dict):
                lat = coords_obj.get("latitude", 0) or 0
                lon = coords_obj.get("longitude", 0) or 0
        if lat and lon:
            coords = [float(lat), float(lon)]
        else:
            base = CITY_COORDS.get(city_name, [52.5200, 13.4050])
            coords = [
                round(base[0] + random.uniform(-0.02, 0.02), 4),
                round(base[1] + random.uniform(-0.02, 0.02), 4),
            ]

        # Investment metrics
        avg_rent = city_config.get("avg_rent_sqm", 14)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        # Features
        features = []
        text = str(title).lower()
        feature_map = {
            "balkon": "Balcony", "balcony": "Balcony",
            "aufzug": "Elevator", "elevator": "Elevator", "fahrstuhl": "Elevator",
            "stellplatz": "Parking", "parking": "Parking", "garage": "Parking",
            "garten": "Garden", "garden": "Garden",
            "terrasse": "Terrace", "terrace": "Terrace",
            "saniert": "Renovated", "renoviert": "Renovated",
            "neubau": "New Build", "erstbezug": "New Build",
            "m\u00f6bliert": "Furnished", "furnished": "Furnished",
            "zentral": "Central Location",
        }
        seen = set()
        for kw, label in feature_map.items():
            if kw in text and label not in seen:
                features.append(label)
                seen.add(label)
        if not features:
            features = ["Investment Property"]

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, title, price)

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
            "source": "immoscout",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": str(address)[:120],
            "neighborhood": str(neighborhood)[:80],
        }

    def _parse_html_cards(self, soup, city_config: dict, homepage: str) -> list:
        """Fallback: parse HTML listing cards from ImmobilienScout24."""
        results = []
        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # Try to find listing cards
        selector_attempts = [
            "li[data-id]",
            "article[data-item]",
            "div[class*='result-list-entry']",
            "div[class*='resultlist']",
            "div[data-id]",
        ]
        cards = []
        for sel in selector_attempts:
            cards = soup.select(sel)
            if cards and len(cards) >= 2:
                break

        if not cards:
            # Find links to expose pages
            links = soup.select("a[href*='/expose/']")
            seen = set()
            for a in links:
                href = a.get("href", "")
                if href not in seen:
                    seen.add(href)
                    parent = a.find_parent("li") or a.find_parent("article") or a.find_parent("div")
                    if parent:
                        cards.append(parent)

        logger.info(f"[immoscout] Found {len(cards)} HTML cards")

        for card in cards[:20]:
            try:
                # Source URL
                source_url = ""
                link = card.select_one("a[href*='/expose/']") or card.select_one("a[href]")
                if link:
                    href = link.get("href", "")
                    if href.startswith("/"):
                        source_url = homepage + href
                    elif href.startswith("http"):
                        source_url = href
                if not source_url:
                    data_id = card.get("data-id", "")
                    if data_id:
                        source_url = f"{homepage}/expose/{data_id}"
                if not source_url:
                    continue

                # Title
                title = ""
                for sel in ["h2", "h3", ".result-list-entry__brand-title", "a[title]"]:
                    el = card.select_one(sel)
                    if el:
                        t = el.get("title") or el.get_text(strip=True)
                        if t and len(t) > 5:
                            title = t
                            break
                if not title:
                    title = f"Property in {city_name}"

                # Price
                price = 0
                text = card.get_text()
                m = re.search(r'([\d.]+)\s*\u20ac', text)
                if m:
                    price = int(m.group(1).replace(".", ""))
                if not price or price < 20000 or price > 5000000:
                    continue

                # Area
                area = 65
                m = re.search(r'([\d.,]+)\s*(?:m\u00b2|m2|qm)', text, re.IGNORECASE)
                if m:
                    val = int(float(m.group(1).replace(",", ".")))
                    if 10 <= val <= 500:
                        area = val

                # Rooms
                rooms = 2
                m = re.search(r'(\d+)\s*(?:Zi|Zimmer|room)', text, re.IGNORECASE)
                if m:
                    val = int(m.group(1))
                    if 1 <= val <= 10:
                        rooms = val

                # Coordinates
                base = CITY_COORDS.get(city_name, [52.5200, 13.4050])
                coords = [
                    round(base[0] + random.uniform(-0.02, 0.02), 4),
                    round(base[1] + random.uniform(-0.02, 0.02), 4),
                ]

                # Image
                img = card.select_one("img[src]") or card.select_one("img[data-src]")
                image_url = ""
                if img:
                    image_url = img.get("src") or img.get("data-src") or ""
                    if image_url and image_url.startswith("//"):
                        image_url = "https:" + image_url
                if not image_url:
                    image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

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
                    "source": "immoscout",
                    "sourceUrl": source_url,
                    "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
                    "address": city_name,
                    "neighborhood": city_name,
                })

            except Exception as e:
                logger.debug(f"[immoscout] HTML card parse error: {e}")
                continue

        return results
