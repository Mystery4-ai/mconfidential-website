"use client";

import { useActionState, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, FormError } from "@/components/ui/field";
import { createInvite, InviteFormState } from "./invite-actions";

export function InviteForm() {
  const [state, formAction, isPending] = useActionState<InviteFormState, FormData>(
    createInvite,
    {}
  );
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!state.link) return;
    await navigator.clipboard.writeText(state.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (state.link) {
    return (
      <div className="rounded-sm border border-border bg-white/40 p-6">
        <p className="font-serif text-lg">Invitation créée</p>
        <p className="mt-2 text-sm text-charcoal-soft">
          Partagez ce lien avec la personne invitée (WhatsApp, email, etc.). Il expire dans 7
          jours et ne peut être utilisé qu’une seule fois.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Input readOnly value={state.link} className="flex-1 text-xs" onFocus={(e) => e.target.select()} />
          <Button type="button" variant="secondary" onClick={copyLink} className="shrink-0">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copié" : "Copier"}
          </Button>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 text-xs text-charcoal underline underline-offset-4"
        >
          Inviter une autre personne
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-sm border border-border bg-white/40 p-6">
      <p className="font-serif text-lg">Inviter un membre de l’équipe</p>
      <p className="mt-1 text-sm text-charcoal-soft">
        Génère un lien à usage unique — la personne définit elle-même son mot de passe en
        l’ouvrant. Aucun service d’envoi d’email nécessaire.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="invite-name">Nom complet</Label>
          <Input id="invite-name" name="name" required />
        </div>
        <div>
          <Label htmlFor="invite-email">Email</Label>
          <Input id="invite-email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="invite-role">Rôle</Label>
          <Select id="invite-role" name="role" defaultValue="CONSULTANT">
            <option value="CONSULTANT">Consultant</option>
            <option value="ADMIN">Administrateur</option>
          </Select>
        </div>

        <FormError>{state.error}</FormError>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Création…" : "Générer le lien d’invitation"}
        </Button>
      </div>
    </form>
  );
}
