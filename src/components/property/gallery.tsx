"use client";

import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { NoDownloadImage } from "./no-download-image";
import { Lightbox } from "./lightbox";

type GalleryImage = { url: string; altText: string | null };

export function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-ivory-dim text-charcoal-soft">
        Photos à venir
      </div>
    );
  }

  const extraCount = images.length - 5;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-1 overflow-hidden rounded-sm md:grid-cols-4 md:grid-rows-2 md:h-[480px]">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label="Agrandir les photos"
          className="relative aspect-[4/3] overflow-hidden bg-ivory-dim md:aspect-auto md:col-span-2 md:row-span-2"
        >
          <NoDownloadImage
            src={images[0].url}
            alt={images[0].altText || title}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </button>

        {images.slice(1, 5).map((img, i) => (
          <button
            key={img.url + i}
            type="button"
            onClick={() => setLightboxIndex(i + 1)}
            aria-label={`Agrandir la photo ${i + 2}`}
            className="relative hidden overflow-hidden bg-ivory-dim md:block"
          >
            <NoDownloadImage src={img.url} alt="" fill sizes="25vw" className="object-cover" />
            {i === 3 && extraCount > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-charcoal/50 text-sm font-medium text-ivory">
                +{extraCount} photos
              </span>
            )}
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <span className="absolute bottom-3 right-3 rounded-full bg-charcoal/80 px-3 py-1 text-xs text-ivory md:hidden">
            {images.length} photos
          </span>
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-sm border border-charcoal bg-ivory px-3 py-2 text-xs font-medium text-charcoal hover:bg-ivory-dim md:flex"
          >
            <LayoutGrid size={14} strokeWidth={1.5} /> Afficher les {images.length} photos
          </button>
        </>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          title={title}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
