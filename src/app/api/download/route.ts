import { NextRequest } from "next/server";

/**
 * Proxies a document download with a forced Content-Disposition header.
 * A plain <a download> doesn't force a real download for cross-origin URLs
 * (Vercel Blob storage) in most browsers — it just opens/previews the file
 * like a normal link. Restricted to our own Blob storage host to avoid
 * becoming an open fetch proxy.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "document.pdf";
  if (!url) return new Response("Missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(url, req.nextUrl.origin);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  const isOwnOrigin = target.origin === req.nextUrl.origin;
  const isBlobStorage = target.hostname.endsWith(".public.blob.vercel-storage.com");
  if (!isOwnOrigin && !isBlobStorage) {
    return new Response("Forbidden", { status: 403 });
  }

  const upstream = await fetch(target.toString());
  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
    },
  });
}
