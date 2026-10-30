"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export type AcceptInviteState = { error?: string };

export async function acceptInvite(
  token: string,
  _prevState: AcceptInviteState,
  formData: FormData
): Promise<AcceptInviteState> {
  const invite = await db.invite.findUnique({ where: { token } });
  if (!invite) {
    return { error: "Ce lien d’invitation est invalide ou a déjà été utilisé." };
  }
  if (invite.expiresAt < new Date()) {
    await db.invite.delete({ where: { id: invite.id } });
    return { error: "Ce lien d’invitation a expiré. Demandez-en un nouveau à votre administrateur." };
  }

  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const existingUser = await db.user.findUnique({ where: { email: invite.email } });
  if (existingUser) {
    await db.invite.delete({ where: { id: invite.id } });
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.$transaction([
    db.user.create({
      data: {
        name: invite.name,
        email: invite.email,
        role: invite.role,
        passwordHash,
      },
    }),
    db.invite.delete({ where: { id: invite.id } }),
  ]);

  redirect("/admin/login?invited=1");
}
