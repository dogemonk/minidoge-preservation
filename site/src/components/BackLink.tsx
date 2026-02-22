"use client";

import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
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
