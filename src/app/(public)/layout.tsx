import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyContactCta } from "@/components/layout/sticky-contact-cta";
import { getAgencySettings } from "@/lib/settings";
import { getDistinctCities } from "@/lib/properties";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mconfidential.ma";

// The whole public site reads live data edited in the backoffice (listings,
// prices, consultants, settings, availability). Force every page in this
// tree to render fresh on each request so backoffice edits are visible
// immediately, instead of risking a statically cached page going stale.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, cities] = await Promise.all([getAgencySettings(), getDistinctCities()]);

  // RealEstateAgent entity schema, site-wide — the strongest single signal
  // for search engines and AI assistants to understand *who this business
  // is* (vs. just what pages exist). Only includes fields that are actually
  // filled in via the backoffice, never invented placeholders.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.agencyName,
    url: SITE_URL,
    ...(settings.tagline ? { description: settings.tagline } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.address || settings.city
      ? {
          address: {
            "@type": "PostalAddress",
            ...(settings.address ? { streetAddress: settings.address } : {}),
            ...(settings.city ? { addressLocality: settings.city } : {}),
            addressCountry: "MA",
          },
        }
      : {}),
    areaServed: cities.length > 0 ? cities : ["Casablanca", "Marrakech"],
    ...(settings.facebookUrl || settings.instagramUrl
      ? { sameAs: [settings.facebookUrl, settings.instagramUrl].filter(Boolean) }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <SiteHeader phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} cities={cities} />
      <StickyContactCta phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
