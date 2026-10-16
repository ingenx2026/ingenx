import { registerCtaAnalytics } from './cta-analytics';
import type { Core } from '@strapi/strapi';
import { registerStudentDashboard } from './student-dashboard';

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await registerStudentDashboard(strapi);
    await registerCtaAnalytics(strapi);
  },
};
