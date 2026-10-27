import { db } from "@/lib/db";
import { Prisma, PropertyType, TransactionType } from "@prisma/client";

export const PAGE_SIZE = 12;

export type PropertySearchParams = {
  transaction?: TransactionType;
  type?: PropertyType;
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
};

function buildWhere(params: PropertySearchParams): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { status: "PUBLISHED" };
  if (params.transaction) where.transactionType = params.transaction;
  if (params.type) where.propertyType = params.type;
  if (params.city) where.city = params.city;
  if (params.neighborhood) where.neighborhood = params.neighborhood;
  if (params.bedrooms) where.bedrooms = { gte: params.bedrooms };
  if (params.minPrice || params.maxPrice) {
    where.price = {
      ...(params.minPrice ? { gte: params.minPrice } : {}),
      ...(params.maxPrice ? { lte: params.maxPrice } : {}),
    };
  }
  return where;
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
  images: {
    select: { url: true, altText: true },
    orderBy: { position: "asc" as const },
    take: 1,
  },
} satisfies Prisma.PropertySelect;

export async function searchProperties(params: PropertySearchParams) {
  const page = Math.max(1, params.page ?? 1);
  const where = buildWhere(params);

  const [items, total] = await Promise.all([
    db.property.findMany({
      where,
      select: cardSelect,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
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

export async function getDistinctCities() {
  const rows = await db.property.findMany({
    where: { status: "PUBLISHED" },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return rows.map((r) => r.city);
}
