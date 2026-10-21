"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FormError, FormSuccess } from "@/components/ui/field";
import { updateSettings, SettingsFormState } from "./actions";

type Settings = {
  agencyName: string;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  heroHeadline: string | null;
  heroSubheadline: string | null;
  aboutText: string | null;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, isPending] = useActionState<SettingsFormState, FormData>(
    updateSettings,
    {}
  );

  return (
    <form action={formAction} className="space-y-10">
      <section>
        <h2 className="font-serif text-lg">Identité de l’agence</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="agencyName">Nom de l’agence</Label>
            <Input id="agencyName" name="agencyName" required defaultValue={settings.agencyName} />
          </div>
          <div>
            <Label htmlFor="tagline">Accroche</Label>
            <Input id="tagline" name="tagline" defaultValue={settings.tagline ?? ""} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg">Coordonnées publiques</h2>
        <p className="mt-1 text-xs text-charcoal-soft">
          Ces informations apparaissent sur le site public (en-tête, pied de page, fiches biens).
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={settings.phone ?? ""} />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" type="tel" defaultValue={settings.whatsapp ?? ""} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={settings.email ?? ""} />
          </div>
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" defaultValue={settings.city ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" name="address" defaultValue={settings.address ?? ""} />
          </div>
          <div>
            <Label htmlFor="facebookUrl">Facebook</Label>
            <Input id="facebookUrl" name="facebookUrl" defaultValue={settings.facebookUrl ?? ""} />
          </div>
          <div>
            <Label htmlFor="instagramUrl">Instagram</Label>
            <Input id="instagramUrl" name="instagramUrl" defaultValue={settings.instagramUrl ?? ""} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg">Page d’accueil</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="heroHeadline">Titre principal (hero)</Label>
            <Input id="heroHeadline" name="heroHeadline" defaultValue={settings.heroHeadline ?? ""} />
          </div>
          <div>
            <Label htmlFor="heroSubheadline">Sous-titre (hero)</Label>
            <Textarea
              id="heroSubheadline"
              name="heroSubheadline"
              rows={2}
              defaultValue={settings.heroSubheadline ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="aboutText">Texte « À propos »</Label>
            <Textarea id="aboutText" name="aboutText" rows={6} defaultValue={settings.aboutText ?? ""} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg">SEO</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="seoDefaultTitle">Titre par défaut</Label>
            <Input
              id="seoDefaultTitle"
              name="seoDefaultTitle"
              defaultValue={settings.seoDefaultTitle ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="seoDefaultDescription">Meta description par défaut</Label>
            <Textarea
              id="seoDefaultDescription"
              name="seoDefaultDescription"
              rows={2}
              defaultValue={settings.seoDefaultDescription ?? ""}
            />
          </div>
        </div>
      </section>

      <FormError>{state.error}</FormError>
      <FormSuccess>{state.success ? "Paramètres enregistrés." : undefined}</FormSuccess>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer les paramètres"}
      </Button>
    </form>
  );
}
