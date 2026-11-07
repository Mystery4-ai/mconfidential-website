"use client";

import { useMemo, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/cn";

/**
 * Calendrier de visite « maison », posé par-dessus Cal.com.
 *
 * Pourquoi : l'embed Cal ouvre d'office le premier jour disponible et déroule
 * tous ses créneaux, sans branding. Ici on veut l'inverse — un calendrier au
 * mois, aux couleurs de l'agence, où RIEN ne s'affiche tant que le client n'a
 * pas choisi un jour ; alors seulement les horaires de ce jour apparaissent.
 * Cliquer un horaire passe la main à Cal, directement sur l'écran de
 * confirmation (nom + e-mail), avec le bon créneau pré-sélectionné.
 *
 * La configuration reproduit EXACTEMENT celle que Mounia a réglée dans Cal
 * (observée à l'écran le 2026-11-06) : lundi→vendredi 09:00–19:00, créneaux de
 * 30 min (donc 09:00 … 18:30), samedi/dimanche fermés, préavis minimum 2 h.
 * La disponibilité « temps réel » (masquer un créneau déjà réservé) viendra
 * plus tard, via l'API — décision de Dylan le 2026-11-06 : « on verra plus
 * tard pour les modifs ».
 *
 * Fuseau — contrat OBSERVÉ sur le vrai Cal (2026-11-06, navigateur réglé sur
 * Africa/Casablanca) : le créneau « 09:00 » de Cal produit
 * `slot=2026-11-09T09:00:00.000Z` et s'affiche « 09:00 ». Cal attend donc
 * l'heure « au mur » tamponnée Z, SANS conversion de fuseau. On recopie ce
 * comportement à l'identique pour atterrir sur le bon créneau. (Question
 * ouverte, à trancher plus tard avec Mounia : son planning paraît ancré sur
 * UTC, pas sur l'heure légale marocaine — à vérifier le jour où on règle les
 * modifs.) Tout le reste se raisonne donc en heure du Maroc.
 */

const OPEN_WEEKDAYS = new Set([1, 2, 3, 4, 5]); // getUTCDay : 0=dim … 6=sam → lun..ven
const START_MIN = 9 * 60; // 09:00
const END_MIN = 19 * 60; // 19:00 — le dernier créneau démarre donc à 18:30
const SLOT_MIN = 30;
const MIN_NOTICE_MIN = 2 * 60; // préavis minimum : 2 heures
const TZ = "Africa/Casablanca";

const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const WEEKDAYS_FR = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

type Slot = { label: string; iso: string };
type Now = { y: number; mo: number; d: number; minutes: number };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateKey(y: number, mo: number, d: number) {
  return `${y}-${pad(mo)}-${pad(d)}`;
}

function cmp(y: number, mo: number, d: number) {
  return y * 10000 + mo * 100 + d; // comparaison de dates "nue"
}

/** Maintenant, en heure du Maroc : date du jour + minutes écoulées depuis minuit. */
function nowInTZ(tz: string): Now {
  const p: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  }).formatToParts(new Date())) {
    p[part.type] = part.value;
  }
  const hour = p.hour === "24" ? 0 : Number(p.hour);
  return { y: Number(p.year), mo: Number(p.month), d: Number(p.day), minutes: hour * 60 + Number(p.minute) };
}

/** Créneaux d'un jour encore réservables, raisonnés entièrement en heure du Maroc. */
function bookableSlots(y: number, mo: number, d: number, now: Now): Slot[] {
  const dateNum = cmp(y, mo, d);
  const todayNum = cmp(now.y, now.mo, now.d);
  if (dateNum < todayNum) return []; // jour passé
  const isToday = dateNum === todayNum;
  const out: Slot[] = [];
  for (let min = START_MIN; min < END_MIN; min += SLOT_MIN) {
    if (isToday && min < now.minutes + MIN_NOTICE_MIN) continue; // préavis de 2 h
    const h = Math.floor(min / 60);
    const mi = min % 60;
    out.push({
      label: `${pad(h)}:${pad(mi)}`,
      // Heure "au mur" tamponnée Z — contrat OBSERVÉ de Cal (voir en-tête).
      iso: `${dateKey(y, mo, d)}T${pad(h)}:${pad(mi)}:00.000Z`,
    });
  }
  return out;
}

