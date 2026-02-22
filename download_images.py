#!/usr/bin/env python3
"""
Download all 10,000 Doginal Mini Doges images from cdn.doggy.market.
Reads metadata from metadata/minidoges_all.json (run scrape_metadata.py first).
"""

import json
import os
import sys
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

CDN_BASE = "https://cdn.doggy.market/content"
METADATA_FILE = "metadata/minidoges_all.json"
IMAGES_DIR = "images"
MAX_WORKERS = 10  # Concurrent downloads
RETRY_COUNT = 3
RETRY_DELAY = 2

def download_image(item):
    """Download a single NFT image. Returns (item_id, success, error)."""
    item_id = item.get("itemId", "unknown")
    inscription_id = item.get("inscriptionId")
    ext = "png"  # All Mini Doges are image/png

    filepath = os.path.join(IMAGES_DIR, f"{item_id}.{ext}")

    # Skip if already downloaded
    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        return (item_id, True, "skipped")

    url = f"{CDN_BASE}/{inscription_id}"

    for attempt in range(RETRY_COUNT):
        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            with open(filepath, "wb") as f:
                f.write(resp.content)
            return (item_id, True, f"{len(resp.content)} bytes")
        except requests.exceptions.RequestException as e:
            if attempt < RETRY_COUNT - 1:
                time.sleep(RETRY_DELAY * (attempt + 1))
            else:
                return (item_id, False, str(e))

def main():
    if not os.path.exists(METADATA_FILE):
        print(f"ERROR: {METADATA_FILE} not found. Run scrape_metadata.py first.")
        sys.exit(1)

    with open(METADATA_FILE) as f:
        data = json.load(f)

    items = data.get("data", [])
    print(f"Found {len(items)} items in metadata")

    os.makedirs(IMAGES_DIR, exist_ok=True)

    # Check how many already downloaded
    existing = sum(1 for item in items
                   if os.path.exists(os.path.join(IMAGES_DIR, f"{item.get('itemId')}.png"))
                   and os.path.getsize(os.path.join(IMAGES_DIR, f"{item.get('itemId')}.png")) > 0)
    print(f"Already downloaded: {existing}")
    print(f"Remaining: {len(items) - existing}")

    if existing == len(items):
        print("All images already downloaded!")
        return

    downloaded = 0
    failed = 0
    skipped = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(download_image, item): item for item in items}

        for future in as_completed(futures):
            item_id, success, info = future.result()
            if info == "skipped":
                skipped += 1
            elif success:
                downloaded += 1
            else:
                failed += 1
                print(f"  FAILED #{item_id}: {info}")

            total_done = downloaded + skipped + failed
            if total_done % 500 == 0:
                print(f"Progress: {total_done}/{len(items)} "
                      f"(downloaded: {downloaded}, skipped: {skipped}, failed: {failed})")

    print(f"\nDone!")
    print(f"  Downloaded: {downloaded}")
    print(f"  Skipped (already had): {skipped}")
    print(f"  Failed: {failed}")
    print(f"  Total images in {IMAGES_DIR}/: {downloaded + skipped}")

    if failed > 0:
        print(f"\nRe-run this script to retry the {failed} failed downloads.")

if __name__ == "__main__":
    main()
