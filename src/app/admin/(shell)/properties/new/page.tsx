import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { PropertyForm } from "../property-form";
import { createProperty } from "../actions";

export default async function NewPropertyPage() {
  const user = await requireUser();
  const consultants =
    user.role === "ADMIN"
      ? await db.user.findMany({
          where: { active: true },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : undefined;

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-2xl">Nouveau bien</h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        Le bien sera créé en brouillon. Vous pourrez ajouter des photos et le soumettre ensuite.
      </p>

      <div className="mt-8 max-w-3xl">
        <PropertyForm
          action={createProperty}
          isAdmin={user.role === "ADMIN"}
          consultants={consultants}
          submitLabel="Créer le brouillon"
        />
      </div>
    </div>
  );
}
