#!/usr/bin/env python3
"""
EuroNest Property Scraper - Main Orchestrator
Usage:
    python main.py --watched    # Update watched cities only (daily)
    python main.py --all        # Update all cities (weekly)
    python main.py --city athens  # Update specific city
"""
import sys
import os
import argparse
import logging
from datetime import datetime
from typing import Dict, List

# Add parent dir to path
sys.path.insert(0, os.path.dirname(__file__))

from config import CITIES, OPENAI_API_KEY, get_watched_cities, LISTINGS_PER_CITY, LOG_FILE
from models import PropertyListing
from output import write_all_listings, write_city_listings, read_existing_listings
from sources.spitogatos import SpitogatosScraper
from sources.greenacres import GreenAcresScraper
from sources.etuovi import EtuoviScraper
from ai_generator import generate_listings

# Setup logging
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger("euronest.scraper")

# Source map
SCRAPERS = {
    "spitogatos": SpitogatosScraper(),
    "greenacres": GreenAcresScraper(),
    "etuovi": EtuoviScraper(),
}


def scrape_city(city_id: str) -> List[dict]:
    """Scrape listings for a single city. Try web scraper first, fall back to AI."""
    if city_id not in CITIES:
        logger.error(f"Unknown city: {city_id}")
        return []

    city_config = CITIES[city_id]
    source = city_config["source"]
    listings = []

    # Step 1: Try web scraper
    scraper = SCRAPERS.get(source)
    if scraper:
        try:
            logger.info(f"Trying {source} scraper for {city_config['name']}...")
            listings = scraper.scrape(city_config)
            if listings:
                logger.info(f"Web scraper got {len(listings)} listings for {city_config['name']}")
        except Exception as e:
            logger.warning(f"Web scraper failed for {city_config['name']}: {e}")
            listings = []

    # Step 2: If scraper got less than needed, supplement with AI
    if len(listings) < LISTINGS_PER_CITY:
        needed = LISTINGS_PER_CITY - len(listings)
        logger.info(f"Need {needed} more listings for {city_config['name']}, using AI fallback...")
        ai_listings = generate_listings(city_config, city_id, OPENAI_API_KEY, count=needed)
        listings.extend(ai_listings)

    # Deduplicate by title similarity
    seen_titles = set()
    unique = []
    for l in listings:
        title_key = l.get("title", "").lower()[:40]
        if title_key not in seen_titles:
            seen_titles.add(title_key)
            unique.append(l)

    return unique[:LISTINGS_PER_CITY]


def run(city_ids: List[str]):
    """Run scraping for a list of cities."""
    logger.info(f"{'='*60}")
    logger.info(f"EuroNest Scraper - Starting at {datetime.utcnow().isoformat()}Z")
    logger.info(f"Cities to update: {', '.join(city_ids)}")
    logger.info(f"{'='*60}")

    all_listings: Dict[str, List[dict]] = {}
    success_count = 0
    fail_count = 0

    for city_id in city_ids:
        try:
            listings = scrape_city(city_id)
            if listings:
                # Convert dicts to PropertyListing objects for output
                pl_objects = []
                for l in listings:
                    try:
                        pl_objects.append(PropertyListing(**{
                            k: v for k, v in l.items()
                            if k in PropertyListing.__dataclass_fields__
                        }))
                    except Exception as e:
                        logger.warning(f"Error creating PropertyListing: {e}")
                        continue

                all_listings[city_id] = pl_objects
                success_count += 1
                logger.info(f"\u2713 {city_id}: {len(pl_objects)} listings")
            else:
                fail_count += 1
                logger.warning(f"\u2717 {city_id}: No listings obtained")
        except Exception as e:
            fail_count += 1
            logger.error(f"\u2717 {city_id}: Error - {e}")

    # Also include existing data for cities not being updated
    from output import OUTPUT_DIR
    existing_cities_dir = os.path.join(OUTPUT_DIR, "cities")
    if os.path.isdir(existing_cities_dir):
        for fname in os.listdir(existing_cities_dir):
            cid = fname.replace(".json", "")
            if cid not in all_listings and cid in CITIES:
                existing = read_existing_listings(cid)
                if existing:
                    try:
                        pl_objects = [PropertyListing(**{
                            k: v for k, v in l.items()
                            if k in PropertyListing.__dataclass_fields__
                        }) for l in existing]
                        all_listings[cid] = pl_objects
                    except Exception:
                        pass

    # Write output
    if all_listings:
        write_all_listings(all_listings)
        logger.info(f"\nOutput written to {OUTPUT_DIR}")

    logger.info(f"\nDone! Success: {success_count}, Failed: {fail_count}")
    logger.info(f"Total listings: {sum(len(v) for v in all_listings.values())}")


def main():
    parser = argparse.ArgumentParser(description="EuroNest Property Scraper")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--watched", action="store_true", help="Update watched cities only (daily)")
    group.add_argument("--all", action="store_true", help="Update all cities (weekly)")
    group.add_argument("--city", type=str, help="Update a specific city")
    args = parser.parse_args()

    if args.watched:
        city_ids = get_watched_cities()
    elif args.all:
        city_ids = list(CITIES.keys())
    else:
        city_ids = [args.city]

    run(city_ids)


if __name__ == "__main__":
    main()
