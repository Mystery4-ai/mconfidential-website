import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Local filesystem image storage for property photos.
 * Production-appropriate for a single-instance deployment; for serverless/
 * multi-instance hosting (e.g. Vercel), swap this for an object storage
 * adapter (Vercel Blob, S3) — only this file needs to change, callers just
 * use saveUploadedImage/deleteUploadedImage.
 */
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "properties");

export async function saveUploadedImage(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/properties/${filename}`;
}

export async function deleteUploadedImage(url: string) {
  if (!url.startsWith("/uploads/properties/")) return; // external/hotlinked, nothing to delete
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await unlink(filePath);
  } catch {
    // already gone — not fatal
  }
}
