import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { NewPropertyClient } from "./new-property-client";
import { ImportFromUrl } from "./import-from-url";

// Importing re-hosts up to 30 photos from the source listing, one fetch +
// upload per photo — well past the platform's default 10s function timeout.
export const maxDuration = 60;

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
        Renseignez les informations et ajoutez des photos ci-dessous : le bien est créé en
        brouillon avec tout en une seule fois. Vous pourrez le compléter ensuite sur sa fiche.
      </p>

      <div className="mt-8 max-w-3xl space-y-8">
        <ImportFromUrl />

        <div className="flex items-center gap-3 text-xs text-charcoal-soft">
          <div className="h-px flex-1 bg-border" /> ou créez-le manuellement{" "}
          <div className="h-px flex-1 bg-border" />
        </div>

        <NewPropertyClient isAdmin={user.role === "ADMIN"} consultants={consultants} />
      </div>
    </div>
  );
}
