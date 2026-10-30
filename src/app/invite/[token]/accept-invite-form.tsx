"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, FormError } from "@/components/ui/field";
import { acceptInvite, AcceptInviteState } from "./actions";

export function AcceptInviteForm({ token }: { token: string }) {
  const action = acceptInvite.bind(null, token);
  const [state, formAction, isPending] = useActionState<AcceptInviteState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="password">Choisissez un mot de passe</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <FormError>{state.error}</FormError>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Création du compte…" : "Créer mon compte"}
      </Button>
    </form>
  );
}
