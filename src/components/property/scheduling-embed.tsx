function buildEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    // Both Cal.com and Calendly support these display-cleanup params; harmless if ignored.
    if (u.hostname.includes("calendly.com")) {
      u.searchParams.set("hide_event_type_details", "1");
      u.searchParams.set("hide_gdpr_banner", "1");
    }
    if (u.hostname.includes("cal.com")) {
      u.searchParams.set("embed", "true");
    }
    return u.toString();
  } catch {
    return url;
  }
}

export function SchedulingEmbed({ url, title }: { url: string; title: string }) {
  return (
    <div className="overflow-hidden border border-border">
      <iframe
        src={buildEmbedUrl(url)}
        title={`Planifier une visite — ${title}`}
        className="h-[720px] w-full"
        loading="lazy"
      />
    </div>
  );
}
