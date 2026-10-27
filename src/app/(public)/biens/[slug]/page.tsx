import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Ruler, Trees, Car, Calendar, MapPin, Phone, MessageCircle } from "lucide-react";
import { getPropertyBySlug, getPropertyBySlugForPreview, getSimilarProperties } from "@/lib/properties";
import { getAgencySettings } from "@/lib/settings";
import { formatPrice, formatSurface, propertyTypeLabels, transactionTypeLabels } from "@/lib/labels";
import { buildPropertyWhatsAppLink } from "@/lib/whatsapp";
import { neighborhoodDescriptions } from "@/lib/neighborhood-content";
import { Container } from "@/components/layout/container";
import { Gallery } from "@/components/property/gallery";
import { PropertyCard } from "@/components/property/property-card";
import { VisitForm } from "@/components/property/visit-form";
import { SchedulingEmbed } from "@/components/property/scheduling-embed";
import { MobileContactBar } from "@/components/property/mobile-contact-bar";
import { ShareButton } from "@/components/property/share-button";
import { NeighborhoodMap } from "@/components/property/neighborhood-map";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { AvailabilityBadge, PropertyStatusBadge } from "@/components/ui/status-badge";
import { auth } from "@/auth";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mconfidential.ma";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;

  if (preview === "1") {
    return { robots: { index: false, follow: false } };
  }

  const property = await getPropertyBySlug(slug);
  if (!property) return {};

  const description = property.description.slice(0, 155).trim();

  return {
    title: property.title,
    description,
    alternates: { canonical: `/biens/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      images: property.images[0] ? [property.images[0].url] : undefined,
      type: "website",
    },
  };
}

export default async function PropertyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;

  let property;
  let isPreview = false;

  if (preview === "1") {
    const session = await auth();
    if (!session?.user) notFound();
    const candidate = await getPropertyBySlugForPreview(slug);
    if (!candidate) notFound();
    const owns = session.user.role === "ADMIN" || candidate.consultantId === session.user.id;
    if (!owns) notFound();
    property = candidate;
    isPreview = true;
  } else {
    property = await getPropertyBySlug(slug);
    if (!property) notFound();
  }

  const [similar, settings] = await Promise.all([
    getSimilarProperties(property),
    getAgencySettings(),
  ]);

  const specs = [
    property.bedrooms != null && { icon: BedDouble, label: `${property.bedrooms} chambres` },
    property.bathrooms != null && { icon: Bath, label: `${property.bathrooms} salles de bain` },
    property.surfaceArea != null && { icon: Ruler, label: formatSurface(property.surfaceArea) },
    property.landArea != null && { icon: Trees, label: `${formatSurface(property.landArea)} de terrain` },
    property.parkingSpaces != null && { icon: Car, label: `${property.parkingSpaces} places parking` },
    property.yearBuilt != null && { icon: Calendar, label: `Construit en ${property.yearBuilt}` },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[];

  const features = Array.isArray(property.features) ? (property.features as string[]) : [];

  const effectivePhone = property.consultant.phone || settings.phone;
  const effectiveWhatsapp = property.consultant.whatsapp || settings.whatsapp;
  const whatsappHref = effectiveWhatsapp
    ? buildPropertyWhatsAppLink(effectiveWhatsapp, property)
    : null;
  const effectiveSchedulingUrl = property.consultant.schedulingUrl || settings.schedulingUrl;

  const neighborhoodText = property.neighborhood ? neighborhoodDescriptions[property.neighborhood] : null;

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Biens", href: "/biens" },
    { label: property.city, href: `/villes/${encodeURIComponent(property.city)}` },
    { label: property.title },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description.slice(0, 500),
    url: `${SITE_URL}/biens/${property.slug}`,
    datePosted: property.publishedAt?.toISOString(),
    image: property.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability:
        property.availability === "AVAILABLE"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    about: {
      "@type": property.propertyType === "APARTMENT" ? "Apartment" : "House",
      numberOfRooms: property.bedrooms ?? undefined,
      floorSize: property.surfaceArea
        ? { "@type": "QuantitativeValue", value: property.surfaceArea, unitCode: "MTK" }
        : undefined,
      address: {
        "@type": "PostalAddress",
        addressLocality: property.neighborhood || property.city,
        addressRegion: property.city,
        addressCountry: "MA",
      },
    },
  };

  return (
    <>
      {isPreview && (
        <div className="sticky top-[73px] z-20 flex items-center justify-center gap-3 bg-status-pending px-4 py-2 text-sm text-ivory">
          <span>Aperçu privé — ce bien n’est pas visible publiquement.</span>
          <PropertyStatusBadge status={property.status} />
        </div>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems, SITE_URL)) }}
      />

      <Container className="pt-6">
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <Container className="py-6 pb-28 lg:pb-10">
        <Gallery images={property.images} title={property.title} />

        <div className="mt-10 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-charcoal-soft">
              <span>{transactionTypeLabels[property.transactionType]}</span>
              <span>·</span>
              <span>{propertyTypeLabels[property.propertyType]}</span>
              <span>·</span>
              <span>Réf. {property.reference}</span>
              {property.availability !== "AVAILABLE" && (
                <AvailabilityBadge availability={property.availability} />
              )}
            </div>

            <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{property.title}</h1>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-charcoal-soft">
                <MapPin size={16} strokeWidth={1.5} />
                {property.neighborhood ? `${property.neighborhood}, ` : ""}
                {property.city}
              </p>
              <ShareButton title={property.title} url={`${SITE_URL}/biens/${property.slug}`} />
            </div>

            <p className="mt-6 font-serif text-3xl text-charcoal">
              {formatPrice(property.price, property.currency)}
              {property.transactionType === "RENT" && (
                <span className="text-base text-charcoal-soft"> /mois</span>
              )}
            </p>

            {specs.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-5">
                {specs.map((spec, i) => (
                  <span key={i} className="flex items-center gap-2 text-sm text-charcoal-soft">
                    <spec.icon size={17} strokeWidth={1.5} />
                    {spec.label}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-serif text-xl">Description</h2>
              <div className="mt-3 space-y-4 leading-relaxed text-charcoal-soft">
                {property.description.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {neighborhoodText && (
              <div className="mt-8">
                <h2 className="font-serif text-xl">
                  Le quartier {property.neighborhood ? `— ${property.neighborhood}` : ""}
                </h2>
                <p className="mt-3 leading-relaxed text-charcoal-soft">{neighborhoodText}</p>
                <div className="mt-4">
                  <NeighborhoodMap city={property.city} neighborhood={property.neighborhood} />
                </div>
              </div>
            )}

            {features.length > 0 && (
              <div className="mt-8">
                <h2 className="font-serif text-xl">Caractéristiques</h2>
                <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-charcoal-soft sm:grid-cols-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-olive" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-white/40 p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                Consultant
              </p>
              <p className="mt-2 font-serif text-lg">{property.consultant.name}</p>
              {property.consultant.title && (
                <p className="text-sm text-charcoal-soft">{property.consultant.title}</p>
              )}

              <div className="mt-5 hidden flex-col gap-2 lg:flex">
                {effectivePhone && (
                  <a
                    href={`tel:${effectivePhone}`}
                    className="flex items-center justify-center gap-2 bg-charcoal px-5 py-3 text-sm font-medium text-ivory transition-colors hover:bg-olive"
                  >
                    <Phone size={16} strokeWidth={1.5} /> {effectivePhone}
                  </a>
                )}
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 border border-charcoal px-5 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
                  >
                    <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
                  </a>
                )}
                {!effectivePhone && !whatsappHref && (
                  <p className="text-sm text-charcoal-soft">
                    Coordonnées à renseigner par le consultant dans son profil.
                  </p>
                )}
              </div>
            </div>

            <div className={effectiveSchedulingUrl ? "" : "border border-border bg-white/40 p-6"}>
              {!effectiveSchedulingUrl && <p className="font-serif text-lg">Planifier une visite</p>}
              <div className={effectiveSchedulingUrl ? "" : "mt-4"}>
                {effectiveSchedulingUrl ? (
                  <SchedulingEmbed
                    url={effectiveSchedulingUrl}
                    title={property.title}
                    reference={property.reference}
                  />
                ) : (
                  <VisitForm propertyId={property.id} />
                )}
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-2xl">Biens similaires</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.slug} property={p} />
              ))}
            </div>
          </div>
        )}
      </Container>

      <MobileContactBar phone={effectivePhone} whatsappHref={whatsappHref} />
    </>
  );
}
