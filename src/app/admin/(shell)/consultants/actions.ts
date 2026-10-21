"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth-helpers";
import { saveUploadedImage } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ConsultantFormState = { error?: string };

const baseSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis."),
  email: z.string().trim().toLowerCase().email("Email invalide."),
  role: z.enum(["ADMIN", "CONSULTANT"]),
  title: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  bio: z.string().trim().optional().or(z.literal("")),
});

export async function createConsultant(
  _prevState: ConsultantFormState,
  formData: FormData
): Promise<ConsultantFormState> {
  await requireAdminAction();

  const parsed = baseSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    title: formData.get("title"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    bio: formData.get("bio"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const photo = formData.get("photo");
  let photoUrl: string | undefined;
  if (photo instanceof File && photo.size > 0) {
    photoUrl = await saveUploadedImage(photo);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      title: parsed.data.title || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      bio: parsed.data.bio || null,
      photoUrl,
      passwordHash,
    },
  });

  revalidatePath("/admin/consultants");
  redirect(`/admin/consultants/${user.id}/edit`);
}

export async function updateConsultant(
  userId: string,
  _prevState: ConsultantFormState,
  formData: FormData
): Promise<ConsultantFormState> {
  await requireAdminAction();

  const parsed = baseSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    title: formData.get("title"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    bio: formData.get("bio"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const emailOwner = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (emailOwner && emailOwner.id !== userId) {
    return { error: "Un autre compte utilise déjà cet email." };
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
    where: { id: userId },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      title: parsed.data.title || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      bio: parsed.data.bio || null,
      ...(photoUrl ? { photoUrl } : {}),
      ...(passwordHash ? { passwordHash } : {}),
    },
  });

  revalidatePath("/admin/consultants");
  revalidatePath(`/admin/consultants/${userId}/edit`);
  return {};
}

export async function toggleConsultantActive(userId: string) {
  await requireAdminAction();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;
  await db.user.update({ where: { id: userId }, data: { active: !user.active } });
  revalidatePath("/admin/consultants");
}
