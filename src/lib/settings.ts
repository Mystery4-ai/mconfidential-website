import { db } from "@/lib/db";

export async function getAgencySettings() {
  const settings = await db.agencySettings.findUnique({ where: { id: 1 } });
  return (
    settings ?? {
      id: 1,
      agencyName: "M. Confidential",
      tagline: null,
      phone: null,
      whatsapp: null,
      email: null,
      address: null,
      city: null,
      facebookUrl: null,
      instagramUrl: null,
      heroHeadline: null,
      heroSubheadline: null,
      aboutText: null,
      seoDefaultTitle: null,
      seoDefaultDescription: null,
      updatedAt: new Date(),
    }
  );
}
