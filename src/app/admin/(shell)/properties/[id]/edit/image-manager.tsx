"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
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
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

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
                  disabled={index === 0 || isPending}
                  className="text-ivory disabled:opacity-30"
                  aria-label="Déplacer vers la gauche"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  disabled={isPending}
                  className="text-ivory hover:text-status-sold"
                  aria-label="Supprimer la photo"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1 || isPending}
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

      <form
        ref={formRef}
        action={async (formData) => {
          await uploadImages(propertyId, formData);
          formRef.current?.reset();
        }}
        className="mt-4"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-charcoal-soft">
            Ajouter des photos
          </span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={() => formRef.current?.requestSubmit()}
            className="block w-full text-sm text-charcoal-soft file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
          />
        </label>
      </form>
    </div>
  );
}
