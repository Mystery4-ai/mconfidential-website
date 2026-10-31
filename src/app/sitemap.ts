import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getDistinctCities } from "@/lib/properties";
import { neighborhoodDirectory } from "@/lib/neighborhoods";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mconfidential.ma";

// Render per-request instead of prerendering at build time. Prerendering
// means hitting the DB during the Vercel build step, and a cold/sleeping
// Neon compute timing out there fails the entire deployment (this is why
// two recent deploys errored out with nothing actually wrong in the code).
// Also keeps the sitemap always in sync with newly published properties.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, cities] = await Promise.all([
    db.property.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    getDistinctCities(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/biens`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/agence`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/estimation`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/guides`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/guides/acheter-au-maroc`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/guides/louer-au-maroc`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${SITE_URL}/villes/${encodeURIComponent(city)}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoodDirectory.flatMap((group) =>
    group.neighborhoods.map((n) => ({
      url: `${SITE_URL}/quartiers/${encodeURIComponent(group.city)}/${encodeURIComponent(n)}`,
      changeFrequency: "daily" as const,
      priority: 0.75,
    }))
  );

  const propertyPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${SITE_URL}/biens/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...cityPages, ...neighborhoodPages, ...propertyPages];
}
