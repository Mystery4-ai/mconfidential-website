import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AcceptInviteForm } from "./accept-invite-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const roleLabels = { ADMIN: "Administrateur", CONSULTANT: "Consultant" };

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await db.invite.findUnique({ where: { token } });
  const expired = invite ? invite.expiresAt < new Date() : false;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-serif text-2xl text-charcoal">M. Confidential</p>
          <p className="mt-1 text-sm text-charcoal-soft">Espace consultants</p>
        </div>
        <div className="border border-border bg-white/40 p-8">
          {!invite || expired ? (
            <p className="text-sm text-charcoal-soft">
              Ce lien d’invitation {expired ? "a expiré" : "est invalide ou a déjà été utilisé"}.
              Demandez une nouvelle invitation à votre administrateur.
            </p>
          ) : (
            <>
              <p className="font-serif text-lg">Bienvenue, {invite.name}</p>
              <p className="mt-1 text-sm text-charcoal-soft">
                Vous avez été invité(e) en tant que {roleLabels[invite.role]} ({invite.email}).
                Choisissez un mot de passe pour activer votre compte.
              </p>
              <div className="mt-6">
                <AcceptInviteForm token={token} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
