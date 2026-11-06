/**
 * Vercel refuses any request body over 4.5 MB (HTTP 413, FUNCTION_PAYLOAD_TOO_LARGE),
 * whatever serverActions.bodySizeLimit says. 4 MB leaves room for the multipart envelope.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function tooHeavyMessage(file: File) {
  const size = (file.size / (1024 * 1024)).toFixed(1).replace(".", ",");
  return `${file.name} pèse ${size} Mo : le maximum est 4 Mo. Réduisez le fichier puis réessayez.`;
}
