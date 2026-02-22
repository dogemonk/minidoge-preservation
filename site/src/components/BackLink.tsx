"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getLastGalleryRoute,
  getPreviousRoute,
  trackRoute,
} from "@/lib/navigationHistory";

function toGalleryHref(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin !== window.location.origin || parsed.pathname !== "/") {
      return null;
    }
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return null;
  }
}

export function BackLink() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    trackRoute(pathname);
  }, [pathname]);

  const handleClick = () => {
    const previousGalleryHref = toGalleryHref(getPreviousRoute());
    const savedGalleryHref = toGalleryHref(getLastGalleryRoute()) || "/";

    if (window.history.length > 1 && previousGalleryHref) {
      router.back();
      return;
    }

    router.push(savedGalleryHref);
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
