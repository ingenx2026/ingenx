const {test,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const V=require('../validation.cjs');
const {handler}=require('../handler.cjs');
process.env.SUPABASE_URL='https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY='test-service-key';
process.env.UPLOAD_SIGNING_SECRET='test-secret';
const originalFetch=global.fetch;
afterEach(()=>{global.fetch=originalFetch;});
const json=body=>new Response(JSON.stringify(body),{headers:{'Content-Type':'application/json'}});
async function invoke(path,method='GET',body={},headers={}) {
 const res={headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;},end(value){this.body=value?JSON.parse(value):null;this.writableEnded=true;}};
 await handler({url:'/api/'+path,method,body,headers:{host:'site.vercel.app',...headers},socket:{remoteAddress:'127.0.0.1'}},res);return res;
}
const id='527b175d-ef18-4fba-a824-d5e4870a5521';
const student={requestId:id,name:'Test Student',email:'TEST@example.com',college:'College',interests:['Marketing'],opportunities:['Internship'],skills:['Writing'],about:'A student exploring creative work.',consent:true};
test('India midnight and repeating 30-day schedule',()=>{
 assert.equal(V.indiaDay(new Date('2026-10-28T18:29:59Z')),'2026-10-28');
 assert.equal(V.indiaDay(new Date('2026-10-28T18:30:00Z')),'2026-10-29');
 assert.equal(V.slot('2026-10-27'),V.slot('2026-11-26'));assert.equal(V.validDay('2026-02-30'),false);
});
test('registration validates consent, interests, skills and honeypot',()=>{
 assert.equal(V.student(student).email,'test@example.com');
 for(const change of [{consent:false},{interests:['Unknown']},{website:'spam'},{skills:[]}])assert.throws(()=>V.student({...student,...change}),{status:400});
});
test('signed uploads reject tampering and expiry; validate PDF',()=>{
 const payload={path:'pending/file.pdf',exp:Date.now()+10000};const token=V.sign(payload);
 assert.deepEqual(V.verify(token),payload);assert.throws(()=>V.verify('x'+token),{status:400});
 assert.throws(()=>V.verify(V.sign({...payload,exp:Date.now()-1})),{status:400});
 assert.equal(V.pdf(Buffer.from('%PDF-1.7\nbody\n%%EOF')),true);assert.equal(V.pdf(Buffer.from('not a pdf document')),false);
});
test('malformed JSON and foreign origins fail before database calls',async()=>{
 global.fetch=()=>{throw Error('Unexpected network');};
 assert.equal((await invoke('pre-registrations','POST','{')).statusCode,400);
 assert.equal((await invoke('pre-registrations','POST',student,{origin:'https://foreign.example'})).statusCode,403);
});
test('admin requires authentication AND allowlisting',async()=>{
 global.fetch=()=>{throw Error('Unexpected network');};
 assert.equal((await invoke('admin/records?kind=students')).statusCode,401);
 global.fetch=async url=>url.includes('/auth/v1/user')?json({id,email:'admin@example.com'}):json([]);
 assert.equal((await invoke('admin/records?kind=students','GET',{}, {authorization:'Bearer valid-user'})).statusCode,403);
});
test('public question redacts private answer fields',async()=>{
 global.fetch=async url=>url.includes('ix_questions')?json([{slot:3,prompt:'What if you ran a bookstore?'}]):json([{day:'2026-10-28',email:'private@example.com',data:{displayName:'Public Name',answer:'A thoughtful public answer.',questionText:'Yesterday question',cvPath:'secret'}}]);
 const res=await invoke('what-if/today');assert.equal(res.statusCode,200);assert.equal(res.body.highlight.displayName,'Public Name');
 assert.equal(JSON.stringify(res.body).includes('private@example'),false);assert.equal(JSON.stringify(res.body).includes('secret'),false);
});
test('registration retry is idempotent and altered retry conflicts',async()=>{
 let row,insertions=0;
 global.fetch=async(url,opts={})=>{
  if(url.includes('ix_rate_limit'))return json(true);
  if(opts.method==='POST'){row=JSON.parse(opts.body);insertions++;return new Response(null,{status:201});}
  if(url.includes('request_id'))return json(row?[row]:[]);return json([]);
 };
 const first=await invoke('pre-registrations','POST',student);const retry=await invoke('pre-registrations','POST',student);
 assert.equal(first.statusCode,200);assert.equal(retry.body.reference,first.body.reference);assert.equal(insertions,1);
 assert.equal((await invoke('pre-registrations','POST',{...student,about:'A different and updated introduction.'})).statusCode,409);
});
test('rate limit stops persistence',async()=>{
 global.fetch=async url=>{assert.match(url,/ix_rate_limit/);return json(false);};
 assert.equal((await invoke('pre-registrations','POST',student)).statusCode,429);
});
test('CV ticket is bound to submission identity',async()=>{
 global.fetch=async url=>url.includes('ix_rate_limit')?json(true):json([]);
 const ticket=V.sign({path:'pending/'+id+'.pdf',requestId:id,email:'another@example.com',exp:Date.now()+10000});
 assert.equal((await invoke('pre-registrations','POST',{...student,resume:{name:'cv.pdf',ticket}})).statusCode,400);
});
