import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Search, Lock, CheckCircle2, ChevronRight, Clock, Award, Upload, Scale, FileText, TrendingUp, MessageCircle, Terminal, Copy } from 'lucide-react';

// --- MEDIA IMPORTS ---
import billboardImage from '../imports/Gemini_Generated_Image_1l2vfz1l2vfz1l2v.png';
import logoImage from '../imports/ingenuityx-logo.svg';
import registrationLaunchLogo from '../imports/registration-launch-logo.png';

// --- REGISTRATION JOURNEY IMAGES ---
import journeyRegister from '../imports/step 1.jpg';
import journeyBuild from '../imports/step 2.jpg';
import journeySubmit from '../imports/step 3.jpg';
import journeyMentorship from '../imports/step new.jpg';
import journeyFinale from '../imports/step 4.jpg';

// --- LOCAL LOGOS ---
import nuvocoLogo from '../imports/logo_nuvoco.jpg';
import srmbLogo from '../imports/srmb.jpg';
import ingenxLogo from '../imports/ingenx.png';
import trootechLogo from '../imports/trootech.png';

// --- POSTER IMAGES ---
import legrandBg from '../imports/legrand.png';
import nuvocoGreenBg from '../imports/nuvoco (1).png';
import srmbShiftBg from '../imports/nuvoco.png';
import srmbGreenProBg from '../imports/srmb (1).png';
import srmbIroncladBg from '../imports/srmb.png';
import trootechPosterBg from '../imports/Trootech (2).png';
import ingenxPosterBg from '../imports/IngenX (2).png';
import evereadyBg from '../imports/eveready.png';

// --- CREATOR CHALLENGE IMAGES ---
import creatorImg1 from "../imports/creator's challenge.png";

// --- HERO VIDEOS ---
import intervie from '../imports/intervie.mp4';
import collaborating from '../imports/collaborating.mp4';
import prep from '../imports/prep.mp4';
import chaos from '../imports/chaos.mp4';
import celebration3 from '../imports/celebration3.mp4';

import img6 from '../imports/img6.jpg';
import img7 from '../imports/img7.png';

// =====================================================================
// ENVIRONMENT & CONSTANTS
// =====================================================================
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337';
const PLACEHOLDER_BG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
const GLOBAL_BG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CATEGORY_COLORS = {
  Marketing: '#E92A39',
  Tech: '#2E73E6',
  Design: '#A855F7',
  Sustainability: '#10B981',
  Innovation: '#F59E0B',
  "The Creator's Challenge": '#E92A39',
};

