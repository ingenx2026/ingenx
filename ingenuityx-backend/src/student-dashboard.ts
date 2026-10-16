import type { Core } from '@strapi/strapi';

export const STUDENT_READ = 'admin::student-dashboard.read';
export const STUDENT_DELETE = 'admin::student-dashboard.delete';
export async function registerStudentDashboard(strapi: Core.Strapi) {
  await strapi.service('admin::permission').actionProvider.register({ uid: 'student-dashboard.read', displayName: 'View student profiles and CVs', pluginName: 'admin', section: 'settings', category: 'student registrations' });
  await strapi.service('admin::permission').actionProvider.register({ uid: 'student-dashboard.delete', displayName: 'Delete student profiles and CVs', pluginName: 'admin', section: 'settings', category: 'student registrations' });
  // Application bootstrap runs after Strapi's built-in Super Admin sync.
  // Add only this new action; preserve all existing role permissions.
  const superAdmin = await strapi.service('admin::role').getSuperAdmin();
  if (superAdmin) {
    for (const action of [STUDENT_READ, STUDENT_DELETE]) {
      const existing = await strapi.db.query('admin::permission').findOne({ where: { action, role: superAdmin.id } });
      if (!existing) await strapi.service('admin::role').addPermissions(superAdmin.id, [{ action }]);
    }
  }
  const config = { policies: ['admin::isAuthenticatedAdmin', { name: 'admin::hasPermissions', config: { actions: [STUDENT_READ] } }] };
  const query = () => strapi.db.query('api::pre-registration.pre-registration');
  strapi.server.routes({ type: 'admin', routes: [
    { method: 'GET', info: { type: 'admin' }, path: '/student-dashboard/records', config, handler: async ctx => {
      ctx.set('Cache-Control', 'no-store');
      if (!ctx.state.user) return ctx.unauthorized();
      const page = Math.max(1, Math.min(100000, Number.parseInt(String(ctx.query.page || '1'), 10) || 1));
      const search = String(ctx.query.search || '').trim().slice(0, 150);
      const cv = String(ctx.query.cv || 'all');
      const where: any = {};
      if (search) where.$or = ['fullName', 'email', 'college'].map(key => ({ [key]: { $containsi: search } }));
      if (cv === 'yes') where.cvBase64 = { $notNull: true };
      if (cv === 'no') where.cvBase64 = { $null: true };
      const [records, total, allStudents, withCv] = await Promise.all([
        query().findMany({ where, select: ['id', 'fullName', 'email', 'college', 'interests', 'opportunities', 'skills', 'about', 'consentAt', 'reference', 'cvName', 'cohort', 'createdAt'], orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], offset: (page - 1) * 20, limit: 20 }),
        query().count({ where }), query().count(), query().count({ where: { cvBase64: { $notNull: true } } }),
      ]);
      ctx.body = { permissions: { canDelete: ctx.state.userAbility.can(STUDENT_DELETE) }, records: records.map(record => ({ ...record, hasCv: Boolean(record.cvName) })), pagination: { page, pageSize: 20, total, pageCount: Math.max(1, Math.ceil(total / 20)) }, stats: { total: allStudents, withCv, withoutCv: allStudents - withCv } };
    } },
    { method: 'GET', info: { type: 'admin' }, path: '/student-dashboard/records/:id/cv', config, handler: async ctx => {
      ctx.set('Cache-Control', 'no-store');
      if (!ctx.state.user) return ctx.unauthorized();
      if (!/^[1-9]\d*$/.test(ctx.params.id)) return ctx.badRequest('Invalid student.');
      const record = await query().findOne({ where: { id: Number(ctx.params.id) }, select: ['cvBase64', 'cvName'] });
      if (!record?.cvBase64) return ctx.notFound('This student has not uploaded a CV.');
      const name = String(record.cvName || 'student-cv.pdf').replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 180);
      ctx.set('Content-Type', 'application/pdf');
      ctx.set('X-Content-Type-Options', 'nosniff');
      ctx.set('Content-Disposition', `inline; filename="${name}"`);
      ctx.body = Buffer.from(record.cvBase64, 'base64');
    } },
    { method: 'DELETE', info: { type: 'admin' }, path: '/student-dashboard/records/:id',
      config: { policies: ['admin::isAuthenticatedAdmin', { name: 'admin::hasPermissions', config: { actions: [STUDENT_READ, STUDENT_DELETE] } }] },
      handler: async ctx => {
        ctx.set('Cache-Control', 'no-store');
        if (!ctx.state.user) return ctx.unauthorized();
        if (!/^[1-9]\d*$/.test(ctx.params.id) || !Number.isSafeInteger(Number(ctx.params.id))) return ctx.badRequest('Invalid student.');
        // The profile and private CV share this one row; deletion removes both.
        const removed = await query().delete({ where: { id: Number(ctx.params.id) }, select: ['id'] });
        if (!removed) return ctx.notFound('This profile has already been deleted.');
        ctx.status = 204;
      },
    },
  ] });
}
