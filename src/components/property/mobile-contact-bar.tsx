import { Phone, MessageCircle } from "lucide-react";

export function MobileContactBar({
  phone,
  whatsappHref,
}: {
  phone?: string | null;
  whatsappHref?: string | null;
}) {
  if (!phone && !whatsappHref) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-ivory/95 backdrop-blur lg:hidden">
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
          className="flex flex-1 items-center justify-center gap-2 border-l border-border bg-charcoal py-3.5 text-sm font-medium text-ivory"
        >
          <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
        </a>
      )}
    </div>
  );
}
