/**
 * One-off: populate the real 24-lot pricing grid for the Palmier new-
 * development project, transcribed from the agency's own price-list photos.
 * Prices are the original figures rounded UP to the nearest 10,000 MAD.
 * Run with: npx tsx prisma/seed-palmier-units.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const PROPERTY_ID = "cmvtcsiju003x7saaxvcycjp4"; // Palmier new-development project

const units: {
  floorLabel: string;
  lotNumber: number;
  surfaceArea: number;
  terraceArea: number | null;
  price: number;
}[] = [
  { floorLabel: "1er étage", lotNumber: 1, surfaceArea: 64, terraceArea: null, price: 1_610_000 },
  { floorLabel: "1er étage", lotNumber: 2, surfaceArea: 58, terraceArea: null, price: 1_470_000 },
  { floorLabel: "1er étage", lotNumber: 3, surfaceArea: 42, terraceArea: 13, price: 1_340_000 },
  { floorLabel: "1er étage", lotNumber: 4, surfaceArea: 70, terraceArea: 16, price: 1_870_000 },
  { floorLabel: "1er étage", lotNumber: 5, surfaceArea: 69, terraceArea: 15, price: 1_920_000 },
  { floorLabel: "1er étage", lotNumber: 6, surfaceArea: 66, terraceArea: null, price: 1_660_000 },

  { floorLabel: "2e étage", lotNumber: 7, surfaceArea: 65, terraceArea: null, price: 1_640_000 },
  { floorLabel: "2e étage", lotNumber: 8, surfaceArea: 58, terraceArea: null, price: 1_470_000 },
  { floorLabel: "2e étage", lotNumber: 9, surfaceArea: 43, terraceArea: null, price: 1_200_000 },
  { floorLabel: "2e étage", lotNumber: 10, surfaceArea: 70, terraceArea: 7, price: 1_850_000 },
  { floorLabel: "2e étage", lotNumber: 11, surfaceArea: 69, terraceArea: null, price: 1_740_000 },
  { floorLabel: "2e étage", lotNumber: 12, surfaceArea: 66, terraceArea: null, price: 1_660_000 },

  { floorLabel: "3e étage", lotNumber: 13, surfaceArea: 64, terraceArea: null, price: 1_610_000 },
  { floorLabel: "3e étage", lotNumber: 14, surfaceArea: 57, terraceArea: null, price: 1_450_000 },
  { floorLabel: "3e étage", lotNumber: 15, surfaceArea: 39, terraceArea: null, price: 1_090_000 },
  { floorLabel: "3e étage", lotNumber: 16, surfaceArea: 61, terraceArea: 16, price: 1_670_000 },
  { floorLabel: "3e étage", lotNumber: 17, surfaceArea: 72, terraceArea: 9, price: 2_020_000 },
  { floorLabel: "3e étage", lotNumber: 18, surfaceArea: 62, terraceArea: null, price: 1_570_000 },

  { floorLabel: "4e étage", lotNumber: 19, surfaceArea: 64, terraceArea: null, price: 1_610_000 },
  { floorLabel: "4e étage", lotNumber: 20, surfaceArea: 57, terraceArea: null, price: 1_450_000 },
  { floorLabel: "4e étage", lotNumber: 21, surfaceArea: 39, terraceArea: null, price: 1_090_000 },
  { floorLabel: "4e étage", lotNumber: 22, surfaceArea: 61, terraceArea: 11, price: 1_610_000 },
  { floorLabel: "4e étage", lotNumber: 23, surfaceArea: 72, terraceArea: 9, price: 2_020_000 },
  { floorLabel: "4e étage", lotNumber: 24, surfaceArea: 62, terraceArea: null, price: 1_570_000 },
];

async function main() {
  await db.$transaction([
    db.projectUnit.deleteMany({ where: { propertyId: PROPERTY_ID } }),
    db.projectUnit.createMany({
      data: units.map((u, i) => ({ propertyId: PROPERTY_ID, ...u, position: i })),
    }),
  ]);
  console.log(`Seeded ${units.length} lots for property ${PROPERTY_ID}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
