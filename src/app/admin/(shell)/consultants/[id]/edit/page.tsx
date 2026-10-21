import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { ConsultantForm } from "../../consultant-form";
import { updateConsultant, toggleConsultantActive } from "../../actions";
import { Button } from "@/components/ui/button";

export default async function EditConsultantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const user = await db.user.findUnique({ where: { id } });
  if (!user) notFound();

  const boundUpdate = updateConsultant.bind(null, user.id);
  const boundToggle = toggleConsultantActive.bind(null, user.id);

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl">{user.name}</h1>
        <form action={boundToggle}>
          <Button type="submit" variant="secondary" size="sm">
            {user.active ? "Désactiver le compte" : "Réactiver le compte"}
          </Button>
        </form>
      </div>

      <div className="mt-8 max-w-xl">
        <ConsultantForm
          action={boundUpdate}
          initialValues={user}
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </div>
  );
}
