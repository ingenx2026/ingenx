import type { StrapiApp } from '@strapi/strapi/admin';
import { User } from '@strapi/icons';
export default {
  config: {},
  register(app: StrapiApp) {
    app.addMenuLink({ to: 'cta-analytics', icon: User, intlLabel: { id: 'cta-analytics.title', defaultMessage: 'CTA analytics' }, permissions: [{ action: 'admin::cta-analytics.read', subject: null }], Component: () => import('./pages/CtaAnalytics'), position: 4 });
    app.addMenuLink({ to: 'student-dashboard', icon: User, intlLabel: { id: 'student-dashboard.title', defaultMessage: 'Students' }, permissions: [{ action: 'admin::student-dashboard.read', subject: null }], Component: () => import('./pages/Students'), position: 3 });
  },
};
