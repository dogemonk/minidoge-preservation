"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { DogeIndex } from "@/lib/types";

export function DogeCard({ doge }: { doge: DogeIndex }) {
  const searchParams = useSearchParams();
  const galleryQuery = searchParams.toString();
  const from = galleryQuery ? `/?${galleryQuery}` : "/";
  const href = `/doge/${doge.id}?from=${encodeURIComponent(from)}`;

  return (
    <Link
      href={href}
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
      <div className="p-2 flex items-center justify-between px-3">
        <span className="text-sm font-medium text-gold group-hover:text-gold-dark">
          #{doge.id}
        </span>
        <span className="text-xs text-white/30">
          Rank {doge.rank.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
