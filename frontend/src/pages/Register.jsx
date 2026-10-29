import { API_BASE } from '../apiConfig';
import VolunteerRegistration from '../components/VolunteerRegistration';
import { useEffect, useRef, useState } from 'react';
import { VAULT_TEASERS } from '../data/vaultPreviews';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check, Upload, X, Clock, LoaderCircle } from 'lucide-react';
import ingenuityLogo from '../imports/ingenuityx-logo.svg';
import finaleImage from '../imports/step 4.jpg';
import './Register.css';

const API_URL = API_BASE;
const INTERESTS = ['Marketing', 'Hackathons', 'Sustainability', 'Design', 'Innovation', 'Content & creation'];
const OPPORTUNITIES = ['Job', 'Internship', 'Paid project', 'Side project', 'PPO'];
const SKILLS = ['Writing', 'Coding', 'Design', 'Research', 'Social media', 'Presenting', 'Video editing', 'Problem solving'];
const STEPS = ['The basics', 'Your direction', 'Your edge'];
const INITIAL = { name: '', email: '', college: '', interests: [], opportunities: [], skills: [], about: '', consent: false, website: '' };

function ChoiceGroup({ title, description, options, selected, onChange, error, id }) {
  return <fieldset className="reg-choices" aria-describedby={error ? `${id}-error` : undefined}>
    <legend>{title}</legend><p>{description}</p>
    <div className="reg-chips">{options.map(option => <button type="button" key={option} aria-pressed={selected.includes(option)} onClick={() => onChange(option)}>
      {option}<span aria-hidden="true">{selected.includes(option) ? <Check size={14} /> : '+'}</span>
    </button>)}</div>
    {error && <p id={`${id}-error`} className="reg-error">{error}</p>}
  </fieldset>;
}

