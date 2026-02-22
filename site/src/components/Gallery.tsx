"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { DogeIndex, TraitCategory } from "@/lib/types";
import { trackRoute } from "@/lib/navigationHistory";
import { DogeCard } from "./DogeCard";
import { TraitFilter } from "./TraitFilter";
import { Pagination } from "./Pagination";

const PER_PAGE = 60;

const FILTER_KEYS = [
  "bg",
  "fur",
  "eyes",
  "mouth",
  "head",
  "body",
  "mouthAcc",
] as const;

function GalleryInner({
  doges,
  traitCategories,
}: {
  doges: DogeIndex[];
  traitCategories: TraitCategory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse filters from URL
  const activeFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    for (const key of FILTER_KEYS) {
      const val = searchParams.get(key);
      if (val) filters[key] = val.split(",");
    }
    return filters;
  }, [searchParams]);

  const queryString = searchParams.toString();
  const galleryRoute = queryString ? `/?${queryString}` : "/";
  const searchId = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "id";
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    trackRoute(galleryRoute);
  }, [galleryRoute]);

  // Build new URL params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset to page 1 when filters change (unless page is being set explicitly)
      if (!("page" in updates)) {
        params.delete("page");
      }
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router, searchParams]
  );

  const handleFilterChange = useCallback(
    (key: string, values: string[]) => {
      updateParams({ [key]: values.length > 0 ? values.join(",") : null });
    },
    [updateParams]
  );

  const handleClearAll = useCallback(() => {
    const clears: Record<string, null> = {};
    for (const key of FILTER_KEYS) clears[key] = null;
    clears["search"] = null;
    clears["sort"] = null;
    updateParams(clears);
  }, [updateParams]);

  // Filter doges
  const filtered = useMemo(() => {
    let result = doges;

    // ID search
    if (searchId) {
      const num = parseInt(searchId, 10);
      if (!isNaN(num)) {
        result = result.filter(
          (d) =>
            d.id === num ||
            d.id.toString().includes(searchId) ||
            d.inscriptionNumber.toString().includes(searchId)
        );
      }
    }

    // Trait filters
    for (const key of FILTER_KEYS) {
      const values = activeFilters[key];
      if (values && values.length > 0) {
        result = result.filter((d) =>
          values.includes((d as unknown as Record<string, string>)[key])
        );
      }
    }

    // Sort
    if (sortBy === "rarity") {
      result = [...result].sort((a, b) => a.rank - b.rank);
    }

    return result;
  }, [doges, activeFilters, searchId, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageDoges = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex gap-6">
      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-gold text-black px-4 py-3 rounded-full font-bold shadow-lg"
      >
        {showFilters ? "Close" : "Filters"}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          showFilters ? "fixed inset-0 z-30 bg-bg p-4 overflow-y-auto" : "hidden"
        } lg:block lg:static lg:w-64 lg:shrink-0`}
      >
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by ID..."
            value={searchId}
            onChange={(e) => updateParams({ search: e.target.value || null })}
            className="w-full px-3 py-2 bg-surface border border-white/10 rounded text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <TraitFilter
          categories={traitCategories}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-white/50">
            {filtered.length.toLocaleString()} doge
            {filtered.length !== 1 ? "s" : ""}
            {filtered.length !== doges.length && (
              <span className="text-white/30">
                {" "}
                / {doges.length.toLocaleString()}
              </span>
            )}
          </p>
          <select
            value={sortBy}
            onChange={(e) =>
              updateParams({ sort: e.target.value === "id" ? null : e.target.value })
            }
            className="bg-surface border border-white/10 rounded px-3 py-1.5 text-sm cursor-pointer focus:outline-none focus:border-gold"
          >
            <option value="id">Sort by ID</option>
            <option value="rarity">Sort by Rarity</option>
          </select>
        </div>

        {pageDoges.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p className="text-lg">No doges found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {pageDoges.map((doge) => (
              <DogeCard key={doge.id} doge={doge} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={(p) => updateParams({ page: p === 1 ? null : String(p) })}
        />
      </div>
    </div>
  );
}

export function Gallery(props: {
  doges: DogeIndex[];
  traitCategories: TraitCategory[];
}) {
  return (
    <Suspense>
      <GalleryInner {...props} />
    </Suspense>
  );
}
