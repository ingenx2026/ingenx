import { API_BASE } from '../apiConfig';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API = API_BASE;

export default function VolunteerRegistration() {
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState(null);
  const [agreements, setAgreements] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', location: '', website: '' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [reference, setReference] = useState('');
  const [retry, setRetry] = useState(0);
  const sending = useRef(false);
  const requestId = useRef(null);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setError('');
    axios.get(`${API}/api/volunteer-registration`, { signal: controller.signal, timeout: 30000 }).then(({ data }) => {
      if (!Array.isArray(data.statements) || data.statements.length < 3 || !data.version) throw new Error('Invalid statements');
      setTerms(data); setAgreements(data.statements.map(() => false));
    }).catch(err => { if (!axios.isCancel(err)) setError('The volunteer statements could not load. Please try again.'); });
    return () => controller.abort();
  }, [open, retry]);
  const ready = Boolean(terms && agreements.length === terms.statements.length && agreements.every(Boolean));
  const update = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  async function submit(event) {
    event.preventDefault();
    if (!ready || sending.current) return;
    sending.current = true; setStatus('sending'); setError('');
    try {
      requestId.current ||= crypto.randomUUID();
      const { data } = await axios.post(`${API}/api/volunteer-registration`, { ...form, agreements, consentVersion: terms.version, requestId: requestId.current }, { timeout: 180000 });
      if (!data.reference) throw new Error('No confirmation');
      setReference(data.reference); setStatus('saved');
    } catch (err) {
      setStatus('error');
      setError(err.response?.status === 429 ? 'Too many attempts. Please try again in 15 minutes.'
        : err.response?.status === 409 ? 'The statements or your saved details have changed. Please reload the page before submitting again.'
        : err.response?.status === 400 ? 'Please check every statement and enter a valid name, email and location.'
        : 'We could not confirm your registration was saved. Your details are still here; please try again.');
    } finally { sending.current = false; }
  }
  return <div className="reg-volunteer">
    <div className="reg-volunteer-top"><button type="button" className="reg-volunteer-toggle" aria-expanded={open} aria-controls="volunteer-panel" onClick={() => setOpen(value => !value)}>Volunteer? <span aria-hidden="true">{open ? '−' : '+'}</span></button></div>
    <section id="volunteer-panel" hidden={!open} className="reg-volunteer-panel" aria-labelledby="volunteer-title">
      <p className="reg-eyebrow">HELP MAKE IT HAPPEN</p><h2 id="volunteer-title">Register as a volunteer.</h2>
      {reference ? <div role="status"><h3>You’re on the volunteer list.</h3><p>Your details are saved for review. This registers your interest; it does not confirm a volunteer role.</p><div className="reg-receipt">YOUR REFERENCE<strong>{reference}</strong></div></div> : <>
        <p>Read and check all three statements, then add your details below. This is separate from student pre-registration.</p>
        {!terms ? <div><p role="status">{error || 'Loading volunteer statements…'}</p>{error && <button type="button" className="reg-back" onClick={() => setRetry(value => value + 1)}>Try again</button>}</div> : <form onSubmit={submit}>
          <fieldset className="reg-form-fields" disabled={status === 'sending'}><legend className="reg-volunteer-legend">Before you sign up · all required</legend>
            {terms.statements.map((statement, index) => <label className="reg-consent" key={statement}><input type="checkbox" required checked={agreements[index] || false} onChange={event => setAgreements(previous => previous.map((value, i) => i === index ? event.target.checked : value))} /><span>{statement} <strong className="reg-required">*</strong></span></label>)}
            <fieldset className="reg-form-fields reg-volunteer-details" disabled={!ready}><legend>Your details</legend>
              <div className="reg-input-grid"><label>Full name <span>*</span><input name="name" autoComplete="name" required minLength={2} maxLength={100} value={form.name} onChange={update} placeholder="Your full name" /></label><label>Email <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={update} placeholder="you@example.com" /></label></div>
              <label className="reg-label">Location <span>*</span><input name="location" autoComplete="address-level2" required minLength={2} maxLength={160} value={form.location} onChange={update} placeholder="City, state / country" /></label>
            </fieldset>
            <div className="reg-honeypot" aria-hidden="true"><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} /></label></div>
            <p className="reg-note">{ready ? 'Your details are used for volunteer coordination.' : 'Check all three statements to enter your details.'}</p>
            <button type="submit" className="reg-primary" disabled={!ready}>{status === 'sending' ? 'Saving your registration…' : 'Register as a volunteer'} <span aria-hidden="true">↗</span></button>
          </fieldset>
          {error && <p className="reg-submit-error" role="alert">{error}</p>}
        </form>}
      </>}
    </section>
  </div>;
}
