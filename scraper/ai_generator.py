"""
AI Fallback: generates realistic property listings using OpenAI
when web scrapers fail or return insufficient results.
"""
import json
import logging
import random
from datetime import datetime
from typing import List
from openai import OpenAI

logger = logging.getLogger("euronest.scraper")

# Unsplash photo IDs for property images (real photos, pre-selected variety)
PROPERTY_IMAGES = [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400",
    "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400",
    "https://images.unsplash.com/photo-1600566753086-00f18f6b0128?w=400",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
    "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400",
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400",
    "https://images.unsplash.com/photo-1600047508788-786f3865b4b9?w=400",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400",
]


def generate_listings(city_config: dict, city_id: str, api_key: str, count: int = 20) -> List[dict]:
    """Generate realistic property listings using OpenAI."""
    logger.info(f"[ai-gen] Generating {count} listings for {city_config['name']} via AI")

    client = OpenAI(api_key=api_key)

    prompt = f"""Generate exactly {count} realistic apartment investment listings currently available in {city_config['name']}, {city_config['country_name']}.

Market data for reference:
- Average price per sqm: \u20ac{city_config['avg_price_sqm']}
- Average monthly rent per sqm: \u20ac{city_config['avg_rent_sqm']}

Requirements:
- Use REAL neighborhoods and districts of {city_config['name']}
- Prices should vary around the average (\u00b130%) to show market range
- Mix of apartments (70%), studios (20%), and larger apartments (10%)
- Include realistic building features for {city_config['country_name']}
- Sizes should range from 25-120 sqm
- Year built should range from 1960 to 2024
- Each listing should have a realistic descriptive title mentioning the neighborhood
- Coordinates should be real lat/lng positions within {city_config['name']}
- Features should be realistic for the local market

Return a JSON array where each object has:
{{
  "title": "Descriptive title with neighborhood (max 80 chars)",
  "type": "apartment|studio",
  "price": integer in euros,
  "areaSqm": integer,
  "rooms": integer (1-4),
  "bathrooms": integer (1-2),
  "floor": integer (0-8),
  "yearBuilt": integer (1960-2024),
  "coordinates": [lat, lng] (real positions in {city_config['name']}),
  "estimatedMonthlyRent": integer in euros,
  "features": ["feature1", "feature2", "feature3"] (3-5 realistic features),
  "address": "Street or area name",
  "neighborhood": "District/neighborhood name"
}}

Return ONLY the JSON array, no explanation."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a European real estate data specialist. Generate realistic property listing data based on current market conditions. Return valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.8,
            max_tokens=4000,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content
        data = json.loads(content)

        # Handle both {"listings": [...]} and [...] formats
        if isinstance(data, dict):
            listings_raw = data.get("listings") or data.get("properties") or data.get("results") or list(data.values())[0]
        else:
            listings_raw = data

        if not isinstance(listings_raw, list):
            logger.error(f"[ai-gen] Unexpected response format for {city_config['name']}")
            return []

        # Convert to our standard format
        results = []
        shuffled_images = random.sample(PROPERTY_IMAGES, min(len(PROPERTY_IMAGES), len(listings_raw)))

        for i, raw in enumerate(listings_raw[:count]):
            price = int(raw.get("price", 0))
            area = int(raw.get("areaSqm", 60))
            monthly_rent = int(raw.get("estimatedMonthlyRent", area * city_config["avg_rent_sqm"]))
            gross_yield = round((monthly_rent * 12 / price) * 100, 1) if price > 0 else 0

            from models import PropertyListing
            lid = PropertyListing.generate_id(city_id, raw.get("title", ""), price)

            results.append({
                "id": lid,
                "cityId": city_id,
                "title": raw.get("title", f"Apartment in {city_config['name']}")[:100],
                "type": raw.get("type", "apartment"),
                "price": price,
                "areaSqm": area,
                "rooms": int(raw.get("rooms", 2)),
                "bathrooms": int(raw.get("bathrooms", 1)),
                "floor": int(raw.get("floor", 2)),
                "yearBuilt": int(raw.get("yearBuilt", 2000)),
                "coordinates": raw.get("coordinates", [0, 0]),
                "imageUrl": shuffled_images[i % len(shuffled_images)],
                "estimatedMonthlyRent": monthly_rent,
                "grossYield": gross_yield,
                "features": raw.get("features", ["Investment Property"])[:5],
                "source": "ai-generated",
                "sourceUrl": "",
                "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d"),
                "address": raw.get("address", ""),
                "neighborhood": raw.get("neighborhood", ""),
            })

        logger.info(f"[ai-gen] Generated {len(results)} listings for {city_config['name']}")
        return results

    except Exception as e:
        logger.error(f"[ai-gen] Error generating listings for {city_config['name']}: {e}")
        return []
