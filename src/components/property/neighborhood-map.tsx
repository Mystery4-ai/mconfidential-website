/**
 * Shows the general area only (neighborhood + city), never the exact
 * address — consistent with a discretion-first brand. Uses Google Maps'
 * no-API-key embed endpoint.
 */
export function NeighborhoodMap({ city, neighborhood }: { city: string; neighborhood: string | null }) {
  const query = encodeURIComponent([neighborhood, city, "Maroc"].filter(Boolean).join(", "));

  return (
    <div className="overflow-hidden border border-border">
      <iframe
        src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1s${query}`}
        title={`Localisation approximative — ${neighborhood ? `${neighborhood}, ` : ""}${city}`}
        className="h-64 w-full"
        loading="lazy"
      />
    </div>
  );
}
