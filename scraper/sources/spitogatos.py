import re
import logging
from typing import List
from datetime import datetime
from .base import BaseScraper

logger = logging.getLogger("euronest.scraper")


class SpitogatosScraper(BaseScraper):
    def __init__(self):
        super().__init__("spitogatos")

    def scrape(self, city_config: dict) -> list:
        """Scrape apartments for sale from en.spitogatos.gr"""
        results = []
        url = city_config.get("search_url", "")
        if not url:
            logger.warning("[spitogatos] No search_url in city config")
            return []

        logger.info(f"[spitogatos] Scraping {city_config['name']} from {url}")

        try:
            for page in range(1, 4):  # up to 3 pages
                page_url = f"{url}?page={page}" if page > 1 else url
                soup = self._get_page(page_url)
                if not soup:
                    logger.warning(f"[spitogatos] Failed to fetch page {page} for {city_config['name']}")
                    break

                # Try multiple selector patterns for listing cards
                cards = (
                    soup.select(".listing-card") or
                    soup.select(".property-card") or
                    soup.select("[data-listing-id]") or
                    soup.select(".results-list .result") or
                    soup.select("article.listing") or
                    soup.select(".search-results-list > div")
                )

                if not cards:
                    logger.warning(f"[spitogatos] No listing cards found on page {page}")
                    break

                for card in cards:
                    try:
                        listing = self._parse_card(card, city_config)
                        if listing:
                            results.append(listing)
                    except Exception as e:
                        logger.debug(f"[spitogatos] Error parsing card: {e}")
                        continue

                if len(results) >= 20:
                    break
        except Exception as e:
            logger.warning(f"[spitogatos] Scrape failed for {city_config.get('name', '?')}: {e}")

        logger.info(f"[spitogatos] Got {len(results)} listings for {city_config['name']}")
        return results[:20]

    def _parse_card(self, card, city_config: dict) -> dict:
        """Parse a single listing card into a property dict."""
        # Extract title
        title_el = card.select_one("h2, h3, .title, .listing-title, a[title]")
        title = title_el.get_text(strip=True) if title_el else None
        if not title:
            return None

        # Extract price
        price_el = card.select_one(".price, .listing-price, [data-price]")
        price_text = price_el.get_text(strip=True) if price_el else ""
        price = self._parse_price(price_text)
        if not price or price < 30000 or price > 2000000:
            return None

        # Extract area
        area = None
        area_patterns = [".area", ".size", ".sqm", "[data-area]"]
        for pattern in area_patterns:
            el = card.select_one(pattern)
            if el:
                area = self._parse_number(el.get_text())
                break
        if not area:
            # Try finding sqm in text
            text = card.get_text()
            m = re.search(r'(\d+)\s*(?:m²|sq\.?m|τ\.?μ)', text)
            if m:
                area = int(m.group(1))

        if not area or area < 20 or area > 300:
            area = 65  # default

        # Extract rooms
        rooms = 2  # default
        text = card.get_text()
        m = re.search(r'(\d+)\s*(?:bed|room|δωμ)', text, re.IGNORECASE)
        if m:
            rooms = int(m.group(1))

        # Extract image
        img_el = card.select_one("img[src], img[data-src]")
        image_url = ""
        if img_el:
            image_url = img_el.get("src") or img_el.get("data-src") or ""
            if image_url.startswith("//"):
                image_url = "https:" + image_url
            elif image_url.startswith("/"):
                image_url = "https://en.spitogatos.gr" + image_url

        # Extract link
        link_el = card.select_one("a[href]")
        source_url = ""
        if link_el:
            href = link_el.get("href", "")
            if href.startswith("/"):
                source_url = "https://en.spitogatos.gr" + href
            elif href.startswith("http"):
                source_url = href

        # Extract location/address
        addr_el = card.select_one(".location, .address, .area-name")
        address = addr_el.get_text(strip=True) if addr_el else city_config["name"]

        # Calculate investment metrics
        avg_rent = city_config.get("avg_rent_sqm", 8)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1)

        # Determine type
        prop_type = "apartment"
        title_lower = title.lower()
        if "studio" in title_lower or area < 35:
            prop_type = "studio"
        elif "house" in title_lower or "villa" in title_lower:
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
            "yearBuilt": 2000,
            "coordinates": _city_coords(city_config["name"]),
            "imageUrl": image_url or "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": self._extract_features(card, title),
            "source": "spitogatos",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": address,
            "neighborhood": address,
        }

    def _parse_price(self, text: str) -> int:
        """Extract numeric price from text."""
        text = text.replace(".", "").replace(",", "").replace("€", "").replace(" ", "")
        numbers = re.findall(r'\d+', text)
        if numbers:
            val = int(numbers[0])
            if val > 1000:  # seems like a real price
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
            "renovated": "Renovated", "balcony": "Balcony", "parking": "Parking",
            "elevator": "Elevator", "furnished": "Furnished", "sea view": "Sea View",
            "garden": "Garden", "storage": "Storage", "terrace": "Terrace",
            "pool": "Pool", "new": "New Build", "metro": "Near Metro",
            "central": "Central Location", "quiet": "Quiet Area",
        }
        for keyword, label in feature_map.items():
            if keyword in text:
                features.append(label)
        if not features:
            features = ["Investment Property"]
        return features[:5]


def _city_coords(name):
    coords = {
        "Athens": [37.9838, 23.7275], "Thessaloniki": [40.6401, 22.9444],
        "Heraklion": [35.3387, 25.1442], "Rhodes": [36.4341, 28.2176],
    }
    return coords.get(name, [37.9838, 23.7275])


def _city_map():
    return {
        "athens": "Athens", "thessaloniki": "Thessaloniki",
        "heraklion": "Heraklion", "rhodes": "Rhodes",
    }
