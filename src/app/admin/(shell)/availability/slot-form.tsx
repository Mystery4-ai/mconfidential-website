"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, FormError } from "@/components/ui/field";
import { createSlot, SlotFormState } from "./actions";

export function SlotForm({ consultants }: { consultants?: { id: string; name: string }[] }) {
  const [state, formAction, isPending] = useActionState<SlotFormState, FormData>(createSlot, {});

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" required />
      </div>
      <div>
        <Label htmlFor="startTime">Heure</Label>
        <Input id="startTime" name="startTime" type="time" required />
      </div>
      {consultants && (
        <div>
          <Label htmlFor="consultantId">Consultant</Label>
          <Select id="consultantId" name="consultantId" defaultValue="">
            {consultants.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Ajout…" : "Ajouter le créneau"}
      </Button>
      <FormError>{state.error}</FormError>
    </form>
  );
}
