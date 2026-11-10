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

export async function saveUploadedImage(file: File, folder: string = "properties"): Promise<string> {
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
