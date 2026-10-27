const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mconfidential.ma";

/** Builds a wa.me link prefilled with enough context to identify the property at a glance. */
export function buildPropertyWhatsAppLink(
  whatsapp: string,
  property: { title: string; reference: string; slug: string }
) {
  const url = `${SITE_URL}/biens/${property.slug}`;
  const text = `Bonjour, je suis intéressé(e) par ce bien : ${property.title} (Réf. ${property.reference}) — ${url}`;
  return `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;
}
