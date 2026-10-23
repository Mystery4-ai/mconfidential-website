"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const ranges = [
  { label: "Moins de 1M DH", min: 0, max: 1_000_000 },
  { label: "1M – 3M DH", min: 1_000_000, max: 3_000_000 },
  { label: "3M – 5M DH", min: 3_000_000, max: 5_000_000 },
  { label: "5M – 10M DH", min: 5_000_000, max: 10_000_000 },
  { label: "10M – 20M DH", min: 10_000_000, max: 20_000_000 },
  { label: "Plus de 20M DH", min: 20_000_000, max: null },
];

export function BudgetFilter({
  defaultMinPrice,
  defaultMaxPrice,
}: {
  defaultMinPrice?: number;
  defaultMaxPrice?: number;
}) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(() =>
    ranges.map((r) => {
      if (defaultMinPrice == null && defaultMaxPrice == null) return false;
      const min = defaultMinPrice ?? 0;
      const max = defaultMaxPrice ?? Infinity;
      return r.min < max && (r.max ?? Infinity) > min;
    })
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRanges = ranges.filter((_, i) => checked[i]);
  const minPrice = selectedRanges.length
    ? Math.min(...selectedRanges.map((r) => r.min))
    : undefined;
  const hasOpenEnd = selectedRanges.some((r) => r.max === null);
  const maxPrice = selectedRanges.length && !hasOpenEnd
    ? Math.max(...selectedRanges.map((r) => r.max as number))
    : undefined;

  const label =
    selectedRanges.length === 0
      ? "Budget"
      : selectedRanges.length === 1
        ? selectedRanges[0].label
        : `${selectedRanges.length} budgets sélectionnés`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-sm border border-border bg-ivory px-3.5 py-2.5 text-left text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive"
      >
        <span className={cn(selectedRanges.length === 0 && "text-charcoal-soft")}>{label}</span>
        <ChevronDown size={15} strokeWidth={1.5} className="shrink-0 text-charcoal-soft" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1.5 w-64 border border-border bg-white p-3 shadow-md">
            {ranges.map((r, i) => (
              <label
                key={r.label}
                className="flex items-center gap-2.5 px-1 py-1.5 text-sm text-charcoal hover:bg-ivory-dim"
              >
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() =>
                    setChecked((prev) => prev.map((c, idx) => (idx === i ? !c : c)))
                  }
                />
                {r.label}
              </label>
            ))}
          </div>
        </>
      )}

      <input type="hidden" name="minPrice" value={minPrice ?? ""} />
      <input type="hidden" name="maxPrice" value={maxPrice ?? ""} />
    </div>
  );
}
