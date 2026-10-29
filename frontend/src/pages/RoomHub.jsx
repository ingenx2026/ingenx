import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Shuffle, X, SlidersHorizontal } from 'lucide-react';
import { ROOMS } from '../data/rooms';
import logo from '../imports/ingenuityx-logo.svg';
import roomBackdrop from '../imports/step 4.jpg';
import './RoomHub.css';
import homeArtwork from '../imports/room-dream-home.png';
import cameraArtwork from '../imports/room-story-camera.png';
import spfArtwork from '../imports/room-spf.png';
import icecreamArtwork from '../imports/room-winter-icecream.png';
import solarArtwork from '../imports/room-solar-house.png';
import serverArtwork from '../imports/room-energy-server.png';
import evArtwork from '../imports/room-lavender-ev.png';
import fridgeArtwork from '../imports/beverage-fridge.png';
import consumerCarArtwork from '../imports/room-consumer-car.png';
import paintArtwork from '../imports/room-paint-insights.png';
import skincareArtwork from '../imports/room-skincare.png';
import oralArtwork from '../imports/room-oral-care.png';
import deodorantArtwork from '../imports/room-deodorant.png';
import lunchboxArtwork from '../imports/room-lunchbox.png';
import cableArtwork from '../imports/room-cable.png';
import laundryArtwork from '../imports/room-laundry.png';
const FEATURE_ART = {
  'Ice cream / Growth': { src: icecreamArtwork, alt: 'Ice cream cone wearing a purple winter hat and a lime scarf', style: 'icecream' },
  'Deodorants / Innovation': { src: deodorantArtwork, alt: 'Lavender deodorant beside a running sneaker', style: 'icecream' },
  'Storytelling / Culture': { src: cameraArtwork, alt: 'Lavender camera with an unfolding illustrated storyboard', style: 'story' },
  'Steel / Brand building': { src: homeArtwork, alt: 'Cutaway dream home showing its steel frame beside a materials moodboard', style: 'story' },
  'Everyday life / Problem solving': { src: cableArtwork, alt: 'Tangled charging cable transformed into a tidy lime coil', style: 'story' },
};
const BRIEF_ART = {
  'Home care / Product': { src: laundryArtwork, alt: 'Lavender laundry basket with clothes and detergent' },
  'Food / New habits': { src: lunchboxArtwork, alt: 'Lavender lunchbox beside a lime-rimmed clock' },
  'Oral care / Growth': { src: oralArtwork, alt: 'Toothpaste and toothbrush surrounded by lime habit-cycle arrows', kind: 'compact' },
  'Beauty / Gen Z': { src: skincareArtwork, alt: 'Lavender skincare products with a checklist', kind: 'compact' },
  'Paints / Consumer insights': { src: paintArtwork, alt: 'Lavender paint tin, colour swatches and a magnifying glass', kind: 'compact' },
  'Auto / Consumer insights': { src: consumerCarArtwork, alt: 'Lavender hatchback with floating consumer insight bubbles', kind: 'compact' },
  'Beauty / Daily habits': { src: spfArtwork, alt: 'Sunscreen tube wearing sunglasses with a lavender cap', kind: 'spf' },
  'Auto / Brand strategy': { src: evArtwork, alt: 'Lavender electric car with a lime battery sticker' },
  'Solar / Innovation': { src: solarArtwork, alt: 'Miniature solar-powered house with trees and a lime sun' },
  'AI / Energy': { src: serverArtwork, alt: 'Charcoal server tower printing an energy receipt' },
  'Beverages / Market disruption': { src: fridgeArtwork, alt: 'Lavender fridge and a bright lime beverage can' },
};

