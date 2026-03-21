#!/usr/bin/env python3
"""
EuroNest Property Scraper - Main Orchestrator
REAL properties only. No AI-generated placeholders.

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

sys.path.insert(0, os.path.dirname(__file__))

from config import CITIES, get_watched_cities, LISTINGS_PER_CITY, LOG_FILE
from models import PropertyListing
from output import write_all_listings, read_existing_listings, OUTPUT_DIR
from sources.spitogatos import SpitogatosScraper
from sources.greenacres import GreenAcresScraper
from sources.etuovi import EtuoviScraper
from sources.idealista import IdealistaScraper
from sources.immoscout import ImmoScoutScraper
from sources.funda import FundaScraper
from sources.immoweb import ImmowebScraper
from sources.otodom import OtodomScraper
from sources.sreality import SrealityScraper
from sources.daft import DaftScraper
from sources.generic import GenericScraper

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

SCRAPERS = {
    "spitogatos": SpitogatosScraper(),
    "greenacres": GreenAcresScraper(),
    "etuovi": EtuoviScraper(),
    "idealista": IdealistaScraper(),
    "immoscout": ImmoScoutScraper(),
    "funda": FundaScraper(),
    "immoweb": ImmowebScraper(),
    "otodom": OtodomScraper(),
    "sreality": SrealityScraper(),
    "daft": DaftScraper(),
    "generic": GenericScraper(),
}


def validate_listing(listing: dict) -> bool:
    """Only accept listings with real source URLs and valid data."""
    if not listing.get("sourceUrl"):
        return False
    if not listing.get("sourceUrl", "").startswith("http"):
        return False
    if not listing.get("title"):
        return False
    price = listing.get("price", 0)
    if not price or price < 20000 or price > 5000000:
        return False
    area = listing.get("areaSqm", 0)
    if not area or area < 10 or area > 500:
        return False
    return True


def scrape_city(city_id: str) -> List[dict]:
    """Scrape REAL listings for a city. No AI fallback."""
    if city_id not in CITIES:
        logger.error(f"Unknown city: {city_id}")
        return []

    city_config = CITIES[city_id]
    source = city_config["source"]

    scraper = SCRAPERS.get(source)
    if not scraper:
        logger.error(f"No scraper for source: {source}")
        return []

    try:
        logger.info(f"Scraping {city_config['name']} via {source}...")
        raw_listings = scraper.scrape(city_config)
    except Exception as e:
        logger.error(f"Scraper crashed for {city_config['name']}: {e}")
        raw_listings = []

    # Validate: only keep real listings with source URLs
    valid = [l for l in raw_listings if validate_listing(l)]
    rejected = len(raw_listings) - len(valid)
    if rejected:
        logger.info(f"  Rejected {rejected} listings without valid source URL")

    # Deduplicate by source URL
    seen_urls = set()
    unique = []
    for l in valid:
        url = l.get("sourceUrl", "")
        if url not in seen_urls:
            seen_urls.add(url)
            unique.append(l)

    result = unique[:LISTINGS_PER_CITY]
    logger.info(f"  {city_config['name']}: {len(result)} real listings with source URLs")
    return result


def run(city_ids: List[str]):
    """Run scraping for a list of cities."""
    logger.info(f"{'='*60}")
    logger.info(f"EuroNest Scraper - {datetime.utcnow().isoformat()}Z")
    logger.info(f"Mode: REAL PROPERTIES ONLY (no AI fallback)")
    logger.info(f"Cities: {', '.join(city_ids)}")
    logger.info(f"{'='*60}")

    all_listings: Dict[str, List[dict]] = {}
    stats = {"success": 0, "partial": 0, "failed": 0}

    for city_id in city_ids:
        try:
            listings = scrape_city(city_id)
            if listings:
                pl_objects = []
                for l in listings:
                    try:
                        pl_objects.append(PropertyListing(**{
                            k: v for k, v in l.items()
                            if k in PropertyListing.__dataclass_fields__
                        }))
                    except Exception as e:
                        logger.debug(f"  Skipping listing: {e}")

                if pl_objects:
                    all_listings[city_id] = pl_objects
                    if len(pl_objects) >= 10:
                        stats["success"] += 1
                        logger.info(f"OK {city_id}: {len(pl_objects)} listings")
                    else:
                        stats["partial"] += 1
                        logger.info(f"~  {city_id}: {len(pl_objects)} listings (partial)")
                else:
                    stats["failed"] += 1
                    logger.warning(f"X  {city_id}: 0 valid listings")
            else:
                stats["failed"] += 1
                logger.warning(f"X  {city_id}: scraper returned nothing")
        except Exception as e:
            stats["failed"] += 1
            logger.error(f"X  {city_id}: {e}")

    # Keep existing data for cities not being updated
    existing_cities_dir = os.path.join(OUTPUT_DIR, "cities")
    if os.path.isdir(existing_cities_dir):
        for fname in os.listdir(existing_cities_dir):
            cid = fname.replace(".json", "")
            if cid not in all_listings and cid in CITIES:
                existing = read_existing_listings(cid)
                # Only keep existing data if it has real source URLs
                real_existing = [l for l in existing if l.get("sourceUrl", "").startswith("http")]
                if real_existing:
                    try:
                        pl_objects = [PropertyListing(**{
                            k: v for k, v in l.items()
                            if k in PropertyListing.__dataclass_fields__
                        }) for l in real_existing]
                        all_listings[cid] = pl_objects
                    except Exception:
                        pass

    if all_listings:
        write_all_listings(all_listings)
        logger.info(f"\nOutput: {OUTPUT_DIR}")

    total = sum(len(v) for v in all_listings.values())
    logger.info(f"\nResults: {stats['success']} full, {stats['partial']} partial, {stats['failed']} failed")
    logger.info(f"Total real listings: {total}")


def main():
    parser = argparse.ArgumentParser(description="EuroNest Property Scraper - Real listings only")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--watched", action="store_true", help="Update watched cities (daily)")
    group.add_argument("--all", action="store_true", help="Update all cities (weekly)")
    group.add_argument("--city", type=str, help="Update specific city")
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
