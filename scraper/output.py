import os
import json
from datetime import datetime
from typing import Dict, List
from models import PropertyListing, listings_to_json
from config import OUTPUT_DIR

def ensure_output_dirs():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, "cities"), exist_ok=True)

def write_city_listings(city_id: str, listings: List[PropertyListing]):
    """Write listings for a single city."""
    ensure_output_dirs()
    path = os.path.join(OUTPUT_DIR, "cities", f"{city_id}.json")
    with open(path, "w", encoding="utf-8") as f:
        f.write(listings_to_json(listings))

def write_all_listings(all_listings: Dict[str, List[PropertyListing]]):
    """Write combined listings.json and per-city files."""
    ensure_output_dirs()

    # Write per-city files
    for city_id, listings in all_listings.items():
        write_city_listings(city_id, listings)

    # Write combined listings.json
    combined = []
    for listings in all_listings.values():
        combined.extend(listings)

    path = os.path.join(OUTPUT_DIR, "listings.json")
    with open(path, "w", encoding="utf-8") as f:
        f.write(listings_to_json(combined))

    # Write meta.json with update timestamps
    meta_path = os.path.join(OUTPUT_DIR, "meta.json")
    try:
        with open(meta_path) as f:
            meta = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        meta = {"cities": {}, "lastFullUpdate": None}

    now = datetime.utcnow().isoformat() + "Z"
    for city_id, listings in all_listings.items():
        meta["cities"][city_id] = {
            "lastUpdated": now,
            "count": len(listings),
            "sources": list(set(l.source for l in listings)),
        }
    meta["lastFullUpdate"] = now

    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)

def read_existing_listings(city_id: str) -> List[dict]:
    """Read existing listings for a city (for merging)."""
    path = os.path.join(OUTPUT_DIR, "cities", f"{city_id}.json")
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []
