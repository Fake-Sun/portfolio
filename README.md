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

## Visual system

The interface uses shadcn-compatible Base UI components, Tailwind CSS v4, Lucide icons, and Motion for scroll effects. The component registry is configured in `components.json`; reusable components live in `src/components/ui`.

`src/app/portfolio.css` contains the public layout and CMS visual refinements. `src/lib/design-copy.ts` holds the additional English/Spanish interface labels. Profile content, project content, authentication, and uploads continue to use the existing CMS and Supabase implementation.

Parallax and floating animations are disabled on small screens and when reduced motion is requested. On desktop, floating accents loop continuously. The page remains readable before JavaScript loads.

Run `npm run typecheck -- --incremental false` for type validation. Use the development server to review the layout; a production build is not required for routine visual changes.

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

### Image editor

The project editor shows cover/gallery previews, actual pixel dimensions, aspect ratios, and resolution guidance. Upload or replace images, add multiple gallery files, reorder them, remove them from the draft, or edit their URLs. Save the project to publish changes. Removing a reference does not delete the file from storage.

- Covers: recommended 2400 x 1500 px (16:10). Other proportions work but leave space in the project card.
- Gallery: recommended 1600 px wide, keeping the original proportions.
- Homepage portraits: recommended 1200 x 1600 px (3:4). Profile settings show the current images for reference; their shared paths are defined in `src/lib/media.ts`, not edited by the settings form.

These are recommendations, not required dimensions. Low-resolution warnings do not block saving. Image controls are shared between English and Spanish; the interface follows the selected language. Uploads show local previews and progress, and project saving is disabled while files upload. Switching projects cancels any pending upload for the old draft.

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
