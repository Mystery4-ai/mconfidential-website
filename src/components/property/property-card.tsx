import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { formatPrice, formatSurface, propertyTypeLabels, transactionTypeLabels } from "@/lib/labels";
import { AvailabilityBadge } from "@/components/ui/status-badge";
import { Availability, PropertyType, TransactionType } from "@prisma/client";

export type PropertyCardData = {
  slug: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  neighborhood: string | null;
  transactionType: TransactionType;
  propertyType: PropertyType;
  availability: Availability;
  surfaceArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  coverImage?: { url: string; altText: string | null } | null;
};

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const notAvailable = property.availability !== "AVAILABLE";

  return (
    <Link
      href={`/biens/${property.slug}`}
      className="group block border border-border bg-white/30 transition-colors hover:border-charcoal"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ivory-dim">
        {property.coverImage ? (
          <Image
            src={property.coverImage.url}
            alt={property.coverImage.altText || property.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-charcoal-soft">
            Photo à venir
          </div>
        )}
        <span className="absolute left-3 top-3 bg-ivory/90 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-charcoal">
          {transactionTypeLabels[property.transactionType]}
        </span>
        {notAvailable && (
          <span className="absolute right-3 top-3">
            <AvailabilityBadge availability={property.availability} />
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-serif text-lg leading-snug text-charcoal line-clamp-2">
          {property.title}
        </p>
        <p className="mt-1 flex items-center gap-1 text-sm text-charcoal-soft">
          <MapPin size={14} strokeWidth={1.5} />
          {property.neighborhood ? `${property.neighborhood}, ` : ""}
          {property.city}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-charcoal-soft">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={15} strokeWidth={1.5} /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={15} strokeWidth={1.5} /> {property.bathrooms}
            </span>
          )}
          {property.surfaceArea != null && (
            <span className="flex items-center gap-1">
              <Ruler size={15} strokeWidth={1.5} /> {formatSurface(property.surfaceArea)}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <p className="font-serif text-xl text-charcoal">
            {formatPrice(property.price, property.currency)}
            {property.transactionType === "RENT" && (
              <span className="text-sm text-charcoal-soft"> /mois</span>
            )}
          </p>
          <p className="text-xs text-charcoal-soft">{propertyTypeLabels[property.propertyType]}</p>
        </div>
      </div>
    </Link>
  );
}
