"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/social-icons";

export function WhatsAppButton({ whatsapp }: { whatsapp?: string | null }) {
  const pathname = usePathname();
  if (!whatsapp) return null;

  // Property detail pages already show dedicated, property-aware WhatsApp
  // CTAs (sidebar on desktop, bottom bar on mobile) — skip the generic
  // floating button there entirely to avoid a redundant, less specific one.
  const isPropertyPage = /^\/biens\/[^/]+$/.test(pathname || "");

  if (isPropertyPage) return null;

  const href = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    "Bonjour, je souhaite avoir plus d’informations."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter M. Confidential sur WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
