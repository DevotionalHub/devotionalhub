# DevotionalHub

An original daily devotional platform with daily messages, Scripture, hymns, prayer points, a Bible reading plan, monthly DOCX downloads, optional reader progress, and an administrative analytics dashboard.

## Backend status

The Supabase backend foundation is defined in version-controlled migrations:

- editorial workflow and revision history;
- optional reader profiles and staff roles;
- devotionals, topics, Scripture, hymns, and prayer points;
- date-based Bible reading plans;
- private reading, prayer, bookmark, and devotional progress;
- private monthly DOCX storage;
- server-recorded activity events and admin-only reporting;
- row-level security for every public-schema table.

See [Supabase backend setup](docs/SUPABASE_SETUP.md) for local development and hosted-project instructions.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

The web app runs at `http://localhost:3000`. Available routes include the landing page, registration, login, password recovery, and the protected `/today` reader page.

For local Supabase development with Docker:

```bash
npm run backend:start
npm run backend:reset
npm run backend:lint
npm run backend:types
```

Supabase Studio is available locally at `http://127.0.0.1:54323` after the stack starts.

## Repository layout

```text
app/                    Next.js pages and authentication routes
components/             Shared brand and authentication UI
lib/supabase/           Browser, server, and session clients
supabase/
  config.toml           Local Supabase configuration
  bootstrap.sql         One-time dashboard setup bundle
  migrations/           Database schema, RLS, analytics, and Storage policies
  seed.sql               Rights-safe lookup and development seed data
scripts/
  build-bootstrap.mjs   Regenerates the dashboard setup bundle
types/
  database.types.ts     Generated Supabase TypeScript types
docs/
  SUPABASE_SETUP.md     Hosted and local setup guide
```

## Security

Copy `.env.example` to `.env.local` and keep all real keys out of Git. The Supabase secret key is server-only and must never be referenced by browser code.
