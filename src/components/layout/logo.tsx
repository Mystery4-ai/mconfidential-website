import { cn } from "@/lib/cn";

/**
 * Original M. Confidential logo (from the former WordPress site), black on
 * transparent, cropped to the drawing (387 × 61) so its left edge lines up
 * with the text below it.
 */
const DEFAULT_LOGO_SRC = "/logo-mconfidential.png";

export function Logo({
  className,
  logoUrl,
  agencyName = "M. Confidential",
}: {
  className?: string;
  logoUrl?: string | null;
  agencyName?: string;
}) {
  // A logo uploaded in the backoffice (Réglages > Logo) takes precedence over
  // the original brand logo shipped with the site.
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand asset or arbitrary external/blob URL, no next/image domain config needed
    <img
      src={logoUrl || DEFAULT_LOGO_SRC}
      alt={agencyName}
      // The uploaded file may carry its own margins; the shipped one has none.
      className={cn(logoUrl ? "h-9" : "h-7", "w-auto object-contain", className)}
    />
  );
}
