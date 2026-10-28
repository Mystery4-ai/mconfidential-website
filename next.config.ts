import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Property/consultant photo uploads go through Server Actions; the
      // 1MB default is too small for real camera photos, especially when
      // uploading several property images in one batch.
      bodySizeLimit: "25mb",
    },
    // The public site is force-dynamic so the server always re-renders with
    // fresh data, but the client-side router cache can still serve an
    // already-visited page from memory for up to 30s on normal link clicks
    // (only a full reload bypasses it). Disabling that window is what makes
    // backoffice edits show up immediately when navigating normally, not
    // just on a hard refresh.
    staleTimes: {
      dynamic: 0,
    },
  },
  async redirects() {
    return [
      // The previous WordPress site served listings at /property/{slug}/.
      // Migrated listings keep the same slug under the new /biens/ path.
      {
        source: "/property/:slug",
        destination: "/biens/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        // Seed property photos are hotlinked from the live WordPress site
        // until real images are uploaded through the backoffice.
        protocol: "https",
        hostname: "mconfidential.ma",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
