import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — no providers (Credentials needs Prisma +
 * bcrypt, which aren't Edge-safe and blew the middleware bundle past
 * Vercel's 1MB Edge Function limit). Middleware only needs to read the JWT
 * session cookie, not re-run authorize(), so this subset is all it needs.
 * The full config with the Credentials provider lives in auth.ts and only
 * runs in the Node.js runtime (Server Actions, API routes).
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "CONSULTANT";
      }
      return session;
    },
  },
};
