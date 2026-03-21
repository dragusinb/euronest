"""
Idealista.com scraper for Spain, Portugal, and Italy property listings.
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
    "Madrid": [40.4168, -3.7038],
    "Barcelona": [41.3874, 2.1686],
    "Valencia": [39.4699, -0.3763],
    "Malaga": [36.7213, -4.4214],
    "Lisbon": [38.7223, -9.1393],
    "Porto": [41.1579, -8.6291],
    "Rome": [41.9028, 12.4964],
    "Milan": [45.4642, 9.1900],
    "Naples": [40.8518, 14.2681],
}

# Map search_url domain to homepage for cookie establishment
DOMAIN_MAP = {
    "idealista.com": "https://www.idealista.com",
    "idealista.pt": "https://www.idealista.pt",
    "idealista.it": "https://www.idealista.it",
}


class IdealistaScraper(BaseScraper):
    """Scraper for idealista.com / idealista.pt / idealista.it listings."""

    def __init__(self):
        super().__init__("idealista")

    def scrape(self, city_config: dict) -> list:
        """Scrape property listings from Idealista."""
        city_name = city_config.get("name", "Unknown")
        search_url = city_config.get("search_url", "")
        if not search_url:
            logger.warning("[idealista] No search_url in city config")
            return []

        results = []
        try:
            # Determine the base domain
            homepage = "https://www.idealista.com"
            for domain, url in DOMAIN_MAP.items():
                if domain in search_url:
                    homepage = url
                    break

            # Step 1: visit homepage for cookies
            logger.info(f"[idealista] Establishing session via {homepage}")
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
                logger.info(f"[idealista] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[idealista] Homepage request failed: {e}")

            time.sleep(random.uniform(1.5, 3.0))

            # Step 2: set browser-like navigation headers
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

            # Step 3: scrape search result pages (up to 2 pages)
            for page_num in range(1, 3):
                if page_num == 1:
                    page_url = search_url
                else:
                    sep = "" if search_url.endswith("/") else "/"
                    page_url = f"{search_url}{sep}pagina-{page_num}.htm"

                logger.info(f"[idealista] Fetching page {page_num}: {page_url}")
                soup = self._get_page(page_url)
                if not soup:
                    logger.warning(f"[idealista] Failed to fetch page {page_num}")
                    break

                cards = self._find_cards(soup)
                if not cards:
                    logger.info(f"[idealista] No cards found on page {page_num}")
                    break

                logger.info(f"[idealista] Found {len(cards)} cards on page {page_num}")
                for card in cards:
                    try:
                        listing = self._parse_card(card, city_config, homepage)
                        if listing:
                            results.append(listing)
                    except Exception as e:
                        logger.debug(f"[idealista] Card parse error: {e}")
                        continue

                if len(results) >= 20:
                    break

                time.sleep(random.uniform(1.5, 3.0))

        except Exception as e:
            logger.warning(f"[idealista] Scrape failed for {city_name}: {e}")

        return results[:20]

    def _find_cards(self, soup) -> list:
        """Find listing cards on Idealista search results page."""
        selector_attempts = [
            "article.item",
            "div.item-info-container",
            "article[class*='item']",
            "div[class*='item-container']",
            "div.listing-item",
            "section.items-list article",
        ]
        for sel in selector_attempts:
            cards = soup.select(sel)
            if cards and len(cards) >= 2:
                return cards

        # Fallback: find links that look like listing URLs
        links = soup.select("a[href]")
        listing_containers = []
        seen = set()
        for a in links:
            href = a.get("href", "")
            if re.search(r'/inmueble/\d+/', href) or re.search(r'/imovel/\d+/', href) or re.search(r'/immobile/\d+/', href):
                if href not in seen:
                    seen.add(href)
                    parent = a.find_parent("article") or a.find_parent("div")
                    if parent and parent not in listing_containers:
                        listing_containers.append(parent)
        return listing_containers

    def _parse_card(self, card, city_config: dict, homepage: str) -> Optional[dict]:
        """Parse a single Idealista listing card."""
        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # Source URL
        source_url = ""
        link_el = card.select_one("a[href*='/inmueble/']") or card.select_one("a[href*='/imovel/']") or card.select_one("a[href*='/immobile/']") or card.select_one("a[href]")
        if link_el:
            href = link_el.get("href", "")
            if href.startswith("/"):
                source_url = homepage + href
            elif href.startswith("http"):
                source_url = href
        if not source_url:
            return None

        # Title
        title = ""
        for sel in ["a.item-link", ".item-link", "h2", "h3", ".item-title", "a[title]"]:
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
        for sel in [".item-price", ".price-row", "span[class*='price']", "div[class*='price']"]:
            el = card.select_one(sel)
            if el:
                price = self._parse_price(el.get_text())
                if price:
                    break
        if not price:
            price = self._extract_price_from_text(card.get_text())
        if not price or price < 20000 or price > 5000000:
            return None

        # Area
        area = self._extract_area(card)

        # Rooms
        rooms = self._extract_rooms(card)

        # Bathrooms
        bathrooms = self._extract_bathrooms(card)

        # Floor
        floor = self._extract_floor(card)

        # Image
        image_url = self._extract_image_url(card, homepage)

        # Address / neighborhood
        address = city_name
        neighborhood = ""
        for sel in [".item-detail", ".item-location", ".location", "span[class*='location']"]:
            el = card.select_one(sel)
            if el:
                text = el.get_text(strip=True)
                if text and len(text) > 2:
                    address = text
                    parts = re.split(r'[,\-]', text)
                    neighborhood = parts[0].strip()
                    break
        if not neighborhood:
            neighborhood = address

        # Property type
        prop_type = "apartment"
        t = title.lower()
        if "studio" in t or "estudio" in t or area < 35:
            prop_type = "studio"
        elif any(w in t for w in ("house", "villa", "chalet", "casa", "moradia")):
            prop_type = "house"

        # Investment metrics
        avg_rent = city_config.get("avg_rent_sqm", 12)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        # Features
        features = self._extract_features(card, title)

        # Coordinates
        base = CITY_COORDS.get(city_name, [40.4168, -3.7038])
        coords = [
            round(base[0] + random.uniform(-0.02, 0.02), 4),
            round(base[1] + random.uniform(-0.02, 0.02), 4),
        ]

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
            "coordinates": coords,
            "imageUrl": image_url,
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": features,
            "source": "idealista",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": address[:120],
            "neighborhood": neighborhood[:80],
        }

    # ------------------------------------------------------------------ #
    #  Parsing helpers
    # ------------------------------------------------------------------ #

    def _parse_price(self, text: str) -> int:
        if not text:
            return 0
        cleaned = text.replace("\u20ac", "").replace("$", "").replace("\xa0", " ").strip()
        m = re.search(r'(\d{1,3}(?:\.\d{3})+)', cleaned)
        if m:
            return int(m.group(1).replace(".", ""))
        m = re.search(r'(\d{1,3}(?:,\d{3})+)', cleaned)
        if m:
            return int(m.group(1).replace(",", ""))
        m = re.search(r'(\d{5,})', cleaned.replace(" ", ""))
        if m:
            return int(m.group(1))
        return 0

    def _extract_price_from_text(self, text: str) -> int:
        patterns = [
            r'\u20ac\s*(\d{1,3}(?:[.,]\d{3})*)',
            r'(\d{1,3}(?:[.,]\d{3})*)\s*\u20ac',
            r'(\d{1,3}(?:\.\d{3})+)',
        ]
        for pat in patterns:
            m = re.search(pat, text)
            if m:
                num_str = m.group(1).replace(".", "").replace(",", "")
                try:
                    val = int(num_str)
                    if 20000 <= val <= 5000000:
                        return val
                except ValueError:
                    continue
        return 0

    def _extract_area(self, card) -> int:
        for sel in [".item-detail", ".detail", "span[class*='area']", "span[class*='size']"]:
            el = card.select_one(sel)
            if el:
                text = el.get_text()
                m = re.search(r'(\d+)\s*(?:m\u00b2|m2|sq)', text, re.IGNORECASE)
                if m:
                    val = int(m.group(1))
                    if 10 <= val <= 500:
                        return val
        text = card.get_text()
        m = re.search(r'(\d+)\s*(?:m\u00b2|m2|sq\.?\s*m)', text, re.IGNORECASE)
        if m:
            val = int(m.group(1))
            if 10 <= val <= 500:
                return val
        return 65

    def _extract_rooms(self, card) -> int:
        text = card.get_text()
        patterns = [
            r'(\d+)\s*(?:bed|hab|quart|local|camer)',
            r'(\d+)\s*(?:room|BR)',
            r'T(\d+)',
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                val = int(m.group(1))
                if 1 <= val <= 10:
                    return val
        return 2

    def _extract_bathrooms(self, card) -> int:
        text = card.get_text()
        m = re.search(r'(\d+)\s*(?:bath|ba\u00f1o|bagn|casa de banho|wc)', text, re.IGNORECASE)
        if m:
            val = int(m.group(1))
            if 1 <= val <= 5:
                return val
        return 1

    def _extract_floor(self, card) -> int:
        text = card.get_text()
        patterns = [
            r'(\d+)(?:st|nd|rd|th)\s*floor',
            r'floor\s*[:.]?\s*(\d+)',
            r'planta\s*(\d+)',
            r'(\d+)\u00ba\s*(?:piso|planta|piano)',
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                val = int(m.group(1))
                if 0 <= val <= 20:
                    return val
        return random.randint(1, 5)

    def _extract_image_url(self, card, base_url: str) -> str:
        for sel in ["img[src]", "img[data-src]", "img[data-lazy-src]", "picture source[srcset]"]:
            el = card.select_one(sel)
            if el:
                url = el.get("src") or el.get("data-src") or el.get("data-lazy-src") or ""
                if not url and el.get("srcset"):
                    url = el.get("srcset", "").split(",")[0].split(" ")[0].strip()
                if url:
                    if url.startswith("//"):
                        url = "https:" + url
                    elif url.startswith("/"):
                        url = base_url + url
                    if url.startswith("http"):
                        return url
        return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

    def _extract_features(self, card, title: str) -> list:
        features = []
        text = (card.get_text() + " " + title).lower()
        feature_map = {
            "renovated": "Renovated", "reformado": "Renovated", "ristrutturato": "Renovated",
            "balcony": "Balcony", "balc\u00f3n": "Balcony", "balcone": "Balcony", "varanda": "Balcony",
            "parking": "Parking", "garaje": "Parking", "garage": "Parking",
            "elevator": "Elevator", "ascensor": "Elevator", "ascensore": "Elevator",
            "furnished": "Furnished", "amueblado": "Furnished", "arredato": "Furnished",
            "sea view": "Sea View", "vista al mar": "Sea View", "vista mare": "Sea View",
            "garden": "Garden", "jard\u00edn": "Garden", "giardino": "Garden",
            "terrace": "Terrace", "terraza": "Terrace", "terrazza": "Terrace",
            "pool": "Pool", "piscina": "Pool",
            "air condition": "Air Conditioning", "aire acondicionado": "Air Conditioning",
            "central": "Central Location",
        }
        seen = set()
        for keyword, label in feature_map.items():
            if keyword in text and label not in seen:
                features.append(label)
                seen.add(label)
        if not features:
            features = ["Investment Property"]
        return features[:6]
