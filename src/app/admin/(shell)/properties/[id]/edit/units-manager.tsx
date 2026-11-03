"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea, FormError, FormSuccess } from "@/components/ui/field";
import { saveProjectUnits, UnitsFormState } from "../../actions";

type Unit = {
  floorLabel: string;
  lotNumber: number;
  surfaceArea: number;
  terraceArea: number | null;
  price: number;
};

export function UnitsManager({ propertyId, units }: { propertyId: string; units: Unit[] }) {
  const boundSave = saveProjectUnits.bind(null, propertyId);
  const [state, formAction, isPending] = useActionState<UnitsFormState, FormData>(boundSave, {});

  const initialText = units
    .map((u) => `${u.floorLabel} | ${u.lotNumber} | ${u.surfaceArea} | ${u.terraceArea ?? ""} | ${u.price}`)
    .join("\n");

  return (
    <form action={formAction}>
      <p className="text-xs text-charcoal-soft">
        Une ligne par lot, séparée par « | » : étage | n° de lot | surface habitable (m²) |
        terrasse/balcon (m², laisser vide si aucune) | prix (MAD). Enregistrer remplace
        l’intégralité de la grille.
      </p>
      <Textarea
        name="units"
        rows={Math.max(8, units.length + 2)}
        defaultValue={initialText}
        placeholder={"1er étage | 1 | 64 |  | 1610000\n1er étage | 3 | 42 | 13 | 1340000"}
        className="mt-3 font-mono text-xs"
      />
      {state.success && <FormSuccess>Grille des lots enregistrée.</FormSuccess>}
      <FormError>{state.error}</FormError>
      <div className="mt-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement…" : "Enregistrer la grille des lots"}
        </Button>
      </div>
    </form>
  );
}
