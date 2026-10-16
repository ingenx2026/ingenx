# One-minute pre-registration

The frontend `/register` page submits to `POST /api/pre-registrations` on `REACT_APP_BACKEND_URL` (local default: http://localhost:1337).

Start the existing backend with `npm run develop` from this directory. It creates the **Pre-registration** collection using your existing Strapi database configuration (SQLite by default; PostgreSQL when configured). In Strapi admin, open **Content Manager → Pre-registration** to review profiles. No public role permissions need to be enabled: only the custom POST submission route is public. There are no public read/update/delete routes.

Profiles store name, email, optional college/course, interests, opportunity types, skills, a short introduction, consent timestamp and cohort. PDF CVs (optional, maximum 5 MB) are stored as private base64 database content, not public media URLs. This makes database backups include CVs; use persistent database storage in production. CV format checks are not malware scanning.

## Student dashboard: view and download CVs

Open `http://localhost:1337/admin/student-dashboard` (or your deployed admin URL), sign in, and choose **Students** in the sidebar. Search by name, email or college; filter for students with/without CVs; open profiles; use **View CV** for an inline PDF preview or **Download** to save the PDF.

Super Admins have access. To grant another admin role access, enable **View student profiles and CVs** under **Student registrations** in Strapi administrator-role settings. These are administrator permissions, not public/users-permissions role permissions. All dashboard requests require admin authentication and this explicit permission. No PDF is copied into public uploads.

Students who skipped the optional CV field show **No CV uploaded**. CVs uploaded before this dashboard was added work automatically; no re-upload or export is needed. Existing registrations without stored CV data cannot produce a PDF.

## Bulk download profiles and CVs

Run `npm run export:pre-registrations` on the backend host with its existing database configuration. This writes `profiles.csv`, `profiles.json` and individual PDFs to a timestamped `private-exports` directory (ignored by Git). Keep exports private. On Windows, use normal account/folder access controls. The export requires local backend/database access and has no public endpoint.

## Behavior

- Server-side field, option, consent, PDF signature and size validation.
- One profile per normalized email; retries and duplicates do not overwrite existing information or disclose the stored profile.
- Basic per-process IP limit: 20 attempts per 15 minutes. For multi-instance production, also apply a shared gateway rate limit and configure trusted proxies correctly.
- Success appears only after database confirmation. Failed requests preserve the in-memory form so users can retry. Refreshing discards the draft; personal data is not kept in localStorage.
- This is pre-registration, not an account creation or verified email flow. No password or OTP is requested.
- Set the deployed frontend API URL to the running backend and use HTTPS. Keep admin access restricted. Back up the persistent database. No submission emails are sent automatically.

## Verification

Run `npm run test:pre-registrations`. The integration test creates a separate `.tmp/pre-registration-test-<pid>.db` and uses port 1437; it never reads or modifies the normal database. It checks persistence with/without a CV, duplicates/retries, invalid fields/files, blocked public reads and rate limiting.

Dashboard integration tests: run `npm run test:student-dashboard`. Tests use only a separate SQLite database and loopback port 1438, including synthetic admin accounts to check allowed/denied access.

## Delete a student profile

In **Students**, use **Delete profile** beside a student or inside their profile panel. Confirm the displayed name and email. This permanently deletes the profile and stored CV from the database; previous exports, downloaded copies and backups are not affected. The list and counts refresh afterward. **Delete student profiles and CVs** is a separate admin permission under Student registrations. Super Admin receives it automatically; admins with view-only access cannot delete.
