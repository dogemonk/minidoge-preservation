#!/usr/bin/env python3
"""
Scrape all 10,000 Doginal Mini Doges metadata from doggy.market API.
Saves complete metadata JSON and a simplified CSV for easy browsing.
"""

import json
import csv
import os
import sys
import time
import requests

API_BASE = "https://api.doggy.market"
COLLECTION = "minidoges"
OUTPUT_DIR = "metadata"
BATCH_SIZE = 1000
TOTAL_EXPECTED = 10000

def fetch_batch(offset, limit):
    """Fetch a batch of NFT metadata."""
    url = f"{API_BASE}/listings/nfts/{COLLECTION}"
    params = {
        "sortBy": "inscriptionNumber",
        "sortOrder": "asc",
        "offset": offset,
        "limit": limit,
    }
    resp = requests.get(url, params=params, timeout=60)
    resp.raise_for_status()
    return resp.json()

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    all_items = []
    total = None

    # Fetch in batches of 1000 to be safe with rate limits
    for offset in range(0, TOTAL_EXPECTED, BATCH_SIZE):
        print(f"Fetching offset {offset}...", end=" ", flush=True)
        try:
            data = fetch_batch(offset, BATCH_SIZE)
        except requests.exceptions.RequestException as e:
            print(f"ERROR: {e}")
            print("Retrying in 5 seconds...")
            time.sleep(5)
            try:
                data = fetch_batch(offset, BATCH_SIZE)
            except requests.exceptions.RequestException as e:
                print(f"FATAL: {e}")
                sys.exit(1)

        if total is None:
            total = data.get("total", "?")
            print(f"(total reported: {total})")

        batch = data.get("data", [])
        print(f"got {len(batch)} items")
        all_items.extend(batch)

        if len(batch) < BATCH_SIZE:
            break  # No more items

        time.sleep(1)  # Be nice to the API

    print(f"\nTotal items fetched: {len(all_items)}")

    # Save complete raw JSON
    raw_path = os.path.join(OUTPUT_DIR, "minidoges_all.json")
    with open(raw_path, "w") as f:
        json.dump({"total": len(all_items), "data": all_items}, f, indent=2)
    print(f"Saved raw JSON: {raw_path}")

    # Save individual JSON per NFT (for easy per-item access)
    items_dir = os.path.join(OUTPUT_DIR, "items")
    os.makedirs(items_dir, exist_ok=True)
    for item in all_items:
        item_id = item.get("itemId", "unknown")
        item_path = os.path.join(items_dir, f"{item_id}.json")
        with open(item_path, "w") as f:
            json.dump(item, f, indent=2)

    print(f"Saved {len(all_items)} individual JSON files to {items_dir}/")

    # Build CSV summary
    # Collect all possible attribute keys
    all_attr_keys = set()
    for item in all_items:
        attrs = item.get("attributes", {})
        if attrs:
            all_attr_keys.update(attrs.keys())
    all_attr_keys = sorted(all_attr_keys)

    csv_path = os.path.join(OUTPUT_DIR, "minidoges_all.csv")
    fieldnames = [
        "itemId",
        "inscriptionNumber",
        "inscriptionId",
        "contentType",
        "output",
        "imageUrl",
    ] + all_attr_keys

    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for item in all_items:
            row = {
                "itemId": item.get("itemId"),
                "inscriptionNumber": item.get("inscriptionNumber"),
                "inscriptionId": item.get("inscriptionId"),
                "contentType": item.get("contentType"),
                "output": item.get("output"),
                "imageUrl": f"https://cdn.doggy.market/content/{item.get('inscriptionId')}",
            }
            attrs = item.get("attributes", {})
            if attrs:
                row.update(attrs)
            writer.writerow(row)

    print(f"Saved CSV: {csv_path}")

    # Print trait summary
    print("\n=== Trait Summary ===")
    trait_counts = {}
    for item in all_items:
        attrs = item.get("attributes", {})
        if not attrs:
            continue
        for key, val in attrs.items():
            if key not in trait_counts:
                trait_counts[key] = {}
            trait_counts[key][val] = trait_counts[key].get(val, 0) + 1

    for trait_name in sorted(trait_counts.keys()):
        values = trait_counts[trait_name]
        print(f"\n{trait_name} ({len(values)} values):")
        for val, count in sorted(values.items(), key=lambda x: -x[1]):
            pct = count / len(all_items) * 100
            print(f"  {val}: {count} ({pct:.1f}%)")

    print(f"\nDone! {len(all_items)} Mini Doges metadata preserved.")

if __name__ == "__main__":
    main()
