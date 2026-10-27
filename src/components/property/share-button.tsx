"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-1.5 text-sm text-charcoal-soft underline underline-offset-4 hover:text-charcoal"
    >
      {copied ? (
        <>
          <Check size={15} strokeWidth={1.5} /> Lien copié
        </>
      ) : (
        <>
          <Share2 size={15} strokeWidth={1.5} /> Partager
        </>
      )}
    </button>
  );
}
