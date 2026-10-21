import { requireAdmin } from "@/lib/auth-helpers";
import { ConsultantForm } from "../consultant-form";
import { createConsultant } from "../actions";

export default async function NewConsultantPage() {
  await requireAdmin();

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-2xl">Nouveau consultant</h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        Créez un compte pour un consultant ou un administrateur.
      </p>

      <div className="mt-8 max-w-xl">
        <ConsultantForm action={createConsultant} submitLabel="Créer le compte" passwordRequired />
      </div>
    </div>
  );
}
