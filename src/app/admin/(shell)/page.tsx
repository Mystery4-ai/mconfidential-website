import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { getDashboardStats } from "@/lib/dashboard";
import { InquiryStatusBadge } from "@/components/ui/status-badge";
import { inquiryTypeLabels } from "@/lib/labels";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const stats = await getDashboardStats(user);

  const cards = [
    { label: "Biens au total", value: stats.total },
    { label: "Publiés", value: stats.published },
    { label: "Brouillons", value: stats.draft },
    { label: "En attente d’approbation", value: stats.pending },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-2xl">Tableau de bord</h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        Bienvenue, {(user.name ?? "").split(" ")[0]}.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-border bg-white/40 p-5">
            <p className="font-serif text-3xl text-charcoal">{c.value}</p>
            <p className="mt-1 text-xs text-charcoal-soft">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg">Demandes récentes</h2>
            <Link href="/admin/inquiries" className="text-xs text-charcoal-soft underline underline-offset-4">
              Tout voir
            </Link>
          </div>
          <div className="mt-4 border border-border bg-white/40">
            {stats.recentInquiries.length === 0 ? (
              <p className="p-5 text-sm text-charcoal-soft">Aucune demande pour le moment.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {stats.recentInquiries.map((inq) => (
                    <tr key={inq.id} className="border-b border-border last:border-0">
                      <td className="p-3">
                        <p className="text-charcoal">{inq.name}</p>
                        <p className="text-xs text-charcoal-soft">
                          {inquiryTypeLabels[inq.type]}
                          {inq.property ? ` · ${inq.property.title.slice(0, 30)}` : ""}
                        </p>
                      </td>
                      <td className="p-3 text-right">
                        <InquiryStatusBadge status={inq.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-lg">Visites à venir</h2>
          <div className="mt-4 border border-border bg-white/40">
            {stats.upcomingVisits.length === 0 ? (
              <p className="p-5 text-sm text-charcoal-soft">Aucune visite planifiée.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {stats.upcomingVisits.map((v) => (
                    <tr key={v.id} className="border-b border-border last:border-0">
                      <td className="p-3">
                        <p className="text-charcoal">{v.name}</p>
                        <p className="text-xs text-charcoal-soft">
                          {v.property?.title.slice(0, 35) || "—"}
                        </p>
                      </td>
                      <td className="p-3 text-right text-xs text-charcoal-soft">
                        {v.preferredDate
                          ? format(new Date(v.preferredDate), "d MMM yyyy", { locale: fr })
                          : "—"}
                        {v.preferredTime ? ` · ${v.preferredTime}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
