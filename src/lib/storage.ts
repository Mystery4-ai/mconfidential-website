import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { put, del, BlobError } from "@vercel/blob";

/**
 * Why the storage refused a file, in words the person uploading can pass on.
 * Blob messages carry no secret, and without access to the hosting logs they
 * are the only way to know what went wrong.
 */
export function storageFailureReason(err: unknown): string {
  const detail = err instanceof Error ? err.message.replace(/^Vercel Blob:\s*/, "") : String(err);
  return err instanceof BlobError ? `stockage : ${detail}` : `erreur : ${detail}`;
}

/**
 * Property photo storage. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is
 * configured (production — Vercel's filesystem is ephemeral/serverless, so
 * local disk writes wouldn't persist). Falls back to local filesystem
 * storage for local dev, so `npm run dev` works with no extra setup.
 */
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

// Browsers execute script embedded in a directly-opened SVG, and the Blob
// store is public — accepting whatever content-type the client claims would
// let any logged-in user host a disguised HTML/SVG payload on our own
// storage domain. Allowlisting here is the one place every upload funnels
// through, so a future call site can't skip it by accident.
const ALLOWED_TYPES: Record<"image" | "document", Set<string>> = {
  image: new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  document: new Set(["application/pdf"]),
};

export async function saveUploadedImage(
  file: File,
  folder: string = "properties",
  kind: "image" | "document" = "image"
): Promise<string> {
  if (!ALLOWED_TYPES[kind].has(file.type)) {
    throw new Error(
      kind === "document"
        ? "seuls les fichiers PDF sont acceptés"
        : "format d’image non pris en charge (jpeg, png, webp ou gif uniquement)"
    );
  }

  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const filename = `${randomUUID()}.${ext}`;

  if (useBlob) {
    const blob = await put(`${folder}/${filename}`, file, { access: "public" });
    return blob.url;
  }

  const uploadDir = path.join(UPLOAD_ROOT, folder);
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  return `/uploads/${folder}/${filename}`;
}

export async function deleteUploadedImage(url: string) {
  if (useBlob && url.includes(".blob.vercel-storage.com")) {
    try {
      await del(url);
    } catch {
      // already gone — not fatal
    }
    return;
  }

  if (!url.startsWith("/uploads/properties/")) return; // external/hotlinked, nothing to delete
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await unlink(filePath);
  } catch {
    // already gone — not fatal
  }
}
