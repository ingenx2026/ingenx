# CTA analytics

Open `/admin/cta-analytics` in Strapi, or choose **CTA analytics** in the sidebar. Super Admin has access automatically. Other admin roles require **View CTA analytics**.

The report groups clicks by source section/card, page and button label. Choose 7, 30 or 90 days and use Refresh for current counts. It measures click events, not unique people, registration completions or conversion rates. Historical clicks cannot be reconstructed. Blocking analytics or network failures can undercount events.

Events are saved to the Strapi database in `cta_events`. They contain an event UUID, source, path (no query string), visible CTA label and server timestamp. No persistent visitor IDs, cookies, profiles or CVs are collected. The UUID identifies an event only and deduplicates retries. Events older than 90 days are pruned on the next incoming event, at most daily. In-memory IP rate limiting is used for abuse protection; IPs are not written to this table. Reports are admin-only; the only public operation is POST `/api/cta-events`.

`frontend/src/components/CtaAnalytics.jsx` tracks registration links globally. Use `data-cta="stable-source-id"` for a particular CTA or `data-cta-section="section-id"` on its section. Button/div navigation requires `data-cta`. Analytics never blocks navigation. Room card sources use `room-<category>-brief-<number>`; preserve these numbers when editing existing brief copy.
