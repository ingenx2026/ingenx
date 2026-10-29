# Daily What if

The homepage replaces only the former Read / Argue / Build / Submit video section. Hero videos and other sections remain intact.

## Daily questions

The server chooses the day in Asia/Kolkata (India time). Thirty prompts are seeded into **Content Manager → What if — Questions** on startup. Edit the prompt for a dayNumber (1–30) there. The default cycle starts 2026-10-27; day 31 repeats slot 1. Set WHAT_IF_START_DATE=YYYY-MM-DD before launch if a different start is needed. Changing that date changes the schedule. Avoid renumbering slots. Deleted slots are restored from the seed on restart; editing existing prompts is persistent.

Prompts are hypothetical, including those naming Monster, Spotify, Amul, IKEA, Instagram, Duolingo, Netflix and InGenuityX. They do not claim sponsorship or endorsement.

## Review and select

1. Open **Content Manager → What if — Answers** using an administrator account. Grant collection read/update permissions to reviewer admin roles as needed. Do not enable public collection permissions.
2. Filter `questionDay` to the submission date (India calendar date). Review `questionText`, `answer`, `displayName` and `consentAt`.
3. For the selected answer, set **approved = true** and **featured = true**, then Save. Keep other answers unfeatured. Both flags are required.
4. That answer appears on the homepage only on the following India calendar day. Selecting an answer today never exposes it today. A late selection from yesterday appears immediately on the next fetch today; selections older than yesterday are not shown.
5. Uncheck either flag to withdraw the highlight. The browser refreshes once a minute and when returning to the tab. If multiple answers are approved and featured for the same day, the most recently updated is shown (ID breaks ties). Select one to avoid ambiguity.

No automatic scoring or fabricated winner is used. If nothing is selected, the highlight panel stays absent. No cron service is necessary: the server calculates today's question and yesterday's eligible highlight on each request.

## Submissions and endpoints

- `GET /api/what-if/today`: today's date, slot and prompt, plus an explicitly limited public highlight (display name, answer, question text and submission day).
- `POST /api/what-if/answers`: displayName (1–60 characters), answer (20–2,000), day, prompt, consent=true, UUID requestId, and empty honeypot website. Email is required for new submissions and stored privately for admin review; it is never included in public highlights. Older submissions may have no email. No account required. Names and answers are stored privately until selected for publication.
- Server supplies question snapshot, day, consent timestamp and moderation flags. Client-provided approved/featured flags are ignored.
- Retries with the same UUID and payload return success without a duplicate. Changed payload for an already-used UUID conflicts. The frontend preserves the request ID across uncertain retries.
- A stale day or edited prompt receives 409. The frontend keeps the draft and offers an explicit switch to the new question, with instructions to copy the old draft first.
- Eight attempts per 15 minutes per IP, with a bounded memory-only rate-limit map. Use shared gateway limits for a multi-instance deployment. Display names are not verified identities; this does not guarantee one submission per person.
- No public list/read/update/delete route for answers or questions. Strapi Content Manager provides authenticated admin editing.

## Local operation and verification

Start the existing backend with `npm run develop` from `ingenuityx-backend/`. The frontend uses its existing REACT_APP_BACKEND_URL (localhost:1337 locally). Schema creation and seed insertion occur on startup; existing student registration and analytics data are not altered by this feature.

`npm run test:what-if` uses an isolated SQLite file and port 1439. It tests the thirty slots, IST midnight, cycle wrap, actual database persistence, idempotency, validation, stale prompts, server-owned moderation flags, yesterday-only publication, private-field projection, blocked public routes and rate limiting.

No production deployment or automatic publication of user answers is performed by development/testing.

Question sharing: the copy button creates a homepage link with `?whatIf=YYYY-MM-DD#inside`. The API accepts an optional `day` query to load that date�s scheduled prompt. Past questions are read-only; visitors can switch to today to submit. Editing a question slot also updates shared links for that slot.
