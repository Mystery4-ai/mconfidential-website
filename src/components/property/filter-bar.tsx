"use client";

import { useRouter } from "next/navigation";
import { propertyTypeLabels } from "@/lib/labels";
import { neighborhoodDirectory } from "@/lib/neighborhoods";
import { PropertySearchParams, AMENITY_LABELS, AmenityKey } from "@/lib/properties";

const fieldClass =
  "w-full rounded-sm border border-border bg-ivory px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive";

export function FilterBar({
  cities,
  current,
}: {
  cities: string[];
  current: PropertySearchParams;
}) {
  const router = useRouter();

  // A plain HTML form submits every field, even empty ones, producing URLs
  // like /biens?transaction=&type=&city=&...&amenities=pool — correct but
  // unshareable for a site whose main lead channel is pasting links into
  // WhatsApp. Builds the same navigation with only the fields actually set,
  // falling back to the native GET submit (still correct, just untidy) if
  // JS doesn't run.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const qs = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string" || value.trim() === "") continue;
      if (key === "sort" && value === "recent") continue;
      qs.append(key, value);
    }
    const s = qs.toString();
    router.push(s ? `/biens?${s}` : "/biens");
  }

  return (
    <details className="border border-border bg-white/40 lg:[&>summary]:hidden lg:[&>form]:!block">
      <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-charcoal lg:hidden">
        Filtrer les biens
      </summary>
      <form
        action="/biens"
        method="get"
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-3 p-5 pt-0 lg:grid-cols-4 lg:pt-5"
      >
        <select name="transaction" defaultValue={current.transaction ?? ""} className={fieldClass}>
          <option value="">Acheter ou louer</option>
          <option value="SALE">Acheter</option>
          <option value="RENT">Louer</option>
        </select>

        <select name="type" defaultValue={current.type ?? ""} className={fieldClass}>
          <option value="">Tous types</option>
          {Object.entries(propertyTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select name="city" defaultValue={current.city ?? ""} className={fieldClass}>
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select name="neighborhood" defaultValue={current.neighborhood ?? ""} className={fieldClass}>
          <option value="">Tous les quartiers</option>
          {neighborhoodDirectory.map((group) => (
            <optgroup key={group.city} label={group.city}>
              {group.neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select name="bedrooms" defaultValue={current.bedrooms?.toString() ?? ""} className={fieldClass}>
          <option value="">Chambres (min.)</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Prix min."
          defaultValue={current.minPrice ?? ""}
          className={fieldClass}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Prix max."
          defaultValue={current.maxPrice ?? ""}
          className={fieldClass}
        />

        <input
          type="number"
          name="minSurface"
          placeholder="Surface min. (m²)"
          defaultValue={current.minSurface ?? ""}
          className={fieldClass}
        />
        <input
          type="number"
          name="maxSurface"
          placeholder="Surface max. (m²)"
          defaultValue={current.maxSurface ?? ""}
          className={fieldClass}
        />

        <select name="sort" defaultValue={current.sort ?? "recent"} className={fieldClass}>
          <option value="recent">Plus récents</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>

        <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 py-1 lg:col-span-4">
          {(Object.entries(AMENITY_LABELS) as [AmenityKey, string][]).map(([value, label]) => (
            <label key={value} className="flex items-center gap-1.5 text-sm text-charcoal">
              <input
                type="checkbox"
                name="amenities"
                value={value}
                defaultChecked={current.amenities?.includes(value)}
                className="accent-olive"
              />
              {label}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="col-span-2 bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-olive lg:col-span-4"
        >
          Appliquer les filtres
        </button>
      </form>
    </details>
  );
}
