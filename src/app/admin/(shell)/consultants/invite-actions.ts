"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth-helpers";
import { generateInviteToken, inviteExpiresAt } from "@/lib/invites";
import { revalidatePath } from "next/cache";

export type InviteFormState = { error?: string; link?: string };

const inviteSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis."),
  email: z.string().trim().toLowerCase().email("Email invalide."),
  role: z.enum(["ADMIN", "CONSULTANT"]),
});

export async function createInvite(
  _prevState: InviteFormState,
  formData: FormData
): Promise<InviteFormState> {
  const admin = await requireAdminAction();

  const parsed = inviteSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const existingUser = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const existingInvite = await db.invite.findUnique({ where: { email: parsed.data.email } });
  if (existingInvite) {
    await db.invite.delete({ where: { id: existingInvite.id } });
  }

  const token = generateInviteToken();
  await db.invite.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      token,
      expiresAt: inviteExpiresAt(),
      invitedById: admin.id,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  revalidatePath("/admin/consultants");
  return { link: `${siteUrl}/invite/${token}` };
}

export async function revokeInvite(inviteId: string) {
  await requireAdminAction();
  await db.invite.delete({ where: { id: inviteId } });
  revalidatePath("/admin/consultants");
}
