# Free deployment: Vercel + Render + Neon

1. In Neon, create a project on the Free plan. Copy its PostgreSQL connection URL from Connect, with SSL parameters included. Keep this password-bearing URL private.
2. Open https://dashboard.render.com/select-repo?type=blueprint and connect ingenx2026/ingenx, branch main. Render reads render.yaml at the repository root.
3. Supply DATABASE_URL using the Neon URL (only the URL, without psql or surrounding quotes). Review that the web service plan is Free, then deploy. The blueprint sets the Strapi folder, build/start commands, health check and generated secrets. Do not create a Render database.
4. Once healthy, open the Render service URL followed by /admin. Create a new production admin account; local accounts and registrations are not copied. Choose Students to view profiles and private PDF CVs.
5. Vercel project settings: Root Directory frontend. Add REACT_APP_BACKEND_URL equal to the Render HTTPS service URL, without /api or /admin, for Production (and Preview if desired). Redeploy. The URL is embedded at build time.
6. Open /register on the website. Submit a synthetic test registration, verify the confirmation and its appearance under Students, then delete the test record.

Render Free sleeps after inactivity and has ephemeral files. This configuration uses Neon PostgreSQL, never a local SQLite file. Existing student CVs are stored privately in database rows, so database storage quotas include CVs. General Strapi Media Library file uploads are not configured for persistent object storage here. Free hosting memory/compute limits can still require an upgrade; do not switch to a paid plan without reviewing cost. Export and back up real registrations regularly. No production deployment is verified until the end-to-end check passes.
