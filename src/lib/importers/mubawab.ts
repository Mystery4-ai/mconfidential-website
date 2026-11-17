type MubawabListing = {
  title: string;
  description: string;
  price: number;
  transactionType: "SALE" | "RENT";
  propertyType: "APARTMENT" | "HOUSE" | "VILLA" | "RIAD" | "LAND" | "OFFICE" | "COMMERCIAL" | "BUILDING";
  city: string;
  neighborhood: string | null;
  surfaceArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  sellerName: string | null;
};

function mapPropertyType(raw: unknown): MubawabListing["propertyType"] {
  const t = String(raw || "").toLowerCase();
  if (t.includes("villa")) return "VILLA";
  if (t.includes("house") || t.includes("maison")) return "HOUSE";
  if (t.includes("riad")) return "RIAD";
  if (t.includes("land") || t.includes("terrain")) return "LAND";
  if (t.includes("office") || t.includes("bureau")) return "OFFICE";
  if (t.includes("commercial") || t.includes("commerce") || t.includes("shop")) return "COMMERCIAL";
  if (t.includes("building") || t.includes("immeuble")) return "BUILDING";
  return "APARTMENT";
}

// Mubawab listing pages embed the full listing (title, description, price,
// address, room counts, photo list) as a single schema.org JSON-LD block —
// no separate API call or DOM-scraping needed, and it's far less fragile
// than parsing the surrounding HTML/CSS, which can change at any time.
export function parseMubawabListing(html: string): MubawabListing | null {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) return null;

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(match[1]);
  } catch {
    return null;
  }

  const offer = data.offers as Record<string, unknown> | undefined;
  const item = offer?.itemOffered as Record<string, unknown> | undefined;
  const address = item?.address as Record<string, unknown> | undefined;
  const containedInPlace = item?.containedInPlace as Record<string, unknown> | undefined;
  const floorSize = item?.floorSize as Record<string, unknown> | undefined;
  const seller = offer?.seller as Record<string, unknown> | undefined;
  const images = Array.isArray(data.image) ? (data.image as unknown[]).filter((u): u is string => typeof u === "string") : [];

  const title = typeof data.name === "string" ? data.name.trim() : "";
  const price = Math.round(Number(offer?.price) || 0);
  if (!title || !price) return null;

  const businessFunction = String(offer?.businessFunction || "");

  return {
    title: title.slice(0, 200),
    description: typeof data.description === "string" ? data.description : "",
    price,
    transactionType: businessFunction.includes("LeaseOut") ? "RENT" : "SALE",
    propertyType: mapPropertyType(item?.["@type"]),
    city: typeof address?.addressLocality === "string" ? address.addressLocality : "Casablanca",
    neighborhood: typeof containedInPlace?.name === "string" ? containedInPlace.name : null,
    surfaceArea: floorSize?.value != null ? Math.round(Number(floorSize.value)) : undefined,
    bedrooms: item?.numberOfBedrooms != null ? Math.round(Number(item.numberOfBedrooms)) : undefined,
    bathrooms: item?.numberOfBathroomsTotal != null ? Math.round(Number(item.numberOfBathroomsTotal)) : undefined,
    images,
    sellerName: typeof seller?.name === "string" ? seller.name : null,
  };
}
