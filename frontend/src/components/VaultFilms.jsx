import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import collaborating from '../imports/vault-films/collaborating-narrated.mp4';
import prep from '../imports/vault-films/prep-narrated.mp4';
import celebration from '../imports/vault-films/celebration-narrated.mp4';
import collaboratingPoster from '../imports/vault-films/collaborating.jpg';
import prepPoster from '../imports/vault-films/prep.jpg';
import celebrationPoster from '../imports/vault-films/celebration.jpg';
import './VaultFilms.css';

const FILMS = [
  { label: 'Find your people', src: collaborating, poster: collaboratingPoster, transcript: 'Do not just watch the next big idea happen. Be in the room. Your idea deserves a chance.' },
  { label: 'Back your idea', src: prep, poster: prepPoster, transcript: 'That idea in your notes? Give it a shot. Find a challenge, build your response, and make your move.' },
  { label: 'Make your next move', src: celebration, poster: celebrationPoster, transcript: 'Do not leave it at, I could have tried that. Pre register with Ingenuity X, and start your next chapter.' },
];

export default function VaultFilms() {
  const section = useRef(null);
  const player = useRef(null);
  const [index, setIndex] = useState(0);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [muted, setMuted] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const film = FILMS[index];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setNear(true);
    }, { threshold: 0.15 });
    if (section.current) observer.observe(section.current);
    const onVisibility = () => setTabVisible(!document.hidden);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => { if (media.matches) setPaused(true); };
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', onMotion);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); media.removeEventListener('change', onMotion); };
  }, []);

  useEffect(() => {
    const video = player.current;
    if (!video) return;
    let active = true;
    if (near && visible && tabVisible && !paused) {
      video.play().catch(() => { if (active) setPaused(true); });
    } else video.pause();
    return () => { active = false; video.pause(); };
  }, [index, near, visible, tabVisible, paused]);

  const select = next => { setIndex((next + FILMS.length) % FILMS.length); setUnavailable(false); };
  const toggleSound = () => {
    const video = player.current;
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (video) {
      video.muted = nextMuted;
      if (!nextMuted) {
        video.currentTime = 0;
        setPaused(false);
        video.play().catch(() => setPaused(true));
      }
    }
  };
  return <section ref={section} className="vault-films" data-cta-section="vault-films" aria-label="Video stories about joining InGenuityX">
    <div className="vault-film-frame">
    <video key={film.src} ref={player} className="vault-film-video" src={near ? film.src : undefined} poster={film.poster} muted={muted} playsInline preload="none" aria-label={film.label} aria-describedby="vault-film-transcript"
      onEnded={() => { if (!paused) select(index + 1); }}
      onError={() => { setUnavailable(true); setPaused(true); }} />
    <p id="vault-film-transcript" className="vault-film-sr-only">{film.transcript}</p>
    <div className="vault-film-controls">
      <button type="button" aria-label="Previous video story" onClick={() => select(index - 1)}><ArrowLeft size={20} aria-hidden="true" /></button>
      <button type="button" disabled={unavailable} aria-label={paused ? 'Play video stories' : 'Pause video stories'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}</button>
      <button type="button" aria-label={muted ? 'Listen to voice-over' : 'Mute voice-over'} aria-pressed={!muted} disabled={unavailable} onClick={toggleSound}>{muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}</button>
      <button type="button" aria-label="Next video story" onClick={() => select(index + 1)}><ArrowRight size={20} aria-hidden="true" /></button>
    </div>
    {unavailable && <p className="vault-film-sr-only" role="status">This video could not load. Try the next video story.</p>}
    </div>
  </section>;
}
