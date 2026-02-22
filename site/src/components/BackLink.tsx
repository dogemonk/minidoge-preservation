"use client";

import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-gold mb-6 cursor-pointer"
    >
      &larr; Back to Gallery
    </button>
  );
}
