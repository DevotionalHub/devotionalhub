# Supabase backend setup

The repository contains a migration-first Supabase backend for DevotionalHub. It supports:

- optional reader accounts and private progress;
- editor and administrator roles;
- devotional drafts, review, scheduling, publishing, and revision history;
- World English Bible passages and rights-aware hymn records;
- daily prayer points and per-user prayer completion;
- date-based Bible reading plans and per-user reading completion;
- private monthly DOCX storage and download metadata;
- privacy-conscious activity events and admin-only analytics RPCs.

## 1. Prerequisites

- Node.js 20 or newer
- Docker Desktop or another Docker-compatible runtime for local Supabase
- A Supabase account for the hosted environment

Install the checked-in tooling:

```bash
npm install
```

## 2. Run locally

Docker is required for these commands:

```bash
npm run backend:start
npm run backend:reset
npm run backend:lint
npm run backend:types
```

`backend:start` prints the local API URL, Studio URL, anonymous key, and service-role key. Put local values in `.env.local`, never in `.env.example` or a committed file.

Open local Supabase Studio at `http://127.0.0.1:54323`.

Stop the stack with:

```bash
npm run backend:stop
```

## 3. Create and connect the hosted project

1. Create a project at <https://supabase.com/dashboard>.
2. Choose a strong database password and store it in your password manager. Do not paste it into source code or chat.
3. In this repository, authenticate the CLI in your own browser/terminal:

   ```bash
   npx supabase login
   ```

4. Copy the project reference from **Project Settings -> General**, then link it:

   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

5. Review pending migrations:

   ```bash
   npx supabase db push --dry-run
   ```

6. Apply them:

   ```bash
   npm run backend:push
   ```

7. Generate checked TypeScript types from the hosted schema:

   ```bash
   npm run backend:types:linked
   ```

The CLI may request the database password interactively. Do not put it in a shell script or committed file.

## 4. Configure application environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Find API values in **Supabase Dashboard -> Project Settings -> API**.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_BROWSER_SAFE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_KEY
```

The service-role key bypasses row-level security. It must only be read by trusted server routes and must never use a `NEXT_PUBLIC_` prefix.

## 5. Configure Authentication

In **Authentication -> URL Configuration**:

- set the Site URL to the production site;
- add `http://localhost:3000/auth/callback` for development;
- add the exact production callback URL;
- add exact preview callback URLs only when needed.

In **Authentication -> Providers**, enable Email. Optional reader accounts work well with email OTP or magic links. Before production:

- enable email confirmation;
- configure a production SMTP provider;
- use a minimum password length of at least 8 if passwords are enabled;
- enable CAPTCHA on public sign-up if abuse becomes a problem.

## 6. Create the first administrator

The schema intentionally does not automatically make the first registered person an administrator.

1. Register your own account through Supabase Authentication.
2. In **SQL Editor**, find the account:

   ```sql
   select id, email, created_at
   from auth.users
   order by created_at;
   ```

3. Assign the role using the UUID shown above:

   ```sql
   insert into public.user_roles (user_id, role, granted_by)
   values ('YOUR_USER_UUID', 'admin', 'YOUR_USER_UUID')
   on conflict (user_id, role) do nothing;
   ```

After this bootstrap step, the application admin panel can assign `editor` and `admin` roles. Never assign a staff role based only on browser-supplied profile metadata.

## 7. Storage and monthly downloads

The migrations create a private bucket named `monthly-devotionals` that only accepts DOCX MIME types. Editors can manage files, but normal readers cannot access bucket objects directly.

The application download route must:

1. find a published row in `monthly_documents`;
2. insert a `document_download` event with a random browser session UUID;
3. create a short-lived signed Storage URL using the server-only Supabase client;
4. redirect the reader to that URL.

Do not make the bucket public: direct public URLs would bypass download counting.

## 8. Activity tracking rules

`activity_events` stores only an event type, random session UUID, optional authenticated user ID, related record IDs, small metadata, and time. It deliberately does not store emails, IP addresses, prayer text, or journal entries.

Only trusted server code can insert events. The browser must call an application API route; it must never receive the service-role key. Supported events are:

- `devotional_view`
- `devotional_complete`
- `prayer_complete`
- `bible_reading_complete`
- `bookmark`
- `share`
- `document_download`

The application should disclose analytics use and only persist a browser session identifier according to its consent policy.

Admins can call:

```sql
select public.get_admin_dashboard_summary('2026-09-28', '2026-10-31');
select * from public.get_admin_daily_activity('2026-09-28', '2026-10-31');
```

Non-admin callers receive an authorization error.

## 9. Publishing workflow

A devotional can only be scheduled or published after it has:

- a memory verse;
- a main Bible passage;
- a non-empty message;
- a reviewer and review time;
- a publication time.

Public row-level security also prevents scheduled devotionals from appearing before `published_at` or before their date in the `Africa/Lagos` timezone.

Recommended workflow:

1. editor creates a `draft`;
2. editor submits it as `in_review`;
3. reviewer fills `reviewed_by` and `reviewed_at`;
4. editor sets `published_at` and changes status to `scheduled`;
5. row-level security makes the devotional public automatically when both its Lagos calendar date and publication time arrive.

A scheduled job is not required for publication. The admin interface may later change live `scheduled` records to `published` for clearer editorial reporting, but both states are publicly readable only after their due time.

## 10. Content rights

The seed file registers the public-domain World English Bible but does not copy any Bible passages, hymn lyrics, or devotional messages. Before importing content:

- load Bible text only from an authorized public-domain source;
- verify each hymn is public domain, original, or licensed;
- record hymn rights and attribution in the provided columns;
- keep Open Heavens/RCCG text out of the database unless written permission is obtained.
