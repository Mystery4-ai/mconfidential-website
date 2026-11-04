"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { CheckCircle2, FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBrochure, saveBrochureUrl } from "../../actions";

export function BrochureManager({
  propertyId,
  brochureUrl,
}: {
  propertyId: string;
  brochureUrl: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function confirmUpload() {
    if (!file) return;
    setStatus("uploading");
    setError(null);
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 60_000);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
        abortSignal: abortController.signal,
      });
      await saveBrochureUrl(propertyId, blob.url);
      setStatus("success");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (err) {
      setStatus("error");
      if (err instanceof Error && err.name === "AbortError") {
        setError("L’envoi a dépassé 60 secondes sans réponse — réessayez, ou vérifiez votre connexion.");
      } else {
        setError(err instanceof Error ? err.message : "Échec de l’envoi du fichier.");
      }
    } finally {
      clearTimeout(timeout);
    }
  }

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

      <div className="mt-3 space-y-2.5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-charcoal-soft">
            {brochureUrl ? "Remplacer la brochure (PDF)" : "Ajouter la brochure (PDF)"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setStatus("idle");
              setError(null);
            }}
            className="block w-full text-sm text-charcoal-soft file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
          />
        </label>

        {file && status !== "success" && (
          <Button type="button" size="sm" onClick={confirmUpload} disabled={status === "uploading"}>
            {status === "uploading" ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Envoi en cours…
              </>
            ) : (
              <>
                <UploadCloud size={14} /> Confirmer l’envoi
              </>
            )}
          </Button>
        )}

        {status === "success" && (
          <p className="flex items-center gap-1.5 text-xs text-status-published">
            <CheckCircle2 size={14} /> PDF envoyé et confirmé.
          </p>
        )}
        {status === "error" && <p className="text-xs text-status-sold">{error}</p>}
      </div>
    </div>
  );
}
