import {
  Availability,
  InquiryStatus,
  InquiryType,
  PropertyStatus,
  PropertyType,
  TransactionType,
} from "@prisma/client";

export const transactionTypeLabels: Record<TransactionType, string> = {
  SALE: "À vendre",
  RENT: "À louer",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  VILLA: "Villa",
  RIAD: "Riad",
  LAND: "Terrain",
  OFFICE: "Bureaux",
  COMMERCIAL: "Commerce",
  BUILDING: "Immeuble",
};

export const propertyStatusLabels: Record<PropertyStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_APPROVAL: "En attente d’approbation",
  PUBLISHED: "Publié",
  UNPUBLISHED: "Dépublié",
  ARCHIVED: "Archivé",
};

export const availabilityLabels: Record<Availability, string> = {
  AVAILABLE: "Disponible",
  UNDER_OFFER: "Sous offre",
  SOLD: "Vendu",
  RENTED: "Loué",
};

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  VISIT_PLANNED: "Visite planifiée",
  COMPLETED: "Terminé",
  CLOSED: "Clôturé",
  LOST: "Perdu",
};

export const inquiryTypeLabels: Record<InquiryType, string> = {
  CONTACT: "Contact",
  VISIT: "Demande de visite",
  VALUATION: "Estimation",
};

export function formatPrice(price: number, currency: string = "MAD") {
  const display = currency === "MAD" ? "DH" : currency;
  return `${new Intl.NumberFormat("fr-FR").format(price)} ${display}`;
}

export function formatSurface(sqm: number | null | undefined) {
  if (!sqm) return null;
  return `${new Intl.NumberFormat("fr-FR").format(sqm)} m²`;
}
