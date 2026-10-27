"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { NoDownloadImage } from "./no-download-image";
import { cn } from "@/lib/cn";

type LightboxImage = { url: string; altText: string | null };

export function Lightbox({
  images,
  title,
  startIndex,
  onClose,
}: {
  images: LightboxImage[];
  title: string;
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Jump to the opening photo without an animated scroll, lock page scroll.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: startIndex * trackRef.current.clientWidth });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function goTo(i: number) {
    const clamped = Math.max(0, Math.min(images.length - 1, i));
    setZoomed(false);
    trackRef.current?.scrollTo({ left: clamped * trackRef.current.clientWidth, behavior: "smooth" });
    setIndex(clamped);
  }

  function handleScroll() {
    const el = trackRef.current;
    if (!el || zoomed) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal" role="dialog" aria-modal="true">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 text-ivory md:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la galerie"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/60 hover:bg-charcoal/80"
        >
          <X size={20} />
        </button>
        <p className="text-sm">
          {index + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={() => setZoomed((z) => !z)}
          aria-label={zoomed ? "Dézoomer" : "Zoomer"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/60 hover:bg-charcoal/80"
        >
          {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
        </button>
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Photo précédente"
          className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal hover:bg-ivory md:flex"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {index < images.length - 1 && (
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Photo suivante"
          className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal hover:bg-ivory md:flex"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className={cn(
          "flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain",
          zoomed ? "overflow-y-auto" : "overflow-y-hidden"
        )}
      >
        {images.map((img, i) => (
          <div key={img.url + i} className="relative flex h-full w-full shrink-0 snap-center items-center justify-center">
            <button
              type="button"
              onClick={() => i === index && setZoomed((z) => !z)}
              className={cn(
                "relative block h-full w-full",
                i === index && (zoomed ? "cursor-zoom-out" : "cursor-zoom-in")
              )}
            >
              <NoDownloadImage
                src={img.url}
                alt={img.altText || `${title} – photo ${i + 1}`}
                fill
                sizes="100vw"
                className={cn(
                  "object-contain transition-transform duration-200",
                  i === index && zoomed && "scale-[2]"
                )}
                priority={Math.abs(i - startIndex) <= 1}
              />
            </button>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 hidden gap-2 overflow-x-auto bg-charcoal/80 p-3 md:flex">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => goTo(i)}
              aria-label={`Aller à la photo ${i + 1}`}
              className={cn(
                "relative h-14 w-20 shrink-0 overflow-hidden rounded-sm",
                i === index ? "ring-2 ring-ivory" : "opacity-50 hover:opacity-80"
              )}
            >
              <NoDownloadImage src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
