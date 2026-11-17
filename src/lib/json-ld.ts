// Plain JSON.stringify doesn't escape "<", so a title or description that
// happens to contain the literal "</script>" (e.g. pasted HTML, or scraped
// third-party text from the Mubawab importer) would close the script tag
// early and let whatever follows run as live HTML/JS — a stored XSS vector.
// The unicode escape is valid inside a JSON string and renders identically.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// Tells Google a page lists multiple properties (the search/city/neighborhood
// pages), which is what unlocks richer "N results" / carousel-style search
// presentation instead of treating the page as a single generic document.
export function propertyListJsonLd(
  properties: { slug: string; title: string }[],
  siteUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: properties.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/biens/${p.slug}`,
      name: p.title,
    })),
  };
}
