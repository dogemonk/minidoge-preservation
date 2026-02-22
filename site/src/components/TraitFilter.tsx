"use client";

import type { TraitCategory } from "@/lib/types";

interface TraitFilterProps {
  categories: TraitCategory[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (category: string, values: string[]) => void;
  onClearAll: () => void;
}

export function TraitFilter({
  categories,
  activeFilters,
  onFilterChange,
  onClearAll,
}: TraitFilterProps) {
  const hasFilters = Object.values(activeFilters).some((v) => v.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-xs text-gold hover:text-gold-dark"
          >
            Clear all
          </button>
        )}
      </div>
      {categories.map((cat) => (
        <details key={cat.name} className="group">
          <summary className="flex items-center justify-between cursor-pointer text-sm font-medium py-1 hover:text-gold">
            <span>{cat.name}</span>
            {(activeFilters[cat.key] || []).length > 0 && (
              <span className="bg-gold text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                {activeFilters[cat.key].length}
              </span>
            )}
          </summary>
          <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pl-1">
            {cat.values.map(({ value, count }) => {
              const active = (activeFilters[cat.key] || []).includes(value);
              return (
                <label
                  key={value}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-gold py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => {
                      const current = activeFilters[cat.key] || [];
                      const next = active
                        ? current.filter((v) => v !== value)
                        : [...current, value];
                      onFilterChange(cat.key as string, next);
                    }}
                    className="accent-gold"
                  />
                  <span className="flex-1 truncate">{value}</span>
                  <span className="text-white/30 text-xs">{count}</span>
                </label>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}
