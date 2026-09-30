# Deploying DevotionalHub to Netlify

This guide fixes the most common production problems: confirmation emails that
lead to a "site can't be reached" page, accounts that never get verified, and
buttons (sign in / sign up) that appear to do nothing.

Almost every one of those symptoms comes from **two dashboards that must be
configured by hand**: Netlify (environment variables) and Supabase (the URLs it
is allowed to redirect to). The code in this repository is already wired up
correctly — it just needs these values.

---

## 1. Netlify build settings

The repository ships a `netlify.toml` that enables the official Next.js runtime
(`@netlify/plugin-nextjs`). This is what makes server features work in
production — the `/auth/callback` route, the request proxy, and pages like
`/today`. If this runtime is missing, confirmation links 404 ("site can't be
reached").

In **Site configuration → Build & deploy**, confirm:

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 20 (already set in `netlify.toml`)

## 2. Netlify environment variables (fixes dead buttons)

If the Supabase keys are missing, the browser cannot talk to Supabase, so
**Sign in / Sign up / Reset password do nothing** (the app now shows a friendly
"temporarily unavailable" message instead of silently failing, but it still
cannot authenticate until these are set).

In **Site configuration → Environment variables**, add:

| Key | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR-PROJECT.supabase.co` | From Supabase → Connect |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | your publishable/anon key | From Supabase → Connect |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-SITE.netlify.app` | Your live domain, **no trailing slash** |
| `SUPABASE_SECRET_KEY` | your secret key | Server-only, never exposed to the browser |

After adding variables, **trigger a new deploy** (Deploys → Trigger deploy →
Clear cache and deploy site). Environment variables are baked in at build time,
so an old build will keep behaving as if they are missing.

## 3. Supabase URL configuration (fixes "site can't be reached" emails)

When someone registers, Supabase sends a confirmation email. The link goes to
Supabase first, which verifies the account and then redirects the reader back to
your site. **If your site's URL is not in Supabase's allow-list, Supabase falls
back to its default "Site URL" — which by default is `http://localhost:3000`.**
That is why the confirmation email opens a page that "can't be reached": it is
sending your visitors to localhost.

Fix it in the Supabase Dashboard under **Authentication → URL Configuration**:

- **Site URL:** `https://YOUR-SITE.netlify.app`
- **Redirect URLs** (add every one of these):
  - `https://YOUR-SITE.netlify.app/**`
  - `https://YOUR-SITE.netlify.app/auth/callback`
  - `http://localhost:3000/**` (optional, for local development)

Save, then send yourself a fresh test registration. Older confirmation emails
generated before this change will still point at the old URL — always test with
a **new** signup.

### Email confirmation on/off

Under **Authentication → Providers → Email**, the **"Confirm email"** toggle
decides whether a new account must click the email link before it can sign in.

- **On (recommended):** the account stays unverified until the link is clicked.
  Make sure Section 3 above is correct or the link will be broken.
- **Off:** accounts are usable immediately after signup with no email step —
  useful if you want to remove the email flow entirely.

## 4. Quick verification checklist

1. Open the live site — the browser tab shows the green DevotionalHub book
   favicon (not a default/Netlify icon).
2. The logo is identical on the home, login, and sign-up pages.
3. Click **Sign up**, register with a real email address.
4. You receive the email, click **Confirm** → you land on the live site
   (`/today`), signed in. No "site can't be reached".
5. Sign out, then **Sign in** with the same credentials — it works.

If step 3 or 5 shows "temporarily unavailable", revisit Section 2 (env vars +
redeploy). If step 4 shows "site can't be reached", revisit Section 3 (Supabase
URL configuration).
