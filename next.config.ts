import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Property/consultant photo uploads go through Server Actions; the
      // 1MB default is too small for real camera photos, especially when
      // uploading several property images in one batch.
      bodySizeLimit: "25mb",
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
