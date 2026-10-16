// Public submission only. No public list, read, update or delete routes.
export default {
  routes: [{ method: 'POST', path: '/pre-registrations', handler: 'pre-registration.submit', config: { auth: false, policies: [], middlewares: [] } }],
};
