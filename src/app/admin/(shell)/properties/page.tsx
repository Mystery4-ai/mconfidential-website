import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { PropertyStatusBadge, AvailabilityBadge } from "@/components/ui/status-badge";
import { formatPrice, propertyTypeLabels, transactionTypeLabels } from "@/lib/labels";
import { LinkButton } from "@/components/ui/button";
import { Prisma, PropertyStatus } from "@prisma/client";

const statusTabs: { label: string; value?: PropertyStatus }[] = [
  { label: "Tous" },
  { label: "Brouillons", value: "DRAFT" },
  { label: "En attente", value: "PENDING_APPROVAL" },
  { label: "Publiés", value: "PUBLISHED" },
  { label: "Dépubliés", value: "UNPUBLISHED" },
  { label: "Archivés", value: "ARCHIVED" },
];

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status } = await searchParams;

  const where: Prisma.PropertyWhereInput = {
    ...(user.role === "ADMIN" ? {} : { consultantId: user.id }),
    ...(status ? { status: status as PropertyStatus } : {}),
  };

  const properties = await db.property.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      consultant: { select: { name: true } },
    },
  });

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl">Biens</h1>
        <LinkButton href="/admin/properties/new">Nouveau bien</LinkButton>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {statusTabs.map((tab) => {
          const href = tab.value ? `/admin/properties?status=${tab.value}` : "/admin/properties";
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
        {properties.length === 0 ? (
          <p className="p-8 text-center text-sm text-charcoal-soft">Aucun bien pour ce filtre.</p>
        ) : (
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-charcoal-soft">
                <th className="p-3 font-medium">Bien</th>
                {user.role === "ADMIN" && <th className="p-3 font-medium">Consultant</th>}
                <th className="p-3 font-medium">Prix</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium">Disponibilité</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <p className="text-charcoal">{p.title.slice(0, 55)}</p>
                    <p className="text-xs text-charcoal-soft">
                      {p.reference} · {transactionTypeLabels[p.transactionType]} ·{" "}
                      {propertyTypeLabels[p.propertyType]} · {p.city}
                    </p>
                  </td>
                  {user.role === "ADMIN" && (
                    <td className="p-3 text-charcoal-soft">{p.consultant.name}</td>
                  )}
                  <td className="p-3 text-charcoal-soft">{formatPrice(p.price, p.currency)}</td>
                  <td className="p-3">
                    <PropertyStatusBadge status={p.status} />
                  </td>
                  <td className="p-3">
                    <AvailabilityBadge availability={p.availability} />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/properties/${p.id}/edit`}
                      className="text-xs text-charcoal underline underline-offset-4"
                    >
                      Modifier
                    </Link>
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