const SYMBOLS = ['✳', '</>', '◒', '↟', '✷', '▶'];
const names = room => room.slug === 'creators' ? 'Creators' : room.name;
export default function RoomHub() {
  const [selected, setSelected] = useState('all');
  const [paidOnly, setPaidOnly] = useState(false);
  const root = useRef(null);
  const active = ROOMS.find(room => room.slug === selected);
  const spotlight = active || ROOMS[0];
  const briefs = (active ? active.briefs.map(brief => ({ ...brief, room: active })) : [
    { ...ROOMS[0].briefs[0], room: ROOMS[0] },
    { ...ROOMS[2].briefs[0], room: ROOMS[2] },
    { ...ROOMS[0].briefs[1], room: ROOMS[0] },
    { ...ROOMS[1].briefs[0], room: ROOMS[1] },
    { ...ROOMS[3].briefs[0], room: ROOMS[3] },
    { ...ROOMS[5].briefs[0], room: ROOMS[5] },
  ]).filter(brief => !paidOnly || brief.internship);
  useEffect(() => {
    const elements = root.current?.querySelectorAll('.hub-brief') || [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('hub-in'); observer.unobserve(entry.target); }
    }), { threshold: .06 });
    elements.forEach(element => { element.classList.add('hub-will-reveal'); observer.observe(element); });
    return () => observer.disconnect();
  }, [selected, paidOnly]);
  const choose = slug => { setSelected(slug); setPaidOnly(false); };
  const shuffle = () => {
    const options = ROOMS.filter(room => room.slug !== selected);
    choose(options[Math.floor(Math.random() * options.length)].slug);
  };
  return <main className="vibe-hub" ref={root}>
    <div className="hub-backdrop" aria-hidden="true"><img src={roomBackdrop} alt="" /></div>
    <aside className="hub-sidebar">
      <Link to="/" className="hub-logo"><img src={logo} alt="InGenuityX home" /></Link>
      <p className="hub-side-label">FIND YOUR VIBE<br /><span>(AND TRIBE.)</span></p>
      <nav aria-label="Filter opportunities by room"><button type="button" className={selected === 'all' ? 'is-active' : ''} aria-pressed={selected === 'all'} onClick={() => choose('all')}><span>⊞</span> The whole mix <small>06</small></button>{ROOMS.map((room, i) => <button type="button" key={room.slug} className={selected === room.slug ? 'is-active' : ''} aria-pressed={selected === room.slug} onClick={() => choose(room.slug)}><span aria-hidden="true">{SYMBOLS[i]}</span>{names(room)}<small>0{i + 1}</small></button>)}</nav>
      <div className="hub-side-bottom"><span className="hub-side-star" aria-hidden="true">✳</span><p>YOU DON’T NEED<br />ANOTHER TAB.<br /><b>YOU NEED A SHOT.</b></p><Link to="/register" data-cta="rooms-sidebar">Take yours <ArrowUpRight size={18} /></Link><Link className="hub-home" to="/">← Back home</Link></div>
    </aside>
    <div className="hub-main">
      <header className="hub-topbar"><span>THE OPPORTUNITY PLAYGROUND</span><span className="hub-cohort">COHORT 01 / OCT ’26</span><Link to="/register" data-cta="rooms-directory-header">I’m in <ArrowUpRight size={16} /></Link></header>
      <section className="hub-intro"><div><p className="hub-eyebrow">REAL BRIEFS. FRESH PERSPECTIVES. YOUR MOVE.</p><h1>YOUR NEXT<br /><em>PLOT TWIST.</em><span aria-hidden="true">↗</span></h1></div><div className="hub-intro-note"><span>↓</span><p>A project worth obsessing over.<br />People who get it.<br /><b>Find both here.</b></p></div></section>
      <section className="hub-stage" aria-label="Discover your next room">
        <div className="hub-play-card"><div className="hub-card-caption"><span>NO SCRIPT REQUIRED</span><span>↗ VOL. 01</span></div><h2 className="hub-start-headline">“Kuch karna hai?”<br /><span>Toh yahin se</span><br /><i>shuru karo.</i></h2><div className="hub-play-bottom"><p>Not sure where you belong?<br />Let curiosity pick first.</p><button type="button" onClick={shuffle}><Shuffle size={18} /> Surprise me</button></div><span className="hub-play-orbit" aria-hidden="true">✳</span></div>
        <div className="hub-spotlight" key={spotlight.slug}><img src={spotlight.image} alt="Students collaborating at InGenuityX" /><div className="hub-photo-top"><span>MEET YOUR NEXT OBSESSION</span><span>0{ROOMS.indexOf(spotlight) + 1} / 06</span></div><div className="hub-spotlight-copy"><span className="hub-photo-tag">THE {names(spotlight).toUpperCase()} ROOM</span><h2>{spotlight.headline}</h2><a href="#room-themes" onClick={() => choose(spotlight.slug)}>Step inside <ArrowUpRight size={25} /></a></div></div>
      </section>
      <section id="room-themes" className="hub-feed" aria-labelledby="hub-feed-title"><div className="hub-feed-head"><div><p className="hub-eyebrow">THE FIRST DROP / NOV ’26</p><h2 id="hub-feed-title">{active ? `${names(active)}. Your way.` : 'Worth closing your other tabs.'}</h2></div><button type="button" className={`hub-filter ${paidOnly ? 'is-active' : ''}`} aria-pressed={paidOnly} onClick={() => setPaidOnly(value => !value)}><SlidersHorizontal size={15} /> Paid internships {paidOnly && <X size={14} />}</button></div>
        <div className="hub-feed-status" role="status"><span>{String(briefs.length).padStart(2, '0')} opportunities to explore</span><span>BRANDS UNDER WRAPS. IDEAS OUT LOUD.</span></div>
        <div className="hub-board" key={`${selected}-${paidOnly}`}>{briefs.map((brief, i) => <article className={`hub-brief hub-brief-${i % 4}`} key={brief.title}>
          <div className="hub-brief-top"><span>{brief.sector}</span><span>↗ {String(i + 1).padStart(2, '0')}</span></div>
          {FEATURE_ART[brief.sector] ? <div className={`hub-${FEATURE_ART[brief.sector].style}-feature`}><div><h3>{brief.title}</h3><p>{brief.description}</p></div><img src={FEATURE_ART[brief.sector].src} alt={FEATURE_ART[brief.sector].alt} loading="lazy" /></div> : <><h3>{brief.title}</h3><p>{brief.description}</p></>}
          {brief.internship ? <div className={`hub-paid ${BRIEF_ART[brief.sector] ? 'hub-paid-illustrated' : ''}`}><span>PAID INTERNSHIP</span><div><strong>₹10K</strong><span>total stipend<br />3 months</span></div>{BRIEF_ART[brief.sector] && <img className={`hub-solar-art ${['spf', 'compact'].includes(BRIEF_ART[brief.sector].kind) ? 'hub-spf-art' : ''}`} src={BRIEF_ART[brief.sector].src} alt={BRIEF_ART[brief.sector].alt} loading="lazy" />}</div> : <div className={`hub-format-row ${BRIEF_ART[brief.sector] ? 'hub-format-illustrated' : ''}`}><div className="hub-format"><span aria-hidden="true">✳</span>{brief.format}</div>{BRIEF_ART[brief.sector] && <img className={`hub-brief-art ${brief.sector.startsWith('Beverages') ? 'hub-brief-art-fridge' : ''}`} src={BRIEF_ART[brief.sector].src} alt={BRIEF_ART[brief.sector].alt} loading="lazy" />}</div>}
          <Link to="/register" data-cta={`rooms-hub-${brief.room.slug}-${i + 1}`}>{i % 2 ? 'Count me in' : 'Get first dibs'}<ArrowUpRight size={22} /></Link>
        </article>)}</div>
        {!briefs.length && <div className="hub-empty"><h3>No paid internships in this mix yet.</h3><p>The other briefs are still worth a look.</p><button type="button" onClick={() => setPaidOnly(false)}>Show all briefs <ArrowRight size={18} /></button></div>}
      </section>
      <section className="hub-outro"><span aria-hidden="true">↗</span><div><p className="hub-eyebrow">NO PERFECT CV REQUIRED.</p><h2>Bring your<br /><em>unfinished brilliance.</em></h2></div><Link to="/register" data-cta="rooms-directory-closing">Find my people <ArrowUpRight size={22} /></Link></section>
      <footer className="hub-footer"><span>INGENUITYX / DARE. DISCOVER. DO.</span><Link to="/">See you in the room ↗</Link></footer>
    </div>
  </main>;
}
