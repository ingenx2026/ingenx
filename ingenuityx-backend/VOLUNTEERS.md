# Volunteer registration

The Volunteer? disclosure at the top of /register is independent of student pre-registration. All three acknowledgements must be checked before name, email and city/location fields are enabled. No Google login is required.

Review entries in Strapi Content Manager → Volunteer registrations. Each entry records contact details, a reference, the acknowledgement text as accepted, its version and a server timestamp. No public collection routes are provided. Grant access only to appropriate admin reviewer roles.

GET /api/volunteer-registration supplies the current statements and version. POST to the same endpoint validates all acknowledgements, name, email, location, consent version and a UUID requestId. Retries with the same payload and requestId return the existing reference; a changed payload conflicts. The API uses a honeypot and an in-memory limit of eight attempts per IP per fifteen minutes. Shared rate limiting is needed if deployed across multiple instances.

Registration records interest; it does not assign a role, send emails, award certificates or promise employment benefits. No changes are made to student registration or authentication. When changing statements, update VOLUNTEER_CONSENT_VERSION in src/volunteers.ts; historical entries retain the original text.

Run `node scripts/volunteers.test.cjs` from the backend directory for an isolated SQLite integration test on port 1440. Production deployment is separate.
