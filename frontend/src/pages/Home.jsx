import RegistrationJourney from '../components/RegistrationJourney';
import ChallengeVault from '../components/ChallengeVault';
import WhatIf from '../components/WhatIf';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Lock, CheckCircle2, ChevronRight, Clock, Award, Upload, Scale, FileText, TrendingUp, MessageCircle, Terminal } from 'lucide-react';

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

// --- POSTER IMAGES ---
import srmbGreenProBg from '../imports/srmb (1).png';
import ingenxPosterBg from '../imports/IngenX (2).png';

// --- CREATOR CHALLENGE IMAGES ---
import creatorImg1 from "../imports/creator's challenge.png";

// --- HERO VIDEOS ---
import intervie from '../imports/intervie.mp4';
import collaborating from '../imports/collaborating.mp4';
import chaos from '../imports/chaos.mp4';
import celebration3 from '../imports/celebration3.mp4';

import img6 from '../imports/img6.jpg';
import img7 from '../imports/img7.png';

// =====================================================================
// ENVIRONMENT & CONSTANTS
// =====================================================================
const PLACEHOLDER_BG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
const GLOBAL_BG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop";

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

// Anonymous preview copy. Original branded page is preserved in
// frontend/archive/challenge-vault/Home.before-anonymous-vault.jsx.txt.
// --- REWARDS DATA ---
const PLATFORM_REWARDS = [
  { top: "Think", title: "Fresh Ideas" },
  { top: "Build", title: "A Response" },
  { top: "Show", title: "Your Process" },
  { top: "Grow", title: "Your Skills" }
];

const REWARD_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
  img6,
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
];

