import InternshipDetails from '../components/InternshipDetails';
import RoomFirstDrop from '../components/RoomFirstDrop';
import { useEffect, useRef } from 'react';
import ingenuityLogo from '../imports/ingenuityx-logo.svg';
import { Link, useParams } from 'react-router-dom';
import { ROOMS } from '../data/rooms';
import './RoomExplore.css';
import './RoomTheme.css';

export default function RoomExplore() {
  const { roomSlug } = useParams();
  const pageRef = useRef(null);
  const room = ROOMS.find(item => item.slug === roomSlug);
  useEffect(() => {
    document.title = `${room?.name || (roomSlug ? 'Room not found' : 'Find your room')} | InGenuityX`;
    return () => { document.title = 'InGenuityX'; };
  }, [room, roomSlug]);
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    let active = true;
    let frame = null;
    let observer;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = [...root.querySelectorAll('.room-card, .room-closing, .room-directory-card, .first-drop-heading, .room-directory-intro, .room-section-heading, .room-hero-copy, .room-hero figure')];
    const reveal = element => { element.classList.add('is-revealed'); observer?.unobserve(element); };
    const configureMotion = () => {
      observer?.disconnect();
      if (media.matches) { elements.forEach(reveal); return; }
      observer = new IntersectionObserver(entries => {
        if (!active || !root.isConnected) return;
        entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
      }, { threshold: 0.06, rootMargin: '0px 0px -25px 0px' });
      elements.forEach(element => {
        const siblings = [...element.parentElement.children];
        element.style.setProperty('--reveal-delay', `${(siblings.indexOf(element) % 3) * 85}ms`);
        element.classList.add('room-reveal');
        observer.observe(element);
      });
    };
    const updateProgress = () => {
      frame = null;
      if (!active || !root.isConnected) return;
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty('--reading-progress', Math.max(0, Math.min(1, window.scrollY / range)));
    };
    const scheduleProgress = () => { if (active && frame === null) frame = requestAnimationFrame(updateProgress); };
    const onFocus = event => {
      const element = event.target.closest?.('.room-reveal');
      if (element) reveal(element);
    };
    configureMotion();
    updateProgress();
    root.addEventListener('focusin', onFocus);
    media.addEventListener('change', configureMotion);
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress);
    return () => {
      active = false;
      observer?.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      root.removeEventListener('focusin', onFocus);
      media.removeEventListener('change', configureMotion);
      window.removeEventListener('scroll', scheduleProgress);
      window.removeEventListener('resize', scheduleProgress);
    };
  }, [roomSlug]);
  const brand = <Link to="/" className="room-wordmark" aria-label="InGenuityX home"><img src={ingenuityLogo} alt="InGenuityX" /></Link>;
  if (!roomSlug) return <main className="room-page room-directory" ref={pageRef}>
    <header className="room-header">{brand}<Link to="/">← Home</Link><Link className="room-join" to="/register" data-cta="rooms-directory-header">Count me in ↗</Link></header>
    <RoomFirstDrop />
    <section className="room-directory-intro room-directory-secondary"><p className="room-eyebrow">SIX ROOMS. NO BOXES.</p><h2>Find your vibe.<br /><em>Meet your tribe.</em></h2><p>Follow what pulls you in. There’s more than one way to make your mark.</p></section>
    <section className="room-directory-grid" aria-label="Choose a room">{ROOMS.map((item, index) => <Link className="room-directory-card" data-room={item.slug} to={`/rooms/${item.slug}`} key={item.slug}><img src={item.image} alt="" loading="lazy" /><div><span className="room-eyebrow">ROOM 0{index + 1}</span><h2>{item.name}</h2><p>{item.headline}</p><span className="room-directory-explore">Explore more ↗</span></div></Link>)}</section>
    <footer className="room-footer"><span>InGenuityX / Cohort 01</span><Link to="/">Back to home ↗</Link></footer>
  </main>;
  if (!room) return <main className="room-page room-missing"><h1>This room hasn’t opened yet.</h1><Link to="/rooms">Find your room ↗</Link></main>;
  return <main className="room-page" data-room={room.slug} key={room.slug} ref={pageRef}>
    <header className="room-header">{brand}<Link to="/rooms">← All rooms</Link><Link className="room-join" to="/register" data-cta={`room-${room.slug}-header`}>Count me in <span aria-hidden="true">↗</span></Link></header>
    <section className="room-hero">
      <div className="room-hero-copy"><p className="room-eyebrow">THE {room.name.toUpperCase()} ROOM / COHORT 01</p><h1>{room.headline}</h1><p className="room-intro">{room.intro}</p><a className="room-browse" href="#room-opportunities">Find your next move <span aria-hidden="true">↓</span></a></div>
      <figure><span className="room-photo-stamp" aria-hidden="true">YOUR<br />NEXT<br />CHAPTER ↗</span><img src={room.image} alt="Participants collaborating on ideas at InGenuityX" /><figcaption>YOUR PEOPLE. YOUR NEXT MOVE.</figcaption></figure>
    </section>
    <div className="room-ticker" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, index) => <span key={index}>DARE ↗ DISCOVER ↗ DO <b>MAKE YOUR MOVE</b> </span>)}</div></div>
    <nav className="room-tabs" aria-label="Explore other rooms">{ROOMS.map(item => <Link key={item.slug} to={`/rooms/${item.slug}`} aria-current={item.slug === room.slug ? 'page' : undefined}>{item.name}</Link>)}</nav>
    <section className="room-opportunities" id="room-opportunities">
      <div className="room-section-heading"><div><p className="room-eyebrow">INGENUITYX / FIRST LOOK</p><h2>Something here has your name on it.</h2></div><p>Brands under wraps.<br />Full briefs and details at the reveal.</p></div>
      <div className="room-grid">{room.briefs.map((brief, index) => <article className={`room-card ${brief.image ? 'room-card-featured' : ''}`} key={brief.title}>
        {brief.image && <div className="room-card-image"><img src={brief.image} alt="A glimpse of the InGenuityX challenge experience" loading="lazy" /><span>THE NEXT CHAPTER IS YOURS ↗</span></div>}
        <div className="room-card-body"><div className="room-card-top"><p>{brief.sector}</p><span>{String(index + 1).padStart(2, '0')} / {String(room.briefs.length).padStart(2, '0')}</span></div><h3>{brief.title}</h3><p className="room-description">{brief.description}</p><div className={`room-meta ${brief.internship ? 'room-meta-internship' : ''}`}>{brief.internship ? <InternshipDetails /> : <span>{brief.format}</span>}<span>Full brief coming soon</span></div><Link className="room-card-cta" to="/register" data-cta={`room-${room.slug}-brief-${index + 1}`}>{index === 0 ? 'Get first dibs' : index % 2 ? 'Count me in' : 'I’m in'} <span aria-hidden="true">↗</span></Link></div>
      </article>)}</div>
    </section>
    <section className="room-closing"><p className="room-eyebrow">THINK YOU’VE GOT A DIFFERENT TAKE?</p><h2>There’s room for it.</h2><p>Tell us what you’re into. We’ll help you find your next move.</p><Link className="room-join" to="/register" data-cta={`room-${room.slug}-closing`}>I’m in <span aria-hidden="true">↗</span></Link></section>
    <footer className="room-footer">{brand}<Link to="/rooms">Find your vibe (and tribe) ↗</Link></footer>
  </main>;
}
