import { z } from "zod";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/rate-limit";
import { InquiryType } from "@prisma/client";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom.").max(120),
  email: z.string().trim().email("Adresse email invalide."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  preferredDate: z.string().trim().max(40).optional().or(z.literal("")),
  preferredTime: z.string().trim().max(40).optional().or(z.literal("")),
  consentGiven: z.literal("on"),
  // Honeypot: real users never fill this hidden field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryFormState = { error?: string; success?: boolean };

export async function submitInquiry(
  type: InquiryType,
  propertyId: string | null,
  formData: FormData
): Promise<InquiryFormState> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(`inquiry:${ip}`, 5, 60_000)) {
    return { error: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes." };
  }

  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    consentGiven: formData.get("consentGiven"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const consentIssue = parsed.error.issues.find((i) => i.path[0] === "consentGiven");
    if (consentIssue) {
      return { error: "Merci d’accepter la politique de confidentialité." };
    }
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  if (parsed.data.website) {
    // Honeypot tripped — silently pretend success without writing anything.
    return { success: true };
  }

  let assignedConsultantId: string | null = null;
  if (propertyId) {
    const property = await db.property.findUnique({
      where: { id: propertyId },
      select: { consultantId: true },
    });
    assignedConsultantId = property?.consultantId ?? null;
  }

  await db.inquiry.create({
    data: {
      type,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      preferredDate: parsed.data.preferredDate || null,
      preferredTime: parsed.data.preferredTime || null,
      propertyId,
      assignedConsultantId,
      consentGiven: true,
    },
  });

  return { success: true };
}
