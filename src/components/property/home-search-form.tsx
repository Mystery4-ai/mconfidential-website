import { propertyTypeLabels } from "@/lib/labels";
import { neighborhoodDirectory } from "@/lib/neighborhoods";
import { BudgetFilter } from "./budget-filter";

export function HomeSearchForm({ cities }: { cities: string[] }) {
  const fieldClass =
    "w-full rounded-sm border border-border bg-ivory px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive";

  return (
    <form
      action="/biens"
      method="get"
      className="grid grid-cols-1 gap-3 border border-border bg-white/95 p-5 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-3"
    >
      <div>
        <label htmlFor="transaction" className="sr-only">Transaction</label>
        <select id="transaction" name="transaction" className={fieldClass} defaultValue="">
          <option value="">Acheter ou louer</option>
          <option value="SALE">Acheter</option>
          <option value="RENT">Louer</option>
        </select>
      </div>

      <div>
        <label htmlFor="type" className="sr-only">Type de bien</label>
        <select id="type" name="type" className={fieldClass} defaultValue="">
          <option value="">Tous types</option>
          {Object.entries(propertyTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="sr-only">Ville</label>
        <select id="city" name="city" className={fieldClass} defaultValue="">
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="neighborhood" className="sr-only">Quartier</label>
        <select id="neighborhood" name="neighborhood" className={fieldClass} defaultValue="">
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
      </div>

      <BudgetFilter />

      <button
        type="submit"
        className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-olive"
      >
        Rechercher
      </button>
    </form>
  );
}
