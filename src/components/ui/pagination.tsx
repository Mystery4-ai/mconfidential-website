import Link from "next/link";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  pageCount,
  buildHref,
}: {
  page: number;
  pageCount: number;
  buildHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "border border-border px-3 py-2 text-sm text-charcoal-soft hover:text-charcoal",
          page === 1 && "pointer-events-none opacity-40"
        )}
      >
        Précédent
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center text-sm",
              p === page
                ? "bg-charcoal text-ivory"
                : "text-charcoal-soft hover:bg-ivory-dim"
            )}
          >
            {p}
          </Link>
        ))}
      </div>

      <Link
        href={buildHref(Math.min(pageCount, page + 1))}
        aria-disabled={page === pageCount}
        className={cn(
          "border border-border px-3 py-2 text-sm text-charcoal-soft hover:text-charcoal",
          page === pageCount && "pointer-events-none opacity-40"
        )}
      >
        Suivant
      </Link>
    </nav>
  );
}
