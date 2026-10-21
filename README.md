# M. Confidential — website & backoffice

Premium real estate marketing site and backoffice for M. Confidential (Casablanca &
Dar Bouazza), rebuilt from scratch in Next.js 16 (App Router, TypeScript), Tailwind
CSS v4, Prisma, and Auth.js.

## Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Turbopack)
- **Styling**: Tailwind CSS v4, custom design tokens (ivory/charcoal/olive palette, Fraunces + Inter)
- **Database**: Prisma ORM 6, SQLite for local dev (`prisma/dev.db`), Postgres-ready for production
- **Auth**: Auth.js (NextAuth v5) with credentials + JWT sessions, role-based access control (ADMIN / CONSULTANT)
- **Images**: local filesystem storage under `public/uploads/properties` (see `src/lib/storage.ts`)

## Getting started

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db and applies the schema
npx prisma db seed       # seeds agency settings, a demo admin + consultant, and 20 real listings
npm run dev
```

Open http://localhost:3000. Backoffice is at `/admin` (redirects to `/admin/login`).

Seeded dev credentials (change immediately in a real deployment):
- `admin@mconfidential.ma` / `ChangeMe123!`
- `consultant@mconfidential.ma` / `ChangeMe123!`

## What's real vs. placeholder

The 20 property listings, their prices, descriptions, photos, and the agency's "About"
copy were imported from the live mconfidential.ma site's public WordPress REST API —
they are genuine, not invented.

What is **not** publicly available and is left as a clearly-labeled placeholder, to be
filled in via `/admin/settings` and `/admin/consultants`:
- Agency phone, WhatsApp, email, and office address
- Real consultant names/profiles (the live site's "agent" pages are unmodified Houzez
  theme demo data — not real people — so none were imported)

The public site degrades gracefully when these are empty (e.g. it shows "Contactez-nous
via le formulaire" instead of a fake phone number).

## Production checklist

Before going live, this still needs:
1. **Database**: point `DATABASE_URL` at a managed Postgres instance (e.g. Vercel
   Postgres/Neon) and change `prisma/schema.prisma`'s datasource `provider` to
   `"postgresql"`.
2. **Image storage**: for serverless/multi-instance hosting, swap
   `src/lib/storage.ts` for an object storage adapter (Vercel Blob, S3) — it's the
   only file that needs to change.
3. **Real agency contact info and consultant accounts**, added via the backoffice.
4. **`AUTH_SECRET`**: generate a fresh one for production (see `.env.example`) and
   store it in your host's secret manager.
5. **`NEXT_PUBLIC_SITE_URL`**: set to the real production domain (used by metadata,
   sitemap.xml, robots.txt).
6. Review and change the seeded admin/consultant passwords.

## Project structure

- `src/app/(public)/` — public site (homepage, listings, property pages, editorial pages)
- `src/app/admin/` — backoffice (auth-gated dashboard, property/consultant/inquiry management)
- `src/lib/` — data access, auth helpers, formatting/labels, storage adapter
- `prisma/schema.prisma` — data model; `prisma/seed.ts` — seed script
