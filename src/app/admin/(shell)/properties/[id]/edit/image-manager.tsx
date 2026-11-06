"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";
import { uploadImages, deleteImage, reorderImages } from "../../actions";

type ImageItem = { id: string; url: string; altText: string | null };

// One request per photo, each shrunk in the browser first: phone photos weigh
// 3-5 MB and several in one request went over the limit in upload-limits.ts,
// which made the action throw and crashed the page.
const MAX_SIDE = 2400;

const isHeic = (file: File) => /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

async function shrink(file: File): Promise<File> {
  const source = URL.createObjectURL(file);
  try {
    // An <img> applies the EXIF rotation of phone photos in every browser.
    const img = document.createElement("img");
    img.src = source;
    await img.decode();
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1 && file.size <= MAX_UPLOAD_BYTES && !isHeic(file)) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.fillStyle = "#fff"; // JPEG has no transparency
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (blob) return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    // A format this browser cannot decode: the checks in upload() decide.
  } finally {
    URL.revokeObjectURL(source);
  }
  return file;
}

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
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const busy = isPending || progress !== null;

  async function upload(files: File[]) {
    if (files.length === 0) return;
    setError(null);
    const failed: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Envoi de la photo ${i + 1} sur ${files.length}…`);
      const name = files[i].name;
      const photo = await shrink(files[i]);
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
      } catch {
        failed.push(`${name} (envoi interrompu)`);
      }
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    if (failed.length > 0) {
      setError(`Pas ajoutées : ${failed.join(" · ")}. Les autres photos sont enregistrées.`);
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
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(() => {
      deleteImage(propertyId, id);
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
      {error && <p className="mt-2 text-sm text-status-sold">{error}</p>}
    </div>
  );
}
