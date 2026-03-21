"""
Funda.nl scraper for Netherlands property listings.
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
    "Amsterdam": [52.3676, 4.9041],
    "Rotterdam": [51.9225, 4.4792],
    "The Hague": [52.0705, 4.3007],
}

HOMEPAGE = "https://www.funda.nl"


class FundaScraper(BaseScraper):
    """Scraper for funda.nl (Netherlands) listings."""

    def __init__(self):
        super().__init__("funda")

    def scrape(self, city_config: dict) -> list:
        """Scrape property listings from Funda."""
        city_name = city_config.get("name", "Unknown")
        search_url = city_config.get("search_url", "")
        if not search_url:
            logger.warning("[funda] No search_url in city config")
            return []

        results = []
        try:
            # Step 1: visit homepage for cookies
            logger.info(f"[funda] Establishing session via {HOMEPAGE}")
            self.session.headers.update({
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                          "image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            })

            try:
                home_resp = self.session.get(HOMEPAGE, timeout=12)
                logger.info(f"[funda] Homepage status: {home_resp.status_code}")
            except Exception as e:
                logger.warning(f"[funda] Homepage request failed: {e}")

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

            # Step 3: fetch search pages
            for page_num in range(1, 3):
                if page_num == 1:
                    page_url = search_url
                else:
                    sep = "" if search_url.endswith("/") else "/"
                    page_url = f"{search_url}{sep}p{page_num}/"

                logger.info(f"[funda] Fetching page {page_num}: {page_url}")
                soup = self._get_page(page_url)
                if not soup:
                    logger.warning(f"[funda] Failed to fetch page {page_num}")
                    break

                # Try JSON extraction first
                if not results:
                    json_results = self._extract_from_json(soup, city_config)
                    if json_results:
                        results.extend(json_results)
                        if len(results) >= 20:
                            break
                        continue

                # Parse HTML cards
                cards = self._find_cards(soup)
                if not cards:
                    logger.info(f"[funda] No cards found on page {page_num}")
                    break

                logger.info(f"[funda] Found {len(cards)} cards on page {page_num}")
                for card in cards:
                    try:
                        listing = self._parse_card(card, city_config)
                        if listing:
                            results.append(listing)
                    except Exception as e:
                        logger.debug(f"[funda] Card parse error: {e}")
                        continue

                if len(results) >= 20:
                    break
                time.sleep(random.uniform(1.5, 3.0))

        except Exception as e:
            logger.warning(f"[funda] Scrape failed for {city_name}: {e}")

        return results[:20]

    def _extract_from_json(self, soup, city_config: dict) -> list:
        """Try to extract listings from embedded JSON data."""
        results = []
        try:
            next_data = soup.select_one("script#__NEXT_DATA__")
            if next_data and next_data.string:
                data = json.loads(next_data.string)
                props = data.get("props", {}).get("pageProps", {})
                listings = (
                    props.get("searchResults")
                    or props.get("results")
                    or props.get("listings")
                    or []
                )
                if isinstance(listings, dict):
                    listings = listings.get("results", []) or listings.get("items", [])

                if listings:
                    logger.info(f"[funda] Found {len(listings)} in __NEXT_DATA__")
                    for item in listings[:20]:
                        listing = self._parse_json_item(item, city_config)
                        if listing:
                            results.append(listing)
        except Exception as e:
            logger.debug(f"[funda] JSON extraction error: {e}")

        return results

    def _parse_json_item(self, item: dict, city_config: dict) -> Optional[dict]:
        """Parse a listing from Funda JSON data."""
        if not isinstance(item, dict):
            return None

        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # URL
        item_url = item.get("url") or item.get("link") or item.get("href") or ""
        if item_url and not item_url.startswith("http"):
            item_url = HOMEPAGE + item_url
        item_id = item.get("id") or item.get("globalId") or ""
        if not item_url and item_id:
            item_url = f"{HOMEPAGE}/koop/{city_id}/appartement-{item_id}/"
        if not item_url:
            return None

        title = item.get("address") or item.get("title") or item.get("name") or f"Property in {city_name}"

        price = 0
        for key in ("askingPrice", "price", "koopprijs", "prijs"):
            raw = item.get(key)
            if isinstance(raw, (int, float)) and raw > 1000:
                price = int(raw)
                break
            elif isinstance(raw, str):
                cleaned = raw.replace(".", "").replace(",", "").replace("\u20ac", "").replace(" ", "")
                m = re.search(r'\d+', cleaned)
                if m:
                    val = int(m.group())
                    if val > 20000:
                        price = val
                        break
        if not price or price < 20000 or price > 5000000:
            return None

        area = 0
        for key in ("livingArea", "woonoppervlakte", "area", "size"):
            raw = item.get(key)
            if isinstance(raw, (int, float)) and raw > 10:
                area = int(raw)
                break
        if not area:
            area = 65

        rooms = 2
        for key in ("numberOfRooms", "aantalKamers", "rooms"):
            raw = item.get(key)
            if isinstance(raw, (int, float)) and raw > 0:
                rooms = int(raw)
                break

        image_url = ""
        images = item.get("images") or item.get("media") or item.get("photos") or []
        if isinstance(images, list) and images:
            first = images[0]
            if isinstance(first, dict):
                image_url = first.get("url") or first.get("src") or ""
            elif isinstance(first, str):
                image_url = first
        if not image_url:
            image_url = item.get("imageUrl") or item.get("mainPhoto") or ""
        if not image_url:
            image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

        address = item.get("address") or title
        neighborhood = item.get("neighborhood") or item.get("wijk") or address

        base = CITY_COORDS.get(city_name, [52.3676, 4.9041])
        coords = [
            round(base[0] + random.uniform(-0.02, 0.02), 4),
            round(base[1] + random.uniform(-0.02, 0.02), 4),
        ]

        avg_rent = city_config.get("avg_rent_sqm", 20)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, title, price)

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
            "source": "funda",
            "sourceUrl": item_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": str(address)[:120],
            "neighborhood": str(neighborhood)[:80],
        }

    def _find_cards(self, soup) -> list:
        """Find listing cards on Funda search results page."""
        selector_attempts = [
            "div[data-test-id='search-result-item']",
            "div[class*='search-result']",
            "li[class*='search-result']",
            "div[class*='listing-search-item']",
            "div[class*='SearchResult']",
            "ol[class*='search-results'] > li",
        ]
        for sel in selector_attempts:
            cards = soup.select(sel)
            if cards and len(cards) >= 2:
                return cards

        # Fallback: links to listing pages
        links = soup.select("a[href*='/koop/']")
        containers = []
        seen = set()
        for a in links:
            href = a.get("href", "")
            if re.search(r'/koop/[^/]+/[^/]+-\d+', href) and href not in seen:
                seen.add(href)
                parent = a.find_parent("div") or a.find_parent("li")
                if parent and parent not in containers:
                    containers.append(parent)
        return containers

    def _parse_card(self, card, city_config: dict) -> Optional[dict]:
        """Parse a single Funda HTML listing card."""
        city_name = city_config.get("name", "Unknown")
        city_id = city_name.lower().replace(" ", "-")

        # Source URL
        source_url = ""
        link = card.select_one("a[href*='/koop/']") or card.select_one("a[href]")
        if link:
            href = link.get("href", "")
            if href.startswith("/"):
                source_url = HOMEPAGE + href
            elif href.startswith("http"):
                source_url = href
        if not source_url:
            return None

        # Title
        title = ""
        for sel in ["h2", "h3", ".search-result__header-title", "a[title]"]:
            el = card.select_one(sel)
            if el:
                t = el.get("title") or el.get_text(strip=True)
                if t and len(t) > 3:
                    title = t
                    break
        if not title:
            title = f"Property in {city_name}"

        # Price
        text = card.get_text()
        price = 0
        m = re.search(r'\u20ac\s*([\d.]+)', text)
        if m:
            price = int(m.group(1).replace(".", ""))
        if not m:
            m = re.search(r'([\d.]+)\s*\u20ac', text)
            if m:
                price = int(m.group(1).replace(".", ""))
        if not price or price < 20000 or price > 5000000:
            return None

        # Area
        area = 65
        m = re.search(r'(\d+)\s*(?:m\u00b2|m2)', text, re.IGNORECASE)
        if m:
            val = int(m.group(1))
            if 10 <= val <= 500:
                area = val

        # Rooms
        rooms = 2
        m = re.search(r'(\d+)\s*(?:kamer|room)', text, re.IGNORECASE)
        if m:
            val = int(m.group(1))
            if 1 <= val <= 10:
                rooms = val

        # Image
        img = card.select_one("img[src]") or card.select_one("img[data-src]")
        image_url = ""
        if img:
            image_url = img.get("src") or img.get("data-src") or ""
            if image_url and image_url.startswith("//"):
                image_url = "https:" + image_url
        if not image_url:
            image_url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"

        base = CITY_COORDS.get(city_name, [52.3676, 4.9041])
        coords = [
            round(base[0] + random.uniform(-0.02, 0.02), 4),
            round(base[1] + random.uniform(-0.02, 0.02), 4),
        ]

        avg_rent = city_config.get("avg_rent_sqm", 20)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

        from models import PropertyListing
        listing_id = PropertyListing.generate_id(city_id, title, price)

        return {
            "id": listing_id,
            "cityId": city_id,
            "title": title[:120],
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
            "source": "funda",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": title[:120],
            "neighborhood": city_name,
        }
