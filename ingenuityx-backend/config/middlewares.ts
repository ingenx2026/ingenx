import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  { name: 'strapi::security', config: { contentSecurityPolicy: { useDefaults: true, directives: { 'frame-src': ["'self'", 'blob:'] } } } },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  { name: 'strapi::body', config: { jsonLimit: '8mb' } },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
