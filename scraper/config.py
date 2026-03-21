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
    # Spain - use idealista.com (English version)
    "madrid": {
        "name": "Madrid", "country": "spain", "country_name": "Spain",
        "source": "idealista",
        "search_url": "https://www.idealista.com/en/venta-viviendas/madrid-madrid/",
        "avg_price_sqm": 3800, "avg_rent_sqm": 16,
    },
    "barcelona": {
        "name": "Barcelona", "country": "spain", "country_name": "Spain",
        "source": "idealista",
        "search_url": "https://www.idealista.com/en/venta-viviendas/barcelona/barcelona/",
        "avg_price_sqm": 4200, "avg_rent_sqm": 17,
    },
    "valencia": {
        "name": "Valencia", "country": "spain", "country_name": "Spain",
        "source": "idealista",
        "search_url": "https://www.idealista.com/en/venta-viviendas/valencia/valencia/",
        "avg_price_sqm": 2200, "avg_rent_sqm": 10,
    },
    "malaga": {
        "name": "Malaga", "country": "spain", "country_name": "Spain",
        "source": "idealista",
        "search_url": "https://www.idealista.com/en/venta-viviendas/malaga-malaga/",
        "avg_price_sqm": 2800, "avg_rent_sqm": 12,
    },
    # Portugal - use idealista.pt (English version)
    "lisbon": {
        "name": "Lisbon", "country": "portugal", "country_name": "Portugal",
        "source": "idealista",
        "search_url": "https://www.idealista.pt/en/venda/casas/lisboa/lisboa/",
        "avg_price_sqm": 4500, "avg_rent_sqm": 18,
    },
    "porto": {
        "name": "Porto", "country": "portugal", "country_name": "Portugal",
        "source": "idealista",
        "search_url": "https://www.idealista.pt/en/venda/casas/porto/porto/",
        "avg_price_sqm": 3200, "avg_rent_sqm": 14,
    },
    # Italy - use idealista.it (English version)
    "rome": {
        "name": "Rome", "country": "italy", "country_name": "Italy",
        "source": "idealista",
        "search_url": "https://www.idealista.it/en/vendita-case/roma/roma/",
        "avg_price_sqm": 3500, "avg_rent_sqm": 14,
    },
    "milan": {
        "name": "Milan", "country": "italy", "country_name": "Italy",
        "source": "idealista",
        "search_url": "https://www.idealista.it/en/vendita-case/milano/milano/",
        "avg_price_sqm": 4800, "avg_rent_sqm": 20,
    },
    "naples": {
        "name": "Naples", "country": "italy", "country_name": "Italy",
        "source": "idealista",
        "search_url": "https://www.idealista.it/en/vendita-case/napoli/napoli/",
        "avg_price_sqm": 2200, "avg_rent_sqm": 10,
    },
    # Germany - use immobilienscout24.de
    "berlin": {
        "name": "Berlin", "country": "germany", "country_name": "Germany",
        "source": "immoscout",
        "search_url": "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-kaufen",
        "avg_price_sqm": 5000, "avg_rent_sqm": 14,
    },
    "munich": {
        "name": "Munich", "country": "germany", "country_name": "Germany",
        "source": "immoscout",
        "search_url": "https://www.immobilienscout24.de/Suche/de/bayern/muenchen/wohnung-kaufen",
        "avg_price_sqm": 8500, "avg_rent_sqm": 20,
    },
    "hamburg": {
        "name": "Hamburg", "country": "germany", "country_name": "Germany",
        "source": "immoscout",
        "search_url": "https://www.immobilienscout24.de/Suche/de/hamburg/hamburg/wohnung-kaufen",
        "avg_price_sqm": 5200, "avg_rent_sqm": 14,
    },
    "frankfurt": {
        "name": "Frankfurt", "country": "germany", "country_name": "Germany",
        "source": "immoscout",
        "search_url": "https://www.immobilienscout24.de/Suche/de/hessen/frankfurt-am-main/wohnung-kaufen",
        "avg_price_sqm": 5500, "avg_rent_sqm": 16,
    },
    # Austria - use immobilienscout24.at
    "vienna": {
        "name": "Vienna", "country": "austria", "country_name": "Austria",
        "source": "immoscout",
        "search_url": "https://www.immobilienscout24.at/Suche/wien/wohnung-kaufen",
        "avg_price_sqm": 5500, "avg_rent_sqm": 16,
    },
    "graz": {
        "name": "Graz", "country": "austria", "country_name": "Austria",
        "source": "immoscout",
        "search_url": "https://www.immobilienscout24.at/Suche/steiermark/wohnung-kaufen",
        "avg_price_sqm": 3200, "avg_rent_sqm": 12,
    },
    # Netherlands - use funda.nl
    "amsterdam": {
        "name": "Amsterdam", "country": "netherlands", "country_name": "Netherlands",
        "source": "funda",
        "search_url": "https://www.funda.nl/koop/amsterdam/",
        "avg_price_sqm": 7500, "avg_rent_sqm": 25,
    },
    "rotterdam": {
        "name": "Rotterdam", "country": "netherlands", "country_name": "Netherlands",
        "source": "funda",
        "search_url": "https://www.funda.nl/koop/rotterdam/",
        "avg_price_sqm": 4200, "avg_rent_sqm": 16,
    },
    "the-hague": {
        "name": "The Hague", "country": "netherlands", "country_name": "Netherlands",
        "source": "funda",
        "search_url": "https://www.funda.nl/koop/den-haag/",
        "avg_price_sqm": 4000, "avg_rent_sqm": 15,
    },
    # Belgium - use immoweb.be
    "brussels": {
        "name": "Brussels", "country": "belgium", "country_name": "Belgium",
        "source": "immoweb",
        "search_url": "https://www.immoweb.be/en/search/apartment/for-sale/brussels/city",
        "avg_price_sqm": 3200, "avg_rent_sqm": 14,
    },
    "antwerp": {
        "name": "Antwerp", "country": "belgium", "country_name": "Belgium",
        "source": "immoweb",
        "search_url": "https://www.immoweb.be/en/search/apartment/for-sale/antwerpen/city",
        "avg_price_sqm": 2800, "avg_rent_sqm": 12,
    },
    # Ireland - use daft.ie
    "dublin": {
        "name": "Dublin", "country": "ireland", "country_name": "Ireland",
        "source": "daft",
        "search_url": "https://www.daft.ie/property-for-sale/dublin-city",
        "avg_price_sqm": 5800, "avg_rent_sqm": 22,
    },
    # Poland - use otodom.pl
    "warsaw": {
        "name": "Warsaw", "country": "poland", "country_name": "Poland",
        "source": "otodom",
        "search_url": "https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/mazowieckie/warszawa",
        "avg_price_sqm": 3200, "avg_rent_sqm": 16,
    },
    "krakow": {
        "name": "Krakow", "country": "poland", "country_name": "Poland",
        "source": "otodom",
        "search_url": "https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/malopolskie/krakow",
        "avg_price_sqm": 2800, "avg_rent_sqm": 14,
    },
    "wroclaw": {
        "name": "Wroclaw", "country": "poland", "country_name": "Poland",
        "source": "otodom",
        "search_url": "https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/dolnoslaskie/wroclaw",
        "avg_price_sqm": 2400, "avg_rent_sqm": 13,
    },
    # Czech Republic - use sreality.cz
    "prague": {
        "name": "Prague", "country": "czech-republic", "country_name": "Czech Republic",
        "source": "sreality",
        "search_url": "https://www.sreality.cz/en/search/for-sale/apartments/praha",
        "avg_price_sqm": 4800, "avg_rent_sqm": 18,
    },
    "brno": {
        "name": "Brno", "country": "czech-republic", "country_name": "Czech Republic",
        "source": "sreality",
        "search_url": "https://www.sreality.cz/en/search/for-sale/apartments/brno",
        "avg_price_sqm": 3200, "avg_rent_sqm": 14,
    },
    # Hungary - use ingatlan.com
    "budapest": {
        "name": "Budapest", "country": "hungary", "country_name": "Hungary",
        "source": "generic",
        "search_url": "https://ingatlan.com/szukits/elado+lakas+budapest",
        "avg_price_sqm": 2800, "avg_rent_sqm": 14,
    },
    # Romania - use imobiliare.ro
    "bucharest": {
        "name": "Bucharest", "country": "romania", "country_name": "Romania",
        "source": "generic",
        "search_url": "https://www.imobiliare.ro/vanzare-apartamente/bucuresti",
        "avg_price_sqm": 1800, "avg_rent_sqm": 10,
    },
    "cluj-napoca": {
        "name": "Cluj-Napoca", "country": "romania", "country_name": "Romania",
        "source": "generic",
        "search_url": "https://www.imobiliare.ro/vanzare-apartamente/cluj-napoca",
        "avg_price_sqm": 2000, "avg_rent_sqm": 11,
    },
    # Croatia - use njuskalo.hr
    "zagreb": {
        "name": "Zagreb", "country": "croatia", "country_name": "Croatia",
        "source": "generic",
        "search_url": "https://www.njuskalo.hr/prodaja-stanova/zagreb",
        "avg_price_sqm": 2400, "avg_rent_sqm": 11,
    },
    "split": {
        "name": "Split", "country": "croatia", "country_name": "Croatia",
        "source": "generic",
        "search_url": "https://www.njuskalo.hr/prodaja-stanova/split",
        "avg_price_sqm": 3200, "avg_rent_sqm": 16,
    },
    "dubrovnik": {
        "name": "Dubrovnik", "country": "croatia", "country_name": "Croatia",
        "source": "generic",
        "search_url": "https://www.njuskalo.hr/prodaja-stanova/dubrovnik",
        "avg_price_sqm": 4500, "avg_rent_sqm": 25,
    },
    # Denmark - use boligsiden.dk
    "copenhagen": {
        "name": "Copenhagen", "country": "denmark", "country_name": "Denmark",
        "source": "generic",
        "search_url": "https://www.boligsiden.dk/tilsalg/lejlighed/koebenhavn",
        "avg_price_sqm": 6000, "avg_rent_sqm": 18,
    },
    # Sweden - use hemnet.se
    "stockholm": {
        "name": "Stockholm", "country": "sweden", "country_name": "Sweden",
        "source": "generic",
        "search_url": "https://www.hemnet.se/bostader?location_ids%5B%5D=17744",
        "avg_price_sqm": 6500, "avg_rent_sqm": 18,
    },
    "gothenburg": {
        "name": "Gothenburg", "country": "sweden", "country_name": "Sweden",
        "source": "generic",
        "search_url": "https://www.hemnet.se/bostader?location_ids%5B%5D=17920",
        "avg_price_sqm": 4200, "avg_rent_sqm": 14,
    },
    # Norway - use finn.no
    "oslo": {
        "name": "Oslo", "country": "norway", "country_name": "Norway",
        "source": "generic",
        "search_url": "https://www.finn.no/realestate/homes/search.html?location=0.20061",
        "avg_price_sqm": 7000, "avg_rent_sqm": 20,
    },
    # Estonia - use city24.ee
    "tallinn": {
        "name": "Tallinn", "country": "estonia", "country_name": "Estonia",
        "source": "generic",
        "search_url": "https://www.city24.ee/en/real-estate-search/apartments-for-sale/tallinn",
        "avg_price_sqm": 3000, "avg_rent_sqm": 14,
    },
    # Latvia - use ss.lv
    "riga": {
        "name": "Riga", "country": "latvia", "country_name": "Latvia",
        "source": "generic",
        "search_url": "https://www.ss.lv/en/real-estate/flats/riga-centre/",
        "avg_price_sqm": 1800, "avg_rent_sqm": 10,
    },
    # Lithuania - use aruodas.lt
    "vilnius": {
        "name": "Vilnius", "country": "lithuania", "country_name": "Lithuania",
        "source": "generic",
        "search_url": "https://www.aruodas.lt/butai/vilniuje/",
        "avg_price_sqm": 2200, "avg_rent_sqm": 12,
    },
    # Cyprus - use bazaraki.com
    "limassol": {
        "name": "Limassol", "country": "cyprus", "country_name": "Cyprus",
        "source": "generic",
        "search_url": "https://www.bazaraki.com/real-estate/houses-and-flats-sale/?city_id=5",
        "avg_price_sqm": 3500, "avg_rent_sqm": 14,
    },
    "paphos": {
        "name": "Paphos", "country": "cyprus", "country_name": "Cyprus",
        "source": "generic",
        "search_url": "https://www.bazaraki.com/real-estate/houses-and-flats-sale/?city_id=3",
        "avg_price_sqm": 2500, "avg_rent_sqm": 12,
    },
    # --- SPAIN (Idealista) ---
    "madrid": {"name": "Madrid", "country": "spain", "country_name": "Spain", "source": "idealista", "search_url": "https://www.idealista.com/en/venta-viviendas/madrid-madrid/", "avg_price_sqm": 3800, "avg_rent_sqm": 16},
    "barcelona": {"name": "Barcelona", "country": "spain", "country_name": "Spain", "source": "idealista", "search_url": "https://www.idealista.com/en/venta-viviendas/barcelona/barcelona/", "avg_price_sqm": 4200, "avg_rent_sqm": 17},
    "valencia": {"name": "Valencia", "country": "spain", "country_name": "Spain", "source": "idealista", "search_url": "https://www.idealista.com/en/venta-viviendas/valencia/valencia/", "avg_price_sqm": 2200, "avg_rent_sqm": 10},
    "malaga": {"name": "Malaga", "country": "spain", "country_name": "Spain", "source": "idealista", "search_url": "https://www.idealista.com/en/venta-viviendas/malaga-malaga/", "avg_price_sqm": 2800, "avg_rent_sqm": 12},
    # --- PORTUGAL (Idealista) ---
    "lisbon": {"name": "Lisbon", "country": "portugal", "country_name": "Portugal", "source": "idealista", "search_url": "https://www.idealista.pt/en/venda/casas/lisboa/lisboa/", "avg_price_sqm": 4500, "avg_rent_sqm": 18},
    "porto": {"name": "Porto", "country": "portugal", "country_name": "Portugal", "source": "idealista", "search_url": "https://www.idealista.pt/en/venda/casas/porto/porto/", "avg_price_sqm": 3200, "avg_rent_sqm": 14},
    # --- ITALY (Idealista) ---
    "rome": {"name": "Rome", "country": "italy", "country_name": "Italy", "source": "idealista", "search_url": "https://www.idealista.it/en/vendita-case/roma/roma/", "avg_price_sqm": 3500, "avg_rent_sqm": 14},
    "milan": {"name": "Milan", "country": "italy", "country_name": "Italy", "source": "idealista", "search_url": "https://www.idealista.it/en/vendita-case/milano/milano/", "avg_price_sqm": 4800, "avg_rent_sqm": 20},
    "naples": {"name": "Naples", "country": "italy", "country_name": "Italy", "source": "idealista", "search_url": "https://www.idealista.it/en/vendita-case/napoli/napoli/", "avg_price_sqm": 2200, "avg_rent_sqm": 10},
    # --- GERMANY (ImmobilienScout24) ---
    "berlin": {"name": "Berlin", "country": "germany", "country_name": "Germany", "source": "immoscout", "search_url": "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-kaufen", "avg_price_sqm": 5000, "avg_rent_sqm": 14},
    "munich": {"name": "Munich", "country": "germany", "country_name": "Germany", "source": "immoscout", "search_url": "https://www.immobilienscout24.de/Suche/de/bayern/muenchen-kreisfreie-stadt/wohnung-kaufen", "avg_price_sqm": 8500, "avg_rent_sqm": 20},
    "hamburg": {"name": "Hamburg", "country": "germany", "country_name": "Germany", "source": "immoscout", "search_url": "https://www.immobilienscout24.de/Suche/de/hamburg/hamburg/wohnung-kaufen", "avg_price_sqm": 5200, "avg_rent_sqm": 14},
    "frankfurt": {"name": "Frankfurt", "country": "germany", "country_name": "Germany", "source": "immoscout", "search_url": "https://www.immobilienscout24.de/Suche/de/hessen/frankfurt-am-main/wohnung-kaufen", "avg_price_sqm": 5500, "avg_rent_sqm": 16},
    # --- NETHERLANDS (Funda) ---
    "amsterdam": {"name": "Amsterdam", "country": "netherlands", "country_name": "Netherlands", "source": "funda", "search_url": "https://www.funda.nl/zoeken/koop/?selected_area=%5B%22amsterdam%22%5D&object_type=%5B%22apartment%22%5D", "avg_price_sqm": 7500, "avg_rent_sqm": 25},
    "rotterdam": {"name": "Rotterdam", "country": "netherlands", "country_name": "Netherlands", "source": "funda", "search_url": "https://www.funda.nl/zoeken/koop/?selected_area=%5B%22rotterdam%22%5D&object_type=%5B%22apartment%22%5D", "avg_price_sqm": 4200, "avg_rent_sqm": 16},
    "the-hague": {"name": "The Hague", "country": "netherlands", "country_name": "Netherlands", "source": "funda", "search_url": "https://www.funda.nl/zoeken/koop/?selected_area=%5B%22den-haag%22%5D&object_type=%5B%22apartment%22%5D", "avg_price_sqm": 4000, "avg_rent_sqm": 15},
    # --- BELGIUM (Immoweb) ---
    "brussels": {"name": "Brussels", "country": "belgium", "country_name": "Belgium", "source": "immoweb", "search_url": "https://www.immoweb.be/en/search/apartment/for-sale?countries=BE&postalCodes=BE-1000", "avg_price_sqm": 3200, "avg_rent_sqm": 14},
    "antwerp": {"name": "Antwerp", "country": "belgium", "country_name": "Belgium", "source": "immoweb", "search_url": "https://www.immoweb.be/en/search/apartment/for-sale?countries=BE&postalCodes=BE-2000", "avg_price_sqm": 2800, "avg_rent_sqm": 12},
    # --- AUSTRIA (ImmobilienScout24) ---
    "vienna": {"name": "Vienna", "country": "austria", "country_name": "Austria", "source": "immoscout", "search_url": "https://www.immobilienscout24.at/Suche/S-T/Wohnung-Kauf/Wien/Wien", "avg_price_sqm": 5500, "avg_rent_sqm": 16},
    "graz": {"name": "Graz", "country": "austria", "country_name": "Austria", "source": "immoscout", "search_url": "https://www.immobilienscout24.at/Suche/S-T/Wohnung-Kauf/Steiermark/Graz", "avg_price_sqm": 3200, "avg_rent_sqm": 12},
    # --- IRELAND (Daft) ---
    "dublin": {"name": "Dublin", "country": "ireland", "country_name": "Ireland", "source": "daft", "search_url": "https://www.daft.ie/property-for-sale/dublin-city", "avg_price_sqm": 5800, "avg_rent_sqm": 22},
    # --- POLAND (Otodom) ---
    "warsaw": {"name": "Warsaw", "country": "poland", "country_name": "Poland", "source": "otodom", "search_url": "https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/mazowieckie/warszawa/warszawa/warszawa", "avg_price_sqm": 3200, "avg_rent_sqm": 16},
    "krakow": {"name": "Krakow", "country": "poland", "country_name": "Poland", "source": "otodom", "search_url": "https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/malopolskie/krakow/krakow/krakow", "avg_price_sqm": 2800, "avg_rent_sqm": 14},
    "wroclaw": {"name": "Wroclaw", "country": "poland", "country_name": "Poland", "source": "otodom", "search_url": "https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/dolnoslaskie/wroclaw/wroclaw/wroclaw", "avg_price_sqm": 2400, "avg_rent_sqm": 13},
    # --- CZECH REPUBLIC (Sreality) ---
    "prague": {"name": "Prague", "country": "czechia", "country_name": "Czech Republic", "source": "sreality", "search_url": "https://www.sreality.cz/en/search/for-sale/apartments/praha", "avg_price_sqm": 4800, "avg_rent_sqm": 18},
    "brno": {"name": "Brno", "country": "czechia", "country_name": "Czech Republic", "source": "sreality", "search_url": "https://www.sreality.cz/en/search/for-sale/apartments/brno", "avg_price_sqm": 3200, "avg_rent_sqm": 14},
    # --- GENERIC (remaining countries) ---
    "budapest": {"name": "Budapest", "country": "hungary", "country_name": "Hungary", "source": "generic", "search_url": "https://ingatlan.com/lista/elado+lakas+budapest", "avg_price_sqm": 2800, "avg_rent_sqm": 14},
    "bucharest": {"name": "Bucharest", "country": "romania", "country_name": "Romania", "source": "generic", "search_url": "https://www.imobiliare.ro/vanzare-apartamente/bucuresti", "avg_price_sqm": 1800, "avg_rent_sqm": 10},
    "cluj-napoca": {"name": "Cluj-Napoca", "country": "romania", "country_name": "Romania", "source": "generic", "search_url": "https://www.imobiliare.ro/vanzare-apartamente/cluj-napoca", "avg_price_sqm": 2000, "avg_rent_sqm": 11},
    "zagreb": {"name": "Zagreb", "country": "croatia", "country_name": "Croatia", "source": "generic", "search_url": "https://www.njuskalo.hr/prodaja-stanova/zagreb", "avg_price_sqm": 2400, "avg_rent_sqm": 11},
    "split": {"name": "Split", "country": "croatia", "country_name": "Croatia", "source": "generic", "search_url": "https://www.njuskalo.hr/prodaja-stanova/split", "avg_price_sqm": 3200, "avg_rent_sqm": 16},
    "dubrovnik": {"name": "Dubrovnik", "country": "croatia", "country_name": "Croatia", "source": "generic", "search_url": "https://www.njuskalo.hr/prodaja-stanova/dubrovnik", "avg_price_sqm": 4500, "avg_rent_sqm": 25},
    "copenhagen": {"name": "Copenhagen", "country": "denmark", "country_name": "Denmark", "source": "generic", "search_url": "https://www.boligsiden.dk/tilsalg?propertyType=ejerlejlighed&area=koebenhavn", "avg_price_sqm": 6000, "avg_rent_sqm": 18},
    "stockholm": {"name": "Stockholm", "country": "sweden", "country_name": "Sweden", "source": "generic", "search_url": "https://www.hemnet.se/bostader?location_ids%5B%5D=17744&item_types%5B%5D=bostadsratt", "avg_price_sqm": 6500, "avg_rent_sqm": 18},
    "gothenburg": {"name": "Gothenburg", "country": "sweden", "country_name": "Sweden", "source": "generic", "search_url": "https://www.hemnet.se/bostader?location_ids%5B%5D=17920&item_types%5B%5D=bostadsratt", "avg_price_sqm": 4200, "avg_rent_sqm": 14},
    "oslo": {"name": "Oslo", "country": "norway", "country_name": "Norway", "source": "generic", "search_url": "https://www.finn.no/realestate/homes/search.html?location=0.20061", "avg_price_sqm": 7000, "avg_rent_sqm": 20},
    "tallinn": {"name": "Tallinn", "country": "estonia", "country_name": "Estonia", "source": "generic", "search_url": "https://www.city24.ee/en/real-estate/apartments-for-sale/tallinn", "avg_price_sqm": 3000, "avg_rent_sqm": 14},
    "riga": {"name": "Riga", "country": "latvia", "country_name": "Latvia", "source": "generic", "search_url": "https://www.ss.lv/en/real-estate/flats/riga-centre/sell/", "avg_price_sqm": 1800, "avg_rent_sqm": 10},
    "vilnius": {"name": "Vilnius", "country": "lithuania", "country_name": "Lithuania", "source": "generic", "search_url": "https://www.aruodas.lt/butai/vilniuje/", "avg_price_sqm": 2200, "avg_rent_sqm": 12},
    "limassol": {"name": "Limassol", "country": "cyprus", "country_name": "Cyprus", "source": "generic", "search_url": "https://www.bazaraki.com/real-estate/houses-and-flats-sale/?city_id=5", "avg_price_sqm": 3500, "avg_rent_sqm": 14},
    "paphos": {"name": "Paphos", "country": "cyprus", "country_name": "Cyprus", "source": "generic", "search_url": "https://www.bazaraki.com/real-estate/houses-and-flats-sale/?city_id=3", "avg_price_sqm": 2500, "avg_rent_sqm": 12},
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
