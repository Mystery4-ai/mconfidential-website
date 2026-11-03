"use client";

import { useRef, useState, useTransition } from "react";
import { FileText, Trash2 } from "lucide-react";
import { uploadFloorPlans, deleteFloorPlan } from "../../actions";

type FloorPlanItem = { id: string; label: string; url: string };

export function FloorPlanManager({
  propertyId,
  floorPlans,
}: {
  propertyId: string;
  floorPlans: FloorPlanItem[];
}) {
  const [items, setItems] = useState(floorPlans);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(() => {
      deleteFloorPlan(propertyId, id);
    });
  }

  return (
    <div>
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((plan) => (
            <li
              key={plan.id}
              className="flex items-center justify-between border border-border bg-white/40 p-3"
            >
              <a
                href={plan.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-charcoal underline underline-offset-4"
              >
                <FileText size={16} strokeWidth={1.5} /> {plan.label}
              </a>
              <button
                type="button"
                onClick={() => remove(plan.id)}
                className="text-charcoal-soft hover:text-status-sold"
                aria-label={`Supprimer le plan ${plan.label}`}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        ref={formRef}
        action={async (formData) => {
          await uploadFloorPlans(propertyId, formData);
          formRef.current?.reset();
        }}
        className="mt-3"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-charcoal-soft">
            Ajouter des plans (PDF) — le nom du fichier devient le libellé affiché (ex. « 1er
            étage.pdf »)
          </span>
          <input
            type="file"
            name="floorPlans"
            accept="application/pdf"
            multiple
            onChange={() => formRef.current?.requestSubmit()}
            className="block w-full text-sm text-charcoal-soft file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
          />
        </label>
      </form>
    </div>
  );
}
