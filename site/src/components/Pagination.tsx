"use client";

import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState("");

  if (totalPages <= 1) return null;

  // Build page numbers to show
  const pages: (number | "...")[] = [];
  const addPage = (p: number) => {
    if (p >= 1 && p <= totalPages && !pages.includes(p)) pages.push(p);
  };

  addPage(1);
  if (currentPage > 3) pages.push("...");
  for (let i = currentPage - 1; i <= currentPage + 1; i++) addPage(i);
  if (currentPage < totalPages - 2) pages.push("...");
  addPage(totalPages);

  const handleJump = () => {
    const num = parseInt(jumpValue, 10);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      onPageChange(num);
      setJumpValue("");
    }
  };

  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center justify-center gap-1 flex-wrap">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded bg-surface text-sm cursor-pointer hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 py-2 text-white/40">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-2 rounded text-sm cursor-pointer ${
                p === currentPage
                  ? "bg-gold text-black font-bold"
                  : "bg-surface hover:bg-surface-hover"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded bg-surface text-sm cursor-pointer hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-white/30">Go to page</span>
        <input
          type="text"
          inputMode="numeric"
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleJump()}
          placeholder={`1–${totalPages}`}
          className="w-20 px-2 py-1 bg-surface border border-white/10 rounded text-sm text-center focus:outline-none focus:border-gold"
        />
        <button
          onClick={handleJump}
          className="px-3 py-1 rounded bg-surface text-sm cursor-pointer hover:bg-surface-hover"
        >
          Go
        </button>
      </div>
    </div>
  );
}
