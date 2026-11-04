import { NextResponse } from "next/server";
import { requireUserAction } from "@/lib/auth-helpers";

/** Temporary diagnostic route — reveals no secrets, just presence/shape. */
export async function GET() {
  try {
    await requireUserAction();
  } catch {
    return NextResponse.json({ error: "Not authenticated — log into /admin first" }, { status: 401 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return NextResponse.json({
    hasToken: !!token,
    tokenPrefix: token ? token.slice(0, 20) : null,
    tokenLength: token ? token.length : 0,
    hasStoreId: !!process.env.BLOB_STORE_ID,
    hasOidcToken: !!process.env.VERCEL_OIDC_TOKEN,
  });
}
