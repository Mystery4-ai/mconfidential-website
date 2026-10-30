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
      // --- Redirects from the previous WordPress/Houzez site (mconfidential.ma) ---
      // Only real, content-bearing old URLs are mapped below. The old site also
      // had ~20 unused Houzez theme demo pages (layout-full-width, home-splash,
      // with-parallax, sample-page, fake "agent" bios, etc.) and empty category
      // archives — those never had real content or backlink value, so they're
      // deliberately left to 404 rather than redirected.

      // Listings kept their WordPress slug under the new /biens/ path.
      {
        source: "/property/:slug",
        destination: "/biens/:slug",
        permanent: true,
      },

      // Property type archives → equivalent filtered search on the new site.
      { source: "/property-type/appartement", destination: "/biens?type=APARTMENT", permanent: true },
      { source: "/property-type/maison", destination: "/biens?type=HOUSE", permanent: true },
      { source: "/property-type/villa", destination: "/biens?type=VILLA", permanent: true },
      { source: "/property-type/ryad", destination: "/biens?type=RIAD", permanent: true },
      { source: "/property-type/studio", destination: "/biens", permanent: true }, // no dedicated "studio" type on the new site

      // Real content pages → closest equivalent on the new site.
      { source: "/about-us", destination: "/agence", permanent: true },
      { source: "/a-propos-de-nous", destination: "/agence", permanent: true },
      { source: "/presentation", destination: "/agence", permanent: true },
      { source: "/our-agents", destination: "/agence", permanent: true },
      { source: "/vendre", destination: "/estimation", permanent: true },
      { source: "/contact-fr", destination: "/contact", permanent: true },
      { source: "/conciergerie", destination: "/agence", permanent: true }, // no dedicated page yet
      { source: "/actualites", destination: "/guides", permanent: true },
      { source: "/blog", destination: "/guides", permanent: true },

      // The 3 real blog posts have no matching article on the new site yet —
      // send them to the guides index rather than a mismatched specific guide.
      { source: "/honoraires-dagence-immobiliere-au-maroc-ce-quil-faut-savoir", destination: "/guides", permanent: true },
      { source: "/les-meilleures-ecoles-internationales-a-casablanca-dar-bouazza", destination: "/guides", permanent: true },
      { source: "/10-raisons-de-sexpatrier-au-maroc", destination: "/guides", permanent: true },
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
      {
        // Listings hotlinked from the agency's Mubawab.ma portal import.
        protocol: "https",
        hostname: "www.mubawab-media.com",
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
