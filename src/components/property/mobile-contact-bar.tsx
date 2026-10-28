import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/social-icons";

export function MobileContactBar({
  phone,
  whatsappHref,
}: {
  phone?: string | null;
  whatsappHref?: string | null;
}) {
  if (!phone && !whatsappHref) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex overflow-hidden rounded-t-xl border border-b-0 border-border bg-ivory/95 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
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
          <WhatsAppIcon size={18} /> WhatsApp
        </a>
      )}
    </div>
  );
}
