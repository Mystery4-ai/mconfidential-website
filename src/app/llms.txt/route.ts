import { getAgencySettings } from "@/lib/settings";
import { getDistinctCities } from "@/lib/properties";
import { neighborhoodDirectory } from "@/lib/neighborhoods";
import { db } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mconfidential.ma";

/**
 * llms.txt — an emerging convention (not yet a formal standard) giving AI
 * assistants and LLM-powered search a clean, factual summary of the site,
 * so they can accurately describe/cite the agency instead of guessing from
 * fragmented page content. Regenerated on each request from live data —
 * never hardcoded, so it can't drift out of date or state anything unreal.
 */
export async function GET() {
  const [settings, cities, propertyCount] = await Promise.all([
    getAgencySettings(),
    getDistinctCities(),
    db.property.count({ where: { status: "PUBLISHED" } }),
  ]);

  const neighborhoodLines = neighborhoodDirectory
    .map((g) => `  - ${g.city}: ${g.neighborhoods.join(", ")}`)
    .join("\n");

  const lines = [
    `# ${settings.agencyName}`,
    "",
    settings.tagline || "Agence immobilière premium au Maroc.",
    "",
    "## About",
    settings.aboutText || `${settings.agencyName} is a real estate agency operating in Morocco.`,
    "",
    "## What this site offers",
    `- ${propertyCount} published property listings (villas, apartments, riads) for sale and rent`,
    `- Cities covered: ${cities.join(", ") || "Casablanca, Marrakech"}`,
    "- Neighborhood guides pairing local context (schools, parks, dining) with live listings:",
    neighborhoodLines,
    "- Online visit booking (consultant availability calendar) directly from each listing",
    "- Property valuation / estimation requests",
    "",
    "## Key pages",
    `- ${SITE_URL}/ — homepage, search by transaction type, property type, city, neighborhood, budget`,
    `- ${SITE_URL}/biens — full property listings`,
    `- ${SITE_URL}/villes/{ville} — listings by city`,
    `- ${SITE_URL}/quartiers/{ville}/{quartier} — listings and local guide by neighborhood`,
    `- ${SITE_URL}/estimation — request a property valuation`,
    `- ${SITE_URL}/agence — about the agency`,
    `- ${SITE_URL}/contact — contact the agency`,
    "",
    "## Contact",
    settings.phone ? `Phone: ${settings.phone}` : null,
    settings.email ? `Email: ${settings.email}` : null,
    `Contact form: ${SITE_URL}/contact`,
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].filter((l) => l !== null);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
