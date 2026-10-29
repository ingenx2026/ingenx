const crypto=require('node:crypto');
const V=require('./validation.cjs');
const S=require('./supabase.cjs');
const enc=encodeURIComponent;
async function existing(kind,id) { return (await S.db(`ix_records?kind=eq.${kind}&request_id=eq.${enc(id)}&limit=1`))[0]; }
async function save(kind,id,data,extra={}) {
 const fingerprint=V.hash(data); const old=await existing(kind,id);
 if(old) { if(old.fingerprint!==fingerprint) V.fail(409,'This request was already used with different details.'); return old; }
 try { return (await S.db('ix_records',{method:'POST',headers:{Prefer:'return=representation'},body:{kind,request_id:id,fingerprint,data,...extra}}))[0]; }
 catch(e) { if(e.upstreamStatus===409) {const row=await existing(kind,id); if(row?.fingerprint===fingerprint) return row; V.fail(409,'A record with these details already exists.');} throw e; }
}
async function rate(req,path) {
 const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
 const key=crypto.createHmac('sha256',process.env.UPLOAD_SIGNING_SECRET).update(path+':'+ip).digest('hex');
 const allowed=await S.db('rpc/ix_rate_limit',{method:'POST',body:{p_key:key,p_limit:path==='cta-events'?60:20,p_seconds:path==='cta-events'?60:900}});
 if(!allowed) V.fail(429,'Too many attempts. Please try again later.');
}
async function question(day) { return (await S.db(`ix_questions?slot=eq.${V.slot(day)}&limit=1`))[0]; }
async function route(req,res,path,b,url) {
 const method=req.method; const token=(req.headers.authorization||'').replace(/^Bearer /,'');
 if(path.startsWith('admin/')) return require('./admin.cjs').route(req,res,path.slice(6),b,url,token);
 if(method==='GET'&&path==='health') { await S.db('ix_questions?select=slot&limit=1'); return {ok:true}; }
 if(method==='GET'&&path==='volunteer-registration') return V.TERMS;
 if(method==='GET'&&path==='what-if/today') {
  const today=V.indiaDay(),day=url.searchParams.get('day')||today;
  if(!V.validDay(day)||day>today) V.fail(400,'Invalid question date.');
  const q=await question(day);if(!q) V.fail(503,'Question setup is incomplete.');
  const chosen=(await S.db(`ix_records?kind=eq.answers&day=eq.${V.previousDay(today)}&approved=eq.true&featured=eq.true&limit=1`))[0];
  return {day,number:q.slot,prompt:q.prompt,acceptingAnswers:day===today,highlight:chosen?{displayName:chosen.data.displayName,answer:chosen.data.answer,prompt:chosen.data.questionText,day:chosen.day}:null};
 }
 if(method==='GET'&&/^challenges\/[0-9a-f-]{36}$/.test(path)) { const row=(await S.db(`ix_records?id=eq.${path.split('/')[1]}&kind=eq.challenges&approved=eq.true`))[0];if(!row)V.fail(404,'Challenge not found.');return {data:{id:row.id,documentId:row.id,...row.data}}; }
 if(method!=='POST') V.fail(405,'Method not allowed.');
 await rate(req,path);
 if(path==='auth/local') {
  if(!V.email(b.identifier)||!V.text(b.password,1,300)) V.fail(400,'Enter your email and password.');
  const {url:base,key}=S.config();const r=await fetch(base+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:b.identifier,password:b.password}),signal:AbortSignal.timeout(15000)});
  if(!r.ok)V.fail(401,'Invalid email or password.');const session=await r.json();return {jwt:session.access_token,user:{id:session.user.id,email:session.user.email}};
 }
 if(path==='cv-upload') {
  if(b.website||!V.uuid(b.requestId)||!V.email(b.email)||!V.text(b.name,1,180)||!b.name.toLowerCase().endsWith('.pdf')||!Number.isInteger(b.size)||b.size<8||b.size>5242880) V.fail(400,'Choose a PDF up to 5 MB.');
  const path=`pending/${crypto.randomUUID()}.pdf`;
  const result=await S.request('/storage/v1/object/upload/sign/cvs/'+path,{method:'POST',body:{}});
  const uploadUrl=result.url.startsWith('http')?result.url:S.config().url+'/storage/v1'+result.url;
  return {uploadUrl,ticket:V.sign({path,requestId:b.requestId,email:V.cleanEmail(b.email),exp:Date.now()+7200000})};
 }
 if(path==='pre-registrations') {
  const data=V.student(b), fingerprint=V.hash({...data,resumeTicket:b.resume?.ticket||null});
  const old=await existing('students',b.requestId);if(old){if(old.fingerprint!==fingerprint)V.fail(409,'This submission has changed.');return {reference:old.data.reference};}
  const duplicate=(await S.db('ix_records?kind=eq.students&email=eq.'+enc(data.email)+'&select=id&limit=1'))[0];
  if(duplicate)return {reference:`IX-${b.requestId.slice(0,18).toUpperCase()}`};
  let cvPath=null;
  if(b.resume) {
   const ticket=V.verify(b.resume.ticket);
   if(ticket.requestId!==b.requestId||ticket.email!==data.email||!/^pending\/[0-9a-f-]+\.pdf$/.test(ticket.path))V.fail(400,'Upload does not match this registration.');
   const response=await S.request('/storage/v1/object/authenticated/cvs/'+ticket.path,{raw:true});
   const bytes=Buffer.from(await response.arrayBuffer());if(!V.pdf(bytes))V.fail(400,'Please upload a valid PDF up to 5 MB.');
   cvPath=`saved/${crypto.randomUUID()}.pdf`;
   await S.request('/storage/v1/object/cvs/'+cvPath,{method:'POST',body:bytes,headers:{'Content-Type':'application/pdf','x-upsert':'false'}});
  }
  const payload={...data,cvPath,reference:`IX-${b.requestId.slice(0,18).toUpperCase()}`,consentAt:new Date().toISOString()};
  try { await S.db('ix_records',{method:'POST',body:{kind:'students',request_id:b.requestId,fingerprint,email:data.email,data:payload}}); }
  catch(e) { if(cvPath)await S.removeFiles([cvPath]).catch(()=>{});const old=await existing('students',b.requestId);if(old?.fingerprint===fingerprint)return {reference:old.data.reference};if(e.upstreamStatus===409&&(await S.db('ix_records?kind=eq.students&email=eq.'+enc(data.email)+'&select=id&limit=1')).length)return {reference:payload.reference};throw e; }
  if(b.resume)await S.removeFiles([V.verify(b.resume.ticket).path]).catch(()=>{});
  return {reference:payload.reference};
 }
 if(path==='volunteer-registration') {const data=V.volunteer(b);const saved=await save('volunteers',b.requestId,data,{email:data.email});return {reference:'VOL-'+saved.id};}
 if(path==='what-if/answers') {
  const data=V.answer(b);const old=await existing('answers',b.requestId);
  if(old){if(old.fingerprint!==V.hash(data))V.fail(409,'This request was already used.');return {saved:true};}
  const q=await question(V.indiaDay());if(b.day!==V.indiaDay()||q?.prompt!==b.prompt)V.fail(409,'The question changed. Refresh to answer today’s prompt.');
  await save('answers',b.requestId,data,{email:data.email,day:b.day});return {saved:true};
 }
 if(path==='cta-events') {
  if(!V.uuid(b.eventId)||!V.text(b.source,1,100)||!/^[a-z0-9-]+$/.test(b.source)||!V.text(b.page,1,120)||!/^\/(?:[a-z0-9-]+\/?){0,3}$/.test(b.page)||!V.text(b.label,1,120))V.fail(400,'Invalid event.');
  await save('events',b.eventId,{source:b.source,page:b.page,label:b.label.trim()});res.statusCode=204;return null;
 }
 const d=b.data||{};
 if(path==='contacts') {
  if(!V.text(d.name,2,100)||!V.email(d.email)||!V.text(d.type,1,80)||!V.text(d.message,10,5000))V.fail(400,'Check your contact details and message.');
  const row=await save('contacts',crypto.randomUUID(),{name:d.name.trim(),email:V.cleanEmail(d.email),type:d.type,message:d.message.trim()},{email:V.cleanEmail(d.email)});return {data:{id:row.id}};
 }
 if(path==='challenges') {
  if(!V.text(d.title,3,200)||!V.text(d.company,2,150)||!V.text(d.description,10,10000))V.fail(400,'Add a title, company and description.');
  const data={};for(const key of ['title','company','type','category','duration','points','description','deadline']){if(d[key]!==undefined&&!V.text(d[key],0,key==='description'?10000:200))V.fail(400,'Invalid challenge.');data[key]=d[key]||'';}
  const row=await save('challenges',crypto.randomUUID(),data);return {data:{id:row.id}};
 }
 if(path==='registrations') {
  const u=await S.user(token);
  if(!V.text(d.challenge,1,100)||!V.text(d.answer1||'',0,5000)||!V.text(d.answer2||'',0,5000))V.fail(400,'Invalid application.');
  const challenge=(await S.db(`ix_records?kind=eq.challenges&id=eq.${enc(d.challenge)}&approved=eq.true&limit=1`))[0];if(!challenge)V.fail(404,'This challenge is not open.');
  const row=await save('applications',u.id+':'+d.challenge,{userId:u.id,email:u.email,challenge:d.challenge,answer1:d.answer1||'',answer2:d.answer2||''},{email:u.email});return {data:{id:row.id}};
 }
 V.fail(404,'Endpoint not found.');
}
async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try {
  S.config();const url=new URL(req.url,'http://localhost');const path=(url.searchParams.get('route')||url.pathname.replace(/^\/api\//,'')).replace(/\/$/,'');
  if(req.headers.origin){const allowed=process.env.SITE_URL?.replace(/\/$/,'');const own='https://'+req.headers.host;const local=process.env.NODE_ENV!=='production'&&/^http:\/\/localhost:\d+$/.test(req.headers.origin);if(req.headers.origin!==own&&req.headers.origin!==allowed&&!local)V.fail(403,'Origin not allowed.');if(local){res.setHeader('Access-Control-Allow-Origin',req.headers.origin);res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS');}}
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}
  let body=req.body||{};if(typeof body==='string'){try{body=JSON.parse(body);}catch{V.fail(400,'Invalid JSON.');}}if(!body||typeof body!=='object'||Array.isArray(body)||JSON.stringify(body).length>40000)V.fail(400,'Invalid request.');
  const result=await route(req,res,path,body,url);if(res.writableEnded)return;if(res.statusCode===204)return res.end();res.statusCode=200;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));
 }catch(e){res.statusCode=e.status||503;if(e.status===429)res.setHeader('Retry-After','900');res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:{message:e.status?e.message:'Service temporarily unavailable. Please retry.'}}));if(!e.status)console.error('API failure',e.name,e.upstreamStatus||'unavailable');}
}
module.exports={handler,route,save,rate};
