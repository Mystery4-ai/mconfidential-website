/**
 * One-off import of a single Nestpro CRM listing into the database.
 * Run with: npx tsx prisma/import-nestpro.ts
 *
 * Source: https://www.nestpro.app/property/c6b5f5d5-bf16-448c-9dd5-e90e88bad876
 * Nestpro's public API (https://api.nestpro.app/api/v1/properties/{id}/public,
 * .../medias/properties/{id}/public, .../amenities/public) gave the full
 * listing + photos + amenities. City/neighborhood weren't set on the source
 * listing — confirmed with the agency as Casablanca / Ain Diab Extension.
 */
import { PrismaClient } from "@prisma/client";
import { generateReference, generateUniqueSlug } from "../src/lib/property-admin";

const db = new PrismaClient();

const CONSULTANT_ID = "cmvsgy6zp00017st1s1a4oloi"; // Mounia Bouyer — Nestpro listing owner

const title = "Appartement élégant à louer - Quartier résidentiel";
const description = `À louer – Appartement 3 chambres avec terrasse dans une résidence familiale sécurisée – 13 000 DH charges incluses

Notre agence vous propose à la location cet appartement sans vis-à-vis, situé dans une résidence sécurisée avec espaces verts et équipements de loisirs, à proximité de George Washington Academy, de Léon l'Africain et du lycée El Biya. À cinq minutes du Morocco Mall et à moins de dix minutes de la corniche d'Aïn Diab, il offre un cadre de vie agréable pour une famille.

L'appartement comprend un salon bénéficiant d'une belle luminosité en fin de journée, prolongé par une terrasse sans vis-à-vis. L'espace nuit accueille trois chambres entièrement parquetées, dont une suite parentale avec sa salle de bain privative. Une seconde salle de bain dessert les deux chambres junior.

La cuisine est équipée d'un four, d'une plaque de cuisson et d'une hotte. Une climatisation centralisée, un ascenseur et deux places de parking complètent les prestations.

La résidence dispose d'une salle de sport, d'un terrain de padel, de deux piscines et d'une piscine pour enfants, ainsi que d'un parc et d'aires de jeux. Ses espaces verts et ses allées permettent de se promener et aux enfants de profiter de leur trottinette en toute tranquillité, à l'écart de la circulation automobile.

L'accès est sécurisé par un gardien à l'entrée et un interphone.

Loyer : 13 000 DH par mois, charges incluses
Caution : un mois de loyer
Honoraires d'agence : un mois de loyer hors taxes`;

const images = [
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261086249.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261086886.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261087370.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261087872.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261088599.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261089405.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261090154.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261090993.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261091777.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261092649.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261093515.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261094890.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261095940.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261097649.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261098560.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261099308.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261099974.jpg",
  "https://nestpro.s3.eu-west-3.amazonaws.com/p/c6b5f5d5-bf16-448c-9dd5-e90e88bad876/1792261100606.jpg",
];

const features = [
  "Jardin",
  "Terrasse",
  "Balcon",
  "Cuisine équipée",
  "Climatisation",
  "Salle de sport",
  "Court de padel",
  "Agents de sécurité",
  "Interphone",
];

async function main() {
  const reference = await generateReference();
  const city = "Casablanca";
  const slug = await generateUniqueSlug(title, city);

  const property = await db.property.create({
    data: {
      reference,
      slug,
      title,
      description,
      transactionType: "RENT",
      propertyType: "APARTMENT",
      status: "PUBLISHED",
      availability: "AVAILABLE",
      price: 13000,
      currency: "MAD",
      city,
      neighborhood: "Ain Diab Extension",
      surfaceArea: 113,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 2,
      features,
      consultantId: CONSULTANT_ID,
      publishedAt: new Date(),
      images: {
        create: images.map((url, i) => ({
          url,
          altText: title,
          position: i,
        })),
      },
    },
  });

  console.log(`Imported ${property.reference} — ${property.title}`);
  console.log(`https://www.mconfidential.ma/biens/${property.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
