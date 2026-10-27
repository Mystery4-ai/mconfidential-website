import Image, { ImageProps } from "next/image";
import { CSSProperties } from "react";

/**
 * Next/Image wrapper that deters casual saving (right-click, drag,
 * iOS long-press "Save Image"). Not a real DRM — the bytes still reach the
 * browser — but it covers the common accidental-save paths.
 */
export function NoDownloadImage({ alt, style, className, ...props }: ImageProps) {
  const mergedStyle: CSSProperties = { ...style, WebkitTouchCallout: "none" };

  return (
    <Image
      {...props}
      alt={alt}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      style={mergedStyle}
      className={`select-none ${className ?? ""}`}
    />
  );
}
