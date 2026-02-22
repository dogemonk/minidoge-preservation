import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";

interface DogeMetadata {
  itemId: string;
  inscriptionId: string;
  inscriptionNumber: number;
  attributes: Record<string, string>;
}

export function generateStaticParams() {
  return Array.from({ length: 10000 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15 makes params a promise in generateMetadata
  // But for static export, we return a generic title
  return {
    title: "Mini Doge Detail",
  };
}

async function getDogeData(id: string): Promise<DogeMetadata> {
  const filePath = join(
    process.cwd(),
    "..",
    "metadata",
    "items",
    `${id}.json`
  );
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export default async function DogePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  const doge = await getDogeData(id);

  const traitOrder = [
    "Background",
    "Fur",
    "Eyes",
    "Mouth",
    "Mouth accessory",
    "Head",
    "Body accessory",
  ];

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-gold mb-6"
      >
        &larr; Back to Gallery
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="shrink-0">
          <div className="bg-surface rounded-xl p-4 inline-block">
            <img
              src={`/images/${id}.png`}
              alt={`Mini Doge #${id}`}
              width={256}
              height={256}
              className="pixelated"
              style={{ width: 256, height: 256 }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-1">
            Mini Doge{" "}
            <span className="text-gold">#{id}</span>
          </h1>
          <p className="text-white/40 text-sm mb-6">
            Inscription #{doge.inscriptionNumber}
          </p>

          {/* Traits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {traitOrder.map((trait) => {
              const value = doge.attributes[trait];
              if (!value) return null;
              return (
                <div
                  key={trait}
                  className="bg-surface rounded-lg p-3"
                >
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    {trait}
                  </div>
                  <div className="text-sm font-medium">{value}</div>
                </div>
              );
            })}
          </div>

          {/* Inscription ID */}
          <div className="bg-surface rounded-lg p-4">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Inscription ID
            </div>
            <div className="text-xs font-mono text-white/70 break-all">
              {doge.inscriptionId}
            </div>
          </div>

          {/* Prev/Next navigation */}
          <div className="flex items-center justify-between mt-6">
            {numId > 1 ? (
              <Link
                href={`/doge/${numId - 1}`}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-gold"
              >
                <img
                  src={`/images/${numId - 1}.png`}
                  alt={`#${numId - 1}`}
                  width={32}
                  height={32}
                  className="pixelated rounded"
                />
                <span>&larr; #{numId - 1}</span>
              </Link>
            ) : (
              <div />
            )}
            {numId < 10000 ? (
              <Link
                href={`/doge/${numId + 1}`}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-gold"
              >
                <span>#{numId + 1} &rarr;</span>
                <img
                  src={`/images/${numId + 1}.png`}
                  alt={`#${numId + 1}`}
                  width={32}
                  height={32}
                  className="pixelated rounded"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
