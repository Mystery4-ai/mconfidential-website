import { propertyTypeLabels } from "@/lib/labels";

const budgetOptions = [
  { label: "Budget max", value: "" },
  { label: "1 000 000 DH", value: "1000000" },
  { label: "3 000 000 DH", value: "3000000" },
  { label: "5 000 000 DH", value: "5000000" },
  { label: "10 000 000 DH", value: "10000000" },
  { label: "20 000 000 DH", value: "20000000" },
];

export function HomeSearchForm({ cities }: { cities: string[] }) {
  const fieldClass =
    "w-full rounded-sm border border-border bg-ivory px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive";

  return (
    <form
      action="/biens"
      method="get"
      className="grid grid-cols-1 gap-3 border border-border bg-white/95 p-5 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-5"
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
        <label htmlFor="maxPrice" className="sr-only">Budget</label>
        <select id="maxPrice" name="maxPrice" className={fieldClass} defaultValue="">
          {budgetOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-olive"
      >
        Rechercher
      </button>
    </form>
  );
}
