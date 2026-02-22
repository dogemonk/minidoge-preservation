# Doginal Mini Doges Preservation

Complete preservation of all 10,000 Doginal Mini Doges — the first 10k NFT collection on Dogecoin (inscribed as Doginals).

This repo contains every image, all metadata, and a browsable gallery site.

## What's Inside

```
images/              10,000 original 72×72 PNG images
metadata/
  minidoges_all.json Full collection metadata (traits, inscription IDs, etc.)
  items/             Individual JSON files per doge (1.json–10000.json)
site/                Next.js gallery for browsing the collection
```

## Gallery

A fully static Next.js site to browse, filter, and sort all 10,000 Mini Doges.

**Features:**
- Browse all 10k doges in a responsive grid
- Filter by 7 trait categories (Background, Fur, Eyes, Mouth, Head, Body accessory, Mouth accessory)
- Sort by ID or rarity rank
- Search by ID
- Detail page for each doge with full traits, inscription data, and rarity score
- Pixel art rendered crisp at any size
- Dark theme with Dogecoin gold accents

### Run Locally

```bash
cd site
npm install
npm run prepare-data   # Generate index files + copy images
npm run dev            # Start dev server at localhost:3000
```

### Build for Production

```bash
cd site
npm run build          # Static export → out/ (10,000+ HTML pages)
```

## Traits

| Category | Values |
|----------|--------|
| Background | White, Blue, Green, Brown, Space, Fire, Sea, Red, Gold |
| Fur | Red, Sesame, Cream, Black n tan |
| Eyes | Doge eyes, Happy eyes, Naughty eyes, Thug glasses, Black glasses, Angry eyes, Blue glasses, 3d glasses, Stoned eyes, Pirate patch, Red glasses, Laser eyes |
| Mouth | Smiling, Neutral, Short |
| Mouth accessory | Tongue out, Open mouth, Teeth, Blunt, Rick's drool, Cigarette, Cigar, Mole |
| Head | Baseball cap blue, Baseball cap black, Miner hat, Baseball cap red, Baseball cap blue rev, Earing, White strip hat, Pirate hat, Straw hat, Hat, Baseball cap red rev, Flower, Crown |
| Body accessory | Blue collar, Black spiked collar, Black collar, Dogecoin, Red kimono, Blue kimono, Brown hoodie, Business suit, Red collar, Cybersuit, Red spiked collar, White hoodie, Skull, Necktie, Heart, Diamond, Bitcoin, Micro doge |

## Rarity

Rarity is calculated using the statistical rarity method: for each doge, the rarity score is the sum of `1 / (trait_frequency / total)` across all 7 trait categories. Rarer traits contribute a higher score. Doges are ranked 1 (rarest) to 10,000 (most common).

## Scripts

- `scrape_metadata.py` — Scrape metadata from the Doginals marketplace
- `download_images.py` — Download all 10,000 images
