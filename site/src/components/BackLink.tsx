"use client";

import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();

  const handleClick = () => {
    const referrer = document.referrer;
    const isSameOrigin = referrer.startsWith(window.location.origin);
    const isGalleryPage =
      isSameOrigin &&
      (new URL(referrer).pathname === "/" ||
        new URL(referrer).pathname === "");

    if (isGalleryPage) {
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
