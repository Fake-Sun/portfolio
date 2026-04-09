# Portfolio 2026

Next.js + TypeScript portfolio with:

- a public-facing portfolio homepage
- localized project detail pages
- a CMS-style admin panel at `/admin`
- Supabase-backed content storage
- Supabase Storage uploads for project images
- editable profile settings plus richer project metadata

## Run locally

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_SECRET_KEY=...
SUPABASE_STORAGE_BUCKET=portfolio-assets
```

Use either `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY`. If your dashboard shows the newer `Secret key`, use `SUPABASE_SECRET_KEY`.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run [supabase/schema.sql](./supabase/schema.sql).
3. In Project Settings, copy:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Add those variables to local `.env.local` and to your deployment environment.
5. Make sure the `portfolio-assets` storage bucket exists and is public.

The app will seed its initial content from [src/data/projects.json](./src/data/projects.json) plus the default profile settings on first successful connection.

## Admin flow

1. Open `/admin`.
2. If no admin secret exists yet, create one from the setup form.
3. After that, log in with the same secret.
4. Project/settings edits and image uploads are stored in Supabase.

## Content model

Projects support:

- client, role, and duration
- cover images and gallery images
- stack, services, metrics, and external links
- featured state and visual accent gradients
- separate English and Spanish content fields

Profile settings support:

- hero name, title, and intro
- about copy
- email, location, and availability
- focus areas and stat tiles
- editable CTA labels and links
- separate English and Spanish content fields

## Deployment

Without Supabase environment variables, the public site falls back to seeded content and the live admin is disabled.

With Supabase configured, the deployed site uses hosted storage for both content and uploads, which is suitable for Vercel.
