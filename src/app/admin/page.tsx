import { requireUser } from "@/lib/auth-helpers";

export default async function AdminDashboardPage() {
  const user = await requireUser();

  return (
    <div className="p-10">
      <h1 className="font-serif text-2xl">Tableau de bord</h1>
      <p className="mt-2 text-charcoal-soft">Connecté en tant que {user.name} ({user.role})</p>
    </div>
  );
}
