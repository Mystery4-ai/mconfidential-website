"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FormError, FormSuccess } from "@/components/ui/field";
import { updateOwnProfile, ProfileFormState } from "./actions";

export type ProfileInitialValues = {
  title: string | null;
  phone: string | null;
  whatsapp: string | null;
  bio: string | null;
  schedulingUrl: string | null;
};

export function ProfileForm({ initialValues }: { initialValues: ProfileInitialValues }) {
  const [state, formAction, isPending] = useActionState<ProfileFormState, FormData>(
    updateOwnProfile,
    {}
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="title">Titre (ex. Consultant senior)</Label>
        <Input id="title" name="title" defaultValue={initialValues.title ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={initialValues.phone ?? ""} />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" type="tel" defaultValue={initialValues.whatsapp ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio (visible sur la page agence)</Label>
        <Textarea id="bio" name="bio" rows={3} defaultValue={initialValues.bio ?? ""} />
      </div>

      <div>
        <Label htmlFor="schedulingUrl">Mon lien Cal.com / Calendly</Label>
        <Input
          id="schedulingUrl"
          name="schedulingUrl"
          type="url"
          placeholder="https://cal.com/mon-nom"
          defaultValue={initialValues.schedulingUrl ?? ""}
        />
        <p className="mt-1.5 text-xs text-charcoal-soft">
          Ce lien apparaît pour prendre rendez-vous sur chacun de vos biens publiés. Laissez vide
          pour utiliser le calendrier commun de l’agence à la place.
        </p>
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
        <Label htmlFor="password">Nouveau mot de passe (facultatif)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Laisser vide pour ne pas changer"
        />
      </div>

      {state.success && <FormSuccess>Profil mis à jour.</FormSuccess>}
      <FormError>{state.error}</FormError>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
