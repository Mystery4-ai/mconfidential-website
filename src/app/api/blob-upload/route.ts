import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireUserAction } from "@/lib/auth-helpers";

/**
 * Authorizes direct browser → Vercel Blob uploads (brochure/floor-plan PDFs).
 * The file bytes never pass through a Next.js server function at all, which
 * sidesteps the serverless execution-time limit entirely — the previous
 * server-action-based upload could exceed it on a slower connection with a
 * larger PDF, surfacing as a generic "load failed" in the browser.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        await requireUserAction();
        return {
          allowedContentTypes: ["application/pdf"],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // No-op — the calling component persists the resulting URL itself
        // via a regular Server Action right after upload() resolves.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
