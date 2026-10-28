"use client";

import { useEffect } from "react";
import CalEmbed, { getCalApi } from "@calcom/embed-react";

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

/** Extracts the "username/event-type" path Cal.com's embed SDK expects from a full cal.com URL. */
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

  useEffect(() => {
    if (!isCalCom) return;
    (async () => {
      const cal = await getCalApi();
      // Cal.com only honors UI config sent through its embed SDK (postMessage
      // handshake) — plain URL query params on the bare booking page are not
      // reliably respected, so this is the one way to actually hide the host
      // name / event description and keep just the calendar + time slots.
      cal("ui", { hideEventTypeDetails: true, layout: "month_view" });
    })();
  }, [isCalCom]);

  if (isCalCom) {
    return (
      <div className="overflow-hidden rounded-sm border border-border">
        <CalEmbed
          calLink={toCalLink(url)}
          config={{ layout: "month_view", notes: `Bien ${reference} — ${title}` }}
          style={{ width: "100%", height: "min(88vh, 880px)", overflow: "hidden" }}
        />
      </div>
    );
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
