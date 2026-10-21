import { requireAdmin } from "@/lib/auth-helpers";
import { getAgencySettings } from "@/lib/settings";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getAgencySettings();

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-2xl">Paramètres</h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        Ces réglages contrôlent le contenu affiché sur le site public.
      </p>

      <div className="mt-8 max-w-2xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
