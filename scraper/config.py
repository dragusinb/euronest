import os
import json

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

OUTPUT_DIR = "/var/www/html/euronest/api"
WATCHED_FILE = "/opt/euronest-scraper/watched_cities.json"
LOG_FILE = "/opt/euronest-scraper/logs/scraper.log"
LISTINGS_PER_CITY = 20

# City configs with scraping source URLs and params
CITIES = {
    # Greece - use spitogatos.gr (English version)
    "athens": {
        "name": "Athens", "country": "greece", "country_name": "Greece",
        "source": "spitogatos",
        "search_url": "https://en.spitogatos.gr/search/results/residential/sale/r100/attica",
        "avg_price_sqm": 2200, "avg_rent_sqm": 12,
    },
    "thessaloniki": {
        "name": "Thessaloniki", "country": "greece", "country_name": "Greece",
        "source": "spitogatos",
        "search_url": "https://en.spitogatos.gr/search/results/residential/sale/r200/central-macedonia",
        "avg_price_sqm": 1500, "avg_rent_sqm": 9,
    },
    "heraklion": {
        "name": "Heraklion", "country": "greece", "country_name": "Greece",
        "source": "spitogatos",
        "search_url": "https://en.spitogatos.gr/search/results/residential/sale/r1300/crete",
        "avg_price_sqm": 1800, "avg_rent_sqm": 10,
    },
    "rhodes": {
        "name": "Rhodes", "country": "greece", "country_name": "Greece",
        "source": "spitogatos",
        "search_url": "https://en.spitogatos.gr/search/results/residential/sale/r600/south-aegean",
        "avg_price_sqm": 2000, "avg_rent_sqm": 14,
    },
    # France - use green-acres.com (English, international)
    "paris": {
        "name": "Paris", "country": "france", "country_name": "France",
        "source": "greenacres",
        "search_url": "https://www.green-acres.com/en/properties/france/ile-de-france",
        "avg_price_sqm": 10500, "avg_rent_sqm": 32,
    },
    "lyon": {
        "name": "Lyon", "country": "france", "country_name": "France",
        "source": "greenacres",
        "search_url": "https://www.green-acres.com/en/properties/france/rhone-alpes",
        "avg_price_sqm": 4800, "avg_rent_sqm": 16,
    },
    "marseille": {
        "name": "Marseille", "country": "france", "country_name": "France",
        "source": "greenacres",
        "search_url": "https://www.green-acres.com/en/properties/france/provence-alpes-cote-d-azur",
        "avg_price_sqm": 3200, "avg_rent_sqm": 14,
    },
    "nice": {
        "name": "Nice", "country": "france", "country_name": "France",
        "source": "greenacres",
        "search_url": "https://www.green-acres.com/en/properties/france/provence-alpes-cote-d-azur",
        "avg_price_sqm": 5200, "avg_rent_sqm": 18,
    },
    "bordeaux": {
        "name": "Bordeaux", "country": "france", "country_name": "France",
        "source": "greenacres",
        "search_url": "https://www.green-acres.com/en/properties/france/aquitaine",
        "avg_price_sqm": 4400, "avg_rent_sqm": 15,
    },
    # Finland - use etuovi.com
    "helsinki": {
        "name": "Helsinki", "country": "finland", "country_name": "Finland",
        "source": "etuovi",
        "search_url": "https://www.etuovi.com/myytavat-asunnot/helsinki",
        "avg_price_sqm": 5100, "avg_rent_sqm": 22,
    },
    "tampere": {
        "name": "Tampere", "country": "finland", "country_name": "Finland",
        "source": "etuovi",
        "search_url": "https://www.etuovi.com/myytavat-asunnot/tampere",
        "avg_price_sqm": 2800, "avg_rent_sqm": 14,
    },
    "turku": {
        "name": "Turku", "country": "finland", "country_name": "Finland",
        "source": "etuovi",
        "search_url": "https://www.etuovi.com/myytavat-asunnot/turku",
        "avg_price_sqm": 2500, "avg_rent_sqm": 13,
    },
    "oulu": {
        "name": "Oulu", "country": "finland", "country_name": "Finland",
        "source": "etuovi",
        "search_url": "https://www.etuovi.com/myytavat-asunnot/oulu",
        "avg_price_sqm": 2100, "avg_rent_sqm": 12,
    },
}

def get_watched_cities():
    """Return list of watched city IDs. Default: capital cities."""
    try:
        with open(WATCHED_FILE) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return ["athens", "paris", "helsinki"]

def set_watched_cities(city_ids):
    os.makedirs(os.path.dirname(WATCHED_FILE), exist_ok=True)
    with open(WATCHED_FILE, "w") as f:
        json.dump(city_ids, f)
