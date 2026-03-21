"""
Daft.ie scraper for Ireland property listings.
Parses search result pages for structured listing data.
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
    "Dublin": [53.3498, -6.2603],
}

HOMEPAGE = "https://www.daft.ie"


class DaftScraper(BaseScraper):
    """Scraper for daft.ie (Ireland) listings."""

    def __init__(self):
        super().__init__("daft")

    def scrape(self, city_config: dict) -> list:
        """Scrape property listings from Daft.ie."""
        city_name = city_config.get("name", "Unknown")
        search_url = city_config.get("search_url", "")
        if not search_url:
            logger.warning("[daft] No search_url in city config")
            return []

        results = []
        try:
            # Step 1: visit homepage for cookies
            logger.info(f"[daft] Establishing session via {HOMEPAGE}")
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                          "image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-IE,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            })

            try:
                home_resp = self.session.get(HOMEPAGE, timeout=12)
                logger.info(f"[daft] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[daft] Homepage request failed: {e}")

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
            logger.info(f"[daft] Fetching search: {search_url}")
            soup = self._get_page(search_url)
            if not soup:
                logger.warning("[daft] Failed to fetch search results")
                return []

            # Try JSON extraction first (Daft uses Next.js)
            results = self._extract_from_next_data(soup, city_config)

            if not results:
                # Fallback: HTML parsing
                logger.info("[daft] No JSON data, trying HTML parsing")
                results = self._parse_html(soup, city_config)

        except Exception as e:
            logger.warning(f"[daft] Scrape failed for {city_name}: {e}")

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

            listings = (
                props.get("listings")
                or props.get("results")
                or props.get("searchResults", [])
                or props.get("data", {}).get("listings", [])
                or []
            )

            if listings:
                logger.info(f"[daft] Found {len(listings)} listings in __NEXT_DATA__")
                for item in listings[:20]:
                    listing = self._parse_json_listing(item, city_config)
                    if listing:
                        results.append(listing)

        except (json.JSONDecodeError, Exception) as e:
            logger.debug(f"[daft] __NEXT_DATA__ extraction error: {e}")

        return results

    def _parse_json_listing(self, item: dict, city_config: dict) -> Optional[dict]:
        """Parse a single Daft listing from JSON data."""
        if not isinstance(item, dict):
            return None

        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # Listing data may be nested
        listing_data = item.get("listing") or item

        # URL
        item_id = listing_data.get("id") or listing_data.get("daftShortcode") or ""
        seo_url = listing_data.get("seoFriendlyPath") or listing_data.get("url") or listing_data.get("link") or ""
        if seo_url and not seo_url.startswith("http"):
            source_url = HOMEPAGE + seo_url
        elif seo_url:
            source_url = seo_url
        elif item_id:
            source_url = f"https://www.daft.ie/for-sale/apartment-{item_id}"
        else:
            return None

        # Title
        title = listing_data.get("title") or listing_data.get("header") or listing_data.get("displayAddress") or f"Property in {city_name}"

        # Price
        price = 0
        price_val = listing_data.get("price") or listing_data.get("askingPrice") or 0
        if isinstance(price_val, str):
            cleaned = price_val.replace("\u20ac", "").replace(",", "").replace(" ", "").replace(".", "")
            m = re.search(r'\d+', cleaned)
            if m:
                price = int(m.group())
        elif isinstance(price_val, (int, float)):
            price = int(price_val)
        if not price or price < 20000 or price > 5000000:
            return None

        # Area
        area = 0
        for key in ("floorArea", "size", "area", "propertySize"):
            raw = listing_data.get(key)
            if isinstance(raw, dict):
                raw = raw.get("value", 0)
            if isinstance(raw, (int, float)) and raw > 10:
                area = int(raw)
                break
            elif isinstance(raw, str):
                m = re.search(r'[\d.,]+', raw)
                if m:
                    area = int(float(m.group().replace(",", "")))
                    if area > 10:
                        break
        if not area or area < 10:
            area = 65

        # Bedrooms
        rooms = 2
        beds = listing_data.get("numBedrooms") or listing_data.get("bedrooms") or listing_data.get("beds") or 0
        if isinstance(beds, (int, float)) and beds > 0:
            rooms = int(beds)

        # Bathrooms
        bathrooms = 1
        baths = listing_data.get("numBathrooms") or listing_data.get("bathrooms") or 0
        if isinstance(baths, (int, float)) and baths > 0:
            bathrooms = int(baths)

        # Image
        image_url = ""
        media = listing_data.get("media") or listing_data.get("images") or listing_data.get("photos") or {}
        if isinstance(media, dict):
            images = media.get("images") or media.get("photos") or []
        elif isinstance(media, list):
            images = media
        else:
            images = []
        if images:
            first = images[0]
            if isinstance(first, dict):
                image_url = first.get("url") or first.get("src") or first.get("size720x480") or ""
            elif isinstance(first, str):
                image_url = first
        if not image_url:
            image_url = listing_data.get("mainPhoto") or listing_data.get("imageUrl") or ""
        if not image_url:
            image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

        # Coordinates
        point = listing_data.get("point") or listing_data.get("ber", {}).get("coordinates") or {}
        lat = 0
        lon = 0
        if isinstance(point, dict):
            lat = point.get("latitude") or point.get("lat") or 0
            lon = point.get("longitude") or point.get("lng") or point.get("lon") or 0
        if isinstance(point, list) and len(point) >= 2:
            lat, lon = point[0], point[1]

        if lat and lon:
            coords = [float(lat), float(lon)]
        else:
            base = CITY_COORDS.get(city_name, [53.3498, -6.2603])
            coords = [
                round(base[0] + random.uniform(-0.02, 0.02), 4),
                round(base[1] + random.uniform(-0.02, 0.02), 4),
            ]

        # Property type
        prop_type = "apartment"
        property_type = str(listing_data.get("propertyType", "")).lower()
        if "house" in property_type or "detached" in property_type:
            prop_type = "house"
        elif "studio" in property_type or area < 35:
            prop_type = "studio"

        avg_rent = city_config.get("avg_rent_sqm", 22)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        # Features
        features_list = listing_data.get("facilities") or listing_data.get("features") or []
        features = []
        if isinstance(features_list, list):
            for f in features_list[:6]:
                if isinstance(f, str):
                    features.append(f)
                elif isinstance(f, dict):
                    features.append(f.get("name", "") or f.get("value", ""))
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
            "bathrooms": bathrooms,
            "floor": random.randint(1, 5),
            "yearBuilt": 2000,
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": features[:6],
            "source": "daft",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": str(listing_data.get("displayAddress", "") or title)[:120],
            "neighborhood": str(listing_data.get("county", "") or city_name)[:80],
        }

    def _parse_html(self, soup, city_config: dict) -> list:
        """Fallback: parse HTML listing cards from Daft."""
        results = []
        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        selector_attempts = [
            "li[data-testid='result']",
            "li[class*='SearchResult']",
            "div[class*='SearchResult']",
            "a[href*='/for-sale/']",
        ]
        cards = []
        for sel in selector_attempts:
            cards = soup.select(sel)
            if cards and len(cards) >= 2:
                break

        if not cards:
            links = soup.select("a[href*='/for-sale/']")
            seen = set()
            for a in links:
                href = a.get("href", "")
                if href not in seen and "/for-sale/" in href:
                    seen.add(href)
                    parent = a.find_parent("li") or a.find_parent("div")
                    if parent:
                        cards.append(parent)

        logger.info(f"[daft] Found {len(cards)} HTML cards")

        for card in cards[:20]:
            try:
                source_url = ""
                link = card.select_one("a[href*='/for-sale/']") or card.select_one("a[href]")
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
                for sel in ["h2", "h3", "p[class*='title']", "a[title]"]:
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
                m = re.search(r'\u20ac\s*([\d,]+)', text)
                if m:
                    price = int(m.group(1).replace(",", ""))
                if not price or price < 20000 or price > 5000000:
                    continue

                area = 65
                m = re.search(r'(\d+)\s*(?:m\u00b2|m2|sq)', text, re.IGNORECASE)
                if m:
                    val = int(m.group(1))
                    if 10 <= val <= 500:
                        area = val

                rooms = 2
                m = re.search(r'(\d+)\s*(?:bed|Bed)', text)
                if m:
                    val = int(m.group(1))
                    if 1 <= val <= 10:
                        rooms = val

                bathrooms = 1
                m = re.search(r'(\d+)\s*(?:bath|Bath)', text)
                if m:
                    val = int(m.group(1))
                    if 1 <= val <= 5:
                        bathrooms = val

                img = card.select_one("img[src]") or card.select_one("img[data-src]")
                image_url = ""
                if img:
                    image_url = img.get("src") or img.get("data-src") or ""
                    if image_url and image_url.startswith("//"):
                        image_url = "https:" + image_url
                if not image_url:
                    image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

                base = CITY_COORDS.get(city_name, [53.3498, -6.2603])
                coords = [
                    round(base[0] + random.uniform(-0.02, 0.02), 4),
                    round(base[1] + random.uniform(-0.02, 0.02), 4),
                ]

                avg_rent = city_config.get("avg_rent_sqm", 22)
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
                    "bathrooms": bathrooms,
                    "floor": random.randint(1, 5),
                    "yearBuilt": 2000,
                    "coordinates": coords,
                    "imageUrl": image_url,
                    "estimatedMonthlyRent": monthly_rent,
                    "grossYield": gross_yield,
                    "features": ["Investment Property"],
                    "source": "daft",
                    "sourceUrl": source_url,
                    "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
                    "address": title[:120],
                    "neighborhood": city_name,
                })

            except Exception as e:
                logger.debug(f"[daft] HTML card parse error: {e}")
                continue

        return results
