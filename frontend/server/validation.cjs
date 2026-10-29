const crypto = require('node:crypto');
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const fail = (status, message) => { throw new HttpError(status, message); };
const text = (v, min, max) => typeof v === 'string' && v.trim().length >= min && v.length <= max;
const email = v => text(v, 3, 254) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const uuid = v => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const cleanEmail = v => v.trim().toLowerCase();
const hash = v => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const indiaDay = (date = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year:'numeric', month:'2-digit', day:'2-digit' }).format(date);
const previousDay = day => new Date(Date.parse(day+'T00:00:00Z')-86400000).toISOString().slice(0,10);
function slot(day) { const start=process.env.WHAT_IF_START_DATE || '2026-10-27'; const n=Math.floor((Date.parse(day+'T00:00:00Z')-Date.parse(start+'T00:00:00Z'))/86400000); if(!Number.isFinite(n)) fail(503,'Invalid question schedule.'); return ((n%30)+30)%30+1; }
function validDay(day) { return typeof day==='string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(Date.parse(day+'T00:00:00Z')) && new Date(day+'T00:00:00Z').toISOString().slice(0,10)===day; }
const TERMS = { version:'2026-10-27-v1', statements:["I’m here for a CV story worth telling—and ready to do the work behind it.","Put my name in the volunteer hat! I know signing up isn’t a confirmed role just yet.","You can save my name, email and location, and email me about volunteering. Let’s talk teamwork!"] };
function student(b) {
 const selection=(v,opts)=>Array.isArray(v)&&v.length>0&&v.length<=opts.length&&new Set(v).size===v.length&&v.every(x=>opts.includes(x));
 if(b.website||!uuid(b.requestId)||!text(b.name,2,100)||!email(b.email)||!text(b.college||'',0,160)||!text(b.about,10,400)||b.consent!==true) fail(400,'Check your name, email, introduction and consent.');
 if(!selection(b.interests,['Marketing','Hackathons','Sustainability','Design','Innovation','Content & creation'])||!selection(b.opportunities,['Job','Internship','Paid project','Side project','PPO'])) fail(400,'Choose your interests and opportunities.');
 if(!Array.isArray(b.skills)||b.skills.length<1||b.skills.length>15||!b.skills.every(x=>text(x,1,40))) fail(400,'Add between 1 and 15 skills.');
 if(b.resume && (!text(b.resume.name,1,180)||!b.resume.name.toLowerCase().endsWith('.pdf')||!text(b.resume.ticket,1,2000))) fail(400,'Upload your CV again.');
 return {fullName:b.name.trim(),email:cleanEmail(b.email),college:(b.college||'').trim(),interests:b.interests,opportunities:b.opportunities,skills:[...new Set(b.skills.map(x=>x.trim()))],about:b.about.trim(),cohort:'Cohort 01 / Nov 2026',cvName:b.resume?b.resume.name.replace(/[^a-zA-Z0-9._ -]/g,'_'):null};
}
function volunteer(b) { if(b.website||!uuid(b.requestId)||!text(b.name,2,100)||!email(b.email)||!text(b.location,2,160)||!Array.isArray(b.agreements)||b.agreements.length!==TERMS.statements.length||b.agreements.some(x=>x!==true)) fail(400,'Check the statements and your details.'); if(b.consentVersion!==TERMS.version) fail(409,'The statements changed. Reload before submitting.'); return {name:b.name.trim(),email:cleanEmail(b.email),location:b.location.trim(),consentVersion:TERMS.version,acknowledgements:TERMS.statements}; }
function answer(b) { if(b.website||!uuid(b.requestId)||!text(b.displayName,1,60)||!email(b.email)||!text(b.answer,20,2000)||!text(b.prompt,10,2000)||!validDay(b.day)||b.consent!==true) fail(400,'Check your name, email, answer and consent.'); return {displayName:b.displayName.trim(),email:cleanEmail(b.email),answer:b.answer.trim(),questionText:b.prompt,questionDay:b.day}; }
function pdf(bytes) { return bytes.length>=8&&bytes.length<=5*1024*1024&&bytes.subarray(0,5).toString()==='%PDF-'&&bytes.subarray(-1024).toString().includes('%%EOF'); }
function sign(payload) { const body=Buffer.from(JSON.stringify(payload)).toString('base64url'); return body+'.'+crypto.createHmac('sha256',process.env.UPLOAD_SIGNING_SECRET).update(body).digest('base64url'); }
function verify(ticket) { try { const [body,sig]=ticket.split('.'); const expected=crypto.createHmac('sha256',process.env.UPLOAD_SIGNING_SECRET).update(body).digest(); const given=Buffer.from(sig||'','base64url'); if(expected.length!==given.length||!crypto.timingSafeEqual(expected,given)) throw Error(); const data=JSON.parse(Buffer.from(body,'base64url')); if(data.exp<Date.now()) throw Error(); return data; } catch { fail(400,'Your upload expired. Please choose the CV again.'); } }
module.exports={HttpError,fail,text,email,uuid,cleanEmail,hash,indiaDay,previousDay,slot,validDay,TERMS,student,volunteer,answer,pdf,sign,verify};
