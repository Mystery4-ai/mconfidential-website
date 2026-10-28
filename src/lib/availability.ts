import { z } from "zod";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/rate-limit";
import { InquiryFormState } from "@/lib/inquiries";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/** Future, unbooked slots for a consultant, soonest first. */
export async function getUpcomingSlotsForConsultant(consultantId: string) {
  return db.availabilitySlot.findMany({
    where: { consultantId, isBooked: false, date: { gte: todayStr() } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom.").max(120),
  email: z.string().trim().email("Adresse email invalide."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consentGiven: z.literal("on"),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

/**
 * Books an open slot: atomically claims it (so two visitors can't double
 * book the same slot) and creates the corresponding Inquiry in one
 * transaction — this is what guarantees every booking lands in the
 * backoffice regardless of whether Cal.com/Calendly is also configured.
 */
export async function bookSlot(
  propertyId: string | null,
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const slotId = String(formData.get("slotId") || "");
  if (!slotId) return { error: "Merci de sélectionner un créneau." };

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`booking:${ip}`, 5, 60_000)) {
    return { error: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes." };
  }

  const parsed = bookingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    consentGiven: formData.get("consentGiven"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const consentIssue = parsed.error.issues.find((i) => i.path[0] === "consentGiven");
    if (consentIssue) return { error: "Merci d’accepter la politique de confidentialité." };
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  if (parsed.data.website) {
    // Honeypot tripped — silently pretend success without writing anything.
    return { success: true };
  }

  const slot = await db.availabilitySlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.isBooked) {
    return { error: "Ce créneau n’est plus disponible. Merci d’en choisir un autre." };
  }

  try {
    await db.$transaction(async (tx) => {
      const claim = await tx.availabilitySlot.updateMany({
        where: { id: slotId, isBooked: false },
        data: { isBooked: true },
      });
      if (claim.count === 0) throw new Error("SLOT_TAKEN");

      const inquiry = await tx.inquiry.create({
        data: {
          type: "VISIT",
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          message: parsed.data.message || null,
          preferredDate: slot.date,
          preferredTime: slot.startTime,
          propertyId,
          assignedConsultantId: slot.consultantId,
          consentGiven: true,
        },
      });

      await tx.availabilitySlot.update({ where: { id: slotId }, data: { inquiryId: inquiry.id } });
    });
  } catch (e) {
    if (e instanceof Error && e.message === "SLOT_TAKEN") {
      return { error: "Ce créneau vient d’être réservé par quelqu’un d’autre. Merci d’en choisir un autre." };
    }
    throw e;
  }

  return { success: true };
}
