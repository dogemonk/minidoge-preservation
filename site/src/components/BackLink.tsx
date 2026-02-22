"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function BackLink() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleClick = () => {
    if (from) {
      router.push(from);
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-gold mb-6 cursor-pointer"
    >
      &larr; Back to Gallery
    </button>
  );
}
