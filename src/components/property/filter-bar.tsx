import { propertyTypeLabels } from "@/lib/labels";
import { PropertySearchParams } from "@/lib/properties";

const fieldClass =
  "w-full rounded-sm border border-border bg-ivory px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive";

export function FilterBar({
  cities,
  current,
}: {
  cities: string[];
  current: PropertySearchParams;
}) {
  return (
    <details className="border border-border bg-white/40 lg:[&>summary]:hidden lg:[&>form]:!block">
      <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-charcoal lg:hidden">
        Filtrer les biens
      </summary>
      <form
        action="/biens"
        method="get"
        className="grid grid-cols-2 gap-3 p-5 pt-0 lg:grid-cols-6 lg:pt-5"
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

        <button
          type="submit"
          className="col-span-2 bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-olive lg:col-span-6"
        >
          Appliquer les filtres
        </button>
      </form>
    </details>
  );
}
