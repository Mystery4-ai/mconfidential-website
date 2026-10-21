import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getFeaturedProperties, getDistinctCities } from "@/lib/properties";
import { getAgencySettings } from "@/lib/settings";
import { PropertyCard } from "@/components/property/property-card";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";
import { HomeSearchForm } from "@/components/property/home-search-form";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [settings, featured, cities] = await Promise.all([
    getAgencySettings(),
    getFeaturedProperties(6),
    getDistinctCities(),
  ]);

  const heroImage = featured[0]?.coverImage;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.agencyName,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://mconfidential.ma",
    areaServed: "Casablanca, Maroc",
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.address ? { address: { "@type": "PostalAddress", streetAddress: settings.address } } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-charcoal text-ivory">
        {heroImage && (
          <Image
            src={heroImage.url}
            alt={heroImage.altText || "Bien d’exception M. Confidential"}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

        <Container className="relative z-10 pb-16 pt-32">
          <h1 className="max-w-2xl font-serif text-4xl leading-tight md:text-6xl">
            {settings.heroHeadline || "Biens d’exception"}
          </h1>
          {settings.heroSubheadline && (
            <p className="mt-5 max-w-xl text-base text-ivory/85 md:text-lg">
              {settings.heroSubheadline}
            </p>
          )}
        </Container>
      </section>

      <section className="relative z-20 -mt-10 md:-mt-14">
        <Container>
          <HomeSearchForm cities={cities} />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                À l’affiche
              </p>
              <h2 className="mt-2 font-serif text-3xl">Sélection de biens</h2>
            </div>
            <Link
              href="/biens"
              className="hidden text-sm text-charcoal underline underline-offset-4 md:block"
            >
              Voir tous les biens
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="text-charcoal-soft">
              Aucun bien publié pour le moment. Ajoutez-en depuis le backoffice.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <LinkButton href="/biens" variant="secondary">
              Voir tous les biens
            </LinkButton>
          </div>
        </Container>
      </section>

      {settings.aboutText && (
        <section className="border-y border-border bg-ivory-dim py-20">
          <Container narrow className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
              L’agence
            </p>
            <h2 className="mt-2 font-serif text-3xl">{settings.agencyName}</h2>
            <p className="mt-6 text-balance leading-relaxed text-charcoal-soft">
              {settings.aboutText.length > 420
                ? settings.aboutText.slice(0, 420).trimEnd() + "…"
                : settings.aboutText}
            </p>
            <div className="mt-8">
              <LinkButton href="/agence" variant="secondary">
                Découvrir l’agence
              </LinkButton>
            </div>
          </Container>
        </section>
      )}

      <section className="py-20">
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
              Vendre ou louer
            </p>
            <h2 className="mt-2 font-serif text-3xl">Estimez votre bien</h2>
            <p className="mt-4 max-w-md leading-relaxed text-charcoal-soft">
              Confiez-nous votre projet : nos consultants réalisent une estimation précise et vous
              accompagnent jusqu’à la signature.
            </p>
            <div className="mt-6">
              <LinkButton href="/estimation">Demander une estimation</LinkButton>
            </div>
          </div>
          <div className="border border-border bg-ivory-dim p-8">
            <p className="font-serif text-xl">Un projet à nous confier ?</p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
              Notre équipe vous répond rapidement pour échanger sur votre recherche ou votre bien à
              vendre.
            </p>
            <div className="mt-5">
              <LinkButton href="/contact" variant="secondary">
                Nous contacter
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
