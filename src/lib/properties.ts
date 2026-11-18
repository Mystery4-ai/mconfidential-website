import { db } from "@/lib/db";
import { Prisma, PropertyType, TransactionType } from "@prisma/client";

export const PAGE_SIZE = 12;

export const AMENITY_LABELS = {
  pool: "Piscine",
  garden: "Jardin",
  terrace: "Terrasse",
  parking: "Parking",
  ac: "Climatisation",
  furnished: "Meublé",
} as const;

export type AmenityKey = keyof typeof AMENITY_LABELS;

export type SortOption = "recent" | "price_asc" | "price_desc";

export type PropertySearchParams = {
  transaction?: TransactionType;
  type?: PropertyType;
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
  bedrooms?: number;
  amenities?: AmenityKey[];
  sort?: SortOption;
  page?: number;
};

// Feature tags are free text (hand-typed, or scraped by the Mubawab
// importer) so the same amenity shows up as e.g. "Piscine", "Pool",
// "Piscine dans le Complexe Résidentiel" — substring matching across
// French/English variants, rather than an exact-match list that would miss
// most of them. "furnished" needs the exclusion since the substring also
// occurs inside "Unfurnished".
const AMENITY_PATTERNS: Record<AmenityKey, string[]> = {
  pool: ["%piscine%", "%pool%"],
  garden: ["%jardin%", "%garden%"],
  terrace: ["%terrasse%", "%terrace%", "%balcon%", "%balcony%", "%rooftop%"],
  parking: ["%parking%", "%garage%", "%carpark%"],
  ac: ["%climatisation%", "%air condition%"],
  furnished: ["%meublé%", "%meuble%", "%furnished%"],
};

async function propertyIdsWithAmenity(key: AmenityKey): Promise<string[]> {
  const patterns = AMENITY_PATTERNS[key];
  const rows =
    key === "furnished"
      ? await db.$queryRaw<{ id: string }[]>`
          SELECT DISTINCT p.id FROM "Property" p,
            jsonb_array_elements_text(COALESCE(p.features, '[]'::jsonb)) AS f
          WHERE p.status = 'PUBLISHED'
            AND f ILIKE ANY(${patterns}::text[])
            AND f NOT ILIKE '%unfurnished%'
        `
      : await db.$queryRaw<{ id: string }[]>`
          SELECT DISTINCT p.id FROM "Property" p,
            jsonb_array_elements_text(COALESCE(p.features, '[]'::jsonb)) AS f
          WHERE p.status = 'PUBLISHED'
            AND f ILIKE ANY(${patterns}::text[])
        `;
  return rows.map((r) => r.id);
}

// Checking multiple amenity boxes narrows the search (must have ALL of
// them), matching how comparable property portals behave — so this
// intersects the ID sets rather than unioning them.
async function propertyIdsWithAllAmenities(keys: AmenityKey[]): Promise<string[]> {
  const idSets = await Promise.all(keys.map(propertyIdsWithAmenity));
  const [first, ...rest] = idSets.map((ids) => new Set(ids));
  let result = first;
  for (const s of rest) result = new Set([...result].filter((id) => s.has(id)));
  return [...result];
}

async function buildWhere(params: PropertySearchParams): Promise<Prisma.PropertyWhereInput> {
  const where: Prisma.PropertyWhereInput = { status: "PUBLISHED" };
  if (params.transaction) where.transactionType = params.transaction;
  if (params.type) where.propertyType = params.type;
  // Case-insensitive: neighborhood/city values are typed by hand or scraped
  // (the Mubawab importer) and small casing drift (e.g. "ain diab extension"
  // vs "Ain Diab Extension") used to silently hide a property from its own
  // neighborhood/city page.
  if (params.city) where.city = { equals: params.city, mode: "insensitive" };
  if (params.neighborhood) where.neighborhood = { equals: params.neighborhood, mode: "insensitive" };
  if (params.bedrooms) where.bedrooms = { gte: params.bedrooms };
  if (params.minPrice || params.maxPrice) {
    where.price = {
      ...(params.minPrice ? { gte: params.minPrice } : {}),
      ...(params.maxPrice ? { lte: params.maxPrice } : {}),
    };
  }
  if (params.minSurface || params.maxSurface) {
    where.surfaceArea = {
      ...(params.minSurface ? { gte: params.minSurface } : {}),
      ...(params.maxSurface ? { lte: params.maxSurface } : {}),
    };
  }
  if (params.amenities && params.amenities.length > 0) {
    const ids = await propertyIdsWithAllAmenities(params.amenities);
    where.id = { in: ids };
  }
  return where;
}

