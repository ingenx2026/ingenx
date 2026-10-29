const { fail } = require('./validation.cjs');
function config() {
 const required=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','UPLOAD_SIGNING_SECRET'];
 const missing=required.filter(name=>!process.env[name]?.trim());
 // Report names only: never return or log credentials, tokens, or their values.
 if(missing.length) fail(503,`Deployment configuration missing: ${missing.join(', ')}. Set these for this deployment's environment and redeploy.`);
 return {url:process.env.SUPABASE_URL.trim().replace(/\/$/,''),key:process.env.SUPABASE_SERVICE_ROLE_KEY.trim()};
}
async function request(path, {method='GET',body,headers={},raw=false}={}) {
 const {url,key}=config();
 const response=await fetch(url+path,{method,headers:{apikey:key,Authorization:`Bearer ${key}`,...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},body:body===undefined?undefined:(Buffer.isBuffer(body)?body:JSON.stringify(body)),signal:AbortSignal.timeout(20000)});
 if(!response.ok) { const err=new Error('Database or storage request failed'); err.upstreamStatus=response.status; throw err; }
 if(raw) return response;
 if(response.status===204 || response.headers.get('content-length')==='0') return null;
 const value=await response.text(); return value?JSON.parse(value):null;
}
const db=(path,options)=>request('/rest/v1/'+path,options);
async function user(token) { if(!token) fail(401,'Sign in to continue.'); const {url,key}=config(); const r=await fetch(url+'/auth/v1/user',{headers:{apikey:key,Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(10000)}); if(!r.ok) fail(401,'Your session expired. Sign in again.'); return r.json(); }
async function admin(token) { const u=await user(token); const rows=await db('ix_admins?user_id=eq.'+encodeURIComponent(u.id)+'&select=user_id'); if(!rows.length) fail(403,'Administrator access required.'); return u; }
const objectPath=p=>p.split('/').map(encodeURIComponent).join('/');
async function removeFiles(paths) { if(paths.length) await request('/storage/v1/object/cvs',{method:'DELETE',body:{prefixes:paths}}); }
module.exports={config,request,db,user,admin,objectPath,removeFiles};
