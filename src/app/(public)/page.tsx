import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Compass,
  UserCheck,
  Gem,
  TrendingUp,
  Sofa,
  FileCheck,
  Lightbulb,
} from "lucide-react";
import { getFeaturedProperties, getDistinctCities } from "@/lib/properties";
import { getAgencySettings } from "@/lib/settings";
import { neighborhoodDirectory } from "@/lib/neighborhoods";
import { PropertyCard } from "@/components/property/property-card";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";
import { HomeSearchForm } from "@/components/property/home-search-form";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAgencySettings();
  return {
    title: settings.seoDefaultTitle ? { absolute: settings.seoDefaultTitle } : undefined,
    description: settings.seoDefaultDescription || undefined,
    alternates: { canonical: "/" },
  };
}

const reasons = [
  {
    icon: ShieldCheck,
    title: "Discrétion",
    description: "Confidentialité assurée à chaque étape, pour les acheteurs comme pour les vendeurs.",
  },
  {
    icon: Compass,
    title: "Expertise locale",
    description: "Une connaissance fine des quartiers et du marché immobilier à Casablanca et Dar Bouazza.",
  },
  {
    icon: UserCheck,
    title: "Accompagnement sur mesure",
    description: "Un consultant dédié qui vous suit de la première visite jusqu’à la signature.",
  },
  {
    icon: Gem,
    title: "Sélection exigeante",
    description: "Des biens choisis avec exigence, pour une offre qualitative plutôt qu’exhaustive.",
  },
];

const services = [
  {
    icon: TrendingUp,
    title: "Investissement immobilier",
    description: "Identification d’opportunités et accompagnement dans vos projets d’investissement locatif ou patrimonial.",
  },
  {
    icon: Sofa,
    title: "Home Staging",
    description: "Mise en valeur de votre bien pour en révéler tout le potentiel avant sa mise sur le marché.",
  },
  {
    icon: FileCheck,
    title: "Transactions immobilières",
    description: "Un accompagnement complet, de l’estimation à la signature, pour l’achat, la vente ou la location.",
  },
  {
    icon: Lightbulb,
    title: "Conseil",
    description: "Un regard d’expert sur votre projet immobilier, pour avancer avec des décisions éclairées.",
  },
];

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <section className="relative flex h-[92vh] min-h-[620px] items-center overflow-hidden bg-charcoal text-ivory">
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
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/25 to-charcoal/70" />

        <Container className="relative z-10 flex flex-col items-center px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ivory/80">
            Casablanca &amp; Dar Bouazza
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            {settings.heroHeadline || "Biens d’exception"}
          </h1>
          {settings.heroSubheadline && (
            <p className="mt-5 max-w-xl text-base text-ivory/85 md:text-lg">
              {settings.heroSubheadline}
            </p>
          )}

          <div className="mt-10 w-full max-w-5xl text-left">
            <HomeSearchForm cities={cities} />
          </div>
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

      <section className="pb-20">
        <Container narrow className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl">
            Une sélection exigeante, un accompagnement sur mesure
          </h2>
          <p className="mt-5 leading-relaxed text-charcoal-soft">
            Chaque bien présenté par M. Confidential répond aux mêmes critères d’exigence :
            emplacement, architecture, qualité de vie. Nos consultants vous accompagnent à chaque
            étape de votre projet, avec discrétion et disponibilité.
          </p>
        </Container>
      </section>

      <section className="border-y border-border bg-ivory-dim py-20">
        <Container>
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
            Explorer par quartier
          </p>
          <h2 className="mt-2 font-serif text-3xl">Nos quartiers</h2>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoodDirectory.map(({ city, neighborhoods }) => (
              <div key={city}>
                <p className="font-serif text-lg">{city}</p>
                <ul className="mt-3 space-y-2">
                  {neighborhoods.map((n) => (
                    <li key={n}>
                      <Link
                        href={`/biens?city=${encodeURIComponent(city)}&neighborhood=${encodeURIComponent(n)}`}
                        className="text-sm text-charcoal-soft hover:text-charcoal"
                      >
                        {n}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
            Pourquoi nous choisir
          </p>
          <h2 className="mt-2 font-serif text-3xl">L’exigence au service de votre projet</h2>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title}>
                <r.icon size={24} strokeWidth={1.5} className="text-olive" />
                <p className="mt-4 font-serif text-lg">{r.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{r.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-ivory-dim py-20">
        <Container>
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
            Nos services
          </p>
          <h2 className="mt-2 font-serif text-3xl">Un accompagnement complet</h2>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title}>
                <s.icon size={24} strokeWidth={1.5} className="text-olive" />
                <p className="mt-4 font-serif text-lg">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{s.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {settings.aboutText && (
        <section className="py-20">
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

      <section className="pb-20">
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