function buildOrderBy(sort: SortOption | undefined): Prisma.PropertyOrderByWithRelationInput[] {
  if (sort === "price_asc") return [{ price: "asc" }];
  if (sort === "price_desc") return [{ price: "desc" }];
  return [{ featured: "desc" }, { publishedAt: "desc" }];
}

const cardSelect = {
  slug: true,
  title: true,
  price: true,
  currency: true,
  city: true,
  neighborhood: true,
  transactionType: true,
  propertyType: true,
  availability: true,
  surfaceArea: true,
  bedrooms: true,
  bathrooms: true,
  isNewDevelopment: true,
  images: {
    select: { url: true, altText: true },
    orderBy: { position: "asc" as const },
    take: 1,
  },
} satisfies Prisma.PropertySelect;

export async function searchProperties(params: PropertySearchParams) {
  const page = Math.max(1, params.page ?? 1);
  const where = await buildWhere(params);
  const orderBy = buildOrderBy(params.sort);

  const [items, total] = await Promise.all([
    db.property.findMany({
      where,
      select: cardSelect,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.property.count({ where }),
  ]);

  return {
    items: items.map((p) => ({ ...p, coverImage: p.images[0] ?? null })),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getFeaturedProperties(limit = 6) {
  const items = await db.property.findMany({
    where: { status: "PUBLISHED", featured: true },
    select: cardSelect,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  if (items.length >= limit) return items.map((p) => ({ ...p, coverImage: p.images[0] ?? null }));

  // top up with most recent published listings if not enough are flagged featured
  const extra = await db.property.findMany({
    where: { status: "PUBLISHED", featured: false },
    select: cardSelect,
    orderBy: { publishedAt: "desc" },
    take: limit - items.length,
  });
  return [...items, ...extra].map((p) => ({ ...p, coverImage: p.images[0] ?? null }));
}

const propertyDetailInclude = {
  images: { orderBy: { position: "asc" as const } },
  floorPlans: { orderBy: { position: "asc" as const } },
  units: { orderBy: [{ floorLabel: "asc" as const }, { lotNumber: "asc" as const }] },
  consultant: {
    select: {
      id: true,
      name: true,
      phone: true,
      whatsapp: true,
      title: true,
      photoUrl: true,
      email: true,
      schedulingUrl: true,
    },
  },
};

export async function getPropertyBySlug(slug: string) {
  return db.property.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: propertyDetailInclude,
  });
}

/** Unfiltered by status — only call behind an auth + ownership check (admin preview). */
export async function getPropertyBySlugForPreview(slug: string) {
  return db.property.findFirst({
    where: { slug },
    include: propertyDetailInclude,
  });
}

export async function getSimilarProperties(property: {
  id: string;
  city: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
}) {
  const items = await db.property.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: property.id },
      city: property.city,
      transactionType: property.transactionType,
    },
    select: cardSelect,
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
  return items.map((p) => ({ ...p, coverImage: p.images[0] ?? null }));
}

export async function getPublishedCountForConsultant(consultantId: string) {
  return db.property.count({ where: { consultantId, status: "PUBLISHED" } });
}

export async function getDistinctCities() {
  const rows = await db.property.findMany({
    where: { status: "PUBLISHED" },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return rows.map((r) => r.city);
}
