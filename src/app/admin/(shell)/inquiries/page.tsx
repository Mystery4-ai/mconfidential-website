import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { InquiryStatusBadge } from "@/components/ui/status-badge";
import { inquiryTypeLabels } from "@/lib/labels";
import { Prisma, InquiryStatus } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusTabs: { label: string; value?: InquiryStatus }[] = [
  { label: "Toutes" },
  { label: "Nouvelles", value: "NEW" },
  { label: "Contactées", value: "CONTACTED" },
  { label: "Visite planifiée", value: "VISIT_PLANNED" },
  { label: "Terminées", value: "COMPLETED" },
  { label: "Clôturées", value: "CLOSED" },
  { label: "Perdues", value: "LOST" },
];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status } = await searchParams;

  const where: Prisma.InquiryWhereInput = {
    ...(user.role === "ADMIN" ? {} : { assignedConsultantId: user.id }),
    ...(status ? { status: status as InquiryStatus } : {}),
  };

  const inquiries = await db.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { title: true, slug: true } },
      assignedConsultant: { select: { name: true } },
    },
  });

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-2xl">Demandes</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {statusTabs.map((tab) => {
          const href = tab.value ? `/admin/inquiries?status=${tab.value}` : "/admin/inquiries";
          const active = (status ?? "") === (tab.value ?? "");
          return (
            <Link
              key={tab.label}
              href={href}
              className={`px-3 py-1.5 text-xs font-medium ${
                active ? "bg-charcoal text-ivory" : "border border-border text-charcoal-soft hover:text-charcoal"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto border border-border bg-white/40">
        {inquiries.length === 0 ? (
          <p className="p-8 text-center text-sm text-charcoal-soft">Aucune demande pour ce filtre.</p>
        ) : (
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-charcoal-soft">
                <th className="p-3 font-medium">Contact</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Bien</th>
                {user.role === "ADMIN" && <th className="p-3 font-medium">Consultant</th>}
                <th className="p-3 font-medium">Reçue le</th>
                <th className="p-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="text-charcoal underline underline-offset-4"
                    >
                      {inq.name}
                    </Link>
                    <p className="text-xs text-charcoal-soft">{inq.email}</p>
                  </td>
                  <td className="p-3 text-charcoal-soft">{inquiryTypeLabels[inq.type]}</td>
                  <td className="p-3 text-charcoal-soft">
                    {inq.property ? inq.property.title.slice(0, 35) : "—"}
                  </td>
                  {user.role === "ADMIN" && (
                    <td className="p-3 text-charcoal-soft">
                      {inq.assignedConsultant?.name ?? "Non assigné"}
                    </td>
                  )}
                  <td className="p-3 text-charcoal-soft">
                    {format(new Date(inq.createdAt), "d MMM yyyy", { locale: fr })}
                  </td>
                  <td className="p-3">
                    <InquiryStatusBadge status={inq.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
