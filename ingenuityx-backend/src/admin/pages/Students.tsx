import { useEffect, useRef, useState } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';
import './Students.css';

type Student = { id:number; fullName:string; email:string; college?:string; interests:string[]; opportunities:string[]; skills:string[]; about:string; consentAt:string; reference:string; cvName?:string; hasCv:boolean; cohort:string; createdAt:string };
type Result = { permissions:{canDelete:boolean}; records:Student[]; pagination:{page:number;pageSize:number;total:number;pageCount:number}; stats:{total:number;withCv:number;withoutCv:number} };
const date = (value:string) => value ? new Intl.DateTimeFormat('en-IN', {dateStyle:'medium'}).format(new Date(value)) : '—';
const tags = (items:string[] = []) => items.map(item => <span className="sd-tag" key={item}>{item}</span>);

export default function Students() {
  const { get, del } = useFetchClient();
  const [deleteTarget,setDeleteTarget] = useState<Student|null>(null);
  const [deleting,setDeleting] = useState(false);
  const [deleteError,setDeleteError] = useState('');
  const [notice,setNotice] = useState('');
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const deleteLock = useRef(false);
  const [search,setSearch] = useState('');
  const [cv,setCv] = useState('all');
  const [page,setPage] = useState(1);
  const [refresh,setRefresh] = useState(0);
  const [result,setResult] = useState<Result|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [selected,setSelected] = useState<Student|null>(null);
  const [cvBusy,setCvBusy] = useState<number|null>(null);
  const [fileError,setFileError] = useState('');
  const [preview,setPreview] = useState<{url:string;student:Student}|null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const downloads = useRef<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);setError('');
    const timer=setTimeout(async () => {
      try {
        const {data}=await get<Result>('/student-dashboard/records',{params:{search,cv,page}});
        if(!cancelled) {setResult(data);setSelected(current=>current ? data.records.find(row=>row.id===current.id)||null : null);}
      } catch { if(!cancelled) setError('Could not load students. Check your admin access or try refreshing.'); }
      finally {if(!cancelled)setLoading(false);}
    },250);
    return ()=>{cancelled=true;clearTimeout(timer);};
  },[get,search,cv,page,refresh]);
  useEffect(()=>{if(preview){dialog.current?.showModal();return()=>{URL.revokeObjectURL(preview.url);};}},[preview]);
  useEffect(()=>()=>{downloads.current.forEach(url=>URL.revokeObjectURL(url));},[]);
  useEffect(()=>{if(deleteTarget&&!deleteDialog.current?.open)deleteDialog.current?.showModal();},[deleteTarget]);
  const requestDelete = (student:Student) => {setDeleteError('');setNotice('');setDeleteTarget(student);};
  const deleteProfile = async () => {
    if(!deleteTarget||deleteLock.current)return;
    const student=deleteTarget;
    deleteLock.current=true;setDeleting(true);setDeleteError('');
    try {
      await del(`/student-dashboard/records/${student.id}`);
      setSelected(current=>current?.id===student.id?null:current);
      setPreview(current=>current?.student.id===student.id?null:current);
      setResult(current=>current?{...current,records:current.records.filter(row=>row.id!==student.id)}:current);
      setDeleteTarget(null);setNotice(`${student.fullName}’s profile and any stored CV were deleted.`);
      if(result?.records.length===1&&page>1)setPage(value=>value-1);
      setRefresh(value=>value+1);
    }catch{
      setDeleteError('Could not delete this profile. Refresh the list to check whether it still exists, or try again.');
    }finally{deleteLock.current=false;setDeleting(false);}
  };
  const file = async(student:Student,download:boolean)=>{
    setCvBusy(student.id);setFileError('');
    try {
      const {data}=await get(`/student-dashboard/records/${student.id}/cv`,{responseType:'blob'});
      const url=URL.createObjectURL(new Blob([data],{type:'application/pdf'}));
      if(download){
        downloads.current.push(url);
        const link=document.createElement('a');link.href=url;link.download=student.cvName||'student-cv.pdf';document.body.appendChild(link);link.click();link.remove();
        setTimeout(()=>{URL.revokeObjectURL(url);downloads.current=downloads.current.filter(item=>item!==url);},60000);
      }else setPreview({url,student});
    }catch{setFileError('Could not open this CV. It may have been removed, or your session may have expired. Refresh and try again.');}
    finally{setCvBusy(null);}
  };
  const cvButtons=(student:Student)=>student.hasCv?<div className="sd-cv-actions"><button type="button" disabled={cvBusy!==null} onClick={()=>file(student,false)} aria-label={`View CV for ${student.fullName}`}>{cvBusy===student.id?'Loading…':'View CV'}</button><button type="button" disabled={cvBusy!==null} onClick={()=>file(student,true)} aria-label={`Download CV for ${student.fullName}`}>Download ↓</button></div>:<span className="sd-muted">No CV uploaded</span>;
  return <main className="student-dashboard">
    <header className="sd-header"><div><p className="sd-eyebrow">INGENUITYX / COHORT 01</p><h1>Meet your next<br/><em>first movers.</em></h1><p>Every student. Their strengths. Their next move.</p></div><button className="sd-refresh" type="button" onClick={()=>setRefresh(value=>value+1)} disabled={loading}>↻ Refresh list</button></header>
    <div className="sd-stats" aria-label="Registration statistics"><div><strong>{result?.stats.total??'—'}</strong><span>Students pre-registered</span></div><div><strong>{result?.stats.withCv??'—'}</strong><span>CVs ready to view</span></div><div><strong>{result?.stats.withoutCv??'—'}</strong><span>Profiles without a CV</span></div></div>
    <div className="sd-toolbar"><label>Find a student<input type="search" value={search} maxLength={150} onChange={event=>{setSearch(event.target.value);setPage(1);}} placeholder="Search name, email or college"/></label><label>CV status<select value={cv} onChange={event=>{setCv(event.target.value);setPage(1);}}><option value="all">All students</option><option value="yes">With a CV</option><option value="no">Without a CV</option></select></label></div>
    {notice&&<div className="sd-notice" role="status">{notice}</div>}
    {error&&<div className="sd-error" role="alert">{error}</div>}{fileError&&<div className="sd-error" role="alert">{fileError}</div>}
    <div className={`sd-workspace ${selected?'has-selection':''}`}>
      <section className="sd-list" aria-label="Student list" aria-busy={loading}>
        <div className="sd-list-heading"><h2>Student directory</h2><span aria-live="polite">{loading?'Loading…':`${result?.pagination.total??0} students`}</span></div>
        {!error&&result?.records.length===0&&!loading?<div className="sd-empty"><h3>{search||cv!=='all'?'No matching students.':'Your first movers are on their way.'}</h3><p>{search||cv!=='all'?'Try another search or choose All students.':'New pre-registrations will appear here. Refresh to see the latest.'}</p></div>:<div className="sd-table-scroll"><table><thead><tr><th>Student</th><th>Looking for</th><th>CV</th><th>Profile</th></tr></thead><tbody>{result?.records.map(student=><tr key={student.id} className={selected?.id===student.id?'is-selected':''}><td><strong>{student.fullName}</strong><span>{student.email}</span><small>{student.college||'College not provided'}</small><small>Joined {date(student.createdAt)}</small></td><td><div className="sd-tags">{tags(student.opportunities)}</div></td><td>{cvButtons(student)}</td><td><button type="button" className="sd-profile-button" aria-pressed={selected?.id===student.id} onClick={()=>{setSelected(student);setFileError('');}}>View profile ↗</button>{result?.permissions.canDelete&&<button type="button" className="sd-delete-button" disabled={loading||cvBusy!==null} onClick={()=>requestDelete(student)} aria-label={`Delete profile for ${student.fullName}`}>Delete profile</button>}</td></tr>)}</tbody></table></div>}
        <div className="sd-pagination"><span>Page {result?.pagination.page||1} of {result?.pagination.pageCount||1}</span><div><button type="button" disabled={page===1||loading} onClick={()=>setPage(value=>value-1)}>← Previous</button><button type="button" disabled={loading||!result||page>=result.pagination.pageCount} onClick={()=>setPage(value=>value+1)}>Next →</button></div></div>
      </section>
      {selected&&<aside className="sd-profile" aria-label={`Profile for ${selected.fullName}`}><button className="sd-close" type="button" onClick={()=>setSelected(null)} aria-label="Close student profile">×</button><p className="sd-eyebrow">STUDENT PROFILE</p><div className="sd-avatar" aria-hidden="true">{selected.fullName.slice(0,1).toUpperCase()}</div><h2>{selected.fullName}</h2><a href={`mailto:${selected.email}`}>{selected.email}</a><p className="sd-college">{selected.college||'College not provided'}</p><div className="sd-profile-section"><h3>In their words</h3><p>{selected.about}</p></div><div className="sd-profile-section"><h3>Interests</h3><div className="sd-tags">{tags(selected.interests)}</div></div><div className="sd-profile-section"><h3>Looking for</h3><div className="sd-tags">{tags(selected.opportunities)}</div></div><div className="sd-profile-section"><h3>Skills</h3><div className="sd-tags">{tags(selected.skills)}</div></div><div className="sd-profile-section"><h3>CV / résumé</h3>{cvButtons(selected)}</div><div className="sd-profile-foot">{result?.permissions.canDelete&&<button type="button" className="sd-delete-button" disabled={loading||cvBusy!==null} onClick={()=>requestDelete(selected)}>Delete this profile</button>}<p>{selected.cohort}</p><p>Consent recorded {date(selected.consentAt)}</p><p>Reference: {selected.reference}</p></div></aside>}
    </div>
    <footer className="sd-footer">Private student directory · Visible only to authorized administrators.</footer>
    {preview&&<dialog ref={dialog} className="sd-preview" onCancel={()=>setPreview(null)} onClose={()=>setPreview(null)}><header><div><strong>{preview.student.fullName}</strong><p>{preview.student.cvName}</p></div><div><a href={preview.url} download={preview.student.cvName||'student-cv.pdf'}>Download PDF ↓</a><button type="button" onClick={()=>setPreview(null)} aria-label="Close CV preview">×</button></div></header><iframe title={`CV for ${preview.student.fullName}`} src={preview.url}/><p>If your browser cannot preview PDFs, use Download PDF above.</p></dialog>}
    {deleteTarget&&<dialog ref={deleteDialog} className="sd-delete-dialog" aria-labelledby="sd-delete-title" aria-describedby="sd-delete-description" onCancel={event=>{if(deleting)event.preventDefault();else setDeleteTarget(null);}} onClose={()=>{if(!deleting)setDeleteTarget(null);}}>
      <p className="sd-eyebrow">DELETE STUDENT PROFILE</p><h2 id="sd-delete-title">Delete {deleteTarget.fullName}’s profile?</h2><p className="sd-delete-email">{deleteTarget.email}</p>
      <p id="sd-delete-description">This permanently removes their registration details and uploaded CV from the student database. This cannot be undone. Previously downloaded files and backups are not removed.</p>
      {deleteError&&<p className="sd-error" role="alert">{deleteError}</p>}
      <div className="sd-delete-dialog-actions"><button type="button" autoFocus disabled={deleting} onClick={()=>setDeleteTarget(null)}>Keep profile</button><button type="button" className="sd-delete-confirm" disabled={deleting} onClick={deleteProfile}>{deleting?'Deleting…':'Yes, delete profile'}</button></div>
    </dialog>}
  </main>;
}
