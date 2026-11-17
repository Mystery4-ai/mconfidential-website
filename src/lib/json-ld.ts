// Plain JSON.stringify doesn't escape "<", so a title or description that
// happens to contain the literal "</script>" (e.g. pasted HTML, or scraped
// third-party text from the Mubawab importer) would close the script tag
// early and let whatever follows run as live HTML/JS — a stored XSS vector.
// The unicode escape is valid inside a JSON string and renders identically.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
