import re
import logging
import random
import time
from typing import List, Optional
from datetime import datetime
from .base import BaseScraper

logger = logging.getLogger("euronest.scraper")

CITY_COORDS = {
    "Athens": [37.9838, 23.7275],
    "Thessaloniki": [40.6401, 22.9444],
    "Heraklion": [35.3387, 25.1442],
    "Rhodes": [36.4341, 28.2176],
}

CITY_ID_MAP = {
    "athens": "Athens",
    "thessaloniki": "Thessaloniki",
    "heraklion": "Heraklion",
    "rhodes": "Rhodes",
}

# XE.gr geo_place_ids (Google Place IDs) for Greek cities
XE_GEO_IDS = {
    "Athens": "ChIJ8UNwBh-9oRQR3Y1mdkU1Nic",
    "Thessaloniki": "ChIJ7eAoFPQ4qBQRqXTOuBRGaAQ",
    "Heraklion": "ChIJXUGCYB2lhBQRrqBrICoYlpc",
    "Rhodes": "ChIJy5RL0QBxlhQRDqxLicoGXQ0",
}


class SpitogatosScraper(BaseScraper):
    """Scraper for Greek property listings from Spitogatos and XE.gr (fallback)."""

    def __init__(self):
        super().__init__("spitogatos")

    def scrape(self, city_config: dict) -> list:
        """Scrape apartments for sale - tries Spitogatos first, falls back to XE.gr."""
        city_name = city_config.get("name", "Unknown")
        logger.info(f"[greece] Starting scrape for {city_name}")

        # Strategy 1: Spitogatos with proper session/cookies
        results = self._scrape_spitogatos(city_config)

        if len(results) >= 3:
            logger.info(f"[greece] Spitogatos returned {len(results)} listings for {city_name}")
            return results[:20]

        # Strategy 2: XE.gr fallback
        logger.info(f"[greece] Spitogatos returned only {len(results)} listings, trying XE.gr fallback")
        xe_results = self._scrape_xe(city_config)

        if xe_results:
            logger.info(f"[greece] XE.gr returned {len(xe_results)} listings for {city_name}")
            # Merge: prefer spitogatos results, fill with xe
            combined = results + xe_results
            return combined[:20]

        logger.warning(f"[greece] Both sources failed for {city_name}, returning {len(results)} results")
        return results[:20]

    # ------------------------------------------------------------------ #
    #  STRATEGY 1 — Spitogatos (en.spitogatos.gr)
    # ------------------------------------------------------------------ #

    def _scrape_spitogatos(self, city_config: dict) -> list:
        """Scrape from en.spitogatos.gr with proper session establishment."""
        results = []
        search_url = city_config.get("search_url", "")
        if not search_url:
            logger.warning("[spitogatos] No search_url in city config")
            return []

        try:
            # Step 1: visit homepage to establish cookies / session
            logger.info("[spitogatos] Establishing session via homepage...")
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                          "image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9,el;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            })

            try:
                home_resp = self.session.get("https://en.spitogatos.gr/", timeout=12)
                logger.info(f"[spitogatos] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[spitogatos] Homepage request failed: {e}")

            time.sleep(random.uniform(1.5, 3.0))

            # Step 2: set browser-like navigation headers
            self.session.headers.update({
                "Referer": "https://en.spitogatos.gr/",
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

            # Step 3: scrape search result pages (up to 3)
            for page_num in range(1, 4):
                if page_num == 1:
                    page_url = search_url
                else:
                    # Spitogatos pagination: /offset_20, /offset_40, etc.
                    sep = "/" if not search_url.endswith("/") else ""
                    page_url = f"{search_url}{sep}offset_{(page_num - 1) * 20}"

                logger.info(f"[spitogatos] Fetching page {page_num}: {page_url}")
                soup = self._get_page(page_url)
                if not soup:
                    logger.warning(f"[spitogatos] Failed to fetch page {page_num}")
                    break

                cards = self._find_spitogatos_cards(soup)
                if not cards:
                    logger.info(f"[spitogatos] No cards found on page {page_num}")
                    break

                logger.info(f"[spitogatos] Found {len(cards)} cards on page {page_num}")
                for card in cards:
                    try:
                        listing = self._parse_spitogatos_card(card, city_config)
                        if listing:
                            results.append(listing)
                    except Exception as e:
                        logger.debug(f"[spitogatos] Card parse error: {e}")
                        continue

                if len(results) >= 20:
                    break

                time.sleep(random.uniform(1.0, 2.5))

        except Exception as e:
            logger.warning(f"[spitogatos] Scrape failed for {city_config.get('name', '?')}: {e}")

        return results[:20]

    def _find_spitogatos_cards(self, soup):
        """Try multiple CSS selectors to find listing cards on Spitogatos."""
        selector_attempts = [
            "div.search-result",
            "div[class*='listing']",
            "div[class*='property-card']",
            "article[class*='listing']",
            "div[data-listing-id]",
            "div[data-id]",
            ".results-list > div",
            ".search-results-list > div",
            "div.result-item",
            "div[class*='result'] a[href*='/sale/']",
            # Broader: any anchor that looks like a listing link
        ]
        for sel in selector_attempts:
            cards = soup.select(sel)
            if cards and len(cards) >= 2:
                return cards

        # Last resort: find all links that look like listing URLs
        links = soup.select("a[href]")
        listing_links = []
        for a in links:
            href = a.get("href", "")
            # Spitogatos listing URLs look like: /en/sale/apartment/12345
            if re.search(r'/(?:sale|rent|buy)/\w+/\d+', href) or re.search(r'/listing/\d+', href):
                # Get the parent container
                parent = a.find_parent("div")
                if parent and parent not in listing_links:
                    listing_links.append(parent)
        if listing_links:
            return listing_links

        return []

    def _parse_spitogatos_card(self, card, city_config: dict) -> Optional[dict]:
        """Parse a single Spitogatos listing card."""
        city_name = city_config.get("name", "Unknown")
        city_id = self._resolve_city_id(city_config)

        # -- Source URL (must have a real link) --
        source_url = ""
        link_el = card.select_one("a[href]")
        if not link_el:
            # card itself might be an <a>
            if card.name == "a" and card.get("href"):
                link_el = card
        if link_el:
            href = link_el.get("href", "")
            if href.startswith("/"):
                source_url = "https://en.spitogatos.gr" + href
            elif href.startswith("http"):
                source_url = href

        # -- Title --
        title = ""
        for sel in ["h2", "h3", ".title", ".listing-title", "a[title]", "a"]:
            el = card.select_one(sel)
            if el:
                t = el.get("title") or el.get_text(strip=True)
                if t and len(t) > 5:
                    title = t
                    break
        if not title:
            title = f"Property in {city_name}"

        # -- Price --
        price = 0
        for sel in [".price", ".listing-price", "[data-price]", "span[class*='price']", "div[class*='price']"]:
            el = card.select_one(sel)
            if el:
                price = self._parse_price(el.get_text())
                if price:
                    break
        if not price:
            # Regex the whole card text for euro amounts
            text = card.get_text()
            price = self._extract_price_from_text(text)
        if not price or price < 15000 or price > 5000000:
            return None

        # -- Area (sqm) --
        area = self._extract_area(card)

        # -- Rooms --
        rooms = self._extract_rooms(card)

        # -- Bathrooms --
        bathrooms = self._extract_bathrooms(card, rooms)

        # -- Floor --
        floor = self._extract_floor(card)

        # -- Image URL --
        image_url = self._extract_image(card, "https://en.spitogatos.gr")

        # -- Address / Neighborhood --
        address, neighborhood = self._extract_location(card, city_name)

        # -- Property type --
        prop_type = self._determine_type(title, area)

        # -- Investment metrics --
        avg_rent = city_config.get("avg_rent_sqm", 8)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        # -- Features --
        features = self._extract_features(card, title)

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
            "bathrooms": bathrooms,
            "floor": floor,
            "yearBuilt": 2000,
            "coordinates": self._jitter_coords(city_name),
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": features,
            "source": "spitogatos",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": address,
            "neighborhood": neighborhood,
        }

    # ------------------------------------------------------------------ #
    #  STRATEGY 2 — XE.gr (fallback)
    # ------------------------------------------------------------------ #

    def _scrape_xe(self, city_config: dict) -> list:
        """Scrape from xe.gr/property as fallback."""
        results = []
        city_name = city_config.get("name", "Unknown")

        try:
            # Reset session headers for xe.gr
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                          "image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9,el;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            })

            # Step 1: visit xe.gr homepage to get cookies
            logger.info("[xe.gr] Establishing session via homepage...")
            try:
                home_resp = self.session.get("https://www.xe.gr/", timeout=12)
                logger.info(f"[xe.gr] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[xe.gr] Homepage request failed: {e}")

            time.sleep(random.uniform(1.0, 2.5))

            # Step 2: set navigation headers
            self.session.headers.update({
                "Referer": "https://www.xe.gr/",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
                "Cache-Control": "max-age=0",
            })

            # Step 3: build search URL
            geo_id = XE_GEO_IDS.get(city_name, "")
            if geo_id:
                search_url = (
                    f"https://www.xe.gr/property/results?"
                    f"transaction_name=buy&item_type=re_residence"
                    f"&geo_place_id={geo_id}"
                )
            else:
                search_url = (
                    f"https://www.xe.gr/property/results?"
                    f"transaction_name=buy&item_type=re_residence"
                    f"&geo_name={city_name}"
                )

            logger.info(f"[xe.gr] Fetching search: {search_url}")
            soup = self._get_page(search_url)
            if not soup:
                logger.warning("[xe.gr] Failed to fetch search results page")
                return []

            cards = self._find_xe_cards(soup)
            if not cards:
                logger.warning("[xe.gr] No listing cards found")
                return []

            logger.info(f"[xe.gr] Found {len(cards)} cards")
            for card in cards:
                try:
                    listing = self._parse_xe_card(card, city_config)
                    if listing:
                        results.append(listing)
                except Exception as e:
                    logger.debug(f"[xe.gr] Card parse error: {e}")
                    continue

                if len(results) >= 20:
                    break

        except Exception as e:
            logger.warning(f"[xe.gr] Scrape failed for {city_name}: {e}")

        return results[:20]

    def _find_xe_cards(self, soup):
        """Try multiple selectors for XE.gr listing cards."""
        selector_attempts = [
            "div[class*='PropertyCard']",
            "div[class*='property-card']",
            "div[class*='listing']",
            "article[class*='result']",
            "div[class*='result-item']",
            "div[class*='item'] a[href*='/property/']",
            "a[href*='/property/d/']",
        ]
        for sel in selector_attempts:
            cards = soup.select(sel)
            if cards and len(cards) >= 1:
                return cards

        # Broader: find links that look like xe property listings
        links = soup.select("a[href]")
        listing_containers = []
        seen_hrefs = set()
        for a in links:
            href = a.get("href", "")
            if re.search(r'/property/d/\d+', href) or re.search(r'/property/\d+', href):
                if href not in seen_hrefs:
                    seen_hrefs.add(href)
                    parent = a.find_parent("div") or a
                    listing_containers.append(parent)
        if listing_containers:
            return listing_containers

        return []

    def _parse_xe_card(self, card, city_config: dict) -> Optional[dict]:
        """Parse a single XE.gr listing card."""
        city_name = city_config.get("name", "Unknown")
        city_id = self._resolve_city_id(city_config)

        # -- Source URL --
        source_url = ""
        link_el = card.select_one("a[href]")
        if not link_el and card.name == "a":
            link_el = card
        if link_el:
            href = link_el.get("href", "")
            if href.startswith("/"):
                source_url = "https://www.xe.gr" + href
            elif href.startswith("http"):
                source_url = href

        # -- Title --
        title = ""
        for sel in ["h2", "h3", "span[class*='title']", "div[class*='title']", "a"]:
            el = card.select_one(sel)
            if el:
                t = el.get("title") or el.get_text(strip=True)
                if t and len(t) > 3:
                    title = t
                    break
        if not title:
            title = f"Property in {city_name}"

        # -- Price --
        price = 0
        for sel in ["span[class*='price']", "div[class*='price']", "[data-price]",
                     "span[class*='Price']", "div[class*='Price']"]:
            el = card.select_one(sel)
            if el:
                price = self._parse_price(el.get_text())
                if price:
                    break
        if not price:
            price = self._extract_price_from_text(card.get_text())
        if not price or price < 15000 or price > 5000000:
            return None

        # -- Area --
        area = self._extract_area(card)

        # -- Rooms --
        rooms = self._extract_rooms(card)

        # -- Image --
        image_url = self._extract_image(card, "https://www.xe.gr")

        # -- Address --
        address, neighborhood = self._extract_location(card, city_name)

        # -- Type --
        prop_type = self._determine_type(title, area)

        # -- Metrics --
        avg_rent = city_config.get("avg_rent_sqm", 8)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        # -- Features --
        features = self._extract_features(card, title)

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
            "floor": self._extract_floor(card),
            "yearBuilt": 2000,
            "coordinates": self._jitter_coords(city_name),
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": features,
            "source": "xe.gr",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": address,
            "neighborhood": neighborhood,
        }

    # ------------------------------------------------------------------ #
    #  SHARED PARSING HELPERS
    # ------------------------------------------------------------------ #

    def _resolve_city_id(self, city_config: dict) -> str:
        """Get a lowercase city_id from config."""
        city_name = city_config.get("name", "")
        city_id = next(
            (k for k, v in CITY_ID_MAP.items() if v == city_name),
            city_name.lower().replace(" ", "_"),
        )
        return city_id

    def _parse_price(self, text: str) -> int:
        """Extract numeric price from text like '185.000 €' or '€185,000'."""
        if not text:
            return 0
        # Remove currency symbols, whitespace
        cleaned = text.replace("€", "").replace("$", "").replace("\xa0", " ").strip()
        # Handle European format: 185.000 (dots as thousands sep)
        # and US format: 185,000
        # Try to find the price number
        # First try: number with dots as thousand separators (European)
        m = re.search(r'(\d{1,3}(?:\.\d{3})+)', cleaned)
        if m:
            return int(m.group(1).replace(".", ""))
        # Try: number with commas as thousand separators
        m = re.search(r'(\d{1,3}(?:,\d{3})+)', cleaned)
        if m:
            return int(m.group(1).replace(",", ""))
        # Try: plain large number
        m = re.search(r'(\d{5,})', cleaned.replace(" ", ""))
        if m:
            return int(m.group(1))
        return 0

    def _extract_price_from_text(self, text: str) -> int:
        """Try to find a price in a block of text."""
        # Look for euro amounts: € 185.000 or 185.000€ or 185,000 €
        patterns = [
            r'€\s*(\d{1,3}(?:[.,]\d{3})*)',
            r'(\d{1,3}(?:[.,]\d{3})*)\s*€',
            r'(\d{1,3}(?:\.\d{3})+)',  # European: 185.000
        ]
        for pat in patterns:
            m = re.search(pat, text)
            if m:
                num_str = m.group(1).replace(".", "").replace(",", "")
                try:
                    val = int(num_str)
                    if 15000 <= val <= 5000000:
                        return val
                except ValueError:
                    continue
        return 0

    def _extract_area(self, card) -> int:
        """Extract area in sqm from a listing card."""
        # Try specific selectors
        for sel in [".area", ".size", ".sqm", "[data-area]",
                    "span[class*='area']", "span[class*='size']",
                    "div[class*='area']", "li[class*='area']"]:
            el = card.select_one(sel)
            if el:
                val = self._parse_number(el.get_text())
                if 10 <= val <= 500:
                    return val

        # Regex fallback in card text
        text = card.get_text()
        patterns = [
            r'(\d+)\s*(?:m²|m2|sq\.?\s*m|τ\.?\s*μ)',
            r'(\d+)\s*sqm',
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                val = int(m.group(1))
                if 10 <= val <= 500:
                    return val

        return 65  # reasonable default

    def _extract_rooms(self, card) -> int:
        """Extract room count from card."""
        text = card.get_text()
        patterns = [
            r'(\d+)\s*(?:bed|room|δωμ|υπνοδ)',
            r'(\d+)\s*(?:BR|br)',
            r'(\d+)-room',
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                val = int(m.group(1))
                if 1 <= val <= 10:
                    return val
        return 2

    def _extract_bathrooms(self, card, rooms: int) -> int:
        """Extract bathroom count from card."""
        text = card.get_text()
        m = re.search(r'(\d+)\s*(?:bath|μπάνι|wc)', text, re.IGNORECASE)
        if m:
            val = int(m.group(1))
            if 1 <= val <= 5:
                return val
        return max(1, rooms // 2)

    def _extract_floor(self, card) -> int:
        """Extract floor number from card."""
        text = card.get_text()
        patterns = [
            r'(\d+)(?:st|nd|rd|th)\s*floor',
            r'floor\s*[:.]?\s*(\d+)',
            r'όροφος\s*[:.]?\s*(\d+)',
            r'(\d+)\s*όροφος',
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                val = int(m.group(1))
                if 0 <= val <= 20:
                    return val
        return random.randint(1, 5)

    def _extract_image(self, card, base_url: str) -> str:
        """Extract image URL from card."""
        for sel in ["img[src]", "img[data-src]", "img[data-lazy-src]",
                     "source[srcset]", "div[style*='background-image']"]:
            el = card.select_one(sel)
            if el:
                url = (el.get("src") or el.get("data-src") or
                       el.get("data-lazy-src") or "")
                # Handle srcset
                if not url and el.get("srcset"):
                    url = el.get("srcset", "").split(",")[0].split(" ")[0].strip()
                # Handle background-image style
                if not url and el.get("style"):
                    m = re.search(r"url\(['\"]?([^'\"]+)['\"]?\)", el.get("style", ""))
                    if m:
                        url = m.group(1)
                if url:
                    if url.startswith("//"):
                        url = "https:" + url
                    elif url.startswith("/"):
                        url = base_url + url
                    if url.startswith("http"):
                        return url

        return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

    def _extract_location(self, card, city_name: str) -> tuple:
        """Extract address and neighborhood. Returns (address, neighborhood)."""
        address = city_name
        neighborhood = ""

        for sel in [".location", ".address", ".area-name",
                    "span[class*='location']", "span[class*='address']",
                    "div[class*='location']", "div[class*='address']",
                    "span[class*='area']", "p[class*='location']"]:
            el = card.select_one(sel)
            if el:
                text = el.get_text(strip=True)
                if text and len(text) > 2:
                    address = text
                    # Try to get neighborhood from the first part
                    parts = re.split(r'[,\-–]', text)
                    neighborhood = parts[0].strip() if parts else text
                    break

        if not neighborhood:
            neighborhood = address

        return address, neighborhood

    def _determine_type(self, title: str, area: int) -> str:
        """Determine property type from title and area."""
        t = title.lower()
        if "studio" in t or "γκαρσονιέρα" in t or area < 35:
            return "studio"
        if "house" in t or "villa" in t or "μονοκατοικία" in t or "βίλα" in t:
            return "house"
        if "commercial" in t or "κατάστημα" in t or "γραφείο" in t:
            return "commercial"
        return "apartment"

    def _extract_features(self, card, title: str) -> list:
        """Extract features from listing text."""
        features = []
        text = (card.get_text() + " " + title).lower()
        feature_map = {
            "renovated": "Renovated", "ανακαινισμ": "Renovated",
            "balcony": "Balcony", "μπαλκόνι": "Balcony",
            "parking": "Parking", "πάρκινγκ": "Parking", "garage": "Parking",
            "elevator": "Elevator", "ασανσέρ": "Elevator", "lift": "Elevator",
            "furnished": "Furnished", "επιπλωμέν": "Furnished",
            "sea view": "Sea View", "θέα θάλασσα": "Sea View",
            "garden": "Garden", "κήπο": "Garden",
            "storage": "Storage", "αποθήκη": "Storage",
            "terrace": "Terrace", "βεράντα": "Terrace",
            "pool": "Pool", "πισίνα": "Pool",
            "new build": "New Build", "νεόδμητ": "New Build",
            "metro": "Near Metro", "μετρό": "Near Metro",
            "central": "Central Location", "κεντρικ": "Central Location",
            "quiet": "Quiet Area", "ήσυχ": "Quiet Area",
            "air condition": "Air Conditioning", "κλιματισμ": "Air Conditioning",
            "solar": "Solar Water Heater", "ηλιακ": "Solar Water Heater",
            "autonomous": "Autonomous Heating", "αυτόνομ": "Autonomous Heating",
        }
        seen_labels = set()
        for keyword, label in feature_map.items():
            if keyword in text and label not in seen_labels:
                features.append(label)
                seen_labels.add(label)
        if not features:
            features = ["Investment Property"]
        return features[:6]

    def _parse_number(self, text: str) -> int:
        """Parse a number from text."""
        numbers = re.findall(r'[\d,.]+', text.replace(",", "."))
        if numbers:
            try:
                return int(float(numbers[0]))
            except ValueError:
                pass
        return 0

    def _jitter_coords(self, city_name: str) -> list:
        """Return city coordinates with small random jitter for each listing."""
        base = CITY_COORDS.get(city_name, [37.9838, 23.7275])
        return [
            round(base[0] + random.uniform(-0.02, 0.02), 4),
            round(base[1] + random.uniform(-0.02, 0.02), 4),
        ]
