import { Download, Eye, FileText } from "lucide-react";

export function DocumentRow({ label, url, filename }: { label: string; url: string; filename?: string }) {
  const downloadHref = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename || label)}`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-white/40 px-4 py-3 shadow-sm">
      <span className="flex min-w-0 items-center gap-2.5 text-sm text-charcoal">
        <FileText size={16} strokeWidth={1.5} className="shrink-0 text-olive" />
        <span className="truncate">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Aperçu — ${label}`}
          title="Aperçu"
          className="flex h-8 w-8 items-center justify-center text-charcoal-soft transition-colors hover:text-charcoal"
        >
          <Eye size={17} strokeWidth={1.5} />
        </a>
        <a
          href={downloadHref}
          aria-label={`Télécharger — ${label}`}
          title="Télécharger"
          className="flex h-8 w-8 items-center justify-center text-charcoal-soft transition-colors hover:text-charcoal"
        >
          <Download size={17} strokeWidth={1.5} />
        </a>
      </span>
    </div>
  );
}
