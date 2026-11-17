"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FormError } from "@/components/ui/field";
import { importFromMubawab, ImportFormState } from "../actions";

export function ImportFromUrl() {
  const [state, formAction, isPending] = useActionState<ImportFormState, FormData>(
    importFromMubawab,
    {}
  );
  const router = useRouter();
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    // No warning: go straight to the created property. With a warning, stay
    // here so the admin sees it before deciding whether to continue.
    if (state.success && state.propertyId && !state.warning) {
      router.push(`/admin/properties/${state.propertyId}/edit`);
    }
  }

  return (
    <div className="border border-border bg-white/40 p-5">
      <h2 className="font-serif text-lg">Importer depuis un lien</h2>
      <p className="mt-1 text-xs text-charcoal-soft">
        Collez le lien d’une annonce Mubawab déjà publiée par votre agence : titre, description,
        prix et photos sont récupérés automatiquement. Le bien est créé en brouillon — vérifiez-le
        avant de le publier.
      </p>
      <form action={formAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="mubawab-url">Lien Mubawab</Label>
          <Input
            id="mubawab-url"
            name="url"
            type="url"
            required
            placeholder="https://www.mubawab.ma/..."
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Import en cours…
            </>
          ) : (
            <>
              <Download size={14} /> Importer
            </>
          )}
        </Button>
      </form>
      <FormError>{state.error}</FormError>
      {state.success && state.propertyId && state.warning && (
        <p className="mt-2 text-xs text-status-sold">
          {state.warning}{" "}
          <a href={`/admin/properties/${state.propertyId}/edit`} className="underline">
            Voir la fiche créée
          </a>
        </p>
      )}
    </div>
  );
}
