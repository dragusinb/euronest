import requests
import time
import random
import logging
from typing import List, Optional
from bs4 import BeautifulSoup

logger = logging.getLogger("euronest.scraper")

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
]

class BaseScraper:
    """Base class for property portal scrapers."""

    def __init__(self, source_name: str):
        self.source_name = source_name
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
        })

    def _get_page(self, url: str, params: dict = None, retries: int = 3) -> Optional[BeautifulSoup]:
        """Fetch a page with retries and random delays."""
        for attempt in range(retries):
            try:
                self.session.headers["User-Agent"] = random.choice(USER_AGENTS)
                time.sleep(random.uniform(1.5, 3.5))  # polite delay
                resp = self.session.get(url, params=params, timeout=15)
                if resp.status_code == 200:
                    return BeautifulSoup(resp.text, "lxml")
                elif resp.status_code == 403:
                    logger.warning(f"[{self.source_name}] 403 Forbidden on {url} (attempt {attempt+1})")
                    time.sleep(random.uniform(5, 10))
                else:
                    logger.warning(f"[{self.source_name}] HTTP {resp.status_code} on {url}")
            except requests.RequestException as e:
                logger.warning(f"[{self.source_name}] Request error: {e} (attempt {attempt+1})")
                time.sleep(random.uniform(3, 6))
        return None

    def scrape(self, city_config: dict) -> list:
        """Override in subclass. Returns list of PropertyListing dicts."""
        raise NotImplementedError
