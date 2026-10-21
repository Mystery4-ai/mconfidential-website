import { Phone, MessageCircle } from "lucide-react";

export function MobileContactBar({
  phone,
  whatsapp,
  propertyTitle,
}: {
  phone?: string | null;
  whatsapp?: string | null;
  propertyTitle: string;
}) {
  if (!phone && !whatsapp) return null;

  const waText = encodeURIComponent(`Bonjour, je suis intéressé(e) par : ${propertyTitle}`);

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
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${waText}`}
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
