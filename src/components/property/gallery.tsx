"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Gallery({
  images,
  title,
}: {
  images: { url: string; altText: string | null }[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!images.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-ivory-dim text-charcoal-soft">
        Photos à venir
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-ivory-dim">
        <Image
          src={current.url}
          alt={current.altText || title}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-7">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              aria-label={`Afficher la photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-square overflow-hidden",
                i === active ? "ring-2 ring-charcoal" : "opacity-80 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt="" fill sizes="10vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
