import Link from "next/link";
import type { DogeIndex } from "@/lib/types";

export function DogeCard({ doge }: { doge: DogeIndex }) {
  return (
    <Link
      href={`/doge/${doge.id}`}
      className="group bg-surface rounded-lg overflow-hidden hover:bg-surface-hover transition-colors"
    >
      <div className="aspect-square bg-black/20 flex items-center justify-center">
        <img
          src={`/images/${doge.id}.png`}
          alt={`Mini Doge #${doge.id}`}
          width={128}
          height={128}
          className="pixelated w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="p-2 text-center">
        <span className="text-sm font-medium text-gold group-hover:text-gold-dark">
          #{doge.id}
        </span>
      </div>
    </Link>
  );
}
