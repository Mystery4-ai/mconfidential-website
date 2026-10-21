/**
 * Seeds the local database with:
 *  - Agency settings using verified copy pulled from the live mconfidential.ma
 *    site (exact homepage/about text + meta description). Contact fields the
 *    live site does not publicly expose (phone/WhatsApp/email/address) are
 *    left null on purpose — fill them in via /admin/settings.
 *  - One admin account and one consultant account (dev-only credentials,
 *    printed below). Real consultants should be created via the backoffice.
 *  - The 20 real property listings currently published on mconfidential.ma,
 *    imported via its public WordPress REST API (title, price, location,
 *    specs, description and photos are all real). They're assigned to the
 *    placeholder consultant until real consultants replace them.
 */
import { PrismaClient, PropertyType, TransactionType, Availability } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import seedProperties from "./seed-data/seed-properties.json";

type SeedImage = { url: string; alt?: string; title?: string };
type SeedProperty = {
  title: string;
  slug: string;
  description: string;
  transactionType: string;
  availability: string;
  featured: boolean;
  propertyType: string;
  price: number;
  city: string;
  neighborhood: string | null;
  surfaceArea: number | null;
  landArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  features: string[];
  images: SeedImage[];
};

const db = new PrismaClient();

async function main() {
  await db.agencySettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      agencyName: "M. Confidential",
      tagline: "Agence immobilière à Casablanca & Dar Bouazza",
      heroHeadline: "Biens d’exception",
      heroSubheadline:
        "Agence immobilière premium à Casablanca et Dar Bouazza : achat, vente, location et gestion sur mesure de biens haut de gamme.",
      aboutText:
        "« M. Confidential » est le fruit d’un parcours personnel à l’étranger, d’expériences professionnelles dans l’immobilier et d’une véritable réflexion. Dans l’intimité de chaque recherche immobilière se cache une quête bien plus profonde que la simple acquisition ou la mise sur le marché d’un bien. L’immobilier est une alchimie complexe entre emplacement, design, exclusivité et une série d’attributs qui élèvent une propriété au-delà du simple espace de vie pour en faire un symbole de statut, de confort et d’art de vivre. Créer une agence immobilière, aujourd’hui, à l’ère numérique, c’est être digitalisée, proposer un accueil haut de gamme, une expertise, mais c’est aussi et surtout retrouver une approche artisanale au sens noble et précieux du terme, faire du sur-mesure et vous accompagner dans votre voyage vers votre destination. Vos aspirations, vos expériences passées, vos évolutions de vie font de vous des personnes uniques ; vos besoins, vos préférences, vos impératifs font de nous des professionnels authentiques.",
      seoDefaultTitle: "M. Confidential – Agence immobilière à Casablanca & Dar Bouazza",
      seoDefaultDescription:
        "M. Confidential, agence immobilière premium à Casablanca et Dar Bouazza : achat, vente, location et gestion sur mesure de biens haut de gamme",
      facebookUrl: "https://www.facebook.com/mconfidential",
      // Not publicly available on the live site — fill in via /admin/settings.
      phone: null,
      whatsapp: null,
      email: null,
      address: null,
      city: "Casablanca",
    },
    update: {
      facebookUrl: "https://www.facebook.com/mconfidential",
    },
  });

  const adminPassword = await bcrypt.hash("ChangeMe123!", 10);
  await db.user.upsert({
    where: { email: "admin@mconfidential.ma" },
    create: {
      name: "Administrateur (à renommer)",
      email: "admin@mconfidential.ma",
      passwordHash: adminPassword,
      role: "ADMIN",
      title: "Administrateur",
    },
    update: {},
  });

  const consultantPassword = await bcrypt.hash("ChangeMe123!", 10);
  const consultant = await db.user.upsert({
    where: { email: "consultant@mconfidential.ma" },
    create: {
      name: "Consultant à créer",
      email: "consultant@mconfidential.ma",
      passwordHash: consultantPassword,
      role: "CONSULTANT",
      title: "Consultant immobilier",
    },
    update: {},
  });

  console.log("Seeded users:");
  console.log("  admin@mconfidential.ma / ChangeMe123! (role ADMIN)");
  console.log("  consultant@mconfidential.ma / ChangeMe123! (role CONSULTANT)");
  console.log("  -> change these passwords immediately after first login.");

  let refCounter = 1;
  for (const p of seedProperties as SeedProperty[]) {
    const reference = `MC-${String(refCounter).padStart(5, "0")}`;
    refCounter += 1;

    const baseSlug = slugify(p.slug || p.title, { lower: true, strict: true });
    const slug = `${baseSlug}`.slice(0, 80);

    const existing = await db.property.findUnique({ where: { slug } });
    if (existing) continue;

    await db.property.create({
      data: {
        reference,
        slug,
        title: p.title,
        description: p.description || "",
        transactionType: p.transactionType as TransactionType,
        propertyType: p.propertyType as PropertyType,
        status: "PUBLISHED",
        availability: p.availability as Availability,
        featured: Boolean(p.featured),
        price: p.price || 0,
        currency: "MAD",
        city: p.city || "Casablanca",
        neighborhood: p.neighborhood || null,
        surfaceArea: p.surfaceArea || null,
        landArea: p.landArea || null,
        bedrooms: p.bedrooms || null,
        bathrooms: p.bathrooms || null,
        parkingSpaces: p.parkingSpaces || null,
        features: p.features?.length ? p.features : undefined,
        consultantId: consultant.id,
        publishedAt: new Date(),
        images: {
          create: (p.images || []).map((img: SeedImage, index: number) => ({
            url: img.url,
            altText: img.alt?.trim() || `${p.title} – photo ${index + 1}`,
            position: index,
          })),
        },
      },
    });
  }

  const count = await db.property.count();
  console.log(`Seeded ${count} properties.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
