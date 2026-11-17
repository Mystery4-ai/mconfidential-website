import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";

// One request per photo, each shrunk in the browser first: phone photos weigh
// 3-5 MB and several in one request went over the limit in upload-limits.ts,
// which made the action throw and crashed the page.
const MAX_SIDE = 2400;

export const isHeic = (file: File) => /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

export async function shrinkImage(file: File): Promise<File> {
  const source = URL.createObjectURL(file);
  try {
    // An <img> applies the EXIF rotation of phone photos in every browser.
    const img = document.createElement("img");
    img.src = source;
    await img.decode();
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1 && file.size <= MAX_UPLOAD_BYTES && !isHeic(file)) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.fillStyle = "#fff"; // JPEG has no transparency
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (blob) return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    // A format this browser cannot decode: the checks in upload() decide.
  } finally {
    URL.revokeObjectURL(source);
  }
  return file;
}
