from dataclasses import dataclass, asdict, field
from typing import List, Optional
import json
import hashlib

@dataclass
class PropertyListing:
    id: str
    cityId: str
    title: str
    type: str  # apartment, studio, house, commercial
    price: int
    areaSqm: int
    rooms: int
    bathrooms: int
    floor: int
    yearBuilt: int
    coordinates: List[float]  # [lat, lng]
    imageUrl: str
    estimatedMonthlyRent: int
    grossYield: float
    features: List[str]
    source: str = ""          # "spitogatos", "greenacres", "etuovi", "ai-generated"
    sourceUrl: str = ""       # link to original listing
    lastUpdated: str = ""     # ISO date
    address: str = ""
    neighborhood: str = ""

    def to_dict(self):
        return asdict(self)

    @staticmethod
    def generate_id(city_id: str, title: str, price: int) -> str:
        raw = f"{city_id}-{title}-{price}"
        return f"{city_id[:2]}-{hashlib.md5(raw.encode()).hexdigest()[:8]}"

def listings_to_json(listings: List[PropertyListing]) -> str:
    return json.dumps([l.to_dict() for l in listings], indent=2, ensure_ascii=False)
