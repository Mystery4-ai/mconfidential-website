import { cn } from "@/lib/cn";

/**
 * Hand-built recreation of the M. Confidential mark (two-peak "M" monogram +
 * serif wordmark + tagline) using currentColor, so it can be dropped on
 * light or dark backgrounds without separate raster assets. If the brand's
 * original vector/logo file becomes available, swap the <path> below.
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 36 L13 4 L24 29 L35 2 L46 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Logo({
  className,
  tagline = true,
  markClassName,
}: {
  className?: string;
  tagline?: boolean;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className={cn("h-7 w-8 shrink-0", markClassName)} />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl tracking-tight">Confidential</span>
        {tagline && (
          <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] opacity-70">
            Real Estate | Maroc
          </span>
        )}
      </span>
    </span>
  );
}
