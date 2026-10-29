# Deploy: Vercel + Supabase only

The deployable app is `frontend/`: React website + Vercel API + Supabase database/private CV storage. No Render or Strapi service is required. The legacy backend is retained to preserve local data.

## 1. Supabase

1. Create a project. Run all of `frontend/supabase/schema.sql` in SQL Editor. It creates protected tables, 30 questions, moderation functions and the private `cvs` bucket. Rerunning preserves records/questions.
2. Keep Data API enabled. Do not add public policies to the application tables or CV bucket.
3. Copy your project URL and private **service_role** API key (not the anon/publishable key).
4. Authentication > Users: create an admin with email/password, confirm its email, and copy its UUID. Run:

```sql
insert into public.ix_admins(user_id) values ('YOUR-AUTH-USER-UUID') on conflict do nothing;
```

Public registration needs no account. Admin requires both a Supabase Auth account and this allowlist entry. Public Auth signups can be disabled unless you intend to use them. Google sign-in is not implemented.

## 2. Vercel

Import your Git repository. Set **Root Directory = frontend**, framework Create React App, Node 22.x, build command `yarn build`, output `build`, install command `yarn install --frozen-lockfile`. Alternatively run Vercel CLI from `frontend`.

Upload source, not only the build folder: `/api` is required. `frontend/vercel.json` provides API and SPA routing.

Set these environment variables for Production (and Preview if desired):

| Name | Value |
| --- | --- |
| SUPABASE_URL | https://PROJECT.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | Private service_role key |
| UPLOAD_SIGNING_SECRET | Random secret generated below |
| SITE_URL | Full HTTPS website URL |
| WHAT_IF_START_DATE | 2026-10-27 |
| GENERATE_SOURCEMAP | false |

Generate the upload secret locally:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Never prefix secrets with REACT_APP_. Remove old Render/Strapi settings. Production ignores REACT_APP_BACKEND_URL and uses same-origin `/api`. Redeploy after environment changes. If the site URL is unknown, deploy once, set SITE_URL to the assigned URL, then redeploy. Update it for your custom domain.

## 3. Live verification

- `/api/health` should return `{"ok":true}`.
- Sign in at `/admin` with the allowlisted account.
- Submit a test pre-registration with PDF, confirm it under Students and open its private CV.
- Test volunteer registration and a What if answer. Review/highlight answers in Admin; an approved featured answer from the previous IST day appears publicly.
- Click a tracked CTA and check Analytics. Delete test records afterward.
- Refresh `/register` and `/rooms/marketing` directly to verify deep links.

Admin includes search, CSV export, question editing, approvals/highlights, CV access, deletion and analytics reset. Sessions expire; sign in again when prompted. Manage passwords through Supabase Auth.

## Local development and existing data

Copy `frontend/.env.example` to `frontend/.env.local`, fill in values, then run `npm run dev:api` and `npm start` in separate terminals from frontend. Change any old local REACT_APP_BACKEND_URL to http://localhost:3002. Run `npm run test:api` for automated backend tests.

Existing Strapi/SQLite records and CVs are NOT automatically transferred. That database is untouched. Export/migrate any real local registrations before retiring the legacy backend. Do not upload .env files, SQLite files, private exports or node_modules.

Private saved CVs are under `saved/`. Abandoned uploads are under `pending/`: periodically delete pending objects older than one day through Supabase Storage. Never delete the saved folder. Admin deletion removes the associated saved CV. Keep backups/exports according to your retention needs.

Local tests use mocked Supabase responses. Actual credentials, database schema and Storage must pass the live verification above before production use.
