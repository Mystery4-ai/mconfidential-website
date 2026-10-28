import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { put, del } from "@vercel/blob";

/**
 * Property photo storage. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is
 * configured (production — Vercel's filesystem is ephemeral/serverless, so
 * local disk writes wouldn't persist). Falls back to local filesystem
 * storage for local dev, so `npm run dev` works with no extra setup.
 */
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "properties");

export async function saveUploadedImage(file: File): Promise<string> {
  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const filename = `${randomUUID()}.${ext}`;

  if (useBlob) {
    const blob = await put(`properties/${filename}`, file, { access: "public" });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filePath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  return `/uploads/properties/${filename}`;
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
