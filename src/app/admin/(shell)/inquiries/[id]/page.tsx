import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { inquiryTypeLabels } from "@/lib/labels";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { InquiryStatusSelect, InquiryNotes, ReassignSelect } from "./inquiry-actions";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const inquiry = await db.inquiry.findFirst({
    where: user.role === "ADMIN" ? { id } : { id, assignedConsultantId: user.id },
    include: {
      property: { select: { title: true, slug: true } },
      assignedConsultant: { select: { id: true, name: true } },
    },
  });
  if (!inquiry) notFound();

  const consultants =
    user.role === "ADMIN"
      ? await db.user.findMany({
          where: { role: "CONSULTANT", active: true },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : [];

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-2xl">{inquiry.name}</h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        {inquiryTypeLabels[inquiry.type]} · Reçue le{" "}
        {format(new Date(inquiry.createdAt), "d MMMM yyyy à HH:mm", { locale: fr })}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="border border-border bg-white/40 p-5">
            <h2 className="font-serif text-lg">Coordonnées</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-20 text-charcoal-soft">Email</dt>
                <dd className="text-charcoal">{inquiry.email}</dd>
              </div>
              {inquiry.phone && (
                <div className="flex gap-2">
                  <dt className="w-20 text-charcoal-soft">Téléphone</dt>
                  <dd className="text-charcoal">{inquiry.phone}</dd>
                </div>
              )}
              {inquiry.property && (
                <div className="flex gap-2">
                  <dt className="w-20 text-charcoal-soft">Bien</dt>
                  <dd>
                    <Link
                      href={`/biens/${inquiry.property.slug}`}
                      target="_blank"
                      className="text-charcoal underline underline-offset-4"
                    >
                      {inquiry.property.title}
                    </Link>
                  </dd>
                </div>
              )}
              {(inquiry.preferredDate || inquiry.preferredTime) && (
                <div className="flex gap-2">
                  <dt className="w-20 text-charcoal-soft">Visite</dt>
                  <dd className="text-charcoal">
                    {inquiry.preferredDate} {inquiry.preferredTime}
                  </dd>
                </div>
              )}
            </dl>

            {inquiry.message && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
                  Message
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-charcoal-soft">
                  {inquiry.message}
                </p>
              </div>
            )}
          </section>

          <section className="border border-border bg-white/40 p-5">
            <InquiryNotes inquiryId={inquiry.id} notes={inquiry.internalNotes ?? ""} />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border border-border bg-white/40 p-5">
            <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} />
          </section>

          {user.role === "ADMIN" && (
            <section className="border border-border bg-white/40 p-5">
              <ReassignSelect
                inquiryId={inquiry.id}
                consultants={consultants}
                currentId={inquiry.assignedConsultant?.id ?? null}
              />
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