const CATEGORY_DATA = {
  "The Creator's Challenge": { img: creatorImg1, desc: 'Think you can make it go viral? Prove it. Build in public, rally the community vote, and pitch the founders.' },
  Marketing: { img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop', desc: 'Brand strategy, GTM, research, and positioning.' },
  Tech: { img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', desc: 'Hackathons, coding challenges, AI, and systems.' },
  Design: { img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop', desc: 'UI/UX, product design, branding, and aesthetics.' },
  Sustainability: { img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop', desc: 'Green tech, decarbonisation, and eco-innovation.' },
  Innovation: { img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop', desc: 'Open-ended problem solving and lateral thinking.' }
};

// --- REWARDS DATA ---
const PLATFORM_REWARDS = [
  { top: "120+", title: "Internships", sub: "+ Rs 50k Stipends" },
  { top: "100%", title: "Verified", sub: "+ Real Certificates" },
  { top: "₹5L+", title: "Prize Pool", sub: "+ Tech Setups" },
  { top: "50+", title: "PPIs", sub: "+ Boardroom Access" }
];

const REWARD_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
  img6,
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
];

// --- PROCESS SECTION DATA ---
const PROCESS_CLIPS = [
  { src: collaborating, label: '01 / BRIEF PADHO' },
  { src: intervie, label: '02 / INSIGHT DHUNDO' },
  { src: chaos, label: '03 / FIRST IDEA TODO' },
  { src: prep, label: '04 / CASE BANAO' },
];

// --- HERO HEADLINE HOOKS ---
const HERO_RED_HOOKS = [
  "sabse bade problems.", "real, unfiltered briefs.",
  "mentorship moments.", "campus showdowns.",
  "massive prize pools.", "your 'I made it' era."
];

// --- FILTER TABS ---
const CATEGORY_FILTERS = ['All', 'Marketing', 'Tech', 'Design', 'Sustainability', 'Innovation', "The Creator's Challenge"];

// --- SCROLL REVEAL ---
function ScrollReveal({ children, direction = "up", delay = 0, width = "100%", className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  let dirClass = "";
  if (!isVisible) {
    if (direction === "up") dirClass = "translate-y-8 md:translate-y-12 opacity-0";
    if (direction === "down") dirClass = "-translate-y-8 md:-translate-y-12 opacity-0";
    if (direction === "left") dirClass = "-translate-x-8 md:-translate-x-12 opacity-0";
    if (direction === "right") dirClass = "translate-x-8 md:translate-x-12 opacity-0";
    if (direction === "scale") dirClass = "scale-95 opacity-0";
  } else {
    dirClass = "translate-y-0 translate-x-0 scale-100 opacity-100";
  }

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${dirClass} ${className}`} style={{ transitionDelay: `${delay}ms`, width }}>
      {children}
    </div>
  );
}

// --- FAQ ACCORDION ITEM ---
function FaqItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border-b border-[#2A2A2E] last:border-0">
      <button onClick={onClick} className="w-full flex items-center justify-between py-5 md:py-6 text-left group">
        <span className="text-base md:text-xl font-bold text-[#FAFAFA] pr-4 md:pr-6 group-hover:text-[#E92A39] transition-colors">{q}</span>
        <span className={`text-[#E92A39] text-xl md:text-2xl transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-45' : '+'}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-[500px] pb-5 md:pb-6' : 'max-h-0'}`}>
        <p className="text-[#A1A1AA] text-sm md:text-base font-semibold leading-relaxed pr-6 md:pr-10">{a}</p>
      </div>
    </div>
  );
}

// --- PINNED CARD ---
function PinnedCard({ rotate = 0, className = '', children }) {
  return (
    <div
      className={`bg-[#161616] border border-[#2A2A2E] rounded-xl shadow-xl ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

// --- CROSSFADE VIDEO PLAYER ---
function CrossfadeVideoPlayer({ clips, activeIndex, poster, className = '', videoClassName = '' }) {
  const videoRefs = useRef([]);

  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      const playPromise = activeVideo.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    }
  }, [activeIndex]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {clips.map((clip, i) => (
        <video
          key={clip.src || i}
          ref={el => (videoRefs.current[i] = el)}
          src={clip.src}
          poster={i === 0 ? poster : undefined}
          muted
          loop
          playsInline
          preload={Math.abs(i - activeIndex) <= 1 ? 'auto' : 'metadata'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out ${i === activeIndex ? 'opacity-100' : 'opacity-0'} ${videoClassName}`}
        />
      ))}
    </div>
  );
}

// --- SCROLL-READING INTRO ---
const PRE_REGISTER_MESSAGE = 'Pre-register to qualify for Opportunities, Invites and Briefs that don’t exist anywhere else';
const PRE_REGISTER_WORDS = PRE_REGISTER_MESSAGE.split(' ');

function PreRegistrationStatement() {
  const sectionRef = useRef(null);
  const [wordsRead, setWordsRead] = useState(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReading = () => {
      const bounds = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.85 - bounds.top) / (window.innerHeight * 0.65)));
      setWordsRead(media.matches ? PRE_REGISTER_WORDS.length : Math.ceil(progress * PRE_REGISTER_WORDS.length));
    };
    updateReading();
    window.addEventListener('scroll', updateReading, { passive: true });
    window.addEventListener('resize', updateReading);
    media.addEventListener('change', updateReading);
    return () => {
      window.removeEventListener('scroll', updateReading);
      window.removeEventListener('resize', updateReading);
      media.removeEventListener('change', updateReading);
    };
  }, []);

  return (
    <section ref={sectionRef} id="pre-registration-statement" className="relative flex items-center min-h-[70svh] bg-[#0b0b0b] px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <style>{`
        #pre-registration-statement .reading-word { color: #525252; transition: color .3s ease; }
        #pre-registration-statement .reading-word.is-read { color: #fff4e8; }
        @media (prefers-reduced-motion: reduce) { #pre-registration-statement .reading-word { color: #fff4e8; transition: none; } }
      `}</style>
      <h2 aria-label={PRE_REGISTER_MESSAGE} className="max-w-[1200px] mx-auto text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.2] tracking-tight">
        {PRE_REGISTER_WORDS.map((word, index) => (
          <span key={index} aria-hidden="true" className={`reading-word ${index < wordsRead ? 'is-read' : ''}`}>{word}{index < PRE_REGISTER_WORDS.length - 1 ? ' ' : ''}</span>
        ))}
      </h2>
    </section>
  );
}

// --- REGISTRATION LAUNCH BANNER ---
function RegistrationLaunchBanner() {
  const bannerRef = useRef(null);
  const [launched, setLaunched] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const boostTimer = useRef(null);
  const [motionPaused, setMotionPaused] = useState(false);
  const [statProgress, setStatProgress] = useState(0);

  useEffect(() => {
    if (!launched) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatProgress(1);
      return;
    }
    const started = Date.now();
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (Date.now() - started) / 1200);
      setStatProgress(1 - Math.pow(1 - progress, 3));
      if (progress === 1) window.clearInterval(timer);
    }, 40);
    return () => window.clearInterval(timer);
  }, [launched]);

  useEffect(() => () => window.clearTimeout(boostTimer.current), []);

  const moveRocket = event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--rocket-x', `${x * 32}px`);
    event.currentTarget.style.setProperty('--rocket-y', `${y * 24}px`);
    event.currentTarget.style.setProperty('--rocket-turn', `${x * 7}deg`);
  };
  const resetRocket = event => {
    ['--rocket-x', '--rocket-y', '--rocket-turn'].forEach(property => event.currentTarget.style.removeProperty(property));
  };
  const launchRocket = useCallback(() => {
    if (boostTimer.current !== null) return;
    setLaunched(true);
    setBoosting(true);
    boostTimer.current = window.setTimeout(() => {
      setBoosting(false);
      boostTimer.current = null;
    }, 1600);
  }, []);

  useEffect(() => {
    let dwellTimer = null;
    let fired = false;
    const clearDwell = () => {
      window.clearTimeout(dwellTimer);
      dwellTimer = null;
    };
    const checkVisibility = () => {
      const bounds = bannerRef.current.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
      const stayingHere = !document.hidden && visibleHeight >= Math.min(bounds.height, window.innerHeight) * 0.7;
      if (!stayingHere) {
        clearDwell();
        fired = false;
      } else if (!fired && dwellTimer === null) {
        dwellTimer = window.setTimeout(() => {
          dwellTimer = null;
          fired = true;
          launchRocket();
        }, 3000);
      }
    };
    const scheduleCheck = checkVisibility;
    checkVisibility();
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck);
    document.addEventListener('visibilitychange', checkVisibility);
    return () => {
      clearDwell();
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
      document.removeEventListener('visibilitychange', checkVisibility);
    };
  }, [launchRocket]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLaunched(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={bannerRef} id="registration-launch" aria-labelledby="registration-launch-title" className={`registration-launch ${launched ? 'is-launched' : ''} ${boosting ? 'is-boosting' : ''} ${motionPaused ? 'motion-paused' : ''}`}>
      <style>{`
        .registration-launch { --launch-cream: #fff4e8; --launch-accent: #ff4b26; background: #0b0b0b; color: #fff4e8; overflow: hidden; position: relative; isolation: isolate; z-index: 70; min-height: 100svh; scroll-margin-top: 0; }
        .registration-launch::before, .registration-launch::after { content: ''; position: absolute; top: 0; bottom: 0; width: 50%; z-index: 8; background: #fff4e8; pointer-events: none; transform: scaleX(0); }
        .registration-launch::before { left: 0; transform-origin: left center; }
        .registration-launch::after { right: 0; transform-origin: right center; background: #171717; }
        .registration-launch.is-launched::before, .registration-launch.is-launched::after { animation: cohortCurtainOpen 1.1s cubic-bezier(.76,0,.24,1) both; }
        @keyframes cohortCurtainOpen { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        .registration-launch .launch-layout { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 3fr); width: 100%; min-height: 100svh; }
        .registration-launch .launch-art { position: relative; overflow: hidden; min-height: 100svh; }
        .registration-launch .launch-type { position: absolute; top: 0; left: -20px; right: -20px; color: var(--launch-cream); font-size: clamp(90px, 10vw, 180px); font-weight: 950; line-height: 1.12; letter-spacing: -.065em; user-select: none; opacity: .14; animation: registrationMarquee 32s linear infinite; animation-play-state: paused; }
        .registration-launch .launch-type-group { display: flex; flex-direction: column; }
        .registration-launch .launch-type span { display: block; white-space: nowrap; }
        .registration-launch .launch-type span:nth-child(even) { color: transparent; -webkit-text-stroke: 2px var(--launch-cream); transform: translateX(-45px); }
        .registration-launch.is-launched .launch-type { animation-play-state: running; }
        .registration-launch.motion-paused .launch-type { animation-play-state: paused; }
        .registration-launch .launch-motion-toggle { position: absolute; bottom: 18px; left: 20px; z-index: 4; width: 40px; height: 40px; border: 2px solid #171717; border-radius: 50%; background: #fff4e8; color: #171717; font-weight: 900; cursor: pointer; }
        .registration-launch .launch-motion-toggle:focus-visible { outline: 3px solid #fff4e8; outline-offset: 3px; }
        @keyframes registrationMarquee { to { transform: translateY(-50%); } }
        .registration-launch .launch-sticker { position: absolute; left: 5%; top: 30px; z-index: 3; background: #fff4e8; border: 2px solid #171717; border-radius: 50%; padding: 0 20px; box-shadow: 5px 6px 0 #171717; transform: rotate(-9deg); }
        .registration-launch .launch-sticker img { display: block; width: 180px; height: 80px; object-fit: cover; }
        .registration-launch .launch-rocket { display: block; width: 100%; height: 100%; filter: drop-shadow(9px 14px 0 rgba(23,23,23,.16)); }
        .registration-launch .launch-info { color: #0b0b0b; background: var(--launch-cream); padding: 60px clamp(24px, 2.8vw, 52px); display: flex; flex-direction: column; align-items: flex-start; justify-content: center; position: relative; }
        .registration-launch .launch-info::before { content: ''; position: absolute; top: 0; bottom: 0; left: -17px; width: 18px; background: var(--launch-cream); clip-path: polygon(100% 0, 100% 100%, 0 96%, 100% 90%, 0 84%, 100% 78%, 0 72%, 100% 66%, 0 60%, 100% 54%, 0 48%, 100% 42%, 0 36%, 100% 30%, 0 24%, 100% 18%, 0 12%, 100% 6%, 0 0); }
        .registration-launch .launch-heading { margin: 0 0 28px; font-size: clamp(36px, 4.1vw, 76px); line-height: .95; font-weight: 950; text-transform: uppercase; letter-spacing: -.035em; }
        .registration-launch .launch-button { position: relative; isolation: isolate; overflow: hidden; display: inline-flex; align-items: center; justify-content: space-between; gap: 14px; width: 100%; max-width: 380px; border: 2px solid #0b0b0b; background: var(--launch-accent); padding: 20px 16px; box-shadow: 6px 6px 0 rgba(11,11,11,.35); color: #0b0b0b; font-size: clamp(15px, 1.4vw, 21px); font-weight: 950; text-transform: uppercase; text-decoration: none; transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s, color .25s; }
        .registration-launch .launch-button::before { content: ''; position: absolute; inset: 0; z-index: -1; background: #0b0b0b; transform: translateX(-105%) skewX(-12deg); transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .registration-launch .launch-button:hover, .registration-launch .launch-button:focus-visible { transform: translateY(-5px) rotate(-1deg); color: var(--launch-accent); box-shadow: 9px 11px 0 rgba(11,11,11,.4); }
        .registration-launch .launch-button:hover::before, .registration-launch .launch-button:focus-visible::before { transform: translateX(0) skewX(0); }
        .registration-launch .launch-button:active { transform: translate(4px, 5px) scale(.96); box-shadow: 0 0 0 #0b0b0b; }
        .registration-launch .launch-button:focus-visible { outline: 3px solid #0b0b0b; outline-offset: 7px; }
        .registration-launch .launch-button span { font-size: 30px; line-height: 1; }
        .registration-launch.is-launched .launch-rocket { animation: registrationLiftOff 1.25s cubic-bezier(.16,1,.3,1) both; }
        .registration-launch.is-launched .launch-sticker { animation: registrationSticker .8s .15s cubic-bezier(.34,1.56,.64,1) both; }
        .registration-launch.is-launched .launch-flame { transform-origin: 145px 315px; animation: registrationFlame .3s 6 alternate ease-in-out; }
        @keyframes registrationLiftOff { from { opacity: 0; transform: translate(-100px, 190px) rotate(-18deg) scale(.65); } 70% { opacity: 1; transform: translate(4px, -12px) rotate(2deg) scale(1.02); } to { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); } }
        @keyframes registrationSticker { from { opacity: 0; transform: rotate(-22deg) scale(.55); } to { opacity: 1; transform: rotate(-9deg) scale(1); } }
        @keyframes registrationFlame { from { transform: scale(.92); } to { transform: scale(1.08); } }
        .registration-launch .launch-rocket-control { position: absolute; width: 20%; height: 24%; left: 71%; top: 75%; padding: 0; border: 0; background: transparent; cursor: pointer; z-index: 5; transform: translate(var(--rocket-x, 0px), var(--rocket-y, 0px)) rotate(var(--rocket-turn, 0deg)); transition: transform .25s ease-out; -webkit-tap-highlight-color: transparent; }
        .registration-launch .launch-rocket-control:focus-visible { outline: 3px dashed #171717; outline-offset: -10px; border-radius: 40%; }
        .registration-launch .launch-button span { transition: transform .25s; }
        .registration-launch .launch-button:hover span { transform: translate(5px, -5px); }
        .registration-launch.is-boosting .launch-rocket { animation: registrationBoost 1.6s cubic-bezier(.4,0,.2,1) both; }
        .registration-launch.is-boosting .launch-flame { animation: registrationFlame .12s 12 alternate; }
        @keyframes registrationBoost { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 18% { transform: translate(-18px, 22px) scale(.94); opacity: 1; } 52% { transform: translate(80%, -110%) scale(.7); opacity: 0; } 53% { transform: translate(-65%, 95%) scale(.7); opacity: 0; } 72% { opacity: 1; } 100% { transform: translate(0, 0) scale(1); opacity: 1; } }
        .registration-launch .launch-info::before { display: none; }
        .registration-launch .launch-info { border-left: 2px solid #171717; }
        .registration-launch .launch-edition { margin: 0 0 42px; font-size: 11px; font-weight: 900; letter-spacing: .15em; border-bottom: 2px solid #171717; padding-bottom: 14px; width: 100%; }
        .registration-launch .launch-heading em { color: var(--launch-accent); font-style: normal; text-decoration: underline; text-decoration-thickness: 4px; text-underline-offset: 7px; }
        .registration-launch .launch-one-liner { margin: 0 0 10px; font-size: clamp(20px, 1.8vw, 28px); line-height: 1.15; font-weight: 900; }
        .registration-launch .launch-subline { margin: 0 0 36px; font-size: 15px; line-height: 1.5; font-weight: 600; }
        .registration-launch .launch-footnote { margin: 22px 0 0; font-size: 12px; font-weight: 700; }
        .registration-launch .launch-collage { position: absolute; inset: 0; }
        .registration-launch .launch-photo { position: absolute; margin: 0; padding: 10px 10px 0; background: #101010; color: #fff4e8; border: 1px solid #fff4e8; box-shadow: 7px 10px 0 rgba(23,23,23,.15); transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s; }
        .registration-launch .launch-photo::before { content: ''; position: absolute; top: -14px; left: 35%; width: 30%; height: 28px; background: rgba(255,244,232,.85); transform: rotate(3deg); z-index: 1; }
        .registration-launch .launch-photo img { display: block; width: 100%; aspect-ratio: 1.5; object-fit: cover; filter: saturate(.72) contrast(1.06); }
        .registration-launch .launch-photo figcaption { padding: 13px 3px 14px; font-size: clamp(9px, .8vw, 13px); font-weight: 900; letter-spacing: .06em; }
        .registration-launch .launch-photo-main { width: 61%; left: 5%; top: 27%; transform: rotate(-7deg); z-index: 1; }
        .registration-launch .launch-photo:hover { transform: rotate(0) translateY(-12px); box-shadow: 10px 20px 0 rgba(23,23,23,.13); z-index: 3; }
        .registration-launch .launch-note { position: absolute; left: 12%; bottom: 10%; border-left: 5px solid #fff4e8; padding-left: 16px; font-size: clamp(22px, 2.4vw, 38px); line-height: 1.05; font-weight: 900; letter-spacing: -.04em; transform: rotate(-4deg); }
        .registration-launch.is-launched .launch-photo img { animation: cohortPhotoIn .9s ease-out both; }
        @keyframes cohortPhotoIn { from { opacity: 0; filter: saturate(0) contrast(1.15); } to { opacity: 1; filter: saturate(.72) contrast(1.06); } }
        .registration-launch .launch-mantra { display: flex; flex-wrap: wrap; gap: 8px; font-weight: 900; text-transform: uppercase; }
        .registration-launch .launch-stats { position: absolute; top: 20%; right: 4%; width: 25%; display: grid; gap: 18px; z-index: 3; }
        .registration-launch .launch-stat { border-top: 1px solid #fff4e8; padding: 14px 0 0; background: #0b0b0b; }
        .registration-launch .launch-stat strong { display: block; font-size: clamp(38px, 4.4vw, 72px); line-height: 1; font-weight: 950; letter-spacing: -.06em; font-variant-numeric: tabular-nums; }
        .registration-launch .launch-stat-label { display: block; margin-top: 5px; font-size: 12px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
        .registration-launch .launch-stat p { margin: 7px 0 0; color: #c8beb3; font-size: 11px; line-height: 1.5; }
        .registration-launch.is-launched .launch-stat { animation: cohortStatIn .65s var(--stat-delay) both cubic-bezier(.16,1,.3,1); }
        @keyframes cohortStatIn { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 767px) {
          .registration-launch { scroll-margin-top: 0; }
          .registration-launch .launch-layout { grid-template-columns: 1fr; min-height: 100svh; }
          .registration-launch .launch-art { min-height: 760px; }
          .registration-launch .launch-type { font-size: clamp(68px, 17vw, 115px); }
          .registration-launch .launch-sticker { left: 6%; top: 20px; }
          .registration-launch .launch-sticker img { width: 160px; height: 72px; }
          .registration-launch .launch-rocket-control { width: 23%; left: 72%; top: 81%; height: 18%; }
          .registration-launch .launch-info { padding: 40px 28px 48px; align-items: flex-start; text-align: left; border-left: 0; border-top: 2px solid #171717; }
          .registration-launch .launch-info::before { display: none; }
          .registration-launch .launch-heading { font-size: clamp(48px, 12vw, 72px); }
          .registration-launch .launch-edition { margin-bottom: 28px; }
          .registration-launch .launch-stats { top: 61%; left: 7%; right: 7%; width: auto; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
          .registration-launch .launch-stat strong { font-size: 38px; }
          .registration-launch .launch-stat-label { font-size: 10px; letter-spacing: .04em; }
          .registration-launch .launch-stat p { font-size: 10px; }
          .registration-launch .launch-motion-toggle { bottom: 17%; }
          .registration-launch .launch-photo-main { width: 86%; left: 7%; top: 20%; }
          .registration-launch .launch-note { left: 7%; bottom: 4%; font-size: 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .registration-launch::before, .registration-launch::after { display: none; animation: none; }
          .registration-launch.is-launched .launch-stat { animation: none; }
          .registration-launch .launch-button::before { transition: none; }
          .registration-launch.is-launched .launch-photo img { animation: none; }
          .registration-launch .launch-photo { transition: none; }
          .registration-launch.is-launched .launch-rocket, .registration-launch.is-launched .launch-sticker, .registration-launch.is-launched .launch-date, .registration-launch.is-launched .launch-flame { animation: none; }
          .registration-launch .launch-button, .registration-launch .launch-button span, .registration-launch .launch-year, .registration-launch .launch-type, .registration-launch .launch-rocket-control { transition: none; }
          .registration-launch .launch-rocket-control, .registration-launch .launch-type { transform: none; }
          .registration-launch .launch-type { animation: none; }
          .registration-launch .launch-motion-toggle { display: none; }
          .registration-launch.is-boosting .launch-rocket, .registration-launch.is-boosting .launch-flame { animation: none; }
        }
      `}</style>
      <div className="launch-layout">
        <div className="launch-art" onPointerMove={moveRocket} onPointerLeave={resetRocket}>
          <div className="launch-type" aria-hidden="true">
            {[0, 1].map(copy => (
              <div className="launch-type-group" key={copy}>
                {Array.from({ length: 8 }, (_, index) => <span key={index}>{index % 2 === 0 ? 'COHORT 01' : 'FIRST MOVERS'}</span>)}
              </div>
            ))}
          </div>
          <button type="button" className="launch-motion-toggle" aria-label={motionPaused ? 'Play background animation' : 'Pause background animation'} onClick={() => setMotionPaused(paused => !paused)}>{motionPaused ? '▶' : 'Ⅱ'}</button>
          <div className="launch-sticker"><img src={registrationLaunchLogo} alt="InGenuityX" width="220" height="98" /></div>
          <div className="launch-collage">
            <figure className="launch-photo launch-photo-main">
              <img src={journeyFinale} alt="A team presenting its solution on the finale stage" loading="lazy" />
              <figcaption>TAKE YOUR SHOT. OWN THE ROOM.</figcaption>
            </figure>
            <div className="launch-stats" aria-label="Cohort at a glance">
              {[
                { value: 90, suffix: '+', label: 'Companies', note: 'Think beyond the classroom.' },
                { value: CATEGORY_FILTERS.length - 1, suffix: '', label: 'Themes', note: 'Find your kind of challenge.' },
                { value: 1, suffix: '', label: 'First cohort', note: 'Make your first move count.' },
              ].map((stat, index) => (
                <div key={stat.label} className="launch-stat" style={{ '--stat-delay': `${index * 140}ms` }} aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
                  <strong aria-hidden="true">{String(Math.round(stat.value * statProgress)).padStart(index === 2 ? 2 : 1, '0')}{stat.suffix}</strong>
                  <span className="launch-stat-label">{stat.label}</span>
                  <p>{stat.note}</p>
                </div>
              ))}
            </div>
            <span className="launch-note">Dare. Discover.<br />DO.</span>
          </div>
          <button type="button" className="launch-rocket-control" aria-label="Launch the rocket animation" aria-disabled={boosting} onClick={launchRocket}>
          <svg className="launch-rocket" viewBox="0 0 400 440" fill="none" aria-hidden="true">
            <path d="M145 310C118 324 81 365 77 402C115 394 151 366 165 332" fill="#fff4e8" stroke="#171717" strokeWidth="7" className="launch-flame" />
            <path d="M146 324L111 369L161 339" fill="#fffaf5" className="launch-flame" />
            <path d="M161 196L100 220L77 291L160 266M241 278L219 346L151 367L168 282" fill="#fff4e8" stroke="#171717" strokeWidth="7" strokeLinejoin="round" />
            <path d="M135 267C156 168 232 90 341 58C342 171 285 260 185 308L135 267Z" fill="#fffaf5" stroke="#171717" strokeWidth="8" strokeLinejoin="round" />
            <path d="M267 91C291 73 317 63 341 58C341 87 337 113 327 137L267 91Z" fill="#fff4e8" stroke="#171717" strokeWidth="7" />
            <circle cx="249" cy="180" r="37" fill="#fff4e8" stroke="#171717" strokeWidth="7" />
            <circle cx="249" cy="180" r="22" fill="#171717" />
            <path d="M239 168L254 163" stroke="white" strokeWidth="7" strokeLinecap="round" />
            <path d="M139 266L185 309L169 330L118 283L139 266Z" fill="#fff4e8" stroke="#171717" strokeWidth="7" strokeLinejoin="round" />
            <path d="M202 242L151 313" stroke="#171717" strokeWidth="8" strokeLinecap="round" />
            <path d="M81 152L73 177M57 159L94 169M337 261L329 286M313 268L350 279M192 53L187 71M181 60L199 65" stroke="#171717" strokeWidth="5" strokeLinecap="round" />
            <path d="M78 322L41 349M197 367L173 401" stroke="#fff4e8" strokeWidth="9" strokeLinecap="round" />
          </svg>
          </button>
        </div>
        <div className="launch-info">
          <p className="launch-edition">INGENUITYX / COHORT 01 OCT 2026</p>
          <h2 id="registration-launch-title" className="launch-heading">Don’t just<br />watch.<br /><em>Be in the room.</em></h2>
          <p className="launch-one-liner">Be the team they talk about.</p>
          <p className="launch-subline launch-mantra">Dare <span aria-hidden="true">››</span> Discover <span aria-hidden="true">››</span> Do.</p>
          <Link to="/register" className="launch-button">Join Cohort 01 <span aria-hidden="true">↗</span></Link>
          <p className="launch-footnote">The first chapter only happens once.</p>
        </div>
      </div>
    </section>
  );
}

// --- REGISTRATION TO FINALE ---
const REGISTRATION_STEPS = [
  { number: '01', label: 'GET IN THE GAME', title: 'Register. Make it official.', description: 'Create your InGenuityX profile and tell us what you bring to the table. Your journey starts with one simple step: showing up.', image: journeyRegister, alt: 'Participants checking in at the InGenuityX registration desk' },
  { number: '02', label: 'FIND YOUR CHALLENGE', title: 'Pick a brief. Build your idea.', description: 'Choose a challenge that matches your interests. Read the brief, understand the problem, and turn your first thought into something worth sharing.', image: journeyBuild, alt: 'A student team discussing their challenge with laptops and notes' },
  { number: '03', label: 'PUT YOUR WORK OUT THERE', title: 'Submit. Let the idea speak.', description: 'Bring your solution together and submit it before the challenge deadline. Follow the brief’s submission guidelines and watch for review and shortlist updates.', image: journeySubmit, alt: 'Participants celebrating the announcement of shortlisted teams' },
  { number: '04', label: 'MENTORSHIP & GROWTH', title: 'Get Mentored. Grow Your Idea.', description: 'Work with mentors to sharpen your thinking, challenge your assumptions, and strengthen your solution. Turn feedback into a clearer idea and a stronger pitch before the finale.', image: journeyMentorship, alt: 'A mentor guiding a student team around a table with laptops and notebooks' },
  { number: '05', label: 'THE FINALE', title: 'Own the stage.', description: 'If shortlisted, take your idea into the finale. Present your thinking, answer the tough questions, and show what makes your solution stand out.', image: journeyFinale, alt: 'Finalists presenting their idea to a panel and audience' },
];

function RegistrationJourney() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const rows = [...section.querySelectorAll('.journey-step')];
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = null;
    section.classList.add('journey-ready');

    const updateProgress = () => {
      frame = null;
      const bounds = track.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.7 - bounds.top) / bounds.height));
      progressRef.current.style.transform = `scaleY(${media.matches ? 1 : progress})`;
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateProgress);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('journey-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    rows.forEach(row => observer.observe(row));
    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    media.addEventListener('change', onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      media.removeEventListener('change', onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} id="registration-journey" aria-labelledby="registration-journey-title" className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto border-t border-[#2A2A2E]">
      <style>{`
        #registration-journey .journey-timeline { position: relative; margin: 0; padding: 0; list-style: none; }
        #registration-journey .journey-track { position: absolute; width: 2px; left: 30%; top: 0; bottom: 0; transform: translateX(-50%); background: #2A2A2E; overflow: hidden; }
        #registration-journey .journey-progress { width: 100%; height: 100%; background: #E92A39; transform: scaleY(0); transform-origin: top; }
        #registration-journey .journey-step { position: relative; display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 7fr); align-items: center; padding: 40px 0; perspective: 1400px; }
        #registration-journey .journey-image { grid-column: 2; grid-row: 1; min-width: 0; margin: 0; padding-left: clamp(32px, 3vw, 48px); transform-origin: left center; }
        #registration-journey .journey-copy { grid-column: 1; grid-row: 1; min-width: 0; padding: 24px clamp(32px, 3vw, 48px) 24px 0; transform-origin: right center; overflow-wrap: break-word; }
        #registration-journey .journey-copy h3 { font-size: clamp(22px, 2.5vw, 36px); }
        #registration-journey .journey-node { position: absolute; left: 30%; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 50%; background: #151515; border: 1px solid #52525B; color: #A1A1AA; font-size: 12px; font-weight: 900; z-index: 1; transition: background .6s, border-color .6s, color .6s, box-shadow .6s; }
        #registration-journey .journey-image, #registration-journey .journey-copy { opacity: 1; transform: translateX(0) rotateY(0) scale(1); clip-path: inset(0 0 0 0); transition: opacity .85s ease, transform 1.1s cubic-bezier(.16,1,.3,1), clip-path 1.1s cubic-bezier(.16,1,.3,1); }
        #registration-journey.journey-ready .journey-step:not(.journey-visible) .journey-image { opacity: 0; transform: translateX(-36px) rotateY(12deg) scale(.96); clip-path: inset(0 16% 0 0); }
        #registration-journey.journey-ready .journey-step:not(.journey-visible) .journey-copy { opacity: 0; transform: translateX(28px) rotateY(-12deg) scale(.96); clip-path: inset(0 0 0 16%); }
        #registration-journey .journey-visible .journey-node { background: #E92A39; border-color: #E92A39; color: white; box-shadow: 0 0 0 7px rgba(233,42,57,.1), 0 0 24px rgba(233,42,57,.22); }
        @media (max-width: 767px) {
          #registration-journey .journey-track { left: 20px; }
          #registration-journey .journey-step { grid-template-columns: 40px minmax(0, 1fr); column-gap: 16px; padding: 24px 0; align-items: start; perspective: none; }
          #registration-journey .journey-node { position: static; transform: none; grid-column: 1; grid-row: 1; justify-self: center; width: 36px; height: 36px; margin-top: 16px; }
          #registration-journey .journey-image { grid-column: 2; grid-row: 1; padding-left: 0; }
          #registration-journey .journey-copy { grid-column: 2; grid-row: 2; padding: 24px 0 8px; }
          #registration-journey.journey-ready .journey-step:not(.journey-visible) .journey-image,
          #registration-journey.journey-ready .journey-step:not(.journey-visible) .journey-copy { transform: translateY(24px) scale(.98); clip-path: inset(0 0 8% 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          #registration-journey .journey-image, #registration-journey .journey-copy, #registration-journey .journey-node { transition: none; }
          #registration-journey.journey-ready .journey-step:not(.journey-visible) .journey-image,
          #registration-journey.journey-ready .journey-step:not(.journey-visible) .journey-copy { opacity: 1; transform: none; clip-path: none; }
        }
      `}</style>
      <div className="max-w-3xl mb-10 md:mb-16">
        <p className="text-[#E92A39] text-xs font-black uppercase tracking-[.2em] mb-4">Your journey starts with registration</p>
        <h2 id="registration-journey-title" className="text-4xl md:text-6xl font-black tracking-tight text-white mb-5">Dare <span className="text-[#E92A39]">&gt;&gt;&gt;&gt;</span> Discover <span className="text-[#E92A39]">&gt;&gt; DO</span></h2>
        <p className="text-[#A1A1AA] text-base md:text-xl font-semibold max-w-xl">Head to the registration page to create your InGenuityX profile. Start there, then follow the journey from your first brief to the finale.</p>
        <Link to="/register" className="inline-flex items-center gap-2 mt-6 bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-7 py-4 rounded-full text-sm font-black transition-colors">Go to Registration <ChevronRight className="w-4 h-4" /></Link>
      </div>
      <div className="relative">
        <div ref={trackRef} className="journey-track" aria-hidden="true"><div ref={progressRef} className="journey-progress" /></div>
        <ol className="journey-timeline">
          {REGISTRATION_STEPS.map(step => (
            <li key={step.number} className="journey-step">
              <figure className="journey-image">
                <img src={step.image} alt={step.alt} loading="lazy" width="1200" height="750" className="w-full aspect-[8/5] object-contain bg-[#161616] rounded-2xl md:rounded-[2rem] border border-[#2A2A2E] shadow-2xl" />
              </figure>
              <span className="journey-node" aria-hidden="true">{step.number}</span>
              <div className="journey-copy">
                <p className="text-[#E92A39] text-[10px] md:text-xs font-black uppercase tracking-[.18em] mb-3">Step {step.number} / {step.label}</p>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white mb-4">{step.title}</h3>
                <p className="text-[#A1A1AA] text-sm md:text-base lg:text-lg font-semibold leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-10 md:mt-16 rounded-2xl border border-[#2A2A2E] bg-[#161616]/80 p-6 md:p-8">
        <p className="text-xl md:text-2xl font-black text-white">Ready to get started? Create your profile.</p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-7 py-4 rounded-full text-sm font-black transition-colors">Go to Registration <ChevronRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [isLoadingOpps, setIsLoadingOpps] = useState(true);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState('idle');
  const [copied, setCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [openFaq, setOpenFaq] = useState(-1);
  const [heroVideoIndex, setHeroVideoIndex] = useState(0);
  const [processVideoIndex, setProcessVideoIndex] = useState(0); 

  const waitlistRank = 2843;

  const heroVideos = [
     intervie, collaborating, chaos, celebration3
  ].filter(Boolean).map(src => ({ src })); 

  const scrollToWaitlist = () => {
    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (heroVideos.length <= 1) return;

    const FIRST_DURATION = 8000; 
    const LOOP_DURATION = 4000;  

    let intervalId;
    const firstTimeout = setTimeout(() => {
      setHeroVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
      intervalId = setInterval(() => {
        setHeroVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
      }, LOOP_DURATION);
    }, FIRST_DURATION);

    return () => {
      clearTimeout(firstTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [heroVideos.length]);

  useEffect(() => {
    if (PROCESS_CLIPS.length <= 1) return;
    const processIntervalId = setInterval(() => {
      setProcessVideoIndex((prevIndex) => (prevIndex + 1) % PROCESS_CLIPS.length);
    }, 5000); 

    return () => clearInterval(processIntervalId);
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-10-20T00:00:00Z').getTime();
    const tick = () => {
      const distance = targetDate - Date.now();
      if (distance < 0) { setCountdown({ days: 0, hours: 0, minutes: 0 }); return; }
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };
    tick();
    const interval = setInterval(tick, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        const oppsResponse = await axios.get(`${API_URL}/api/challenges`).catch(() => ({ data: { data: [] } }));
        const fetchedOpps = oppsResponse.data.data.map(item => {
          const attr = item.attributes || item;
          let plainTextDescription = attr.description;
          if (Array.isArray(attr.description)) {
            plainTextDescription = attr.description.map(block => block.children ? block.children.map(child => child.text).join('') : '').join('\n');
          }
          let finalLogoUrl = attr.logoUrl;
          if (!finalLogoUrl) {
            const compNameLower = (attr.company || '').toLowerCase();
            if (compNameLower.includes('nuvoco')) finalLogoUrl = nuvocoLogo;
            else if (compNameLower.includes('srmb')) finalLogoUrl = srmbLogo;
            else if (compNameLower.includes('ingenx') || compNameLower.includes('ingenuityx')) finalLogoUrl = ingenxLogo;
            else if (compNameLower.includes('trootech')) finalLogoUrl = trootechLogo;
          }
          return {
            id: item.documentId || item.id,
            title: attr.title,
            company: attr.company,
            logoUrl: finalLogoUrl,
            type: attr.type || 'Competition',
            category: attr.category || 'Marketing',
            duration: attr.duration,
            points: attr.points,
            description: plainTextDescription,
            deadline: attr.deadline,
          };
        });

        const DEMO_CHALLENGES = [
          { id: "demo-eveready-1", title: "Keep It Lit", company: "Eveready", logoUrl: null, bgImage: evereadyBg, type: "Innovation Project", category: "Innovation", duration: "4 Weeks", points: "Internship + Rs 50k", description: "Reinvent portable lighting for rural and everyday India. Design a robust, affordable, and sustainable portable lighting solution.", deadline: "Oct 30, 2026", isDemo: true },
          { id: "demo-trootech-1", title: "TrooTech 2030", company: "TrooTech", logoUrl: trootechLogo, bgImage: trootechPosterBg, type: "Innovation Challenge", category: "Innovation", duration: "5 Weeks", points: "Certification", description: "Reposition a 350+ person AI company's brand story. Innovate, collaborate, and change the game in this challenge.", deadline: "Oct 28, 2026", isDemo: true },
          { id: "demo-legrand-1", title: "Power Protocol", company: "Legrand", logoUrl: null, bgImage: legrandBg, type: "Tech Hackathon", category: "Tech", duration: "3 Weeks", points: "Rs 1L + Tech Setup", description: "Design intelligent power distribution for AI data centers. Develop energy-efficient systems capable of sustaining high-density loads.", deadline: "Oct 20, 2026", isDemo: true },
          { id: "demo-nuvoco-1", title: "Grey 2 Green", company: "Nuvoco", logoUrl: nuvocoLogo, bgImage: nuvocoGreenBg, type: "Sustainability Project", category: "Sustainability", duration: "4 Weeks", points: "PPI + Rs 50k", description: "Cut the carbon footprint of cement manufacturing. Develop innovative strategies to drastically reduce emissions across supply chains.", deadline: "Oct 18, 2026", isDemo: true },
          { id: "demo-srmb-1", title: "Solid Shift Challenge", company: "SRMB", logoUrl: srmbLogo, bgImage: srmbShiftBg, type: "Innovation Challenge", category: "Design", duration: "5 Weeks", points: "Rs 75k Pool", description: "Reimagine advanced building materials. Pitch a revolutionary approach to materials that adapt to environmental stress.", deadline: "Oct 25, 2026", isDemo: true },
          { id: "demo-srmb-3", title: "Ironclad Challenge", company: "SRMB", logoUrl: srmbLogo, bgImage: srmbIroncladBg, type: "Marketing Campaign", category: "Marketing", duration: "4 Weeks", points: "Internship + Rs 40k", description: "Position SRMB among Gen-Z homeowners. Design a robust go-to-market strategy to solidify their leadership.", deadline: "Oct 22, 2026", isDemo: true }
        ];

        setOpportunities([...DEMO_CHALLENGES, ...fetchedOpps]);
      } catch (error) {
        console.error("Error fetching platform data:", error);
      } finally {
        setIsLoadingOpps(false);
      }
    };
    fetchPlatformData();
  }, []);

  const handleWaitlistJoin = async () => {
    const trimmedEmail = waitlistEmail.trim();
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setWaitlistStatus('error');
      return;
    }
    setWaitlistStatus('submitting');
    try {
      await axios.post(`${API_URL}/api/waitlists`, { data: { email: trimmedEmail } }).catch(()=>{});
      setWaitlistStatus('success');
    } catch (err) {
      setWaitlistStatus('success'); 
    }
  };

  const faqs = [
    { q: "Is this actually legit, or filler content?", a: "Bilkul legit. Every brief comes straight from a real brand with a real problem — win, and they might actually build your idea, not just hand you a PDF certificate." },
    { q: "Do I need a top college tag to win?", a: "Nahi. We hide your college name till the shortlist stage — brands only see the idea. Merit se hoga, tag se nahi." },
    { q: "Solo run ya squad zaroori hai?", a: "Depends on the brief. Kuch solo hote hain, most let you squad up with up to 4 log — even from totally different colleges." },
    { q: "Any entry fee? What's the catch?", a: "Zero catch, zero fee. Kabhi nahi. Brands pay to be here — tumhara kaam sirf build karna hai." },
    { q: "Submit kiya, jeeta nahi — waste gaya?", a: "Bilkul nahi. You still get 'The Rejection Letter' — a real scorecard on your Insight, Strategy aur Execution. Actual feedback, participation trophy nahi." }
  ];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = activeFilter === 'All' || opp.category === activeFilter;
    const matchesSearch = searchQuery === '' || opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) || opp.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="grain min-h-screen bg-transparent text-[#FAFAFA] font-sans overflow-x-hidden relative selection:bg-[#E92A39] selection:text-white">
      
      {/* GLOBAL BACKGROUND IMAGE WITH BLUR OVERLAY */}
      <div className="fixed inset-0 z-[-1] bg-black">
        <img src={GLOBAL_BG} alt="" className="w-full h-full object-cover opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/80 via-[#151515]/95 to-[#151515] backdrop-blur-[60px]"></div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Kalam:wght@400;700&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .grain::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 100; mix-blend-mode: overlay;
        }
        @keyframes textFadeUp { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-text-fade-up { animation: textFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInOpacity { 0% { opacity: 0; transform: scale(1.05); } 100% { opacity: 0.8; transform: scale(1); } }
        .animate-video-fade { animation: fadeInOpacity 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>

      {/* COUNTDOWN BANNER */}
      <div className="fixed top-0 w-full h-10 bg-[#0A0A0A]/80 backdrop-blur-md text-[#FAFAFA] px-4 md:px-6 text-center text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 z-[60] border-b border-[#2A2A2E]">
        <span className="text-[#E92A39] animate-pulse">LIVE</span>
        <span className="hidden sm:inline">Launching this Dussehra in</span> {countdown.days}d {countdown.hours}h {countdown.minutes}m --
        <button onClick={scrollToWaitlist} className="underline hover:text-[#E92A39] transition-colors">Join</button>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-10 w-full z-50 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2E] shadow-sm' : 'bg-gradient-to-b from-black/80 to-transparent pt-6 md:pt-4'}`}>
        <div className="w-auto md:w-48 flex justify-start">
          <Link to="/" className="hover:opacity-80 transition-opacity flex items-center">
            <img src={logoImage} alt="InGenuityX" className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-6 md:h-8' : 'h-8 md:h-10'}`} />
          </Link>
        </div>
        <div className={`hidden md:flex items-center justify-center gap-10 text-sm font-bold tracking-wide transition-colors duration-300 flex-1 ${isScrolled ? 'text-[#A1A1AA]' : 'text-white/90'}`}>
          <a href="#opportunities" className="hover:text-[#FAFAFA] transition-colors">Opportunities</a>
          <Link to="/for-brands" className="hover:text-[#FAFAFA] transition-colors">For Brands</Link>
          <Link to="/about" className="hover:text-[#FAFAFA] transition-colors">About Us</Link>
        </div>
        <div className="w-auto md:w-48 flex justify-end">
          <button onClick={scrollToWaitlist} className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-sm transition-colors">
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* 1. HERO SECTION & QUEUE MECHANIC */}
      <section className="relative w-full min-h-[100dvh] flex items-start justify-center overflow-hidden bg-transparent pb-24 lg:pb-32 pt-[22vh] md:pt-[28vh]">
        <div className="absolute inset-0 bg-transparent">
          {heroVideos && heroVideos.length > 0 ? (
            <CrossfadeVideoPlayer clips={heroVideos} activeIndex={heroVideoIndex} poster={billboardImage} />
          ) : (
            <ImageWithFallback src={billboardImage} alt="InGenuityX" className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/90 via-[#151515]/50 to-transparent" />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto flex flex-col px-4 md:px-12 lg:px-20 w-full">
          <div className="w-full lg:w-4/5 xl:w-3/5">
            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold tracking-tight mb-4 md:mb-6 leading-[1.1] md:leading-[1.05] text-[#FAFAFA] flex flex-col items-start min-h-[90px] md:min-h-[160px]">
              <span className="block">Duniya ke sabse bade brands ke</span>
              <span key={`hook-${heroVideoIndex}`} className="text-[#E92A39] block animate-text-fade-up mt-1 md:mt-2">
                {HERO_RED_HOOKS[heroVideoIndex % HERO_RED_HOOKS.length]}
              </span>
            </h1>
            
            {waitlistStatus !== 'success' ? (
              <>
                <p className="text-base md:text-2xl text-[#A1A1AA] mb-8 md:mb-10 max-w-xl font-bold animate-text-fade-up" style={{ animationDelay: '100ms' }}>
                  Register before Dussehra (October 20th) to get the first briefs the moment they drop.
                </p>
                <div id="waitlist-form" className="mt-4 md:mt-6 w-full scroll-mt-32 animate-text-fade-up" style={{ animationDelay: '200ms' }}>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={waitlistEmail}
                      onChange={(e) => { setWaitlistEmail(e.target.value); if (waitlistStatus === 'error') setWaitlistStatus('idle'); }}
                      className={`flex-1 bg-black/40 backdrop-blur-md border ${waitlistStatus === 'error' ? 'border-[#E92A39]' : 'border-white/10'} text-white placeholder:text-[#71717A] px-5 py-3.5 md:px-6 md:py-4 rounded-full focus:outline-none focus:border-[#E92A39] font-bold text-sm md:text-base transition-colors shadow-inner`}
                    />
                    <button onClick={handleWaitlistJoin} disabled={waitlistStatus === 'submitting'} className="bg-[#E92A39] text-white px-8 py-3.5 md:py-4 rounded-full text-xs font-black uppercase tracking-widest shrink-0 hover:bg-[#ff3b4b] transition-colors disabled:opacity-60 shadow-lg">
                      {waitlistStatus === 'submitting' ? 'Joining...' : 'Lock In'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div id="waitlist-form" className="mt-6 md:mt-8 w-full max-w-xl bg-[#151515]/90 backdrop-blur-md border border-[#2A2A2E] rounded-[2rem] p-6 md:p-8 shadow-2xl animate-text-fade-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-[#10B981]" /> You're locked in.
                  </h3>
                  <span className="bg-[#10B981]/10 text-[#10B981] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-[#10B981]/20 w-fit">
                    Rank #{waitlistRank.toLocaleString()}
                  </span>
                </div>
                <p className="text-[#A1A1AA] text-sm md:text-base font-bold mb-6 leading-relaxed">
                  The vault opens on Dussehra (Oct 20th). Want early access? Move up <strong className="text-white">50 spots</strong> for every peer who joins using your link.
                </p>
                <div className="flex items-center gap-2 bg-[#0A0A0A] p-1.5 md:p-2 rounded-xl border border-[#2A2A2E]">
                  <input 
                    type="text" 
                    readOnly 
                    value={`ingenuityx.com/join?ref=ix_${waitlistEmail.split('@')[0] || 'user'}`} 
                    className="bg-transparent text-[#71717A] text-xs md:text-sm font-mono flex-1 px-3 outline-none truncate"
                  />
                  <button 
                    onClick={() => { 
                      navigator.clipboard.writeText(`ingenuityx.com/join?ref=ix_${waitlistEmail.split('@')[0] || 'user'}`); 
                      setCopied(true); setTimeout(() => setCopied(false), 2000); 
                    }}
                    className="bg-[#2A2A2E] hover:bg-[#3f3f46] text-white px-4 py-2.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 shrink-0"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5"/> : <Copy className="w-3.5 h-3.5"/>}
                    {copied ? 'Copied' : 'Copy Link'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <PreRegistrationStatement />

      <RegistrationLaunchBanner />

      {/* 3. PICK YOUR LANE */}
      <section className="py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto border-t border-[#2A2A2E]">
        <ScrollReveal>
          <div className="mb-8 md:mb-10 text-left">
            <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 md:mb-4">Find your vibe(and tribe)</h3>
            <p className="text-[#A1A1AA] font-bold text-sm md:text-lg">Choose from the 6 Rooms where you get noticed</p>
          </div>
        </ScrollReveal>
        
        {/* Responsive Theme Grid: Three Cards Per Row on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-y-8 gap-x-4 md:gap-x-12 md:px-6">
          {CATEGORY_FILTERS.filter(f => f !== 'All').map((catName, i) => {
            const catColor = CATEGORY_COLORS[catName] || '#FAFAFA';
            const data = CATEGORY_DATA[catName];
            
            return (
              <ScrollReveal key={i} delay={i * 50} className="min-w-0 h-[280px] md:h-[360px]">
                <div 
                  onClick={() => { setActiveFilter(catName); document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="relative h-full w-full overflow-hidden group cursor-pointer transition-all duration-500 ease-out md:transform md:-skew-x-6 rounded-2xl md:rounded-2xl border border-[#2A2A2E] hover:border-transparent"
                >
                  <div className="absolute md:inset-[-20%] md:w-[140%] inset-0 w-full h-full md:transform md:skew-x-6 pointer-events-none">
                    <img src={data.img} alt={catName} className="absolute inset-0 w-full h-full object-cover opacity-40 md:group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-black/40 md:via-black/20 to-transparent md:group-hover:opacity-0 transition-opacity duration-300"></div>
                    
                    {/* Staggered Step Fill */}
                    <div className="hidden md:block absolute inset-0 overflow-hidden z-10">
                       <div className="absolute bottom-0 left-0 w-[33.5%] h-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" style={{ backgroundColor: catColor }}></div>
                       <div className="absolute bottom-0 left-[33.3%] w-[33.5%] h-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out delay-75" style={{ backgroundColor: catColor }}></div>
                       <div className="absolute bottom-0 left-[66.6%] w-[33.5%] h-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out delay-150" style={{ backgroundColor: catColor }}></div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 md:p-8 md:transform md:skew-x-6 pointer-events-none">
                    <span className="absolute top-5 left-5 md:top-6 md:left-8 text-4xl md:text-5xl font-black text-white/80 leading-none" aria-label={`Theme ${i + 1}`}>{i + 1}</span>
                    {/* Default View */}
                    <div className="md:absolute md:bottom-6 md:left-8 md:right-6 transition-all duration-300 md:group-hover:opacity-0 md:group-hover:translate-y-4">
                      <h4 
                        className={`text-2xl md:text-xl font-black text-white uppercase drop-shadow-lg ${
                          catName.length > 10 
                            ? 'lg:text-xl xl:text-2xl tracking-wide' 
                            : 'lg:text-3xl tracking-widest'
                        }`} 
                        style={{ color: catColor }}
                      >
                        {catName}
                      </h4>
                    </div>

                    {/* Desktop Hover Reveal */}
                    <div className="hidden md:flex opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200 flex-col items-start h-full justify-center w-full">
                      <h4 className={`text-2xl font-black text-white mb-3 tracking-tight drop-shadow-lg ${
                        catName.length > 10 ? 'xl:text-3xl' : 'xl:text-4xl'
                      }`}>
                        {catName}
                      </h4>
                      <p className="text-white/90 text-sm md:text-base font-semibold mb-6 max-w-[220px] md:max-w-sm leading-relaxed drop-shadow-md">{data.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 4. WHAT'S ACTUALLY ON THE LINE */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-y border-[#2A2A2E] overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={PLACEHOLDER_BG} alt="Rewards Background" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#151515] via-[#151515]/80 to-[#151515]"></div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-3 md:mb-4">Earn More Than a Certificate</h2>
              <p className="text-[#A1A1AA] font-bold text-sm md:text-lg max-w-2xl mx-auto px-4">No generic certificates. These are the actual rewards tied to live briefs in the vault right now.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {PLATFORM_REWARDS.map((reward, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="relative bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#2A2A2E] rounded-[1.5rem] md:rounded-[2rem] text-center flex flex-col items-center justify-center min-h-[140px] md:min-h-[200px] hover:border-[#E92A39]/50 transition-colors overflow-hidden group">
                  <img src={REWARD_IMAGES[i % REWARD_IMAGES.length]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"></div>
                  
                  {/* NEW NUMERIC DESIGN */}
                  <div className="relative z-10 p-6 md:p-8 w-full flex flex-col items-center justify-center h-full">
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-1 drop-shadow-md">{reward.top}</h3>
                    <h4 className="text-sm md:text-base font-bold text-[#FAFAFA] mb-2 uppercase tracking-widest drop-shadow-sm">{reward.title}</h4>
                    <span className="text-[10px] md:text-xs font-black text-[#E92A39] uppercase tracking-widest bg-[#E92A39]/10 border border-[#E92A39]/20 px-3 py-1 rounded-full mt-2 backdrop-blur-md">{reward.sub}</span>
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE CHALLENGE VAULT (REFINED HOVER ACTION) */}
      <section id="opportunities" className="py-16 md:py-24 relative overflow-hidden bg-transparent border-b border-[#2A2A2E] scroll-mt-10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 md:mb-4 text-white">The Challenge Vault</h2>
                <p className="text-[#A1A1AA] text-sm md:text-base font-bold">Pick a brief. Build your proof. Get noticed.</p>
              </div>
              <div className="flex items-center bg-[#1C1C1E]/80 backdrop-blur-md border border-[#2A2A2E] rounded-full px-4 py-2.5 md:px-5 md:py-3 w-full md:w-[350px]">
                <Search className="w-4 h-4 md:w-5 md:h-5 text-[#71717A] mr-2 md:mr-3" />
                <input type="text" placeholder="Search brands or briefs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-[#71717A]" />
              </div>
            </div>

            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-4 md:pb-6 w-full">
              {CATEGORY_FILTERS.map(filter => (
                <button 
                  key={filter} 
                  onClick={() => setActiveFilter(filter)} 
                  className={`whitespace-nowrap px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all border ${activeFilter === filter ? 'bg-[#E92A39] border-[#E92A39] text-white' : 'bg-[#151515]/80 backdrop-blur-sm border-[#2A2A2E] text-[#A1A1AA] hover:border-gray-500 hover:text-white'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {isLoadingOpps ? (
             <div className="text-center py-20 md:py-32 text-[#71717A] font-bold text-xs md:text-sm uppercase tracking-widest">Loading...</div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-20 md:py-32 border border-[#2A2A2E] rounded-2xl bg-[#151515]/80 backdrop-blur-sm">
              <p className="text-[#A1A1AA] text-sm font-bold">No matches found in this lane.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredOpportunities.map((opp, i) => {
                const catColor = CATEGORY_COLORS[opp.category] || '#E92A39';
                return (
                  <ScrollReveal key={opp.id} delay={(i % 4) * 50}>
                    <div 
                      className="relative rounded-[2.5rem] bg-[#161616] border border-[#2A2A2E] h-[540px] flex flex-col overflow-hidden group cursor-pointer shadow-sm"
                      onClick={scrollToWaitlist}
                    >
                      {/* Background Image */}
                      <img src={opp.bgImage || PLACEHOLDER_BG} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                      {/* Default State (Visible when NOT hovered) */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-8 transition-opacity duration-500 group-hover:opacity-0">
                        {/* Top Left Tag */}
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white w-fit shadow-sm flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }}></span>
                          {opp.category}
                        </span>

                        {/* Bottom Gradient & Content */}
                        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent pointer-events-none" />
                        <div className="relative z-10 w-full mt-auto">
                           <h4 className="text-3xl font-black text-white mb-6 leading-tight">{opp.title}</h4>
                           <button className="w-full bg-[#1C1C1E] border border-[#2A2A2E] text-white py-4 rounded-xl text-sm font-black flex justify-center items-center gap-2 shadow-lg backdrop-blur-md">
                              Hover to view brief
                           </button>
                        </div>
                      </div>

                      {/* Hover Overlay (Dark Blur) */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                      {/* Hover Content Area (Exactly matching the image) */}
                      <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        
                        {/* Top Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/10 border border-white/5 text-white/90 shadow-sm">{opp.type}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/10 border border-white/5 text-white/90 shadow-sm">PPO Pathway</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#10B981] text-white w-fit shadow-sm">Opens on Dussehra (Oct 20)</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/5 shadow-sm">↗</div>
                        </div>

                        {/* Title & Company */}
                        <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6 drop-shadow-md">{opp.title}</h3>
                        
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-12 h-12 rounded-full bg-white p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                             {opp.logoUrl ? <img src={opp.logoUrl} alt={opp.company} className="w-full h-full object-contain" /> : <span className="text-[#111] font-black text-xl">{opp.company.charAt(0)}</span>}
                           </div>
                           <div className="flex items-center gap-1.5 text-white font-bold text-lg drop-shadow-md">
                             {opp.company} <CheckCircle2 className="w-5 h-5 text-[#3BA8E7]" strokeWidth={3} /> <span className="text-[10px] uppercase tracking-widest text-white/60 font-black ml-1">Verified</span>
                           </div>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 mb-6">
                          <span className="text-[11px] font-bold px-4 py-2 rounded-full border border-white/20 text-white/90 bg-white/5 backdrop-blur-sm">Team 1-4</span>
                          <span className="text-[11px] font-bold px-4 py-2 rounded-full border border-white/20 text-white/90 bg-white/5 backdrop-blur-sm">Beginner Friendly</span>
                        </div>

                        {/* Reward Box */}
                        <div className="bg-white/5 border border-white/20 rounded-2xl p-5 mb-auto backdrop-blur-sm">
                          <h4 className="text-2xl font-black text-white drop-shadow-sm mb-1">{opp.points.split('+')[0].trim()}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{opp.duration} • {opp.deadline}</p>
                        </div>

                        {/* CTA & Desc */}
                        <button className="w-full bg-[#E92A39] text-white py-4 rounded-xl text-sm font-black flex justify-center items-center gap-2 shadow-lg mb-4 hover:bg-[#ff3b4b] transition-colors mt-6">
                          ⏳ Join Waitlist to Apply
                        </button>
                        <p className="text-[#A1A1AA] text-xs font-medium line-clamp-2 leading-relaxed drop-shadow-sm">{opp.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6. SINGLE MERGED PROCESS VIDEO PLAYER */}
      <section id="inside" className="py-16 md:py-28 px-4 md:px-8 max-w-[1600px] mx-auto border-t border-[#2A2A2E] relative overflow-hidden">
        <ScrollReveal>
          <div className="max-w-3xl mb-12 md:mb-16">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-4">
              Read. Argue. Build.
              <br />
              <span className="text-[#A1A1AA]">Submit.</span>
            </h2>

            <p className="max-w-xl text-base md:text-xl font-bold text-[#A1A1AA]">
              Brief drops. Group chats blow up. The first draft gets trashed. And then, you build something that actually wins.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 w-full h-[400px] md:h-[600px]">
          <ScrollReveal className="h-full w-full">
            <figure className="group relative overflow-hidden rounded-[2.5rem] border border-[#2A2A2E] bg-[#161616] h-full w-full shadow-2xl">
              <CrossfadeVideoPlayer
                clips={PROCESS_CLIPS}
                activeIndex={processVideoIndex}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent pointer-events-none" />
              
              <figcaption className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-10">
                <h3 key={`label-${processVideoIndex}`} className="font-mono text-2xl md:text-4xl lg:text-5xl font-black tracking-[0.16em] text-[#FAFAFA] animate-text-fade-up mb-8 drop-shadow-lg">
                  {PROCESS_CLIPS[processVideoIndex].label}
                </h3>
                
                {/* Progress Indicators */}
                <div className="flex gap-3">
                  {PROCESS_CLIPS.map((_, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setProcessVideoIndex(idx)} 
                      className={`h-2 rounded-full cursor-pointer transition-all duration-500 ease-out ${
                        processVideoIndex === idx ? 'w-12 md:w-20 bg-[#E92A39] shadow-[0_0_10px_#E92A39]' : 'w-3 bg-white/20 hover:bg-white/40'
                      }`} 
                    />
                  ))}
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
      </section>

      <RegistrationJourney />

      {/* 9. FAQ */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-transparent border-t border-[#2A2A2E]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 md:mb-10 text-white text-left md:text-center">Before you ask.</h2>
            <div className="bg-[#151515]/80 backdrop-blur-sm border border-[#2A2A2E] rounded-2xl md:rounded-[2rem] px-5 md:px-10">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 10. FINAL COUNTDOWN CTA */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto relative z-10">
        <ScrollReveal>
          <div className="bg-[#1C1C1E]/80 backdrop-blur-md border border-[#2A2A2E] rounded-2xl md:rounded-[3rem] p-8 md:p-20 text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#E92A39]/10 to-transparent pointer-events-none"></div>
            <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-4 md:mb-6 relative z-10">
              Vault opens this Dussehra, October 20th.
            </h2>
            <p className="text-[#A1A1AA] text-sm md:text-lg font-bold mb-8 md:mb-10 max-w-xl relative z-10">
              Don't miss the first cohort of live briefs. Join the waitlist to secure early access.
            </p>
            <button onClick={scrollToWaitlist} className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg relative z-10">
              Join the Waitlist
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="py-12 md:py-16 px-6 md:px-12 border-t border-[#2A2A2E] bg-black/80 backdrop-blur-md">
        <ScrollReveal>
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div className="md:col-span-2 flex flex-col items-start gap-6 md:gap-8">
              <img src={logoImage} alt="InGenuityX Logo" className="h-6 md:h-10 w-auto object-contain" />
              <p className="text-[#71717A] text-xs md:text-sm max-w-xs leading-relaxed font-bold">Bridging the gap between Gen Z talent and brand briefs. Stop simulating. Start building.</p>
            </div>
            <div className="flex flex-col">
              <h4 className="text-[#71717A] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">Platform</h4>
              <div className="flex flex-col space-y-3 md:space-y-4 text-white text-xs md:text-sm font-bold">
                <a href="#opportunities" className="hover:text-[#E92A39] transition-colors w-fit">Challenges</a>
                <Link to="/about" className="hover:text-[#E92A39] transition-colors w-fit">About</Link>
                <Link to="/for-brands" className="hover:text-[#E92A39] transition-colors w-fit">For Brands</Link>
              </div>
            </div>
            <div className="flex flex-col">
              <h4 className="text-[#71717A] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">Connect</h4>
              <div className="flex flex-col space-y-3 md:space-y-4 text-xs md:text-sm font-bold text-white">
                <a href="mailto:storm@minervainnov.com" className="hover:text-[#E92A39] transition-colors w-fit">storm@minervainnov.com</a>
                <a href="tel:+918320262013" className="hover:text-[#E92A39] transition-colors w-fit">+91 8320 262 013</a>
              </div>
            </div>
          </div>
          <div className="max-w-[1600px] mx-auto mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[#2A2A2E]">
            <p className="text-[10px] md:text-xs text-[#71717A] font-bold uppercase tracking-widest">© 2026 InGenuityX. All rights reserved.</p>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
}