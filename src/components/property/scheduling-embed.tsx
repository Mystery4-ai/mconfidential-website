function buildEmbedUrl(url: string, context: { reference: string; title: string }) {
  try {
    const u = new URL(url);
    const note = `Bien ${context.reference} — ${context.title}`;

    if (u.hostname.includes("calendly.com")) {
      // Strip Calendly's own branding/description chrome so only the
      // calendar + time slots show — the surrounding page already carries
      // the property context.
      u.searchParams.set("hide_event_type_details", "1");
      u.searchParams.set("hide_landing_page_details", "1");
      u.searchParams.set("hide_gdpr_banner", "1");
      // Calendly doesn't support a generic prefilled notes field without a
      // matching custom question, but UTM params are recorded and shown to
      // the host on the booking — enough to identify the property.
      u.searchParams.set("utm_content", context.reference);
    }
    if (u.hostname.includes("cal.com")) {
      // Same idea for Cal.com: embed mode + month view + no event details
      // panel, so visitors see just the calendar and open slots.
      u.searchParams.set("embed", "true");
      u.searchParams.set("layout", "month_view");
      u.searchParams.set("hideEventTypeDetails", "true");
      u.searchParams.set("notes", note);
    }
    return u.toString();
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
  return (
    <div className="overflow-hidden border border-border">
      <iframe
        src={buildEmbedUrl(url, { reference, title })}
        title={`Planifier une visite — ${title}`}
        className="h-[720px] w-full"
        loading="lazy"
      />
    </div>
  );
}
