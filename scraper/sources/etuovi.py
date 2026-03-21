import re
import logging
from typing import List
from datetime import datetime
from .base import BaseScraper

logger = logging.getLogger("euronest.scraper")


class EtuoviScraper(BaseScraper):
    def __init__(self):
        super().__init__("etuovi")

    def scrape(self, city_config: dict) -> list:
        """Scrape apartments for sale from etuovi.com (Finland)."""
        results = []
        url = city_config.get("search_url", "")
        if not url:
            logger.warning("[etuovi] No search_url in city config")
            return []

        logger.info(f"[etuovi] Scraping {city_config['name']} from {url}")

        try:
            for page in range(1, 4):  # up to 3 pages
                page_url = f"{url}&page={page}" if "?" in url else f"{url}?page={page}"
                if page == 1:
                    page_url = url
                soup = self._get_page(page_url)
                if not soup:
                    logger.warning(f"[etuovi] Failed to fetch page {page} for {city_config['name']}")
                    break

                # Try multiple selector patterns for listing cards
                cards = (
                    soup.select(".ListPage__cardContainer") or
                    soup.select("[class*='ResultList'] [class*='Card']") or
                    soup.select(".property-card") or
                    soup.select("[data-test-id='result-card']") or
                    soup.select(".listing-card") or
                    soup.select("[class*='result'] [class*='card']") or
                    soup.select("article") or
                    soup.select(".search-results > div > div")
                )

                if not cards:
                    logger.warning(f"[etuovi] No listing cards found on page {page}")
                    break

                for card in cards:
                    try:
                        listing = self._parse_card(card, city_config)
                        if listing:
                            results.append(listing)
                    except Exception as e:
                        logger.debug(f"[etuovi] Error parsing card: {e}")
                        continue

                if len(results) >= 20:
                    break
        except Exception as e:
            logger.warning(f"[etuovi] Scrape failed for {city_config.get('name', '?')}: {e}")

        logger.info(f"[etuovi] Got {len(results)} listings for {city_config['name']}")
        return results[:20]

    def _parse_card(self, card, city_config: dict) -> dict:
        """Parse a single listing card into a property dict."""
        # Extract title
        title_el = card.select_one(
            "h2, h3, .title, [class*='Title'], [class*='title'], a[title], "
            "[class*='address'], [class*='Address']"
        )
        title = title_el.get_text(strip=True) if title_el else None
        if not title:
            return None

        # Extract price
        price_el = card.select_one(
            ".price, [class*='Price'], [class*='price'], [data-price]"
        )
        price_text = price_el.get_text(strip=True) if price_el else ""
        price = self._parse_price(price_text)
        if not price or price < 30000 or price > 2000000:
            return None

        # Extract area
        area = None
        area_patterns = [
            ".area", ".size", "[class*='Size']", "[class*='size']",
            "[class*='Area']", "[class*='area']", "[data-area]",
        ]
        for pattern in area_patterns:
            el = card.select_one(pattern)
            if el:
                area = self._parse_number(el.get_text())
                break
        if not area:
            text = card.get_text()
            m = re.search(r'(\d+[.,]?\d*)\s*(?:m²|m2|neliö)', text)
            if m:
                area = int(float(m.group(1).replace(",", ".")))

        if not area or area < 20 or area > 300:
            area = 55  # default for Finnish apartments

        # Extract rooms
        rooms = 2  # default
        text = card.get_text()
        # Finnish room notation: 2h+k = 2 rooms + kitchen, 3h+k+s = 3 rooms + kitchen + sauna
        m = re.search(r'(\d+)\s*[hH]\s*\+', text)
        if m:
            rooms = int(m.group(1))
        else:
            m = re.search(r'(\d+)\s*(?:huone|room|bed)', text, re.IGNORECASE)
            if m:
                rooms = int(m.group(1))

        # Extract image
        img_el = card.select_one("img[src], img[data-src], img[data-lazy-src]")
        image_url = ""
        if img_el:
            image_url = img_el.get("src") or img_el.get("data-src") or img_el.get("data-lazy-src") or ""
            if image_url.startswith("//"):
                image_url = "https:" + image_url
            elif image_url.startswith("/"):
                image_url = "https://www.etuovi.com" + image_url

        # Extract link
        link_el = card.select_one("a[href]")
        source_url = ""
        if link_el:
            href = link_el.get("href", "")
            if href.startswith("/"):
                source_url = "https://www.etuovi.com" + href
            elif href.startswith("http"):
                source_url = href

        # Extract location/address
        addr_el = card.select_one(
            ".location, .address, [class*='Location'], [class*='location'], "
            "[class*='Address'], [class*='address']"
        )
        address = addr_el.get_text(strip=True) if addr_el else city_config["name"]

        # Calculate investment metrics
        avg_rent = city_config.get("avg_rent_sqm", 15)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1)

        # Determine type
        prop_type = "apartment"
        title_lower = title.lower()
        if "yksiö" in title_lower or "studio" in title_lower or area < 35:
            prop_type = "studio"
        elif any(w in title_lower for w in ("talo", "house", "omakotitalo", "villa")):
            prop_type = "house"

        city_id = next(
            (k for k, v in _city_map().items() if v == city_config.get("name")),
            city_config.get("name", "").lower(),
        )

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
            "floor": 2,
            "yearBuilt": 1985,
            "coordinates": _city_coords(city_config["name"]),
            "imageUrl": image_url or "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": self._extract_features(card, title),
            "source": "etuovi",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": address,
            "neighborhood": address,
        }

    def _parse_price(self, text: str) -> int:
        """Extract numeric price from text, handling Finnish formatting."""
        text = text.replace("\u202f", "").replace("\xa0", "")  # non-breaking spaces
        text = text.replace(".", "").replace(",", "").replace("€", "").replace(" ", "")
        numbers = re.findall(r'\d+', text)
        if numbers:
            val = int(numbers[0])
            if val > 1000:
                return val
        return 0

    def _parse_number(self, text: str) -> int:
        numbers = re.findall(r'[\d,.]+', text.replace(",", "."))
        if numbers:
            try:
                return int(float(numbers[0]))
            except ValueError:
                pass
        return 0

    def _extract_features(self, card, title: str) -> list:
        features = []
        text = (card.get_text() + " " + title).lower()
        feature_map = {
            "sauna": "Sauna",
            "parveke": "Balcony", "balcony": "Balcony",
            "autopaikka": "Parking", "parking": "Parking",
            "hissi": "Elevator", "elevator": "Elevator",
            "kalustettu": "Furnished", "furnished": "Furnished",
            "merinäköala": "Sea View", "sea view": "Sea View",
            "piha": "Garden", "garden": "Garden",
            "varasto": "Storage", "storage": "Storage",
            "terassi": "Terrace", "terrace": "Terrace",
            "uima-allas": "Pool", "pool": "Pool",
            "uudiskohde": "New Build", "new": "New Build",
            "remontoitu": "Renovated", "renovated": "Renovated",
            "keskusta": "Central Location", "central": "Central Location",
            "rauhallinen": "Quiet Area", "quiet": "Quiet Area",
        }
        for keyword, label in feature_map.items():
            if keyword in text and label not in features:
                features.append(label)
        if not features:
            features = ["Investment Property"]
        return features[:5]


def _city_coords(name):
    coords = {
        "Helsinki": [60.1699, 24.9384],
        "Tampere": [61.4978, 23.7610],
        "Turku": [60.4518, 22.2666],
        "Oulu": [65.0121, 25.4651],
    }
    return coords.get(name, [60.1699, 24.9384])


def _city_map():
    return {
        "helsinki": "Helsinki",
        "tampere": "Tampere",
        "turku": "Turku",
        "oulu": "Oulu",
    }
