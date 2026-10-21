import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAgencySettings } from "@/lib/settings";
import { getDistinctCities } from "@/lib/properties";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, cities] = await Promise.all([getAgencySettings(), getDistinctCities()]);

  return (
    <>
      <SiteHeader phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} cities={cities} />
    </>
  );
}
