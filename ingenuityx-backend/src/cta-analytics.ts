import type { Core } from '@strapi/strapi';
export const ANALYTICS_READ = 'admin::cta-analytics.read';
export async function registerCtaAnalytics(strapi: Core.Strapi) {
  await strapi.service('admin::permission').actionProvider.register({ uid: 'cta-analytics.read', displayName: 'View CTA analytics', pluginName: 'admin', section: 'settings', category: 'student registrations' });
  const role = await strapi.service('admin::role').getSuperAdmin();
  if (role && !await strapi.db.query('admin::permission').findOne({ where: { action: ANALYTICS_READ, role: role.id } })) await strapi.service('admin::role').addPermissions(role.id, [{ action: ANALYTICS_READ }]);
  const events = () => strapi.db.query('api::cta-event.cta-event' as any);
  // Memory-only abuse protection. No IP addresses are written to the analytics database.
  const limits = new Map<string, { count: number; until: number }>();
  let lastCleanup = 0;
  strapi.server.routes([{ method: 'POST', path: '/api/cta-events', config: { auth: false }, handler: async ctx => {
    const now = Date.now();
    for (const [ip, item] of limits) if (item.until < now) limits.delete(ip);
    const key = ctx.ip || 'unknown';
    const limit = limits.get(key) || { count: 0, until: now + 60000 };
    if (++limit.count > 60 || (!limits.has(key) && limits.size >= 10000)) { ctx.status = 429; return; }
    limits.set(key, limit);
    const body = ctx.request.body || {};
    if (typeof body.eventId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.eventId) || typeof body.source !== 'string' || !/^[a-z0-9-]{1,100}$/.test(body.source) || typeof body.page !== 'string' || !/^\/(?:[a-z0-9-]+\/?){0,3}$/.test(body.page) || body.page.length > 120 || typeof body.label !== 'string' || !body.label.trim() || body.label.length > 120) return ctx.badRequest('Invalid click event.');
    const data = { eventId: body.eventId, source: body.source, page: body.page, label: body.label.trim() };
    if (!await events().findOne({ where: { eventId: data.eventId }, select: ['id'] })) {
      try { await events().create({ data }); }
      catch (error) { if (!await events().findOne({ where: { eventId: data.eventId }, select: ['id'] })) throw error; }
    }
    if (now - lastCleanup > 86400000) { lastCleanup = now; await events().deleteMany({ where: { createdAt: { $lt: new Date(now - 90 * 86400000).toISOString() } } }); }
    ctx.status = 204;
  } }]);
  strapi.server.routes({ type: 'admin', routes: [{ method: 'GET', info: { type: 'admin' }, path: '/cta-analytics/summary', config: { policies: ['admin::isAuthenticatedAdmin', { name: 'admin::hasPermissions', config: { actions: [ANALYTICS_READ] } }] }, handler: async ctx => {
    if (!ctx.state.user) return ctx.unauthorized();
    ctx.set('Cache-Control', 'no-store');
    const days = [7, 30, 90].includes(Number(ctx.query.days)) ? Number(ctx.query.days) : 30;
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const table = strapi.db.metadata.get('api::cta-event.cta-event').tableName;
    const rows = await strapi.db.connection(table).where('created_at', '>=', new Date(since)).select('source', 'page', 'label').count({ clicks: '*' }).max({ lastClick: 'created_at' }).groupBy('source', 'page', 'label').orderBy('clicks', 'desc');
    ctx.body = { days, since, total: rows.reduce((sum, row) => sum + Number(row.clicks), 0), rows: rows.map(row => ({ ...row, clicks: Number(row.clicks) })) };
  } }] });
}
