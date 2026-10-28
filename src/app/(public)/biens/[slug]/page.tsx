import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Ruler, Trees, Car, Calendar, MapPin, Phone, School, Utensils, BadgeCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import {
  getPropertyBySlug,
  getPropertyBySlugForPreview,
  getSimilarProperties,
  getPublishedCountForConsultant,
} from "@/lib/properties";
import { getAgencySettings } from "@/lib/settings";
import { getUpcomingSlotsForConsultant } from "@/lib/availability";
import { formatPrice, formatSurface, propertyTypeLabels, transactionTypeLabels } from "@/lib/labels";
import { buildPropertyWhatsAppLink } from "@/lib/whatsapp";
import { neighborhoodDescriptions } from "@/lib/neighborhood-content";
import { Container } from "@/components/layout/container";
import { Gallery } from "@/components/property/gallery";
import { PropertyCard } from "@/components/property/property-card";
import { VisitForm } from "@/components/property/visit-form";
import { SlotPicker } from "@/components/property/slot-picker";
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

  const [similar, settings, availableSlots, consultantListingCount] = await Promise.all([
    getSimilarProperties(property),
    getAgencySettings(),
    getUpcomingSlotsForConsultant(property.consultant.id),
    getPublishedCountForConsultant(property.consultant.id),
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

  const neighborhoodProfile = property.neighborhood ? neighborhoodDescriptions[property.neighborhood] : null;

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

            {neighborhoodProfile && (
              <div className="mt-8">
                <h2 className="font-serif text-xl">
                  Le quartier {property.neighborhood ? `— ${property.neighborhood}` : ""}
                </h2>
                <p className="mt-3 leading-relaxed text-charcoal-soft">{neighborhoodProfile.story}</p>

                <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex gap-2.5">
                    <School size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" />
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                        Écoles
                      </dt>
                      <dd className="mt-1 text-sm text-charcoal-soft">{neighborhoodProfile.schools}</dd>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <Trees size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" />
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                        Espaces verts
                      </dt>
                      <dd className="mt-1 text-sm text-charcoal-soft">{neighborhoodProfile.parks}</dd>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <Utensils size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" />
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                        Restaurants
                      </dt>
                      <dd className="mt-1 text-sm text-charcoal-soft">{neighborhoodProfile.dining}</dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-5">
                  <NeighborhoodMap city={property.city} neighborhood={property.neighborhood} />
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-sm border border-border bg-white/40 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar src={property.consultant.photoUrl} name={property.consultant.name} size={56} />
                <div>
                  <p className="font-serif text-lg leading-tight">{property.consultant.name}</p>
                  {property.consultant.title && (
                    <p className="text-sm text-charcoal-soft">{property.consultant.title}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-charcoal-soft">
                <BadgeCheck size={15} strokeWidth={1.5} className="shrink-0 text-olive" />
                <span>
                  Consultant vérifié
                  {consultantListingCount > 0 &&
                    ` · ${consultantListingCount} bien${consultantListingCount > 1 ? "s" : ""} en exclusivité`}
                </span>
              </div>

              <div className="mt-4 hidden grid-cols-2 gap-2 lg:grid">
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <WhatsAppIcon size={18} /> WhatsApp
                  </a>
                )}
                {effectivePhone && (
                  <a
                    href={`tel:${effectivePhone}`}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-sm border border-charcoal px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-ivory",
                      !whatsappHref && "col-span-2"
                    )}
                  >
                    <Phone size={16} strokeWidth={1.5} /> Appeler
                  </a>
                )}
                {!effectivePhone && !whatsappHref && (
                  <p className="col-span-2 text-sm text-charcoal-soft">
                    Coordonnées à renseigner par le consultant dans son profil.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-sm border border-border bg-white/40 p-6 shadow-sm">
              <p className="font-serif text-lg">Planifier une visite express</p>
              <div className="mt-4">
                {availableSlots.length > 0 ? (
                  <SlotPicker
                    propertyId={property.id}
                    slots={availableSlots.map((s) => ({ id: s.id, date: s.date, startTime: s.startTime }))}
                  />
                ) : effectiveSchedulingUrl ? (
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
