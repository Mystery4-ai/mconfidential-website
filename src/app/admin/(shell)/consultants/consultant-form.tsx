"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea, FormError } from "@/components/ui/field";
import { ConsultantFormState } from "./actions";

export type ConsultantInitialValues = {
  name: string;
  email: string;
  role: string;
  title: string | null;
  phone: string | null;
  whatsapp: string | null;
  bio: string | null;
};

export function ConsultantForm({
  action,
  initialValues,
  submitLabel = "Enregistrer",
  passwordRequired = false,
}: {
  action: (state: ConsultantFormState, formData: FormData) => Promise<ConsultantFormState>;
  initialValues?: ConsultantInitialValues;
  submitLabel?: string;
  passwordRequired?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" name="name" required defaultValue={initialValues?.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required defaultValue={initialValues?.email} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="role">Rôle</Label>
          <Select id="role" name="role" defaultValue={initialValues?.role ?? "CONSULTANT"}>
            <option value="CONSULTANT">Consultant</option>
            <option value="ADMIN">Administrateur</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="title">Titre (ex. Consultant senior)</Label>
          <Input id="title" name="title" defaultValue={initialValues?.title ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={initialValues?.phone ?? ""} />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" type="tel" defaultValue={initialValues?.whatsapp ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio (visible sur la page agence)</Label>
        <Textarea id="bio" name="bio" rows={3} defaultValue={initialValues?.bio ?? ""} />
      </div>

      <div>
        <Label htmlFor="photo">Photo de profil</Label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="block w-full text-sm text-charcoal-soft file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
        />
      </div>

      <div>
        <Label htmlFor="password">
          {passwordRequired ? "Mot de passe" : "Nouveau mot de passe (facultatif)"}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required={passwordRequired}
          autoComplete="new-password"
          placeholder={passwordRequired ? "" : "Laisser vide pour ne pas changer"}
        />
      </div>

      <FormError>{state.error}</FormError>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement…" : submitLabel}
      </Button>
    </form>
  );
}
