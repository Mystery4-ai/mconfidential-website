import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyContactCta } from "@/components/layout/sticky-contact-cta";
import { getAgencySettings } from "@/lib/settings";
import { getDistinctCities } from "@/lib/properties";

// The whole public site reads live data edited in the backoffice (listings,
// prices, consultants, settings, availability). Force every page in this
// tree to render fresh on each request so backoffice edits are visible
// immediately, instead of risking a statically cached page going stale.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, cities] = await Promise.all([getAgencySettings(), getDistinctCities()]);

  return (
    <>
      <SiteHeader phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} cities={cities} />
      <StickyContactCta phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
