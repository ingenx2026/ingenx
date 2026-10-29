import { API_BASE } from '../apiConfig';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './WhatIf.css';
const API = API_BASE;
export default function WhatIf() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!window.IntersectionObserver) { setRevealed(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealed(true); observer.disconnect(); }
    }, { threshold: 0.08 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  const [daily, setDaily] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [expired, setExpired] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [answer, setAnswer] = useState('');
  const [flow, setFlow] = useState('invite');
  const flowFocus = useRef(null);
  useEffect(() => { if (flow !== 'invite') flowFocus.current?.focus({ preventScroll: true }); }, [flow]);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const sending = useRef(false);
  const currentQuestion = useRef(null);
  const hasDraft = useRef(false);
  useEffect(() => { hasDraft.current = Boolean(answer.trim()) && status !== 'saved'; }, [answer, status]);
  const requestId = useRef(null);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    let inFlight = false;
    let retryTimer;
    const load = async (initial = false) => {
      if (!active || inFlight || (!initial && document.hidden)) return;
      inFlight = true;
      clearTimeout(retryTimer);
      try {
        const { data } = await axios.get(`${API}/api/what-if/today`, { params: { day: new URLSearchParams(window.location.search).get('whatIf') || undefined }, signal: controller.signal, timeout: 15000 });
        if (!data.day || !data.prompt) throw new Error('Invalid response');
        if (!active) return;
        setLoadError(false);
        const previous = currentQuestion.current;
        const changed = previous && (previous.day !== data.day || previous.prompt !== data.prompt);
        if (changed && hasDraft.current) {
          setExpired(true);
          setDaily({ ...previous, highlight: data.highlight });
        } else {
          if (changed) { setShareStatus(''); setFlow('invite'); setAnswer(''); setConsent(false); setStatus('idle'); setError(''); setExpired(false); requestId.current = null; }
          currentQuestion.current = data;
          setDaily(data);
          setExpired(data.acceptingAnswers === false);
        }
      } catch (err) {
        if (active && !axios.isCancel(err)) {
          setLoadError(true);
          retryTimer = setTimeout(() => load(), 5000);
        }
      } finally { inFlight = false; }
    };
    // Fetch immediately even when an embedded preview initially reports hidden.
    load(true);
    const interval = setInterval(() => load(), 60000);
    const visible = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', visible);
    window.addEventListener('focus', visible);
    window.addEventListener('online', visible);
    return () => {
      active = false; controller.abort(); clearInterval(interval); clearTimeout(retryTimer);
      document.removeEventListener('visibilitychange', visible);
      window.removeEventListener('focus', visible);
      window.removeEventListener('online', visible);
    };
  }, [reload]);
  const restart = () => { const url = new URL(window.location.href); url.searchParams.delete('whatIf'); window.history.replaceState(null, '', url); setShareStatus(''); currentQuestion.current = null; setDaily(null); setFlow('invite'); setExpired(false); setAnswer(''); setConsent(false); setStatus('idle'); setError(''); requestId.current = null; setReload(value => value + 1); };
  async function shareQuestion() {
    const url = new URL(window.location.href);
    url.searchParams.set('whatIf', daily.day); url.hash = 'inside';
    setShareUrl(url.href);
    try { await navigator.clipboard.writeText(url.href); setShareStatus('Link copied!'); }
    catch { setShareStatus('Copy the question link below:'); }
  }
  async function submit(event) {
    event.preventDefault();
    if (sending.current || expired || !daily) return;
    if (flow === 'answer') {
      if (answer.trim().length < 20) { setError('Give your idea a little more detail — at least 20 characters.'); return; }
      setError(''); setFlow('details'); return;
    }
    if (flow !== 'details') return;
    if (!name.trim() || !email.trim() || answer.trim().length < 20 || !consent) { setError('Add a display name, email, at least 20 characters of thinking, and publication consent.'); return; }
    sending.current = true; setStatus('sending'); setError('');
    try {
      requestId.current ||= crypto.randomUUID();
      const response = await axios.post(`${API}/api/what-if/answers`, { day: daily.day, prompt: daily.prompt, displayName: name, email, answer, consent, website, requestId: requestId.current }, { timeout: 30000 });
      if (response.data?.saved !== true) throw new Error('No confirmation');
      setStatus('saved');
    } catch (err) {
      setStatus('error');
      if (err.response?.status === 409) { setExpired(true); setError('The question or submission has changed. Copy your draft before starting today’s answer.'); }
      else setError(err.response?.status === 429 ? 'A few too many attempts. Please try again in 15 minutes.' : 'We couldn’t confirm your answer was saved. Your draft is still here; please try again.');
    } finally { sending.current = false; }
  }
  return <section ref={sectionRef} id="inside" className={`what-if-section${revealed ? ' is-revealed' : ''}`} aria-labelledby="what-if-title">
    <div className="what-if-heading"><p className="what-if-kicker">ONE QUESTION. A DIFFERENT PERSPECTIVE.</p><h2 id="what-if-title">Your today’s <span>What if?</span></h2><p>A fresh question every day. Your take, your reasoning. We’ll review the answers and highlight a selected response the next day.</p></div>
    <div className="what-if-layout"><article className="what-if-prompt"><div className="what-if-ticket-mark" aria-hidden="true">WHAT<br /><span>IF?</span></div><div className="what-if-meta"><span>{expired ? 'PREVIOUS QUESTION' : 'TODAY’S WHAT IF?'}</span></div>
      {daily ? <><p className="what-if-date">{daily.day}{!expired && ' · Changes at midnight IST'}</p><h3>{daily.prompt}</h3><p className="what-if-hint">What would you change? Why would it work? Give us the idea behind the idea.</p><button type="button" className="what-if-text-button what-if-share" onClick={shareQuestion}>Copy question link ↗</button><p role="status" className="what-if-share-status">{shareStatus}</p>{shareStatus.startsWith('Copy the') && <input className="what-if-share-url" aria-label="Question link" readOnly value={shareUrl} onFocus={event => event.target.select()} />}</> : <p role="status">{loadError ? 'Today’s question couldn’t load. Retrying shortly…' : 'Loading today’s question…'}</p>}
      {loadError && <button type="button" className="what-if-text-button" onClick={() => setReload(value => value + 1)}>Reload question ↻</button>}
      <p className="what-if-disclaimer">Hypothetical prompts for independent thinking. Named brands are not sponsors or partners of this feature. No account needed.</p>
    </article><div className="what-if-answer">
      {status === 'saved' ? <div className="what-if-saved" role="status"><span aria-hidden="true">↗</span><h3>Your take is in.</h3><p>Your answer is saved for review. Check back tomorrow to see whether it’s selected. Submission doesn’t guarantee a highlight.</p></div> : flow === 'invite' ? <div className="what-if-invite"><h3>Wanna give it a shot?</h3><p>One idea is enough. No essay needed.</p><button type="button" className="what-if-submit" disabled={!daily || expired} onClick={() => setFlow('answer')}>I’ll give it a shot <span aria-hidden="true">↗</span></button><p className="what-if-invite-note">Start with your answer. Add your name and email when you’re ready to share.</p></div> : <form onSubmit={submit}><fieldset disabled={!daily || status === 'sending' || expired}>
        <legend>{flow === 'answer' ? 'What’s your take?' : 'Put a name to your idea.'}</legend>
        {flow === 'answer' ? <>
          <p className="what-if-step-note">A few lines will do. What would you try?</p>
          <label htmlFor="what-if-answer">Your idea</label><textarea ref={flowFocus} id="what-if-answer" value={answer} onChange={e => setAnswer(e.target.value)} minLength={20} maxLength={2000} required rows={4} placeholder="I’d try…" aria-describedby="what-if-answer-help" /><p id="what-if-answer-help" className="what-if-counter">At least 20 characters <span>{answer.length}/2,000</span></p>
          <button type="submit" className="what-if-submit">Continue <span aria-hidden="true">→</span></button>
          <button type="button" className="what-if-text-button" onClick={() => { setFlow('invite'); setError(''); }}>Maybe later — keep my draft</button>
        </> : <>
          <p className="what-if-step-note">Your answer is ready. Just two details before you send it.</p>
          <details className="what-if-draft-preview"><summary>Review your answer</summary><p>{answer}</p></details>
          <label htmlFor="what-if-name">Display name <span>A name you’re happy to share publicly</span></label><input ref={flowFocus} id="what-if-name" value={name} onChange={e => setName(e.target.value)} maxLength={60} required autoComplete="nickname" placeholder="What should we call you?" /><label htmlFor="what-if-email">Email <span>For submission review; never shown publicly</span></label><input id="what-if-email" type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={254} required autoComplete="email" placeholder="you@example.com" />
          <label className="what-if-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required /><span>I agree that InGenuityX may store my email and review my answer, and publish it with my display name if selected.</span></label>
          <button type="submit" className="what-if-submit">{status === 'sending' ? 'Saving your take…' : 'Share my take'} <span aria-hidden="true">↗</span></button>
          <button type="button" className="what-if-text-button" onClick={() => { setFlow('answer'); setError(''); }}>← Edit my answer</button>
        </>}
        <div className="what-if-honey" aria-hidden="true"><label>Leave blank<input value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
      </fieldset></form>}
      {error && <p className="what-if-error" role="alert">{error}</p>}
      {expired && <div className="what-if-expired" role="status"><p>This question is closed for answers. Copy any draft you want to keep before switching to today’s question.</p><button type="button" className="what-if-text-button" onClick={restart}>Start today’s answer ↗</button></div>}
    </div></div>
    {daily?.highlight && <article className="what-if-highlight"><p className="what-if-kicker">YESTERDAY’S QUESTION. A TAKE WORTH SHARING.</p><h3>{daily.highlight.prompt}</h3><blockquote>{daily.highlight.answer}</blockquote><p className="what-if-credit">— {daily.highlight.displayName} <span>Selected by InGenuityX · {daily.highlight.day}</span></p></article>}
  </section>;
}
