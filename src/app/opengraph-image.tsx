import { ImageResponse } from "next/og";
import { getAgencySettings } from "@/lib/settings";

// getAgencySettings() goes through Prisma, which isn't Edge-safe — without
// this the route defaults to the Edge runtime (same class of issue as
// auth.config.ts needing to stay Prisma-free for middleware).
export const runtime = "nodejs";

// Prerendering this at build time means hitting the DB during the Vercel
// build step — a cold/sleeping Neon compute timing out there fails the
// whole deployment (see sitemap.ts for the same issue). Rendering per
// request is fine here: this is only ever fetched by link-preview crawlers,
// never by a browser on the user-facing critical path.
export const dynamic = "force-dynamic";

export const alt = "M. Confidential — Agence immobilière à Casablanca & Marrakech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide fallback for any page that doesn't set its own openGraph.images
// (property pages already do, using the listing's own photo). Without this,
// links shared on WhatsApp — the agency's primary channel — showed no
// preview thumbnail at all. Kept to a plain brand-color card rather than a
// hero photo background: Satori (the engine behind ImageResponse) fetches
// remote background images at render time, which is an extra point of
// failure for not much visual gain over clean typography.
export default async function Image() {
  const settings = await getAgencySettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#211e1a",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9a9284",
            marginBottom: 28,
          }}
        >
          {settings.agencyName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            color: "#faf7f2",
            maxWidth: 950,
            lineHeight: 1.15,
          }}
        >
          {settings.tagline || "Agence immobilière premium à Casablanca & Marrakech"}
        </div>
      </div>
    ),
    { ...size }
  );
}
