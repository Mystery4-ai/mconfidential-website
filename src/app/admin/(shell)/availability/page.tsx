import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { SlotForm } from "./slot-form";
import { DeleteSlotButton } from "./delete-slot-button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AvailabilityPage() {
  const user = await requireUser();

  const consultants =
    user.role === "ADMIN"
      ? await db.user.findMany({
          where: { active: true },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : undefined;

  const todayStr = new Date().toISOString().slice(0, 10);

  const slots = await db.availabilitySlot.findMany({
    where: {
      ...(user.role === "ADMIN" ? {} : { consultantId: user.id }),
      date: { gte: todayStr },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    include: {
      consultant: { select: { name: true } },
      inquiry: { select: { name: true, status: true } },
    },
  });

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-2xl">Disponibilités</h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        Ouvrez des créneaux de visite : ils apparaissent sur les fiches biens que vous gérez et
        toute réservation crée automatiquement une demande dans « Demandes ».
      </p>

      <div className="mt-8 border border-border bg-white/40 p-5">
        <SlotForm consultants={consultants} />
      </div>

      <div className="mt-8 overflow-x-auto border border-border bg-white/40">
        {slots.length === 0 ? (
          <p className="p-8 text-center text-sm text-charcoal-soft">
            Aucun créneau à venir. Ajoutez-en ci-dessus.
          </p>
        ) : (
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-charcoal-soft">
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Heure</th>
                {user.role === "ADMIN" && <th className="p-3 font-medium">Consultant</th>}
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-charcoal">
                    {format(new Date(slot.date), "EEEE d MMMM yyyy", { locale: fr })}
                  </td>
                  <td className="p-3 text-charcoal-soft">{slot.startTime}</td>
                  {user.role === "ADMIN" && (
                    <td className="p-3 text-charcoal-soft">{slot.consultant.name}</td>
                  )}
                  <td className="p-3">
                    {slot.isBooked ? (
                      <span className="text-xs font-medium text-status-sold">
                        Réservé{slot.inquiry ? ` — ${slot.inquiry.name}` : ""}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-status-published">Disponible</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {!slot.isBooked && <DeleteSlotButton slotId={slot.id} />}
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
