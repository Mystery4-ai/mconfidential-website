/**
 * One-off import of M. Confidential's live Mubawab.ma listings into the
 * database. Run with: npx tsx prisma/import-mubawab.ts <path-to-json>
 * The JSON must be an array of listing objects (see mubawab-listings.json)
 * with a `likelyDuplicate` flag — entries flagged true are skipped since
 * they're already on the site via the earlier WordPress import.
 */
import { PrismaClient, PropertyType, TransactionType } from "@prisma/client";
import { generateReference, generateUniqueSlug } from "../src/lib/property-admin";

const db = new PrismaClient();

const CONSULTANT_ID = "cmvsgy6zp00017st1s1a4oloi"; // Mounia Bouyer

type MubawabListing = {
  title: string;
  transactionType: "SALE" | "RENT";
  propertyType: string;
  price: number;
  city: string;
  neighborhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  surfaceArea: number | null;
  landArea: number | null;
  parkingSpaces: number | null;
  fullDescription: string;
  features: string[];
  images: string[];
  sourceUrl: string;
  likelyDuplicate: boolean;
};

const propertyTypeMap: Record<string, PropertyType> = {
  APARTMENT: "APARTMENT",
  HOUSE: "HOUSE",
  VILLA: "VILLA",
  RIAD: "RIAD",
  LAND: "LAND",
  OFFICE: "OFFICE",
  COMMERCIAL: "COMMERCIAL",
  BUILDING: "BUILDING",
};

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) throw new Error("Usage: tsx prisma/import-mubawab.ts <path-to-json>");

  const { readFileSync } = await import("fs");
  const listings: MubawabListing[] = JSON.parse(readFileSync(jsonPath, "utf-8"));
  const toImport = listings.filter((l) => !l.likelyDuplicate);

  console.log(`${listings.length} listings total, ${toImport.length} new to import.`);

  let imported = 0;
  for (const listing of toImport) {
    const reference = await generateReference();
    const slug = await generateUniqueSlug(listing.title, listing.city);
    const propertyType = propertyTypeMap[listing.propertyType] || "APARTMENT";

    const property = await db.property.create({
      data: {
        reference,
        slug,
        title: listing.title,
        description: listing.fullDescription,
        transactionType: listing.transactionType as TransactionType,
        propertyType,
        status: "PUBLISHED",
        availability: "AVAILABLE",
        price: listing.price,
        city: listing.city,
        neighborhood: listing.neighborhood,
        surfaceArea: listing.surfaceArea,
        landArea: listing.landArea,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        parkingSpaces: listing.parkingSpaces,
        features: listing.features,
        consultantId: CONSULTANT_ID,
        publishedAt: new Date(),
        images: {
          create: listing.images.map((url, i) => ({
            url,
            altText: listing.title,
            position: i,
          })),
        },
      },
    });

    console.log(`  ${property.reference} — ${property.title.slice(0, 60)}`);
    imported += 1;
  }

  console.log(`\nImported ${imported} properties.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
