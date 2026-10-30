import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Check, Mic, Sparkles, LockKeyhole, Pause, Play } from 'lucide-react';
import { API_BASE } from '../apiConfig';
import logo from '../imports/ingenuityx-logo.svg';
import teamPhoto from '../imports/step 2.jpg';
import workshopPhoto from '../imports/step new.jpg';
import storyCamera from '../imports/room-story-camera.png';
import collaborationFilm from '../imports/collaborating.mp4';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import './ForBrands.css';

const themes = ['Innovation', 'Business growth', 'Tech', 'Sustainability', 'Creator'];
const offers = [
  { name: 'Platform', tag: 'PUT A REAL CHALLENGE IN PLAY', title: 'Your brief. Fresh thinking.', text: 'Invite young minds to tackle a business question. Discover ideas—and the people behind them.', benefit: 'Challenge partnerships', mode: 'Platform challenge' },
  { name: 'Podcast', tag: 'OPEN UP THE CONVERSATION', title: 'A voice beyond the logo.', text: 'Bring your people, perspectives and big questions into conversations with the next generation.', benefit: 'Podcast partnerships', mode: 'Podcast partnership' },
  { name: 'Publication', tag: 'GIVE YOUR STORY A PLACE', title: 'Ideas worth turning a page for.', text: 'Explore brand stories and perspectives in a youth-focused publication built around ideas and opportunity.', benefit: 'Publication partnerships', mode: 'Publication partnership' },
];
const interests = ['Explore all 3Ps', 'Platform challenge', 'Podcast partnership', 'Publication partnership', 'Internal pilot'];
function BrandVectors({ className = '' }) {
  return <svg className={`brands-vectors ${className}`} viewBox="0 0 600 500" fill="none" aria-hidden="true"><ellipse cx="300" cy="250" rx="270" ry="150" transform="rotate(-28 300 250)"/><ellipse cx="300" cy="250" rx="210" ry="230" transform="rotate(24 300 250)"/><path d="M440 65v64m-32-32h64m-55-23 46 46m0-46-46 46M84 334v42m-21-21h42"/><circle cx="112" cy="143" r="10"/><circle cx="492" cy="351" r="7"/><path d="M162 430c45 16 136 18 190-8m-19-10 23 9-16 20"/></svg>;
}
function BackgroundFilm({ reduced }) {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || paused) { video?.pause(); return; }
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) video.play().catch(() => setPlaying(false));
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, [paused, reduced]);
  return <><div className="brands-film"><video ref={videoRef} src={reduced ? undefined : collaborationFilm} poster={teamPhoto} muted loop playsInline preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-hidden="true" tabIndex={-1}/><div className="brands-film-shade"/></div>{!reduced && <button type="button" className="brands-film-toggle" aria-label={playing ? 'Pause background video' : 'Play background video'} onClick={()=>{ if (playing) setPaused(true); else { setPaused(false); videoRef.current?.play().catch(()=>setPlaying(false)); } }}>{playing ? <Pause size={13}/> : <Play size={13}/>}<span>{playing ? 'Pause motion' : 'Play motion'}</span></button>}</>;
}
function OfferArt({ name }) {
  if (name === 'Platform') return <div className="brands-platform-art" aria-hidden="true"><div className="brief-shadow"/><div className="brief-sheet"><span>THE CHALLENGE</span><Sparkles size={32}/><strong>What if<br/>your next idea<br/>started here?</strong><div className="brief-tags"><span>IDEATE</span><span>BUILD</span><span>PITCH</span></div></div><span className="idea-sticker">Fresh<br/>perspective ↗</span></div>;
  if (name === 'Podcast') return <div className="brands-podcast-art" aria-hidden="true"><div className="mic-orbit"/><div className="mic-disc"><Mic size={86} strokeWidth={1.2}/></div><div className="sound-bars">{[18,35,57,28,72,92,42,65,28,48,78,39,22].map((h,i)=><i key={i} style={{height:h}}/>)}</div><span>IDEAS. PEOPLE. POSSIBILITIES.</span></div>;
  return <div className="brands-publication-art" aria-hidden="true"><div className="magazine"><span>IDEAS / PEOPLE / IMPACT</span><strong>InGenuity<span>X</span></strong><div className="cover-shape"><Sparkles size={70} strokeWidth={1}/></div><b>A BOLDER<br/>POINT OF<br/>VIEW.</b><small>THE NEXT GENERATION HAS SOMETHING TO SAY.</small></div><span className="concept-note">Illustrative cover</span></div>;
}
export default function ForBrands() {
  const [mode, setMode] = useState('Explore all 3Ps');
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const sending = useRef(false);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroDrift = useTransform(scrollY, [0, 850], [0, 85]);
  const vectorTurn = useTransform(scrollY, [0, 850], [0, 35]);
  const reveal = { initial: reduceMotion ? false : { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.55 } };
  useEffect(() => { const old = document.title; document.title = 'For Brands | InGenuityX'; return () => { document.title = old; }; }, []);
  const update = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const choose = value => { setMode(value); };
  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true; setStatus('sending'); setError('');
    try {
      const response = await fetch(`${API_BASE}/api/contacts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30000),
        body: JSON.stringify({ data: { name: form.name.trim(), email: form.email.trim(), type: mode, message: `Brand / organisation: ${form.company.trim()}\nInterest: ${mode}\n\n${form.message.trim()}` } }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.data?.id) throw new Error(result?.error?.message || 'We couldn’t confirm your enquiry. Please try again.');
      setStatus('saved');
    } catch (err) { setStatus('error'); setError(err.name === 'TimeoutError' ? 'This is taking longer than expected. Please check with us before resubmitting.' : err.message || 'Connection interrupted. Your details are still here.'); }
    finally { sending.current = false; }
  }
  return <div className="brands-page">
    <nav className="brands-nav" aria-label="Brand navigation"><Link to="/" aria-label="InGenuityX home"><img src={logo} alt="InGenuityX" /></Link><span className="brands-nav-tag">For Brands</span><Link className="brands-nav-students" to="/">For students</Link><a href="#brand-enquiry" data-cta="brands-nav" className="brands-button brands-button-small">Let’s talk <ArrowUpRight size={16} /></a></nav>
    <main>
      <section className="brands-hero" data-cta-section="brands-hero">
        <BackgroundFilm reduced={reduceMotion}/>
        <motion.div className="brands-hero-orbits" style={reduceMotion ? undefined : {rotate: vectorTurn}}><BrandVectors/></motion.div>
        <motion.div {...reveal} className="brands-hero-copy"><p className="brands-eyebrow"><span className="brands-dot"/> BRANDS × THE NEXT GENERATION</p><h1>Don’t just be seen.<br/><em>Be part of<br/>what’s next.</em></h1><p className="brands-lead">Real challenges. Honest conversations. Stories that matter.<br/>Three ways to build a connection with young minds.</p><div className="brands-cta-row"><a className="brands-button" href="#brand-enquiry" data-cta="brands-start" onClick={()=>choose('Explore all 3Ps')}>Let’s build a partnership <ArrowUpRight size={19}/></a><a className="brands-text-link" href="#brands-3ps">Explore the 3Ps <ArrowRight size={17}/></a></div></motion.div>
        <motion.div {...reveal} transition={{duration:0.7,delay:reduceMotion?0:0.15}} className="brands-hero-stack" style={reduceMotion ? undefined : {y:heroDrift}} aria-label="Platform, Podcast and Publication"><a href="#brands-3ps" className="stack-card stack-platform"><span>01 / SOLVE TOGETHER</span><strong>Platform</strong><Sparkles/></a><a href="#brands-3ps" className="stack-card stack-podcast"><span>02 / START A CONVERSATION</span><strong>Podcast</strong><Mic/></a><a href="#brands-3ps" className="stack-card stack-publication"><span>03 / TELL A STORY</span><strong>Publication</strong><ArrowUpRight/></a><p>One ecosystem. Three ways in.</p></motion.div>
      </section>
      <section className="brands-offers brands-section" id="brands-3ps"><motion.div {...reveal} className="brands-section-heading"><div><p className="brands-eyebrow">THE INGENUITYX 3Ps</p><h2>Three formats.<br/><em>More possibilities.</em></h2></div><p>Choose one. Connect all three.<br/>We’ll shape the right partnership around your goals.</p></motion.div><div className="brands-offer-grid">{offers.map((offer,i)=><motion.article {...reveal} initial={reduceMotion ? false : {opacity:0,y:65,rotate:i===1?0:i===0?-3:3}} whileInView={{opacity:1,y:0,rotate:0}} whileHover={reduceMotion ? undefined : {y:-10,transition:{duration:0.25}}} transition={{duration:0.65,delay:reduceMotion?0:i*0.12}} className={`brands-offer offer-${offer.name.toLowerCase()}`} key={offer.name}><div className="offer-top"><h3>{offer.name}</h3><span>0{i+1}</span></div><OfferArt name={offer.name}/><div className="offer-copy"><p className="brands-eyebrow">{offer.tag}</p><h4>{offer.title}</h4><p>{offer.text}</p><a href="#brand-enquiry" data-cta={`brands-${offer.name.toLowerCase()}`} onClick={()=>choose(offer.mode)}>{offer.benefit}<ArrowUpRight size={20}/></a></div></motion.article>)}</div></section>
      <section className="brands-outcomes brands-section">
        <motion.div {...reveal} className="brands-photo-collage"><BrandVectors/><motion.figure initial={reduceMotion?false:{opacity:0,x:-45,rotate:-9}} whileInView={{opacity:1,x:0,rotate:-5}} viewport={{once:true,amount:0.3}} transition={{duration:0.7}} className="brands-photo-main"><img src={teamPhoto} alt="Young people exchanging ideas around laptops" loading="lazy"/><figcaption>Fresh eyes. Different possibilities.</figcaption></motion.figure><motion.figure initial={reduceMotion?false:{opacity:0,y:45,rotate:12}} whileInView={{opacity:1,y:0,rotate:6}} viewport={{once:true,amount:0.3}} transition={{duration:0.7,delay:reduceMotion?0:0.15}} className="brands-photo-detail"><img src={workshopPhoto} alt="A small group exploring ideas together at a table" loading="lazy"/></motion.figure><span className="brands-collage-sticker">A different<br/><strong>point of view.</strong><Sparkles size={26}/></span></motion.div>
        <motion.div {...reveal} className="brands-outcomes-copy"><p className="brands-eyebrow">WHAT YOUR BRAND CAN EXPLORE</p><div>{['Fresh ideas.','Relevant conversations.','Emerging talent.'].map((line,i)=><motion.h2 key={line} initial={reduceMotion?false:{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5,delay:reduceMotion?0:i*0.12}}>{line}</motion.h2>)}</div><p>Start with a goal. We’ll agree the format, deliverables and measures of success together.</p><div className="brands-theme-chips">{themes.map(theme=><span key={theme}>{theme}</span>)}</div></motion.div>
      </section>
      <motion.section {...reveal} className="brands-pilot brands-section" id="brand-pilot" data-cta-section="brands-pilot"><div><svg className="brands-pilot-doodle" viewBox="0 0 180 110" fill="none" aria-hidden="true"><path d="M8 28C55-5 154 3 141 55c-7 28-74 38-77 13-4-26 54-36 99 23m-27-6 30 10-2-29"/></svg><p className="brands-eyebrow"><LockKeyhole size={14}/> THE INTERNAL PILOT</p><h2>Big curiosity.<br/><em>Small first step.</em></h2><p>Try a focused challenge with your own team before exploring a wider launch.</p><a href="#brand-enquiry" className="brands-button brands-button-dark" data-cta="brands-pilot-enquiry" onClick={()=>choose('Internal pilot')}>Explore a pilot <ArrowUpRight size={19}/></a></div><aside><div className="pilot-step"><span>01</span><div><strong>One real question</strong><p>Pick a challenge worth exploring.</p></div></div><div className="pilot-step"><span>02</span><div><strong>Your team, involved</strong><p>A defined internal participant group.</p></div></div><div className="pilot-step"><span>03</span><div><strong>Review. Then decide.</strong><p>See what you learn before going wider.</p></div></div><small>Scope, confidentiality, ownership, timeline and fees are agreed before starting.</small></aside></motion.section>
      <section className="brands-enquiry brands-section" id="brand-enquiry" data-cta-section="brands-enquiry"><div><p className="brands-eyebrow">LET’S FIND YOUR STARTING POINT</p><h2>Your brand.<br /><em>Our next<br />conversation.</em></h2><p>A challenge, a conversation, a story—or all three. Tell us what you have in mind.</p><img className="brands-enquiry-camera" src={storyCamera} alt="" loading="lazy"/><p className="brands-fine">Please share only a high-level summary here. Confidential details can wait until the right arrangements are in place.</p></div>{status==='saved'?<div className="brands-success" role="status"><Check size={32}/><h3>Your enquiry is in.</h3><p>Thanks for reaching out. We’ve saved your details for the InGenuityX team to review.</p><Link to="/">Back to InGenuityX <ArrowRight size={16}/></Link></div>:<form onSubmit={submit}><fieldset disabled={status==='sending'}><legend>Start a partnership conversation</legend><label className="brands-interest">I’m interested in<select value={mode} onChange={event=>setMode(event.target.value)}>{interests.map(value=><option key={value}>{value}</option>)}</select></label><div className="brands-form-row"><label>Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={update}/></label><label>Brand / organisation<input name="company" required minLength={2} maxLength={150} autoComplete="organization" value={form.company} onChange={update}/></label></div><label>Work email<input name="email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={update}/></label><label>What would you like to explore?<textarea name="message" required minLength={10} maxLength={3500} rows={4} placeholder="A business question, a fresh perspective, or a pilot for your team…" value={form.message} onChange={update}/></label><p className="brands-fine">By sending, you agree that InGenuityX can use these details to respond to this enquiry.</p>{error&&<p role="alert" className="brands-error">{error}</p>}<button className="brands-button" type="submit">{status==='sending'?'Sending…':'Let’s start a conversation'}<ArrowUpRight size={19}/></button></fieldset></form>}</section>
    </main><footer className="brands-footer"><Link to="/"><img src={logo} alt="InGenuityX"/></Link><span>New perspectives. Real possibilities.</span><Link to="/">Back to the student experience <ArrowUpRight size={16}/></Link></footer>
  </div>;
}
