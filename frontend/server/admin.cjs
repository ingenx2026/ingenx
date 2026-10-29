const S=require('./supabase.cjs');const V=require('./validation.cjs');
const kinds=['students','volunteers','answers','contacts','challenges','applications'];
async function route(req,res,path,b,url,token) {
 const u=await S.admin(token);const method=req.method;
 if(path==='me'&&method==='GET')return {email:u.email};
 if(path==='questions'&&method==='GET')return {records:await S.db('ix_questions?order=slot.asc')};
 if(path==='questions'&&method==='PATCH'){if(!Number.isInteger(b.slot)||b.slot<1||b.slot>30||!V.text(b.prompt,10,2000))V.fail(400,'Invalid question.');await S.db('ix_questions?slot=eq.'+b.slot,{method:'PATCH',body:{prompt:b.prompt.trim()}});return {saved:true};}
 if(path==='analytics'&&method==='GET'){const days=Number(url.searchParams.get('days')||30);if(![7,30,90].includes(days))V.fail(400,'Invalid period.');const rows=await S.db('rpc/ix_analytics',{method:'POST',body:{p_days:days}});return {rows,total:rows.reduce((n,r)=>n+Number(r.clicks),0)};}
 if(path==='analytics'&&method==='DELETE'){await S.db('ix_records?kind=eq.events',{method:'DELETE'});return {saved:true};}
 if(path==='records'&&method==='GET'){
  const kind=url.searchParams.get('kind');if(!kinds.includes(kind))V.fail(400,'Invalid record type.');
  const page=Math.max(1,Math.min(100000,parseInt(url.searchParams.get('page')||'1',10)||1));
  const search=(url.searchParams.get('search')||'').replace(/[^a-zA-Z0-9 @._-]/g,'').slice(0,100);
  let query=`ix_records?kind=eq.${kind}&order=created_at.desc,id.desc&limit=50&offset=${(page-1)*50}`;
  if(search)query+='&or='+encodeURIComponent(`(email.ilike.*${search}*,data->>fullName.ilike.*${search}*,data->>name.ilike.*${search}*,data->>displayName.ilike.*${search}*)`);
  const response=await S.request('/rest/v1/'+query,{raw:true,headers:{Prefer:'count=exact'}});
  return {records:await response.json(),total:Number(response.headers.get('content-range')?.split('/')[1]||0),page};
 }
 const match=path.match(/^records\/([0-9a-f-]{36})(\/cv)?$/);
 if(match){const id=match[1];const row=(await S.db('ix_records?id=eq.'+id+'&limit=1'))[0];if(!row||!kinds.includes(row.kind))V.fail(404,'Record not found.');
  if(match[2]&&method==='GET'){if(!row.data.cvPath)V.fail(404,'No CV attached.');const result=await S.request('/storage/v1/object/sign/cvs/'+S.objectPath(row.data.cvPath),{method:'POST',body:{expiresIn:60}});return {url:result.signedURL.startsWith('http')?result.signedURL:S.config().url+'/storage/v1'+result.signedURL};}
  if(method==='DELETE'){if(row.data.cvPath)await S.removeFiles([row.data.cvPath]);await S.db('ix_records?id=eq.'+id,{method:'DELETE'});return {saved:true};}
  if(method==='PATCH'){
   if(row.kind==='answers'&&typeof b.featured==='boolean'){await S.db('rpc/ix_feature_answer',{method:'POST',body:{p_id:id,p_featured:b.featured}});return {saved:true};}
   if(['answers','challenges'].includes(row.kind)&&typeof b.approved==='boolean'){await S.db('ix_records?id=eq.'+id,{method:'PATCH',body:{approved:b.approved,...(!b.approved?{featured:false}:{}),updated_at:new Date().toISOString()}});return {saved:true};}
   V.fail(400,'Unsupported change.');
  }
 }
 V.fail(404,'Admin endpoint not found.');
}
module.exports={route};
