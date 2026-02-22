import { readFileSync, writeFileSync, cpSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "../..");
const METADATA = join(ROOT, "metadata/minidoges_all.json");
const OUT_DIR = join(__dirname, "../src/data");
const PUBLIC_IMAGES = join(__dirname, "../public/images");
const SOURCE_IMAGES = join(ROOT, "images");

interface RawItem {
  itemId: string;
  inscriptionId: string;
  inscriptionNumber: number;
  attributes: Record<string, string>;
}

// Attribute key mapping to short keys
const ATTR_MAP: Record<string, string> = {
  Background: "bg",
  Fur: "fur",
  Eyes: "eyes",
  Mouth: "mouth",
  Head: "head",
  "Body accessory": "body",
  "Mouth accessory": "mouthAcc",
};

console.log("Reading metadata...");
const raw = JSON.parse(readFileSync(METADATA, "utf-8")) as {
  total: number;
  data: RawItem[];
};

console.log(`Processing ${raw.data.length} items...`);

// Build compact index
const index = raw.data
  .map((item) => ({
    id: parseInt(item.itemId, 10),
    inscriptionNumber: item.inscriptionNumber,
    bg: item.attributes["Background"] || "",
    fur: item.attributes["Fur"] || "",
    eyes: item.attributes["Eyes"] || "",
    mouth: item.attributes["Mouth"] || "",
    head: item.attributes["Head"] || "",
    body: item.attributes["Body accessory"] || "",
    mouthAcc: item.attributes["Mouth accessory"] || "",
  }))
  .sort((a, b) => a.id - b.id);

// Build trait values with counts
const traitCategories = Object.entries(ATTR_MAP).map(([name, key]) => {
  const counts = new Map<string, number>();
  for (const item of index) {
    const val = (item as Record<string, unknown>)[key] as string;
    if (val) {
      counts.set(val, (counts.get(val) || 0) + 1);
    }
  }
  const values = Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
  return { name, key, values };
});

// Write output files
writeFileSync(join(OUT_DIR, "doges-index.json"), JSON.stringify(index));
console.log(`Wrote doges-index.json (${index.length} items)`);

writeFileSync(
  join(OUT_DIR, "trait-values.json"),
  JSON.stringify(traitCategories, null, 2)
);
console.log(`Wrote trait-values.json (${traitCategories.length} categories)`);

// Copy images
if (!existsSync(join(PUBLIC_IMAGES, "1.png"))) {
  console.log("Copying images to public/images/ ...");
  cpSync(SOURCE_IMAGES, PUBLIC_IMAGES, { recursive: true });
  console.log("Images copied.");
} else {
  console.log("Images already present in public/images/, skipping copy.");
}

console.log("Done!");
