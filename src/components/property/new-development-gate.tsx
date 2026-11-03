"use client";

import { useActionState, useState } from "react";
import { ChevronDown, Download, FileText, Lock } from "lucide-react";
import { Input, Label, FormError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { formatPrice, formatSurface } from "@/lib/labels";
import { unlockLeadGateAction } from "@/app/(public)/biens/[slug]/actions";
import type { LeadGateState } from "@/lib/inquiries";

type Unit = {
  id: string;
  floorLabel: string;
  lotNumber: number;
  surfaceArea: number;
  terraceArea: number | null;
  price: number;
};

export function NewDevelopmentGate({
  propertyId,
  brochureUrl,
  units,
  currency,
  initialUnlocked,
}: {
  propertyId: string;
  brochureUrl: string | null;
  units: Unit[];
  currency: string;
  initialUnlocked: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [lotsOpen, setLotsOpen] = useState(false);
  // Tracks whether we've already reacted to a successful unlock, so the
  // state adjustment below (derived during render, not in an effect — see
  // https://react.dev/learn/you-might-not-need-an-effect) only fires once.
  const [handledSuccess, setHandledSuccess] = useState(false);

  const boundAction = unlockLeadGateAction.bind(null, propertyId);
  const [state, formAction, isPending] = useActionState<LeadGateState, FormData>(boundAction, {});

  const unlocked = initialUnlocked || state.success === true;

  if (state.success && !handledSuccess) {
    setHandledSuccess(true);
    setShowForm(false);
    setLotsOpen(true);
  }

  if (!brochureUrl && units.length === 0) return null;

  function openGate() {
    if (!unlocked) setShowForm(true);
  }

  return (
    <div className="space-y-5">
      {brochureUrl &&
        (unlocked ? (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-sm border border-border bg-white/40 p-5 shadow-sm transition-colors hover:border-charcoal"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal text-ivory">
              <FileText size={18} strokeWidth={1.5} />
            </span>
            <span>
              <span className="block text-sm font-medium text-charcoal">Brochure du projet</span>
              <span className="block text-xs text-charcoal-soft">
                Prestations, plans et grille tarifaire — PDF
              </span>
            </span>
            <Download
              size={16}
              strokeWidth={1.5}
              className="ml-auto shrink-0 text-charcoal-soft transition-transform group-hover:translate-y-0.5"
            />
          </a>
        ) : (
          <button
            type="button"
            onClick={openGate}
            className="flex w-full items-center gap-4 rounded-sm border border-border bg-white/40 p-5 text-left shadow-sm transition-colors hover:border-charcoal"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory-dim text-charcoal-soft">
              <Lock size={18} strokeWidth={1.5} />
            </span>
            <span>
              <span className="block text-sm font-medium text-charcoal">Brochure du projet</span>
              <span className="block text-xs text-charcoal-soft">
                Indiquez vos coordonnées pour la télécharger
              </span>
            </span>
          </button>
        ))}

      {units.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => (unlocked ? setLotsOpen((v) => !v) : openGate())}
            className="flex w-full items-center justify-between rounded-sm border border-border bg-white/40 px-5 py-4 text-left shadow-sm transition-colors hover:border-charcoal"
          >
            <span className="flex items-center gap-3">
              {!unlocked && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory-dim text-charcoal-soft">
                  <Lock size={14} strokeWidth={1.5} />
                </span>
              )}
              <span>
                <span className="block text-sm font-medium text-charcoal">Grille des lots</span>
                <span className="block text-xs text-charcoal-soft">
                  {unlocked
                    ? `${units.length} lots disponibles`
                    : "Indiquez vos coordonnées pour voir les prix"}
                </span>
              </span>
            </span>
            <ChevronDown
              size={18}
              strokeWidth={1.5}
              className={`shrink-0 text-charcoal-soft transition-transform ${lotsOpen && unlocked ? "rotate-180" : ""}`}
            />
          </button>

          {unlocked && lotsOpen && (
            <div className="mt-2 overflow-x-auto rounded-sm border border-border bg-white/40 shadow-sm">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-ivory-dim text-left text-xs uppercase tracking-wide text-charcoal-soft">
                    <th className="px-4 py-3 font-medium">Lot</th>
                    <th className="px-4 py-3 font-medium">Surface</th>
                    <th className="px-4 py-3 font-medium">Terrasse</th>
                    <th className="px-4 py-3 text-right font-medium">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u, i) => {
                    const showFloorHeader = i === 0 || u.floorLabel !== units[i - 1].floorLabel;
                    return (
                      <FragmentRow key={u.id} showFloorHeader={showFloorHeader} floorLabel={u.floorLabel}>
                        <tr className="border-b border-border text-charcoal-soft last:border-0 hover:bg-ivory-dim/40">
                          <td className="px-4 py-2.5">Lot {u.lotNumber}</td>
                          <td className="px-4 py-2.5">{formatSurface(u.surfaceArea)}</td>
                          <td className="px-4 py-2.5">
                            {u.terraceArea != null ? formatSurface(u.terraceArea) : "—"}
                          </td>
                          <td className="px-4 py-2.5 text-right font-medium text-charcoal">
                            {formatPrice(u.price, currency)}
                          </td>
                        </tr>
                      </FragmentRow>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showForm && !unlocked && (
        <form
          action={formAction}
          className="rounded-sm border border-charcoal bg-white/60 p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-charcoal">
            Vos coordonnées pour accéder à la brochure et aux prix
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="lead-name">Nom</Label>
              <Input id="lead-name" name="name" required autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="lead-phone">Téléphone</Label>
              <Input id="lead-phone" name="phone" type="tel" required autoComplete="tel" />
            </div>
          </div>
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
          <FormError>{state.error}</FormError>
          <div className="mt-4 flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Envoi…" : "Voir les prix et télécharger"}
            </Button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-charcoal-soft underline underline-offset-4"
            >
              Annuler
            </button>
          </div>
          <p className="mt-3 text-xs text-charcoal-soft">
            Vos coordonnées sont transmises au consultant en charge de ce projet, uniquement pour
            vous recontacter à ce sujet.
          </p>
        </form>
      )}
    </div>
  );
}

function FragmentRow({
  showFloorHeader,
  floorLabel,
  children,
}: {
  showFloorHeader: boolean;
  floorLabel: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {showFloorHeader && (
        <tr>
          <td
            colSpan={4}
            className="bg-ivory-dim/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-charcoal-soft"
          >
            {floorLabel}
          </td>
        </tr>
      )}
      {children}
    </>
  );
}
