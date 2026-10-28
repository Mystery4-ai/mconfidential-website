import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PropertyCard } from "@/components/property/property-card";
import { searchProperties, getDistinctCities } from "@/lib/properties";

async function resolveCity(encoded: string) {
  const target = decodeURIComponent(encoded);
  const cities = await getDistinctCities();
  return cities.find((c) => c.toLowerCase() === target.toLowerCase()) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: encoded } = await params;
  const city = await resolveCity(encoded);
  if (!city) return {};

  return {
    title: `Immobilier à ${city}`,
    description: `Biens à vendre et à louer à ${city} sélectionnés par M. Confidential, agence immobilière premium.`,
    alternates: { canonical: `/villes/${encodeURIComponent(city)}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: encoded } = await params;
  const city = await resolveCity(encoded);
  if (!city) notFound();

  const { items, total } = await searchProperties({ city, page: 1 });

  return (
    <Container className="py-16">
      <h1 className="font-serif text-3xl">Immobilier à {city}</h1>
      <p className="mt-3 max-w-2xl text-charcoal-soft">
        M. Confidential sélectionne des biens à vendre et à louer à {city}, avec un accompagnement
        personnalisé de la recherche jusqu’à la signature. {total} bien{total > 1 ? "s" : ""}{" "}
        actuellement disponible{total > 1 ? "s" : ""}.
      </p>

      {items.length === 0 ? (
        <p className="mt-10 text-charcoal-soft">
          Aucun bien publié à {city} pour le moment. Revenez bientôt ou contactez-nous pour être
          informé des nouvelles opportunités.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      )}
    </Container>
  );
}
