"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireUserAction } from "@/lib/auth-helpers";
import { saveUploadedImage } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export type ProfileFormState = { error?: string; success?: boolean };

const schema = z.object({
  title: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  bio: z.string().trim().optional().or(z.literal("")),
  schedulingUrl: z.string().trim().optional().or(z.literal("")),
});

/**
 * Lets a logged-in user (admin or consultant) edit their own profile —
 * notably their personal Cal.com/Calendly link. Deliberately excludes
 * email and role: those stay admin-managed via /admin/consultants to
 * avoid a consultant locking themselves out or self-promoting.
 */
export async function updateOwnProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const sessionUser = await requireUserAction();

  const parsed = schema.safeParse({
    title: formData.get("title"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    bio: formData.get("bio"),
    schedulingUrl: formData.get("schedulingUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  if (parsed.data.schedulingUrl) {
    try {
      new URL(parsed.data.schedulingUrl);
    } catch {
      return { error: "L’URL Cal.com / Calendly n’est pas valide." };
    }
  }

  const photo = formData.get("photo");
  let photoUrl: string | undefined;
  if (photo instanceof File && photo.size > 0) {
    photoUrl = await saveUploadedImage(photo);
  }

  const newPassword = String(formData.get("password") || "");
  let passwordHash: string | undefined;
  if (newPassword) {
    if (newPassword.length < 8) {
      return { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
    }
    passwordHash = await bcrypt.hash(newPassword, 10);
  }

  await db.user.update({
    where: { id: sessionUser.id },
    data: {
      title: parsed.data.title || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      bio: parsed.data.bio || null,
      schedulingUrl: parsed.data.schedulingUrl || null,
      ...(photoUrl ? { photoUrl } : {}),
      ...(passwordHash ? { passwordHash } : {}),
    },
  });

  revalidatePath("/admin/profile");
  return { success: true };
}
