import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Uses the Edge-safe config directly (not @/auth) — middleware only needs to
// read the JWT session cookie, and pulling in the full config (Prisma +
// bcrypt via the Credentials provider) blew the Edge Function past Vercel's
// 1MB size limit.
const { auth } = NextAuth(authConfig);

// The third-party surface this site actually embeds: Google Maps (iframe on
// property/neighborhood pages), Calendly (iframe, for agencies using it
// instead of Cal.com — the Cal.com path opens a new tab via window.open,
// which CSP doesn't govern), and our own Blob storage / hotlinked photo
// hosts (Mubawab, the old WordPress media library, the Nestpro CRM bucket).
function cspHeaderValue(nonce: string) {
  // React's dev-mode debugging (stack-trace reconstruction) calls eval() —
  // harmless (dev-only, never shipped), but without 'unsafe-eval' it floods
  // the local console with errors. Production never needs it.
  const scriptSrc =
    process.env.NODE_ENV === "production"
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`;
  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://*.public.blob.vercel-storage.com https://confidentiel.ma https://www.mubawab-media.com https://nestpro.s3.eu-west-3.amazonaws.com",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-src https://www.google.com https://calendly.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

export default auth((req) => {
  const { nextUrl } = req;

  // Per-request nonce so inline scripts Next.js generates for hydration can
  // be allow-listed individually, instead of blanket-trusting every inline
  // script with 'unsafe-inline' (which defeats the point of a script-src
  // policy). Next reads the nonce back out of this same request's CSP
  // header to stamp its own scripts with it.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = cspHeaderValue(nonce);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  function withCsp(response: NextResponse) {
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  if (nextUrl.pathname.startsWith("/admin")) {
    const isLoggedIn = !!req.auth;
    const isLoginPage = nextUrl.pathname === "/admin/login";

    if (isLoginPage) {
      if (isLoggedIn) {
        return withCsp(NextResponse.redirect(new URL("/admin", nextUrl)));
      }
      return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
    }

    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return withCsp(NextResponse.redirect(loginUrl));
    }
  }

  return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
});

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
