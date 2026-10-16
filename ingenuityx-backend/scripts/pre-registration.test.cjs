const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { compileStrapi, createStrapi } = require('@strapi/strapi');
process.env.DATABASE_CLIENT = 'sqlite';
process.env.DATABASE_FILENAME = `.tmp/pre-registration-test-${process.pid}.db`;
process.env.PORT = '1437'; process.env.HOST = '127.0.0.1'; process.env.NODE_ENV = 'test';
let app;
(async () => {
  const context = await compileStrapi();
  app = await createStrapi({ ...context, serveAdminPanel: false }).start();
  const base = 'http://127.0.0.1:1437/api/pre-registrations';
  const make = () => ({ name: 'Test Student', email: `test-${randomUUID()}@example.invalid`, college: 'Test College', interests: ['Marketing'], opportunities: ['Internship', 'Paid project'], skills: ['Writing'], about: 'I am a student looking for a real brand project.', consent: true, website: '', requestId: randomUUID() });
  const post = body => fetch(base, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  const noCv = make();
  let response = await post(noCv); assert.equal(response.status, 201); assert.ok((await response.json()).reference);
  const query = app.db.query('api::pre-registration.pre-registration');
  let row = await query.findOne({ where:{email:noCv.email} }); assert.equal(row.fullName, noCv.name); assert.equal(row.cvBase64, null); assert.deepEqual(row.skills, ['Writing']);
  await post(noCv); await post({...noCv,requestId:randomUUID(),about:'This must not overwrite the original.'});
  assert.equal(await query.count({where:{email:noCv.email}}),1); row=await query.findOne({where:{email:noCv.email}}); assert.equal(row.about,noCv.about);
  const withCv=make(); withCv.resume={name:'student.pdf',content:Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF').toString('base64')};
  assert.equal((await post(withCv)).status,201); row=await query.findOne({where:{email:withCv.email}}); assert.equal(row.cvBase64,withCv.resume.content);
  for(const change of [{email:'bad'}, {interests:['Invalid']}, {opportunities:[]}, {skills:[]}, {about:'short'}, {consent:false}, {resume:{name:'fake.pdf',content:Buffer.from('not a PDF').toString('base64')}}, {resume:{name:'big.pdf',content:Buffer.alloc(5*1024*1024+1).toString('base64')}}]) assert.equal((await post({...make(),...change})).status,400);
  assert.equal((await fetch(base)).status,404);
  assert.equal((await fetch(`${base}/${row.documentId}`)).status,404);
  let limited; for(let i=0;i<12;i++) limited=await post(make()); assert.equal(limited.status,429);
  console.log('PASS: saved profiles and private CVs; retries; duplicates; validation; no public reads; rate limiting.');
  if(process.env.KEEP_TEST_SERVER === '1') { console.log('TEST_SERVER_READY: isolated database on port 1437'); return; }
  await app.destroy(); app=null;
})().catch(async error => { console.error(error); if(app) await app.destroy(); process.exitCode=1; });
