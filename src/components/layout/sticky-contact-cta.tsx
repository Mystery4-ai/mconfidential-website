"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

// 44 px: the smallest comfortable tap target (Apple HIG, WCAG 2.5.5).
const ROUND_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105";

export function StickyContactCta({
  phone,
  whatsapp,
  instagramUrl,
  facebookUrl,
}: {
  phone?: string | null;
  whatsapp?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
}) {
  const pathname = usePathname();
  if (!phone && !whatsapp && !instagramUrl && !facebookUrl) return null;

  // Property detail pages already show dedicated, property-aware phone/WhatsApp
  // CTAs (sidebar on desktop, bottom bar on mobile) — skip this generic one
  // there entirely to avoid a redundant, less specific CTA.
  const isPropertyPage = /^\/biens\/[^/]+$/.test(pathname || "");
  if (isPropertyPage) return null;

  const whatsappHref = whatsapp ? buildGenericWhatsAppLink(whatsapp) : null;
  const socials = [
    instagramUrl && { href: instagramUrl, label: "Instagram", Icon: InstagramIcon },
    facebookUrl && { href: facebookUrl, label: "Facebook", Icon: FacebookIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof InstagramIcon } => Boolean(s));

  return (
    <>
      {/* Mobile: full-width sticky bottom bar, thumb-friendly */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex overflow-hidden rounded-t-xl border border-b-0 border-border bg-ivory/95 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium text-charcoal"
          >
            <Phone size={16} strokeWidth={1.5} /> Appeler
          </a>
        )}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex flex-[1.3] items-center justify-center gap-2 border-l border-border bg-[#25D366] py-3.5 text-sm font-semibold text-white"
          >
            <WhatsAppIcon size={16} /> WhatsApp
          </a>
        )}
        {socials.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`M. Confidential sur ${label}`}
            className="flex min-h-12 w-12 shrink-0 items-center justify-center border-l border-border text-charcoal"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      {/* Desktop: floating buttons bottom-right — socials on top, contact below */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col gap-4 md:flex">
        {socials.length > 0 && (
          <div className="flex flex-col gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`M. Confidential sur ${label}`}
                title={label}
                className={cn(ROUND_BUTTON, "bg-ivory text-charcoal ring-1 ring-border")}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              aria-label="Nous appeler"
              title="Nous appeler"
              className={cn(ROUND_BUTTON, "bg-charcoal text-ivory")}
            >
              <Phone size={20} strokeWidth={1.5} />
            </a>
          )}
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Contacter M. Confidential sur WhatsApp"
              title="WhatsApp"
              className={cn(ROUND_BUTTON, "bg-[#25D366] text-white")}
            >
              <WhatsAppIcon size={22} />
            </a>
          )}
        </div>
      </div>
    </>
  );
}
