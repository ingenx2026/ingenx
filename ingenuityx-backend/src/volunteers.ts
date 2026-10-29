import { randomUUID } from 'node:crypto';

export const VOLUNTEER_CONSENT_VERSION = '2026-10-27-v1';
export const VOLUNTEER_ACKNOWLEDGEMENTS = [
  "I’m here for a CV story worth telling—and ready to do the work behind it.",
  "Put my name in the volunteer hat! I know signing up isn’t a confirmed role just yet.",
  "You can save my name, email and location, and email me about volunteering. Let’s talk teamwork!"
];

export function registerVolunteers(strapi: any) {
  const registrations = () => strapi.db.query('api::volunteer.volunteer');
  const limits = new Map<string, { count: number; until: number }>();
  strapi.server.routes([
    { method: 'GET', path: '/api/volunteer-registration', config: { auth: false }, handler: ctx => {
      ctx.set('Cache-Control', 'no-store');
      ctx.body = { version: VOLUNTEER_CONSENT_VERSION, statements: VOLUNTEER_ACKNOWLEDGEMENTS };
    } },
    { method: 'POST', path: '/api/volunteer-registration', config: { auth: false }, handler: async ctx => {
      ctx.set('Cache-Control', 'no-store');
      const now = Date.now();
      for (const [key, limit] of limits) if (limit.until <= now) limits.delete(key);
      const key = ctx.ip || 'unknown';
      const limit = limits.get(key) || { count: 0, until: now + 15 * 60000 };
      if ((!limits.has(key) && limits.size >= 10000) || ++limit.count > 8) {
        ctx.status = 429; ctx.set('Retry-After', '900'); ctx.body = { error: 'Please try again in 15 minutes.' }; return;
      }
      limits.set(key, limit);
      const input = ctx.request.body || {};
      const validText = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.length <= max;
      if (!validText(input.name, 2, 100) || !validText(input.location, 2, 160) || !validText(input.email, 3, 254)
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.website
        || !Array.isArray(input.agreements) || input.agreements.length !== VOLUNTEER_ACKNOWLEDGEMENTS.length || input.agreements.some(value => value !== true)
        || typeof input.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) {
        return ctx.badRequest('Check all statements and enter your name, email and location.');
      }
      if (input.consentVersion !== VOLUNTEER_CONSENT_VERSION) return ctx.conflict('The statements have changed. Reload them before submitting.');
      const details = { name: input.name.trim(), email: input.email.trim().toLowerCase(), location: input.location.trim() };
      const same = row => row && row.name === details.name && row.email === details.email && row.location === details.location && row.consentVersion === input.consentVersion;
      let saved = await registrations().findOne({ where: { requestId: input.requestId } });
      if (saved && !same(saved)) return ctx.conflict('This request was already saved with different details.');
      if (!saved) {
        try {
          saved = await registrations().create({ data: { ...details, requestId: input.requestId, reference: `VOL-${randomUUID()}`, consentVersion: VOLUNTEER_CONSENT_VERSION, consentAt: new Date().toISOString(), acknowledgements: VOLUNTEER_ACKNOWLEDGEMENTS } });
        } catch {
          saved = await registrations().findOne({ where: { requestId: input.requestId } });
          if (!same(saved)) { ctx.status = 503; ctx.body = { error: 'Unable to save. Please retry.' }; return; }
        }
      }
      ctx.status = 201; ctx.body = { reference: saved.reference };
    } }
  ]);
}
