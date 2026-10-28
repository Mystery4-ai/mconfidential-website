"use client";

import { useActionState, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { bookSlotAction } from "@/app/(public)/biens/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FormError, FormSuccess } from "@/components/ui/field";
import { InquiryFormState } from "@/lib/inquiries";
import { cn } from "@/lib/cn";

type Slot = { id: string; date: string; startTime: string };

export function SlotPicker({ propertyId, slots }: { propertyId: string; slots: Slot[] }) {
  const action = bookSlotAction.bind(null, propertyId);
  const [state, formAction, isPending] = useActionState<InquiryFormState, FormData>(action, {});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      const list = map.get(slot.date) ?? [];
      list.push(slot);
      map.set(slot.date, list);
    }
    return Array.from(map.entries());
  }, [slots]);

  const selected = slots.find((s) => s.id === selectedId);

  if (state.success) {
    return (
      <FormSuccess>
        Votre visite est confirmée{selected ? ` pour le ${format(parseISO(selected.date), "EEEE d MMMM", { locale: fr })} à ${selected.startTime}` : ""}. Un consultant vous recontactera pour confirmer les détails.
      </FormSuccess>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="slotId" value={selectedId ?? ""} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="space-y-4">
        {byDate.map(([date, daySlots]) => (
          <div key={date}>
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
              {format(parseISO(date), "EEEE d MMMM", { locale: fr })}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {daySlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedId(slot.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    selectedId === slot.id
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-border text-charcoal hover:border-charcoal"
                  )}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="space-y-4 border-t border-border pt-4">
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message (facultatif)</Label>
            <Textarea id="message" name="message" rows={2} />
          </div>

          <label className="flex items-start gap-2 text-xs text-charcoal-soft">
            <input type="checkbox" name="consentGiven" required className="mt-0.5" />
            <span>
              J’accepte que mes données soient utilisées par M. Confidential pour traiter ma
              demande, conformément à sa politique de confidentialité.
            </span>
          </label>

          <FormError>{state.error}</FormError>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending
              ? "Confirmation…"
              : `Confirmer la visite — ${format(parseISO(selected!.date), "d MMM", { locale: fr })} à ${selected!.startTime}`}
          </Button>
        </div>
      )}
    </form>
  );
}
