"use client";

import { VisitCalendar } from "@/components/property/visit-calendar";

function buildCalendlyUrl(url: string, reference: string) {
  try {
    const u = new URL(url);
    // Calendly officially supports these as plain query params on its embed
    // page — strips branding/description chrome so only the calendar and
    // time slots show.
    u.searchParams.set("hide_event_type_details", "1");
    u.searchParams.set("hide_landing_page_details", "1");
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("utm_content", reference);
    return u.toString();
  } catch {
    return url;
  }
}

/** Extracts the "username/event-type" path Cal.com expects from a full cal.com URL. */
function toCalLink(url: string) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return url;
  }
}

export function SchedulingEmbed({
  url,
  title,
  reference,
}: {
  url: string;
  title: string;
  reference: string;
}) {
  const isCalCom = /(^|\.)cal\.com$/.test(new URL(url, "https://cal.com").hostname || "");

  // Cal.com : on n'affiche PAS l'embed Cal (qui ouvre d'office le premier jour
  // et déroule tous ses créneaux, sans branding). On pose notre propre
  // calendrier au mois, aux couleurs de l'agence, qui passe la main à Cal sur
  // l'écran de confirmation une fois le créneau choisi.
  if (isCalCom) {
    return <VisitCalendar calLink={toCalLink(url)} notes={`Bien ${reference} — ${title}`} />;
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <iframe
        src={buildCalendlyUrl(url, reference)}
        title={`Planifier une visite — ${title}`}
        className="h-[min(88vh,880px)] w-full"
        loading="lazy"
      />
    </div>
  );
}
