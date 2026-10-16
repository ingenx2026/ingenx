const { compileStrapi, createStrapi } = require('@strapi/strapi');
const fs = require('node:fs/promises');
const path = require('node:path');
(async () => {
  let app;
  try {
    const context = await compileStrapi();
    app = await createStrapi(context).load();
    const output = path.resolve(process.argv[2] || `private-exports/${new Date().toISOString().replace(/[:.]/g, '-')}`);
    await fs.mkdir(output, { recursive: true, mode: 0o700 });
    const profiles = []; let offset = 0;
    while (true) {
      const batch = await app.db.query('api::pre-registration.pre-registration').findMany({ orderBy: { id: 'asc' }, offset, limit: 100 });
      if (!batch.length) break;
      for (const { cvBase64, ...row } of batch) {
        if (cvBase64) {
          row.cvFile = `${row.id}-${(row.cvName || 'cv.pdf').replace(/[^a-zA-Z0-9._ -]/g, '_')}`;
          await fs.writeFile(path.join(output, row.cvFile), Buffer.from(cvBase64, 'base64'), { mode: 0o600 });
        }
        profiles.push(row);
      }
      offset += batch.length;
    }
    await fs.writeFile(path.join(output, 'profiles.json'), JSON.stringify(profiles, null, 2), { mode: 0o600 });
    const fields = ['reference', 'fullName', 'email', 'college', 'interests', 'opportunities', 'skills', 'about', 'consentAt', 'cvFile'];
    const escape = value => { let text = Array.isArray(value) ? value.join('; ') : String(value ?? ''); if (/^[=+@\-\t\r]/.test(text)) text = "'" + text; return '"' + text.replace(/"/g, '""') + '"'; };
    await fs.writeFile(path.join(output, 'profiles.csv'), [fields.join(','), ...profiles.map(row => fields.map(field => escape(row[field])).join(','))].join('\r\n'), { mode: 0o600 });
    console.log(`Exported ${profiles.length} profiles and their CVs to ${output}`);
  } finally { if (app) await app.destroy(); }
})().catch(() => { console.error('Export failed. Check database configuration and folder permissions.'); process.exitCode = 1; });
