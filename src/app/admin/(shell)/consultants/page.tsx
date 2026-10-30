import Link from "next/link";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { LinkButton } from "@/components/ui/button";
import { InviteForm } from "./invite-form";
import { RevokeInviteButton } from "./revoke-invite-button";

export default async function ConsultantsPage() {
  await requireAdmin();

  const [users, invites] = await Promise.all([
    db.user.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { properties: true } } },
    }),
    db.invite.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl">Consultants</h1>
        <LinkButton href="/admin/consultants/new">Nouveau consultant</LinkButton>
      </div>

      <div className="mt-6 max-w-xl">
        <InviteForm />
      </div>

      {invites.length > 0 && (
        <div className="mt-6 overflow-x-auto border border-border bg-white/40">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-charcoal-soft">
                <th className="p-3 font-medium">Invitations en attente</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Rôle</th>
                <th className="p-3 font-medium">Expire le</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-charcoal">{inv.name}</td>
                  <td className="p-3 text-charcoal-soft">{inv.email}</td>
                  <td className="p-3 text-charcoal-soft">
                    {inv.role === "ADMIN" ? "Administrateur" : "Consultant"}
                  </td>
                  <td className="p-3 text-charcoal-soft">
                    {inv.expiresAt.toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3 text-right">
                    <RevokeInviteButton inviteId={inv.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 overflow-x-auto border border-border bg-white/40">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-charcoal-soft">
              <th className="p-3 font-medium">Nom</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Rôle</th>
              <th className="p-3 font-medium">Biens</th>
              <th className="p-3 font-medium">Statut</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3 text-charcoal">{u.name}</td>
                <td className="p-3 text-charcoal-soft">{u.email}</td>
                <td className="p-3 text-charcoal-soft">
                  {u.role === "ADMIN" ? "Administrateur" : "Consultant"}
                </td>
                <td className="p-3 text-charcoal-soft">{u._count.properties}</td>
                <td className="p-3">
                  <span
                    className={`text-xs font-medium ${u.active ? "text-status-published" : "text-status-sold"}`}
                  >
                    {u.active ? "Actif" : "Désactivé"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/consultants/${u.id}/edit`}
                    className="text-xs text-charcoal underline underline-offset-4"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
