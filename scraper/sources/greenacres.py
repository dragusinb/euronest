import re
import logging
from typing import List
from datetime import datetime
from .base import BaseScraper

logger = logging.getLogger("euronest.scraper")


class GreenAcresScraper(BaseScraper):
    def __init__(self):
        super().__init__("greenacres")

    def scrape(self, city_config: dict) -> list:
        """Scrape apartments for sale from green-acres.com (France)."""
        results = []
        url = city_config.get("search_url", "")
        if not url:
            logger.warning("[greenacres] No search_url in city config")
            return []

        logger.info(f"[greenacres] Scraping {city_config['name']} from {url}")

        try:
            for page in range(1, 4):  # up to 3 pages
                page_url = f"{url}?page={page}" if page > 1 else url
                soup = self._get_page(page_url)
                if not soup:
                    logger.warning(f"[greenacres] Failed to fetch page {page} for {city_config['name']}")
                    break

                # Try multiple selector patterns for listing cards
                cards = (
                    soup.select(".announcesListItem") or
                    soup.select(".property-card") or
                    soup.select(".listing-item") or
                    soup.select("[data-property-id]") or
                    soup.select(".results-list .result") or
                    soup.select("article.announce") or
                    soup.select(".search-results li") or
                    soup.select(".announces-list > div")
                )

                if not cards:
                    logger.warning(f"[greenacres] No listing cards found on page {page}")
                    break

                for card in cards:
                    try:
                        listing = self._parse_card(card, city_config)
                        if listing:
                            results.append(listing)
                    except Exception as e:
                        logger.debug(f"[greenacres] Error parsing card: {e}")
                        continue

                if len(results) >= 20:
                    break
        except Exception as e:
            logger.warning(f"[greenacres] Scrape failed for {city_config.get('name', '?')}: {e}")

        logger.info(f"[greenacres] Got {len(results)} listings for {city_config['name']}")
        return results[:20]

    def _parse_card(self, card, city_config: dict) -> dict:
        """Parse a single listing card into a property dict."""
        # Extract title
        title_el = card.select_one("h2, h3, .title, .announce-title, a[title], .property-title")
        title = title_el.get_text(strip=True) if title_el else None
        if not title:
            return None

        # Extract price
        price_el = card.select_one(".price, .announce-price, .property-price, [data-price]")
        price_text = price_el.get_text(strip=True) if price_el else ""
        price = self._parse_price(price_text)
        if not price or price < 30000 or price > 2000000:
            return None

        # Extract area
        area = None
        area_patterns = [".area", ".size", ".surface", ".sqm", "[data-area]"]
        for pattern in area_patterns:
            el = card.select_one(pattern)
            if el:
                area = self._parse_number(el.get_text())
                break
        if not area:
            text = card.get_text()
            m = re.search(r'(\d+)\s*(?:m²|sq\.?m|m2)', text)
            if m:
                area = int(m.group(1))

        if not area or area < 20 or area > 300:
            area = 60  # default

        # Extract rooms
        rooms = 2  # default
        text = card.get_text()
        m = re.search(r'(\d+)\s*(?:pièce|chambre|room|bed|pi[eè]ce)', text, re.IGNORECASE)
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
                image_url = "https://www.green-acres.com" + image_url

        # Extract link
        link_el = card.select_one("a[href]")
        source_url = ""
        if link_el:
            href = link_el.get("href", "")
            if href.startswith("/"):
                source_url = "https://www.green-acres.com" + href
            elif href.startswith("http"):
                source_url = href

        # Extract location/address
        addr_el = card.select_one(".location, .address, .city, .announce-location")
        address = addr_el.get_text(strip=True) if addr_el else city_config["name"]

        # Calculate investment metrics
        avg_rent = city_config.get("avg_rent_sqm", 15)
        monthly_rent = int(area * avg_rent)
        gross_yield = round((monthly_rent * 12 / price) * 100, 1)

        # Determine type
        prop_type = "apartment"
        title_lower = title.lower()
        if "studio" in title_lower or area < 35:
            prop_type = "studio"
        elif any(w in title_lower for w in ("maison", "house", "villa")):
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
            "yearBuilt": 1990,
            "coordinates": _city_coords(city_config["name"]),
            "imageUrl": image_url or "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
            "estimatedMonthlyRent": monthly_rent,
            "grossYield": gross_yield,
            "features": self._extract_features(card, title),
            "source": "greenacres",
            "sourceUrl": source_url,
            "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
            "address": address,
            "neighborhood": address,
        }

    def _parse_price(self, text: str) -> int:
        """Extract numeric price from text, handling French formatting (e.g. 150 000 €)."""
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
            "rénové": "Renovated", "renovated": "Renovated",
            "balcon": "Balcony", "balcony": "Balcony",
            "parking": "Parking", "garage": "Garage",
            "ascenseur": "Elevator", "elevator": "Elevator",
            "meublé": "Furnished", "furnished": "Furnished",
            "vue mer": "Sea View", "sea view": "Sea View",
            "jardin": "Garden", "garden": "Garden",
            "cave": "Storage", "storage": "Storage",
            "terrasse": "Terrace", "terrace": "Terrace",
            "piscine": "Pool", "pool": "Pool",
            "neuf": "New Build", "new": "New Build",
            "métro": "Near Metro", "metro": "Near Metro",
            "centre": "Central Location", "central": "Central Location",
            "calme": "Quiet Area", "quiet": "Quiet Area",
            "lumineux": "Bright", "bright": "Bright",
        }
        for keyword, label in feature_map.items():
            if keyword in text and label not in features:
                features.append(label)
        if not features:
            features = ["Investment Property"]
        return features[:5]


def _city_coords(name):
    coords = {
        "Paris": [48.8566, 2.3522],
        "Lyon": [45.7640, 4.8357],
        "Marseille": [43.2965, 5.3698],
        "Nice": [43.7102, 7.2620],
        "Bordeaux": [44.8378, -0.5792],
    }
    return coords.get(name, [48.8566, 2.3522])


def _city_map():
    return {
        "paris": "Paris",
        "lyon": "Lyon",
        "marseille": "Marseille",
        "nice": "Nice",
        "bordeaux": "Bordeaux",
    }
