"use client";

import { useRef } from "react";
import { FileText, Trash2 } from "lucide-react";
import { uploadBrochure, deleteBrochure } from "../../actions";

export function BrochureManager({
  propertyId,
  brochureUrl,
}: {
  propertyId: string;
  brochureUrl: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      {brochureUrl ? (
        <div className="flex items-center justify-between border border-border bg-white/40 p-3">
          <a
            href={brochureUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-charcoal underline underline-offset-4"
          >
            <FileText size={16} strokeWidth={1.5} /> Voir la brochure actuelle
          </a>
          <form action={() => deleteBrochure(propertyId)}>
            <button
              type="submit"
              className="text-charcoal-soft hover:text-status-sold"
              aria-label="Supprimer la brochure"
            >
              <Trash2 size={16} />
            </button>
          </form>
        </div>
      ) : (
        <p className="text-sm text-charcoal-soft">Aucune brochure n’a encore été ajoutée.</p>
      )}

      <form
        ref={formRef}
        action={async (formData) => {
          await uploadBrochure(propertyId, formData);
          formRef.current?.reset();
        }}
        className="mt-3"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-charcoal-soft">
            {brochureUrl ? "Remplacer la brochure (PDF)" : "Ajouter la brochure (PDF)"}
          </span>
          <input
            type="file"
            name="brochure"
            accept="application/pdf"
            onChange={() => formRef.current?.requestSubmit()}
            className="block w-full text-sm text-charcoal-soft file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
          />
        </label>
      </form>
    </div>
  );
}
