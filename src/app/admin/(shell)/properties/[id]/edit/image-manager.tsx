"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, Trash2 } from "lucide-react";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";
import { isHeic, shrinkImage } from "@/lib/shrink-image";
import { useSaveToast } from "@/components/ui/save-toast";
import { uploadImages, deleteImage, reorderImages } from "../../actions";

type ImageItem = { id: string; url: string; altText: string | null };

export function ImageManager({
  propertyId,
  images,
}: {
  propertyId: string;
  images: ImageItem[];
}) {
  const [items, setItems] = useState(images);
  // Pick up the fresh list after router.refresh() (useState ignores new props).
  const [prevImages, setPrevImages] = useState(images);
  if (images !== prevImages) {
    setPrevImages(images);
    setItems(images);
  }
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const notifySaved = useSaveToast();
  const busy = isPending || progress !== null;

  async function upload(files: File[]) {
    if (files.length === 0) return;
    setError(null);
    setSuccess(null);
    const failed: string[] = [];
    let uploaded = 0;
    for (let i = 0; i < files.length; i++) {
      setProgress(`Envoi de la photo ${i + 1} sur ${files.length}…`);
      const name = files[i].name;
      const photo = await shrinkImage(files[i]);
      if (isHeic(photo)) {
        failed.push(`${name} (format HEIC illisible ici : ouvrez cette page dans Safari ou envoyez un JPEG)`);
        continue;
      }
      if (photo.size > MAX_UPLOAD_BYTES) {
        failed.push(`${name} (trop lourde)`);
        continue;
      }
      const formData = new FormData();
      formData.append("images", photo);
      try {
        const result = await uploadImages(propertyId, formData);
        if (result.error) failed.push(`${name} (${result.error})`);
        else uploaded++;
      } catch {
        failed.push(`${name} (envoi interrompu)`);
      }
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    if (failed.length > 0) {
      setError(`Pas ajoutées : ${failed.join(" · ")}. Les autres photos sont enregistrées.`);
    }
    if (uploaded > 0) {
      const msg = uploaded === 1 ? "Photo envoyée et ajoutée." : `${uploaded} photos envoyées et ajoutées.`;
      setSuccess(msg);
      notifySaved(msg);
    }
    router.refresh();
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(() => {
      reorderImages(propertyId, next.map((i) => i.id));
      notifySaved("Ordre des photos mis à jour.");
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(() => {
      deleteImage(propertyId, id);
      notifySaved("Photo supprimée.");
    });
  }

  return (
    <div>
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((img, index) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden border border-border">
              <Image src={img.url} alt={img.altText || ""} fill sizes="25vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-charcoal/80 px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || busy}
                  className="text-ivory disabled:opacity-30"
                  aria-label="Déplacer vers la gauche"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  disabled={busy}
                  className="text-ivory hover:text-status-sold"
                  aria-label="Supprimer la photo"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1 || busy}
                  className="text-ivory disabled:opacity-30"
                  aria-label="Déplacer vers la droite"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 bg-ivory px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-charcoal">
                  Couverture
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-medium tracking-wide text-charcoal-soft">
          Ajouter des photos
        </span>
        <input
          ref={inputRef}
          type="file"
          name="images"
          accept="image/*"
          multiple
          disabled={progress !== null}
          onChange={(e) => upload(Array.from(e.target.files ?? []))}
          className="block w-full text-sm text-charcoal-soft file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory disabled:opacity-50"
        />
      </label>
      {progress && <p className="mt-2 text-sm text-charcoal-soft">{progress}</p>}
      {success && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-status-published">
          <CheckCircle2 size={14} /> {success}
        </p>
      )}
      {error && <p className="mt-2 text-sm text-status-sold">{error}</p>}
    </div>
  );
}