export default function Register() {
  const location = useLocation();
  const selectedChallenge = VAULT_TEASERS.find(challenge => challenge.id === location.state?.selectedChallengeId);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [cv, setCv] = useState(null);
  const [skill, setSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [slowRequest, setSlowRequest] = useState(false);
  useEffect(() => {
    if (status !== 'sending') { setSlowRequest(false); return; }
    const timer = setTimeout(() => setSlowRequest(true), 10000);
    return () => clearTimeout(timer);
  }, [status]);
  const [receipt, setReceipt] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const confirmationDialog = useRef(null);
  const heading = useRef(null);
  const fileInput = useRef(null);
  const requestId = useRef(null);
  const resumeUpload = useRef(null);
  const sending = useRef(false);
  useEffect(() => { document.title = 'Pre-register | InGenuityX'; return () => { document.title = 'InGenuityX'; }; }, []);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    if (receipt) heading.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, [step, receipt]);
  useEffect(() => {
    if (confirmationOpen && confirmationDialog.current && !confirmationDialog.current.open) {
      confirmationDialog.current.showModal();
    }
  }, [confirmationOpen]);
  const closeConfirmation = () => {
    setConfirmationOpen(false);
    heading.current?.focus({ preventScroll: true });
  };
  const update = (key, value) => { setForm(previous => ({ ...previous, [key]: value })); setErrors(previous => ({ ...previous, [key]: '', submit: '' })); };
  const toggle = (key, value) => {
    const selected = form[key];
    if (!selected.includes(value) && key === 'skills' && selected.length >= 15) return setErrors(previous => ({ ...previous, skills: 'Choose up to 15 skills.' }));
    update(key, selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]);
  };
  const addSkill = () => {
    const value = skill.trim();
    if (!value) return;
    if (!form.skills.some(item => item.toLowerCase() === value.toLowerCase())) {
      if (form.skills.length >= 15) return setErrors(previous => ({ ...previous, skills: 'Choose up to 15 skills.' }));
      update('skills', [...form.skills, value]);
    }
    setSkill('');
  };
  const validate = current => {
    const next = {};
    if (current === 0) {
      if (form.name.trim().length < 2) next.name = 'Add your full name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    }
    if (current === 1) {
      if (!form.interests.length) next.interests = 'Choose at least one interest.';
      if (!form.opportunities.length) next.opportunities = 'Choose at least one opportunity.';
    }
    if (current === 2) {
      if (!form.skills.length) next.skills = 'Choose a skill or add your own.';
      if (form.about.trim().length < 10) next.about = 'Tell us a little about yourself and what you want (at least 10 characters).';
      if (!form.consent) next.consent = 'Please agree so we can save your profile and contact you.';
    }
    return next;
  };
  const chooseFile = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) || file.size > 5 * 1024 * 1024 || file.size === 0) {
      setErrors(previous => ({ ...previous, cv: 'Please choose a PDF up to 5 MB.' }));
      event.target.value = ''; setCv(null); return;
    }
    setCv(file); setErrors(previous => ({ ...previous, cv: '' }));
  };
  const submit = async event => {
    event.preventDefault();
    if (sending.current) return;
    if (step < 2) {
      const next = validate(step); setErrors(next);
      if (Object.keys(next).length) return;
      setStep(step + 1); return;
    }
    for (let index = 0; index < 3; index++) {
      const next = validate(index);
      if (Object.keys(next).length) { setErrors(next); setStep(index); return; }
    }
    sending.current = true; setStatus('sending'); setErrors({});
    try {
      requestId.current ||= crypto.randomUUID();
      let resume = null;
      if (cv && resumeUpload.current?.file === cv && resumeUpload.current?.email === form.email.trim().toLowerCase() && resumeUpload.current.expiresAt > Date.now()) { resume = resumeUpload.current.resume; }
      else if (cv) {
        const { data: upload } = await axios.post(`${API_URL}/api/cv-upload`, { name: cv.name, size: cv.size, email: form.email.trim(), requestId: requestId.current, website: form.website });
        const uploaded = await fetch(upload.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body: cv });
        if (!uploaded.ok) throw new Error('CV upload failed');
        resume = { name: cv.name, ticket: upload.ticket };
        resumeUpload.current = { file: cv, email: form.email.trim().toLowerCase(), resume, expiresAt: Date.now() + 110 * 60 * 1000 };
      }
      const response = await axios.post(`${API_URL}/api/pre-registrations`, { ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), college: form.college.trim(), about: form.about.trim(), resume, requestId: requestId.current }, { timeout: 180000 });
      if (!response.data?.reference) throw new Error('Unexpected response');
      setReceipt(response.data.reference); setConfirmationOpen(true); setCv(null); setForm(INITIAL); setStatus('success');
    } catch (error) {
      setStatus('error');
      const code = error.response?.status;
      if (code === 400 || code === 409) { resumeUpload.current = null; requestId.current = null; }
      const message = code === 429 ? 'A few too many attempts. Please try again in 15 minutes.'
        : code === 413 ? 'Your CV is too large. Choose a PDF up to 5 MB.'
        : code === 400 ? 'Please check your details and PDF, then try again.'
        : code === 409 ? 'Your details changed. Please submit again to save this version.'
        : !error.response ? 'We couldn’t connect. Please check your connection and try again. Your answers are still here.'
        : 'Registration is temporarily unavailable. Your answers are still here. Please try again shortly.';
      setErrors({ submit: message });
    } finally { sending.current = false; }
  };
  const customSkills = form.skills.filter(value => !SKILLS.includes(value));
  return <main className="registration-page">
    <aside className="reg-story">
      <Link className="reg-brand" to="/" aria-label="InGenuityX home"><img src={ingenuityLogo} alt="InGenuityX" /></Link>
      <div className="reg-story-copy"><p className="reg-eyebrow">COHORT 01 / NOV 2026</p><h1>Good ideas <br />need a <br /><em>way in.</em></h1><p>This is yours. Find your people.<br />Build something that gets noticed.</p></div>
      <div className="reg-photo"><img src={finaleImage} alt="Students presenting their ideas on the InGenuityX stage" /><span>YOUR NEXT CHAPTER, IN REAL LIFE. ↗</span></div>
      <div className="reg-story-bottom"><span>DARE → DISCOVER → DO</span><span>01 / FIRST MOVERS</span></div>
    </aside>
    <section className="reg-main" aria-label="Pre-registration">
      <VolunteerRegistration />
      <header className="reg-top"><Link to="/"><ArrowLeft size={15} /> Back to the room</Link><span><Clock size={14} /> ABOUT 60 SECONDS</span></header>
      {receipt ? <div className="reg-success"><span className="reg-success-icon"><Check size={40} /></span><p className="reg-eyebrow" role="status">PRE-REGISTRATION SUCCESSFUL</p><h2 ref={heading} tabIndex={-1}>You’re<br /><em>pre-registered!</em></h2><p>Your profile has been saved successfully. You’re on the list for Cohort 01. We’ll use your email to contact you about relevant opportunities.</p><div className="reg-receipt">YOUR REFERENCE<strong>{receipt}</strong></div><Link className="reg-primary" to="/">Explore the rooms <ArrowUpRight size={20} /></Link></div> : <>
        {selectedChallenge && <aside className="reg-vault-context" aria-label="Selected challenge preview"><p>PRE-REGISTRATION / CHALLENGE PREVIEW</p><strong>{selectedChallenge.title}</strong><span>You’re pre-registering your profile. The full brief is coming soon.</span></aside>}
        <nav className="reg-progress" aria-label="Registration progress">{STEPS.map((label, index) => <button type="button" key={label} disabled={index > step || status === 'sending'} aria-current={index === step ? 'step' : undefined} onClick={() => { setStep(index); setErrors({}); }}><span>{index < step ? <Check size={13} /> : `0${index + 1}`}</span>{label}</button>)}</nav>
        <form onSubmit={submit} noValidate>
          {slowRequest && <p role="status" className="reg-note">Our registration server is waking up. This can take a minute or two. Please keep this page open; your answers are still here.</p>}
          <fieldset className="reg-form-fields" disabled={status === 'sending'}>
            <div className="reg-step-heading"><p className="reg-eyebrow">0{step + 1} / 03 — {STEPS[step]}</p><h2 tabIndex={-1} ref={heading}>{['First, you.', 'Find your thing.', 'Bring your edge.'][step]}</h2><p>{['A name. An email. A foot in the door.', 'What pulls you in? Pick everything that fits.', 'A few skills. A little ambition. That’s all we need.'][step]}</p></div>
            <div className="reg-step" key={step}>
              {step === 0 && <>
                <div className="reg-input-grid"><label>Full name <span>*</span><input name="name" autoComplete="name" value={form.name} maxLength={100} onChange={event => update('name', event.target.value)} placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} required />{errors.name && <small id="name-error" className="reg-error">{errors.name}</small>}</label>
                <label>Email <span>*</span><input name="email" type="email" aria-required="true" autoComplete="email" value={form.email} maxLength={254} onChange={event => update('email', event.target.value)} placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} required />{errors.email && <small id="email-error" className="reg-error">{errors.email}</small>}</label></div>
                <label className="reg-label">College / course <small>OPTIONAL</small><input name="college" autoComplete="organization" value={form.college} maxLength={160} onChange={event => update('college', event.target.value)} placeholder="e.g. B.Des, second year · NID" /></label>
                <div className="reg-cv"><Upload size={24} /><div><strong>{cv ? cv.name : 'Got a CV? Drop it here.'}</strong><p>Optional · PDF, up to 5 MB</p></div><label className="reg-file-button" htmlFor="reg-cv">{cv ? 'Change' : 'Choose PDF'}</label><input ref={fileInput} id="reg-cv" className="reg-file-input" type="file" accept=".pdf,application/pdf" onChange={chooseFile} aria-label="Upload CV" />{cv && <button type="button" aria-label="Remove CV" onClick={() => { setCv(null); fileInput.current.value = ''; }}><X size={18} /></button>}</div>
                {errors.cv && <p role="alert" className="reg-error">{errors.cv}</p>}
                <p className="reg-note">No CV yet? Your skills and your story are enough to get started.</p>
              </>}
              {step === 1 && <>
                <ChoiceGroup id="interests" title="I’m interested in… *" description="Choose the rooms you’d like to explore." options={INTERESTS} selected={form.interests} onChange={value => toggle('interests', value)} error={errors.interests} />
                <ChoiceGroup id="opportunities" title="I’m looking for… *" description="PPO = pre-placement offer. You can pick more than one." options={OPPORTUNITIES} selected={form.opportunities} onChange={value => toggle('opportunities', value)} error={errors.opportunities} />
              </>}
              {step === 2 && <>
                <ChoiceGroup id="skills" title="What are you good at? *" description="Tap your strengths or add your own. Up to 15." options={[...SKILLS, ...customSkills]} selected={form.skills} onChange={value => toggle('skills', value)} error={errors.skills} />
                <div className="reg-add-skill"><input aria-label="Add your own skill" maxLength={40} value={skill} onChange={event => setSkill(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addSkill(); } }} placeholder="Something else? e.g. Figma" /><button type="button" onClick={addSkill} disabled={!skill.trim()}>Add +</button></div>
                <label className="reg-label">You, in a line or two. <span>*</span><textarea name="about" aria-required="true" minLength={10} value={form.about} maxLength={400} rows={3} onChange={event => update('about', event.target.value)} placeholder="I’m a design student who loves storytelling. I want to work on a real brand campaign." aria-invalid={!!errors.about} aria-describedby="about-help" required /></label><div className="reg-text-help" id="about-help"><span>{errors.about || 'Who are you, and what would you love to do next?'}</span><span>{form.about.length}/400</span></div>
                <label className="reg-consent"><input id="registration-consent" name="consent" type="checkbox" aria-required="true" aria-invalid={!!errors.consent} aria-describedby="consent-help" checked={form.consent} onChange={event => update('consent', event.target.checked)} required /><span>I agree that InGenuityX can store my profile and CV (if provided), and contact me about relevant opportunities. <strong className="reg-required">* Required</strong></span></label><p id="consent-help" className={errors.consent ? "reg-error" : "reg-note"}>{errors.consent || (form.consent ? "Thanks — you’re ready to pre-register." : "Tick the checkbox to enable Pre-register.")}</p>
              </>}
            </div>
            <div className="reg-honeypot" aria-hidden="true"><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={event => update('website', event.target.value)} /></label></div>
          </fieldset>
          {errors.submit && <p className="reg-submit-error" role="alert">{errors.submit}</p>}
          <div className="reg-form-bottom">{step > 0 ? <button type="button" className="reg-back" disabled={status === 'sending'} onClick={() => { setStep(step - 1); setErrors({}); }}><ArrowLeft size={16} /> Back</button> : <span className="reg-note">* Required. Keep it simple.</span>}<button className="reg-primary" type="submit" disabled={status === 'sending' || (step === 2 && !form.consent)}>{status === 'sending' ? 'Saving your profile…' : step === 2 ? 'Pre-register' : 'Continue'}{status === 'sending' ? <LoaderCircle className="reg-saving-spinner" size={19} aria-hidden="true" /> : <ArrowRight size={19} />}</button></div>
          <p className="reg-bottom-note" aria-live="polite">{status === 'sending' ? 'Uploading securely to our registration database.' : 'No password. No long essay. Just your next move.'}</p>
        </form>
      </>}
      <footer className="reg-footer"><span>INGENUITYX / FIRST MOVERS</span><span>Be in the room. ↗</span></footer>
    </section>
    {confirmationOpen && <dialog ref={confirmationDialog} className="reg-confirmation" aria-labelledby="registration-confirmed-title" aria-describedby="registration-confirmed-description" onCancel={closeConfirmation} onClose={closeConfirmation}>
      <span className="reg-confirmation-check" aria-hidden="true"><Check size={40} strokeWidth={3} /></span>
      <p className="reg-eyebrow">YOU’RE IN / COHORT 01</p>
      <h2 id="registration-confirmed-title">Pre-registration<br /><em>successful!</em></h2>
      <p id="registration-confirmed-description">Your profile has been saved. You’re on the list, and we’ll contact you about relevant opportunities.</p>
      <div className="reg-receipt">YOUR REGISTRATION REFERENCE<strong>{receipt}</strong></div>
      <button type="button" className="reg-primary" onClick={closeConfirmation} autoFocus>Got it — I’m in <Check size={18} /></button>
    </dialog>}
  </main>;
}