// --- PROCESS SECTION DATA ---

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
    let active = true;
    const updateReading = () => {
      const section = sectionRef.current;
      if (!active || !section?.isConnected) return;
      const bounds = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.85 - bounds.top) / (window.innerHeight * 0.65)));
      setWordsRead(media.matches ? PRE_REGISTER_WORDS.length : Math.ceil(progress * PRE_REGISTER_WORDS.length));
    };
    updateReading();
    window.addEventListener('scroll', updateReading, { passive: true });
    window.addEventListener('resize', updateReading);
    media.addEventListener('change', updateReading);
    return () => {
      active = false;
      window.removeEventListener('scroll', updateReading);
      window.removeEventListener('resize', updateReading);
      media.removeEventListener('change', updateReading);
    };
  }, []);

  return (
    <section data-cta-section="pre-registration-statement" ref={sectionRef} id="pre-registration-statement" className="relative flex flex-col justify-center items-center min-h-[70svh] bg-[#0b0b0b] px-6 md:px-12 lg:px-20 py-20 md:py-28">
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
    <div className="relative z-10 mt-10 text-center"><PreRegisterCTA /></div>
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
    let active = true;
    const clearDwell = () => {
      window.clearTimeout(dwellTimer);
      dwellTimer = null;
    };
    const checkVisibility = () => {
      const banner = bannerRef.current;
      if (!active || !banner?.isConnected) { clearDwell(); return; }
      const bounds = banner.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
      const stayingHere = !document.hidden && visibleHeight >= Math.min(bounds.height, window.innerHeight) * 0.7;
      if (!stayingHere) {
        clearDwell();
        fired = false;
      } else if (!fired && dwellTimer === null) {
        dwellTimer = window.setTimeout(() => {
          dwellTimer = null;
          if (!active || !bannerRef.current?.isConnected) return;
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
      active = false;
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
    <section data-cta-section="registration-launch" ref={bannerRef} id="registration-launch" aria-labelledby="registration-launch-title" className={`registration-launch ${launched ? 'is-launched' : ''} ${boosting ? 'is-boosting' : ''} ${motionPaused ? 'motion-paused' : ''}`}>
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
                { value: 100, suffix: '+', label: 'Opportunities' },
                { value: CATEGORY_FILTERS.length - 1, suffix: '', label: 'Themes' },
                { value: 1, suffix: '', label: 'First cohort' },
              ].map((stat, index) => (
                <div key={stat.label} className="launch-stat" style={{ '--stat-delay': `${index * 140}ms` }} aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
                  <strong aria-hidden="true">{String(Math.round(stat.value * statProgress)).padStart(index === 2 ? 2 : 1, '0')}{stat.suffix}</strong>
                  <span className="launch-stat-label">{stat.label}</span>
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
          <p className="launch-edition">COHORT 01 NOV 2026</p>
          <h2 id="registration-launch-title" className="launch-heading">Don’t just<br />watch.<br /><em>Be in the room.</em></h2>
          <p className="launch-one-liner">Be the team they talk about.</p>
          <p className="launch-subline launch-mantra">Dare <span aria-hidden="true">››</span> Discover <span aria-hidden="true">››</span> Do.</p>
          <Link to="/register" className="launch-button">Pre-register</Link>
        </div>
      </div>
    </section>
  );
}

// --- REGISTRATION TO FINALE ---
const REGISTRATION_STEPS = [
  { number: '01', label: 'GET IN THE GAME', title: 'Pre-register. Make it official.', description: 'Create your InGenuityX profile and tell us what you bring to the table. Your journey starts with one simple step: showing up.', image: journeyRegister, alt: 'Participants checking in at the InGenuityX registration desk' },
  { number: '02', label: 'FIND YOUR CHALLENGE', title: 'Pick a brief. Build your idea.', description: 'Choose a challenge that matches your interests. Read the brief, understand the problem, and turn your first thought into something worth sharing.', image: journeyBuild, alt: 'A student team discussing their challenge with laptops and notes' },
  { number: '03', label: 'PUT YOUR WORK OUT THERE', title: 'Submit. Let the idea speak.', description: 'Bring your solution together and submit it before the challenge deadline. Follow the brief’s submission guidelines and watch for review and shortlist updates.', image: journeySubmit, alt: 'Participants celebrating the announcement of shortlisted teams' },
  { number: '04', label: 'MENTORSHIP & GROWTH', title: 'Get Mentored. Grow Your Idea.', description: 'Work with mentors to sharpen your thinking, challenge your assumptions, and strengthen your solution. Turn feedback into a clearer idea and a stronger pitch before the finale.', image: journeyMentorship, alt: 'A mentor guiding a student team around a table with laptops and notebooks' },
  { number: '05', label: 'THE FINALE', title: 'Own the stage.', description: 'If shortlisted, take your idea into the finale. Present your thinking, answer the tough questions, and show what makes your solution stand out.', image: journeyFinale, alt: 'Finalists presenting their idea to a panel and audience' },
];

// --- PAGE OPENING TRANSITION ---
function PreRegisterCTA({ label = 'Pre-register' }) {
  return <Link to="/register" className="inline-flex items-center justify-center gap-5 bg-[#ff4b26] text-white px-7 py-4 rounded-full text-sm font-black hover:bg-[#df3512] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4b26]">{label}</Link>;
}

function PageOpeningTransition() {
  const [opening, setOpening] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      setOpening(false);
      return;
    }
    const timeout = window.setTimeout(() => setOpening(false), 1250);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!opening) return null;
  return (
    <div className="home-opening" aria-hidden="true">
      <style>{`
        .home-opening { position: fixed; inset: 0; z-index: 200; pointer-events: none; overflow: hidden; }
        .home-opening-panel { position: absolute; inset-block: 0; width: 50.1%; background: #fff4e8; animation: homeOpeningReveal 1.1s .1s cubic-bezier(.76,0,.24,1) both; }
        .home-opening-panel:first-of-type { left: 0; transform-origin: left; }
        .home-opening-panel:nth-of-type(2) { right: 0; transform-origin: right; background: #ff4b26; }
        .home-opening-wordmark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #0b0b0b; padding: 24px; text-align: center; font-size: clamp(28px, 5vw, 80px); font-weight: 900; letter-spacing: -.05em; animation: homeOpeningTitle .45s ease-in both; }
        @keyframes homeOpeningReveal { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @keyframes homeOpeningTitle { 0%, 35% { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-18px); } }
        @media (prefers-reduced-motion: reduce) { .home-opening { display: none; } }
      `}</style>
      <div className="home-opening-panel" />
      <div className="home-opening-panel" />
      <div className="home-opening-wordmark">DARE. DISCOVER. DO.</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [openFaq, setOpenFaq] = useState(-1);
  const [heroVideoIndex, setHeroVideoIndex] = useState(0);



  const heroVideos = [
     intervie, collaborating, chaos, celebration3
  ].filter(Boolean).map(src => ({ src })); 

  const goToPreRegister = () => {
    navigate('/register');
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
    const targetDate = new Date('2026-11-08T00:00:00+05:30').getTime();
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

  const faqs = [
    { q: "Is this actually legit, or filler content?", a: "Bilkul legit. Every brief comes straight from a real brand with a real problem — win, and they might actually build your idea, not just hand you a PDF certificate." },
    { q: "Do I need a top college tag to win?", a: "Nahi. We hide your college name till the shortlist stage — brands only see the idea. Merit se hoga, tag se nahi." },
    { q: "Solo run ya squad zaroori hai?", a: "Depends on the brief. Kuch solo hote hain, most let you squad up with up to 4 log — even from totally different colleges." },
    { q: "Any entry fee? What's the catch?", a: "Zero catch, zero fee. Kabhi nahi. Brands pay to be here — tumhara kaam sirf build karna hai." },
    { q: "Submit kiya, jeeta nahi — waste gaya?", a: "Bilkul nahi. You still get 'The Rejection Letter' — a real scorecard on your Insight, Strategy aur Execution. Actual feedback, participation trophy nahi." }
  ];

  return (
    <div className="home-page grain min-h-screen bg-transparent text-[#FAFAFA] font-sans overflow-x-hidden relative selection:bg-[#E92A39] selection:text-white">
      <PageOpeningTransition />
      
      {/* GLOBAL BACKGROUND IMAGE WITH BLUR OVERLAY */}
      <div className="fixed inset-0 z-[-1] bg-black">
        <img src={GLOBAL_BG} alt="" className="w-full h-full object-cover opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/80 via-[#151515]/95 to-[#151515] backdrop-blur-[60px]"></div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');
        .home-page, .home-page * { font-family: 'Lato', sans-serif !important; }
        .home-page h1, .home-page h2, .home-page h3, .home-page h4,
        .home-page :is(h1,h2,h3,h4) *, .home-page .launch-mantra { font-family: 'Arvo', serif !important; font-weight: 700; }
        @media(max-width:600px) { .home-page .vault-header h2 strong { font-size: clamp(52px,16vw,76px); } .home-page .vault-title-arrow { left: calc(100% + 12px); } }
        .home-page .registration-launch .launch-edition { font-size: 14px; }
        .home-page .registration-launch .launch-mantra { font-size: clamp(24px,2.3vw,36px); line-height: 1.35; }

        .hero-highlight { color: #fff; background: #E92A39; padding: .06em .1em .12em; box-decoration-break: clone; max-width: 100%; overflow-wrap: anywhere; }
        .home-hero-headline, .home-hero-headline > span { font-family: 'Outfit', sans-serif; font-weight: 900; letter-spacing: -.045em; }
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
        <span className="hidden sm:inline">Launching this Laxmi Puja in</span> {countdown.days}d {countdown.hours}h {countdown.minutes}m --
        <button data-cta="home-announcement" onClick={goToPreRegister} className="underline hover:text-[#E92A39] transition-colors">Pre-register</button>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-10 w-full z-50 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2E] shadow-sm' : 'bg-gradient-to-b from-black/80 to-transparent pt-6 md:pt-4'}`}>
        <div className="w-auto flex items-center gap-3 md:gap-5">
          <Link to="/" className="hover:opacity-80 transition-opacity flex items-center">
            <img src={logoImage} alt="InGenuityX" className={`w-auto max-w-[96px] md:max-w-none object-contain transition-all duration-300 ${isScrolled ? 'h-6 md:h-8' : 'h-8 md:h-10'}`} />
          </Link>
          <Link to="/for-brands" data-cta="home-brands-navigation" className="text-[10px] md:text-xs font-bold whitespace-nowrap border border-white/30 rounded-full px-3 py-2 text-white hover:bg-white/10">For brands</Link>
        </div>
        <div className={`hidden md:flex items-center justify-center gap-10 text-sm font-bold tracking-wide transition-colors duration-300 flex-1 ${isScrolled ? 'text-[#A1A1AA]' : 'text-white/90'}`}>
          <a href="#opportunities" className="hover:text-[#FAFAFA] transition-colors">Opportunities</a>
          <Link to="/about" className="hover:text-[#FAFAFA] transition-colors">About Us</Link>
        </div>
        <div className="w-auto md:w-48 flex justify-end">
          <button data-cta="home-navigation" onClick={goToPreRegister} className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-3 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-sm transition-colors">
            Pre-register
          </button>
        </div>
      </nav>

      {/* 1. HERO SECTION & QUEUE MECHANIC */}
      <section data-cta-section="home-hero" className="relative w-full min-h-[100dvh] flex items-start justify-center overflow-hidden bg-transparent pb-24 lg:pb-32 pt-[22vh] md:pt-[28vh]">
        <div className="absolute inset-0 bg-transparent">
          {heroVideos && heroVideos.length > 0 ? (
            <CrossfadeVideoPlayer clips={heroVideos} activeIndex={heroVideoIndex} poster={billboardImage} />
          ) : (
            <ImageWithFallback src={billboardImage} alt="InGenuityX" className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/90 via-[#151515]/50 to-transparent" />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto flex flex-col px-4 md:px-12 lg:px-20 w-full">
          <div className="w-full lg:w-4/5 xl:w-3/4">
            <h1 className="home-hero-headline text-4xl md:text-6xl lg:text-[72px] font-black tracking-tight mb-4 md:mb-6 leading-[1.1] md:leading-[1.05] text-[#FAFAFA] flex flex-col items-start min-h-[90px] md:min-h-[160px]">
              <span className="block">Duniya ke sabse bade brands ke</span>
              <span key={`hook-${heroVideoIndex}`} className="hero-highlight block animate-text-fade-up mt-1 md:mt-2">
                {HERO_RED_HOOKS[heroVideoIndex % HERO_RED_HOOKS.length]}
              </span>
            </h1>
            
            <p className="text-base md:text-2xl text-[#A1A1AA] mb-8 max-w-xl font-bold">Your next opportunity starts here. Tell us what you love and what you want to do.</p>
            <PreRegisterCTA />
            <p className="text-sm text-[#A1A1AA] mt-4">About 60 seconds. A whole new set of possibilities.</p>
          </div>
        </div>
      </section>

      <PreRegistrationStatement />

      <RegistrationLaunchBanner />

      {/* 3. PICK YOUR LANE */}
      <section data-cta-section="rooms" id="rooms" className="py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto border-t border-[#2A2A2E]">
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
                  onClick={() => navigate('/rooms')}
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
                    {/* Default View */}
                    <div className="md:absolute md:bottom-6 md:left-8 md:right-6 transition-all duration-300 md:group-hover:opacity-0 md:group-hover:translate-y-4 md:group-focus-within:opacity-0">
                      <h4 
                        className={`flex items-baseline gap-3 text-2xl md:text-xl font-black text-white uppercase drop-shadow-lg ${
                          catName.length > 10 
                            ? 'lg:text-xl xl:text-2xl tracking-wide' 
                            : 'lg:text-3xl tracking-widest'
                        }`} 
                        style={{ color: catColor }}
                      >
                        <span className="shrink-0 tabular-nums">{i + 1}.</span>
                        <span>{catName}</span>
                      </h4>
                    </div>

                    <Link to={'/rooms'} onClick={event => event.stopPropagation()} className="md:hidden pointer-events-auto mt-4 inline-flex self-start items-center gap-6 rounded-full bg-white text-black px-5 py-2.5 text-sm font-black">Explore more <span aria-hidden="true">↗</span></Link>

                    {/* Desktop Hover Reveal */}
                    <div className="hidden md:flex opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-500 delay-200 flex-col items-start h-full justify-center w-full">
                      <h4 className={`flex items-baseline gap-3 text-2xl font-black text-white mb-3 tracking-tight drop-shadow-lg ${
                        catName.length > 10 ? 'xl:text-3xl' : 'xl:text-4xl'
                      }`}>
                        <span className="shrink-0 tabular-nums">{i + 1}.</span>
                        <span>{catName}</span>
                      </h4>
                      <p className="text-white/90 text-sm md:text-base font-semibold mb-6 max-w-[220px] md:max-w-sm leading-relaxed drop-shadow-md">{data.desc}</p>
                      <Link to={'/rooms'} onClick={event => event.stopPropagation()} className="pointer-events-auto inline-flex items-center gap-6 rounded-full bg-white text-black px-6 py-3 text-sm font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Explore more <span aria-hidden="true">↗</span></Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      <div className="relative z-10 mt-10 text-center"><PreRegisterCTA /></div>
      </section>

      {/* 4. WHAT'S ACTUALLY ON THE LINE */}
      <section data-cta-section="home-rewards" className="relative w-full py-16 md:py-24 px-4 md:px-8 border-y border-[#2A2A2E] overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={PLACEHOLDER_BG} alt="Rewards Background" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#151515] via-[#151515]/80 to-[#151515]"></div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-3 md:mb-4">Give Your Ideas Something to Show</h2>
              <p className="text-[#A1A1AA] font-bold text-sm md:text-lg max-w-2xl mx-auto px-4">“Experience hai?” Let your work answer. Explore each brief for confirmed opportunities and selection details.</p>
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
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </section>

      <ChallengeVault categoryColors={CATEGORY_COLORS} />

      <RegistrationJourney steps={REGISTRATION_STEPS} />

      <WhatIf />

      {/* 9. FAQ */}
      <section data-cta-section="home-faq" className="py-16 md:py-24 px-4 md:px-8 bg-transparent border-t border-[#2A2A2E]">
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
      <section data-cta-section="home-footer" className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto relative z-10">
        <ScrollReveal>
          <div className="bg-[#1C1C1E]/80 backdrop-blur-md border border-[#2A2A2E] rounded-2xl md:rounded-[3rem] p-8 md:p-20 text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#E92A39]/10 to-transparent pointer-events-none"></div>
            <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-4 md:mb-6 relative z-10">
              Vault opens this Laxmi Puja, November 8, 2026.
            </h2>
            <p className="text-[#A1A1AA] text-sm md:text-lg font-bold mb-8 md:mb-10 max-w-xl relative z-10">
              Don't miss the first cohort of live briefs. Pre-register to secure early access.
            </p>
            <button data-cta="home-footer" onClick={goToPreRegister} className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg relative z-10">
              Pre-register
            </button>
          </div>
        </ScrollReveal>
      </section>

      <section data-cta-section="home-brands" className="max-w-[1600px] mx-auto px-6 md:px-12 pb-16 md:pb-24">
        <div className="border border-[#d8c7ee]/30 bg-[#1b1820] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div><p className="text-[#d8c7ee] text-xs font-bold uppercase tracking-widest mb-4">For the brands with a question</p><h2 className="text-white text-3xl md:text-4xl font-bold mb-3">Your challenge. A fresh perspective.</h2><p className="text-[#aaa6b1] max-w-xl">Bring a business brief to InGenuityX—or start with an internal pilot for your team.</p></div>
          <Link to="/for-brands" data-cta="home-brands-bottom" className="shrink-0 bg-[#d8c7ee] text-[#18151d] px-7 py-4 rounded-full font-bold hover:bg-[#e6daf5]">Explore InGenuityX for brands</Link>
        </div>
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
