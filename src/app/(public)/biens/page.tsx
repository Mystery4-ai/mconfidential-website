import type { Metadata } from "next";
import { searchProperties, getDistinctCities, PropertySearchParams } from "@/lib/properties";
import { PropertyCard } from "@/components/property/property-card";
import { FilterBar } from "@/components/property/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { Container } from "@/components/layout/container";
import { PropertyType, TransactionType } from "@prisma/client";

type RawParams = Record<string, string | string[] | undefined>;

function parseParams(raw: RawParams): PropertySearchParams {
  const str = (key: string) => (Array.isArray(raw[key]) ? raw[key][0] : raw[key]) || "";

  const transaction = str("transaction");
  const type = str("type");
  const page = parseInt(str("page"), 10);

  return {
    transaction: (["SALE", "RENT"] as const).includes(transaction as TransactionType)
      ? (transaction as TransactionType)
      : undefined,
    type: Object.keys(PropertyType as unknown as Record<string, string>).includes(type)
      ? (type as PropertyType)
      : undefined,
    city: str("city") || undefined,
    minPrice: str("minPrice") ? Number(str("minPrice")) : undefined,
    maxPrice: str("maxPrice") ? Number(str("maxPrice")) : undefined,
    bedrooms: str("bedrooms") ? Number(str("bedrooms")) : undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}): Promise<Metadata> {
  const params = parseParams(await searchParams);
  const parts = [
    params.transaction === "RENT" ? "À louer" : params.transaction === "SALE" ? "À vendre" : "Biens",
    params.city,
  ].filter(Boolean);

  return {
    title: `${parts.join(" à ")} | M. Confidential`,
    description:
      "Parcourez les biens immobiliers disponibles à la vente et à la location avec M. Confidential, agence premium à Casablanca et Dar Bouazza.",
    alternates: {
      canonical: `/biens${params.page && params.page > 1 ? `?page=${params.page}` : ""}`,
    },
  };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const raw = await searchParams;
  const params = parseParams(raw);
  const [{ items, total, page, pageCount }, cities] = await Promise.all([
    searchProperties(params),
    getDistinctCities(),
  ]);

  const buildHref = (p: number) => {
    const qs = new URLSearchParams();
    if (params.transaction) qs.set("transaction", params.transaction);
    if (params.type) qs.set("type", params.type);
    if (params.city) qs.set("city", params.city);
    if (params.minPrice) qs.set("minPrice", String(params.minPrice));
    if (params.maxPrice) qs.set("maxPrice", String(params.maxPrice));
    if (params.bedrooms) qs.set("bedrooms", String(params.bedrooms));
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `/biens?${s}` : "/biens";
  };

  return (
    <Container className="py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl">Nos biens</h1>
        <p className="mt-2 text-sm text-charcoal-soft">
          {total} bien{total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mb-10">
        <FilterBar cities={cities} current={params} />
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-charcoal-soft">
          Aucun bien ne correspond à ces critères. Essayez d’élargir votre recherche.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      )}

      <Pagination page={page} pageCount={pageCount} buildHref={buildHref} />
    </Container>
  );
}
