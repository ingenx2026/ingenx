import { validateSubmission, normalizeSubmission } from '../utils/validation';

const attempts = new Map<string, { count: number; until: number }>();
const WINDOW = 15 * 60 * 1000;
export default {
  async submit(ctx) {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
    const key = ctx.ip;
    let limit = attempts.get(key);
    if (!limit) {
      if (attempts.size >= 10000) { ctx.status = 429; ctx.body = { error: 'Please try again later.' }; return; }
      limit = { count: 0, until: now + WINDOW }; attempts.set(key, limit);
    }
    if (++limit.count > 20) { ctx.set('Retry-After', String(Math.ceil((limit.until - now) / 1000))); ctx.status = 429; ctx.body = { error: 'Please try again later.' }; return; }
    const input = ctx.request.body;
    const error = validateSubmission(input);
    if (error) return ctx.badRequest(error);
    const data = normalizeSubmission(input);
    const query = strapi.db.query('api::pre-registration.pre-registration');
    try {
      const existing = await query.findOne({ where: { $or: [{ email: data.email }, { requestId: data.requestId }] } });
      // Duplicate/retry responses never expose a stored profile or its reference.
      if (!existing) await query.create({ data: { ...data, reference: `IX-${input.requestId.slice(0, 18).toUpperCase()}`, consentAt: new Date().toISOString() } });
      ctx.status = 201;
      ctx.body = { reference: `IX-${input.requestId.slice(0, 18).toUpperCase()}` };
    } catch (error) {
      // A simultaneous retry can race the unique indexes. It is still a successful submission.
      const saved = await query.findOne({ where: { $or: [{ email: data.email }, { requestId: data.requestId }] } }).catch(() => null);
      if (saved) { ctx.status = 201; ctx.body = { reference: `IX-${input.requestId.slice(0, 18).toUpperCase()}` }; return; }
      strapi.log.error('Pre-registration persistence failed');
      ctx.status = 503; ctx.body = { error: 'We could not save your profile. Please try again.' };
    }
  },
};
