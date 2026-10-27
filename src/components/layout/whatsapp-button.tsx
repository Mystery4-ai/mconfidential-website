"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { cn } from "@/lib/cn";

export function WhatsAppButton({ whatsapp }: { whatsapp?: string | null }) {
  const pathname = usePathname();
  if (!whatsapp) return null;

  // Property detail pages already show a dedicated call/WhatsApp bar at the
  // bottom on mobile — avoid stacking a second floating button there.
  const isPropertyPage = /^\/biens\/[^/]+$/.test(pathname || "");

  const href = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    "Bonjour, je souhaite avoir plus d’informations."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter M. Confidential sur WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105",
        isPropertyPage && "hidden lg:flex"
      )}
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
