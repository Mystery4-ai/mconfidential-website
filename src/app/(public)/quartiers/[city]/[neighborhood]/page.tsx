import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { School, Trees, Utensils } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PropertyCard } from "@/components/property/property-card";
import { NeighborhoodMap } from "@/components/property/neighborhood-map";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { searchProperties } from "@/lib/properties";
import { neighborhoodDirectory } from "@/lib/neighborhoods";
import { neighborhoodDescriptions } from "@/lib/neighborhood-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mconfidential.ma";

function resolve(cityEncoded: string, neighborhoodEncoded: string) {
  const cityTarget = decodeURIComponent(cityEncoded).toLowerCase();
  const neighborhoodTarget = decodeURIComponent(neighborhoodEncoded).toLowerCase();

  for (const group of neighborhoodDirectory) {
    if (group.city.toLowerCase() !== cityTarget) continue;
    const neighborhood = group.neighborhoods.find((n) => n.toLowerCase() === neighborhoodTarget);
    if (neighborhood) return { city: group.city, neighborhood };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; neighborhood: string }>;
}): Promise<Metadata> {
  const { city: cityEncoded, neighborhood: neighborhoodEncoded } = await params;
  const resolved = resolve(cityEncoded, neighborhoodEncoded);
  if (!resolved) return {};
  const { city, neighborhood } = resolved;

  const title = `Villa et appartement à vendre et à louer à ${neighborhood}, ${city}`;
  const description = `Biens à vendre et à louer à ${neighborhood} (${city}) sélectionnés par M. Confidential : villas, appartements, visites sur mesure et accompagnement personnalisé.`;
  const canonical = `/quartiers/${encodeURIComponent(city)}/${encodeURIComponent(neighborhood)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: "website" },
  };
}

export default async function NeighborhoodPage({
  params,
}: {
  params: Promise<{ city: string; neighborhood: string }>;
}) {
  const { city: cityEncoded, neighborhood: neighborhoodEncoded } = await params;
  const resolved = resolve(cityEncoded, neighborhoodEncoded);
  if (!resolved) notFound();
  const { city, neighborhood } = resolved;

  const [{ items, total }, profile] = await Promise.all([
    searchProperties({ city, neighborhood, page: 1 }),
    Promise.resolve(neighborhoodDescriptions[neighborhood] ?? null),
  ]);

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Biens", href: "/biens" },
    { label: city, href: `/villes/${encodeURIComponent(city)}` },
    { label: neighborhood },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems, SITE_URL)) }}
      />

      <Container className="py-16">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="mt-4 font-serif text-3xl md:text-4xl">
          Villa et appartement à {neighborhood}, {city}
        </h1>
        <p className="mt-3 max-w-2xl text-charcoal-soft">
          M. Confidential sélectionne des biens à vendre et à louer à {neighborhood}, avec un
          accompagnement personnalisé de la recherche jusqu’à la signature. {total} bien
          {total > 1 ? "s" : ""} actuellement disponible{total > 1 ? "s" : ""}.
        </p>

        {profile && (
          <div className="mt-10 border-y border-border py-8">
            <h2 className="font-serif text-xl">Le quartier — {neighborhood}</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-charcoal-soft">{profile.story}</p>

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex gap-2.5">
                <School size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                    Écoles
                  </dt>
                  <dd className="mt-1 text-sm text-charcoal-soft">{profile.schools}</dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Trees size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                    Espaces verts
                  </dt>
                  <dd className="mt-1 text-sm text-charcoal-soft">{profile.parks}</dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Utensils size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                    Restaurants
                  </dt>
                  <dd className="mt-1 text-sm text-charcoal-soft">{profile.dining}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 max-w-xl">
              <NeighborhoodMap city={city} neighborhood={neighborhood} />
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="font-serif text-xl">
            Biens disponibles à {neighborhood}
          </h2>

          {items.length === 0 ? (
            <p className="mt-6 text-charcoal-soft">
              Aucun bien publié à {neighborhood} pour le moment. Contactez-nous pour être informé
              des nouvelles opportunités dans ce quartier, ou consultez les autres biens à{" "}
              {city}.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
