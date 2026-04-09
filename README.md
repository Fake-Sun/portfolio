# Portfolio 2026

Next.js + TypeScript portfolio with:

- a public-facing portfolio homepage
- project detail pages
- a CMS-style admin panel at `/admin`
- SQLite-backed content storage in `data/portfolio.sqlite`
- local image uploads stored in `public/uploads`
- editable profile settings plus richer project metadata

## Run locally

```bash
npm install
npm run dev
```

Optional admin protection:

1. Open `/admin`
2. If no admin secret exists yet, create it from the setup form
3. After that, use the same secret in the admin password field before saving, deleting, or uploading

## Content model

The app seeds its first-run data from `src/data/projects.json`, then stores all content in a local SQLite database at `data/portfolio.sqlite`.

The admin secret is also stored locally in the SQLite database after the first setup.

Projects now support:

- client, role, and duration
- cover images and gallery images
- stack, services, metrics, and external links
- featured state and visual accent gradients

Profile settings now support:

- hero headline and intro
- about copy
- email, location, and availability
- focus areas and stat tiles
- editable CTA labels and links

## Deployment note

This setup works well on a persistent filesystem such as your local machine or a VPS.

If you deploy to a serverless platform like Vercel, local SQLite files and uploaded files in `public/uploads` will not behave like durable storage. In that case, move the same schema to a hosted database and object storage.
