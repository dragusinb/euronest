import logging
from openai import OpenAI

logger = logging.getLogger("euronest.scraper")

def translate_listings(listings: list, api_key: str) -> list:
    if not api_key or not listings:
        return listings

    # Find listings needing translation
    needs_translation = []
    for i, l in enumerate(listings):
        title = l.get("title", "")
        if any(ord(c) > 127 for c in title):
            needs_translation.append((i, title, l.get("address", ""), l.get("neighborhood", "")))

    if not needs_translation:
        return listings

    logger.info(f"  Translating {len(needs_translation)} listings to English...")

    # Batch translate
    texts = [f"{idx}: TITLE: {t} | ADDR: {a} | AREA: {n}" for idx, t, a, n in needs_translation]
    prompt = "Translate these property listing details to English. Keep numbers, prices, and measurements as-is. Return one line per input in format: IDX: TITLE: translated | ADDR: translated | AREA: translated\n\n" + "\n".join(texts)

    try:
        client = OpenAI(api_key=api_key)
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=2000,
        )
        result = resp.choices[0].message.content

        for line in result.strip().split("\n"):
            try:
                parts = line.split(": ", 1)
                if len(parts) < 2: continue
                idx = int(parts[0].strip())
                rest = parts[1]

                title_match = rest.split("TITLE: ", 1)
                if len(title_match) > 1:
                    title_part = title_match[1].split(" | ADDR: ", 1)
                    translated_title = title_part[0].strip()

                    # Find the matching listing
                    for orig_idx, _, _, _ in needs_translation:
                        if orig_idx == idx:
                            listings[idx]["originalTitle"] = listings[idx]["title"]
                            listings[idx]["title"] = translated_title

                            if " | ADDR: " in rest:
                                addr_part = rest.split(" | ADDR: ", 1)[1].split(" | AREA: ", 1)
                                if addr_part[0].strip():
                                    listings[idx]["address"] = addr_part[0].strip()
                                if len(addr_part) > 1 and addr_part[1].strip():
                                    listings[idx]["neighborhood"] = addr_part[1].strip()
                            break
            except (ValueError, IndexError):
                continue

        logger.info(f"  Translation complete")
    except Exception as e:
        logger.warning(f"  Translation failed: {e}")

    return listings