type DayState = "open" | "closed" | "unavailable";

function dayState(y: number, mo: number, d: number, now: Now): DayState {
  const wd = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  if (!OPEN_WEEKDAYS.has(wd)) return "closed"; // week-end
  if (bookableSlots(y, mo, d, now).length === 0) return "unavailable"; // passé ou trop tard
  return "open";
}

export function VisitCalendar({
  calLink,
  notes,
  logoUrl,
}: {
  /** Chemin « identifiant/type » attendu par Cal, ex. "m.confidential/visite". */
  calLink: string;
  notes?: string;
  logoUrl?: string | null;
}) {
  const now = useMemo(() => nowInTZ(TZ), []);
  const [view, setView] = useState({ y: now.y, mo: now.mo });
  const [selected, setSelected] = useState<{ y: number; mo: number; d: number } | null>(null);

  const canPrev = view.y > now.y || (view.y === now.y && view.mo > now.mo);

  const grid = useMemo(() => {
    const firstDow = new Date(Date.UTC(view.y, view.mo - 1, 1)).getUTCDay();
    const lead = (firstDow + 6) % 7; // semaine commençant le lundi
    const daysInMonth = new Date(Date.UTC(view.y, view.mo, 0)).getUTCDate();
    const cells: Array<{ d: number; state: DayState } | null> = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ d, state: dayState(view.y, view.mo, d, now) });
    }
    return cells;
  }, [view, now]);

  const selectedSlots = useMemo(
    () => (selected ? bookableSlots(selected.y, selected.mo, selected.d, now) : []),
    [selected, now],
  );

  function shiftMonth(delta: number) {
    setSelected(null);
    setView((v) => {
      const m = v.mo - 1 + delta;
      return { y: v.y + Math.floor(m / 12), mo: ((m % 12) + 12) % 12 + 1 };
    });
  }

  function openCal(slot: Slot) {
    if (!selected) return;
    const key = dateKey(selected.y, selected.mo, selected.d);
    const u = new URL(`https://cal.com/${calLink}`);
    u.searchParams.set("month", key.slice(0, 7));
    u.searchParams.set("date", key);
    u.searchParams.set("slot", slot.iso);
    if (notes) u.searchParams.set("notes", notes);
    window.open(u.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-sm border border-border bg-white/60 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <Logo logoUrl={logoUrl} className="h-6" />
        <span className="text-[11px] uppercase tracking-wide text-charcoal-soft">
          Heure du Maroc
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canPrev}
          aria-label="Mois précédent"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-charcoal disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>
        <p className="font-serif text-base capitalize text-charcoal">
          {MONTHS_FR[view.mo - 1]} {view.y}
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Mois suivant"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-charcoal"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-charcoal-soft">
        {WEEKDAYS_FR.map((w) => (
          <span key={w} className="py-1">{w}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {grid.map((cell, i) => {
          if (!cell) return <span key={`b${i}`} />;
          const isSelected =
            selected?.d === cell.d && selected?.mo === view.mo && selected?.y === view.y;
          const clickable = cell.state === "open";
          return (
            <button
              key={cell.d}
              type="button"
              disabled={!clickable}
              onClick={() => setSelected({ y: view.y, mo: view.mo, d: cell.d })}
              aria-label={`${cell.d} ${MONTHS_FR[view.mo - 1]} ${view.y}`}
              className={cn(
                "aspect-square rounded-full text-sm transition-colors",
                isSelected && "bg-charcoal text-ivory",
                !isSelected && clickable && "text-charcoal hover:bg-ivory-dim",
                !clickable && "cursor-not-allowed text-charcoal-soft/35",
              )}
            >
              {cell.d}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
            {`${WEEKDAYS_FR[(new Date(Date.UTC(selected.y, selected.mo - 1, selected.d)).getUTCDay() + 6) % 7]}. ${selected.d} ${MONTHS_FR[selected.mo - 1]}`}
          </p>
          {selectedSlots.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {selectedSlots.map((slot) => (
                <button
                  key={slot.label}
                  type="button"
                  onClick={() => openCal(slot)}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory"
                >
                  {slot.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-charcoal-soft">
              Plus de créneau disponible ce jour — choisissez un autre jour.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
