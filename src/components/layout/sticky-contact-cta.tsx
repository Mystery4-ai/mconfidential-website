"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";

export function StickyContactCta({
  phone,
  whatsapp,
}: {
  phone?: string | null;
  whatsapp?: string | null;
}) {
  const pathname = usePathname();
  if (!phone && !whatsapp) return null;

  // Property detail pages already show dedicated, property-aware phone/WhatsApp
  // CTAs (sidebar on desktop, bottom bar on mobile) — skip this generic one
  // there entirely to avoid a redundant, less specific CTA.
  const isPropertyPage = /^\/biens\/[^/]+$/.test(pathname || "");
  if (isPropertyPage) return null;

  const whatsappHref = whatsapp ? buildGenericWhatsAppLink(whatsapp) : null;

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
      </div>

      {/* Desktop: floating stacked buttons bottom-right */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 md:flex">
        {phone && (
          <a
            href={`tel:${phone}`}
            aria-label="Nous appeler"
            title="Nous appeler"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-ivory shadow-lg transition-transform hover:scale-105"
          >
            <Phone size={24} strokeWidth={1.5} />
          </a>
        )}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Contacter M. Confidential sur WhatsApp"
            title="WhatsApp"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
          >
            <WhatsAppIcon size={28} />
          </a>
        )}
      </div>
    </>
  );
}
