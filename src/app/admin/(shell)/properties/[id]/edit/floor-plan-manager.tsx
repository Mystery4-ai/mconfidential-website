"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { CheckCircle2, FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addFloorPlan, deleteFloorPlan } from "../../actions";

type FloorPlanItem = { id: string; label: string; url: string };

export function FloorPlanManager({
  propertyId,
  floorPlans,
}: {
  propertyId: string;
  floorPlans: FloorPlanItem[];
}) {
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [doneCount, setDoneCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function remove(id: string) {
    setPendingDeletes((prev) => new Set(prev).add(id));
    startTransition(async () => {
      await deleteFloorPlan(propertyId, id);
      router.refresh();
    });
  }

  async function confirmUpload() {
    if (files.length === 0) return;
    setStatus("uploading");
    setError(null);
    setDoneCount(0);
    try {
      for (const file of files) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob-upload",
        });
        const label = file.name.replace(/\.pdf$/i, "").trim() || "Plan";
        await addFloorPlan(propertyId, blob.url, label);
        setDoneCount((n) => n + 1);
      }
      setStatus("success");
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Échec de l’envoi du fichier.");
    }
  }

  const visible = floorPlans.filter((p) => !pendingDeletes.has(p.id));

  return (
    <div>
      {visible.length > 0 && (
        <ul className="space-y-2">
          {visible.map((plan) => (
            <li
              key={plan.id}
              className="flex items-center justify-between border border-border bg-white/40 p-3"
            >
              <a
                href={plan.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-charcoal underline underline-offset-4"
              >
                <FileText size={16} strokeWidth={1.5} /> {plan.label}
              </a>
              <button
                type="button"
                onClick={() => remove(plan.id)}
                className="text-charcoal-soft hover:text-status-sold"
                aria-label={`Supprimer le plan ${plan.label}`}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-2.5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-charcoal-soft">
            Ajouter des plans (PDF) — le nom du fichier devient le libellé affiché (ex. « 1er
            étage.pdf »)
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => {
              setFiles(Array.from(e.target.files || []));
              setStatus("idle");
              setError(null);
            }}
            className="block w-full text-sm text-charcoal-soft file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
          />
        </label>

        {files.length > 0 && status !== "success" && (
          <Button type="button" size="sm" onClick={confirmUpload} disabled={status === "uploading"}>
            {status === "uploading" ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Envoi {doneCount}/{files.length}…
              </>
            ) : (
              <>
                <UploadCloud size={14} /> Confirmer l’envoi ({files.length})
              </>
            )}
          </Button>
        )}

        {status === "success" && (
          <p className="flex items-center gap-1.5 text-xs text-status-published">
            <CheckCircle2 size={14} /> {doneCount} plan(s) envoyé(s) et confirmé(s).
          </p>
        )}
        {status === "error" && <p className="text-xs text-status-sold">{error}</p>}
      </div>
    </div>
  );
}
