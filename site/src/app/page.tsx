import { Gallery } from "@/components/Gallery";
import dogesIndex from "@/data/doges-index.json";
import traitValues from "@/data/trait-values.json";

export default function Home() {
  return <Gallery doges={dogesIndex} traitCategories={traitValues} />;
}
