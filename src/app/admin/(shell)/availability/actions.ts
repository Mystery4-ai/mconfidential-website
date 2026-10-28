"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUserAction } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

export type SlotFormState = { error?: string };

const slotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide."),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Heure invalide."),
  consultantId: z.string().trim().optional().or(z.literal("")),
});

export async function createSlot(
  _prevState: SlotFormState,
  formData: FormData
): Promise<SlotFormState> {
  const user = await requireUserAction();

  const parsed = slotSchema.safeParse({
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    consultantId: formData.get("consultantId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  if (parsed.data.date < todayStr) {
    return { error: "La date ne peut pas être dans le passé." };
  }

  const consultantId =
    user.role === "ADMIN" && parsed.data.consultantId ? parsed.data.consultantId : user.id;

  await db.availabilitySlot.create({
    data: { consultantId, date: parsed.data.date, startTime: parsed.data.startTime },
  });

  revalidatePath("/admin/availability");
  return {};
}

export async function deleteSlot(slotId: string) {
  const user = await requireUserAction();

  const slot = await db.availabilitySlot.findUnique({ where: { id: slotId } });
  if (!slot) return;
  if (user.role !== "ADMIN" && slot.consultantId !== user.id) return;
  if (slot.isBooked) return; // cancel the inquiry first, from the Demandes view

  await db.availabilitySlot.delete({ where: { id: slotId } });
  revalidatePath("/admin/availability");
}
