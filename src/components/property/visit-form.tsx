"use client";

import { useActionState } from "react";
import { requestVisitAction } from "@/app/(public)/biens/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FormError, FormSuccess } from "@/components/ui/field";
import { InquiryFormState } from "@/lib/inquiries";

const initialState: InquiryFormState = {};

export function VisitForm({ propertyId }: { propertyId: string }) {
  const action = requestVisitAction.bind(null, propertyId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <FormSuccess>
        Votre demande de visite a été envoyée. Un consultant vous recontactera rapidement.
      </FormSuccess>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="preferredDate">Date souhaitée</Label>
          <Input id="preferredDate" name="preferredDate" type="date" />
        </div>
        <div>
          <Label htmlFor="preferredTime">Heure souhaitée</Label>
          <Input id="preferredTime" name="preferredTime" type="time" />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message (facultatif)</Label>
        <Textarea id="message" name="message" rows={3} />
      </div>

      <label className="flex items-start gap-2 text-xs text-charcoal-soft">
        <input type="checkbox" name="consentGiven" required className="mt-0.5" />
        <span>
          J’accepte que mes données soient utilisées par M. Confidential pour traiter ma demande,
          conformément à sa politique de confidentialité.
        </span>
      </label>

      <FormError>{state.error}</FormError>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Envoi…" : "Planifier une visite"}
      </Button>
    </form>
  );
}
