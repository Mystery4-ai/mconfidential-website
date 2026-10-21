"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FormError, FormSuccess } from "@/components/ui/field";
import { InquiryFormState } from "@/lib/inquiries";

export function ContactForm({
  action,
  messageLabel = "Message",
  successMessage = "Votre message a bien été envoyé. Nous vous répondrons rapidement.",
  children,
  submitLabel = "Envoyer",
}: {
  action: (state: InquiryFormState, formData: FormData) => Promise<InquiryFormState>;
  messageLabel?: string;
  successMessage?: string;
  children?: React.ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  if (state.success) {
    return <FormSuccess>{successMessage}</FormSuccess>;
  }

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Téléphone (facultatif)</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      {children}

      <div>
        <Label htmlFor="message">{messageLabel}</Label>
        <Textarea id="message" name="message" rows={4} />
      </div>

      <label className="flex items-start gap-2 text-xs text-charcoal-soft">
        <input type="checkbox" name="consentGiven" required className="mt-0.5" />
        <span>
          J’accepte que mes données soient utilisées par M. Confidential pour traiter ma demande,
          conformément à sa politique de confidentialité.
        </span>
      </label>

      <FormError>{state.error}</FormError>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Envoi…" : submitLabel}
      </Button>
    </form>
  );
}
