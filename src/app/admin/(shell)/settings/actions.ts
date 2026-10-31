"use server";

import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth-helpers";
import { saveUploadedImage } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type SettingsFormState = { error?: string; success?: boolean };

const schema = z.object({
  agencyName: z.string().trim().min(2, "Le nom de l’agence est requis."),
  tagline: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Email invalide.").optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  facebookUrl: z.string().trim().optional().or(z.literal("")),
  instagramUrl: z.string().trim().optional().or(z.literal("")),
  schedulingUrl: z.string().trim().optional().or(z.literal("")),
  heroHeadline: z.string().trim().optional().or(z.literal("")),
  heroSubheadline: z.string().trim().optional().or(z.literal("")),
  aboutText: z.string().trim().optional().or(z.literal("")),
  seoDefaultTitle: z.string().trim().optional().or(z.literal("")),
  seoDefaultDescription: z.string().trim().optional().or(z.literal("")),
});

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdminAction();

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const data: Record<string, string | null> = Object.fromEntries(
    Object.entries(parsed.data).map(([k, v]) => [k, v || null])
  );

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    data.logoUrl = await saveUploadedImage(logo, "branding");
  }

  await db.agencySettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...data, agencyName: parsed.data.agencyName },
    update: data,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/agence");

  return { success: true };
}
