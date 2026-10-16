import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { X, Check, ArrowUpRight } from 'lucide-react';

import registeredImage from '../imports/image-1.png';
import groupDiscussion from '../imports/image-3.png';
import logoImage from '../imports/ingenuityx-logo.svg';

const PLACEHOLDER_BG = "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop";

// --- SCROLL REVEAL COMPONENT ---
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

export default function About() {
  return (
    <div className="grain min-h-screen bg-[#151515] text-[#FAFAFA] font-sans overflow-x-hidden relative selection:bg-[#E92A39] selection:text-white pb-24">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        
        .grain::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 100; mix-blend-mode: overlay;
        }
      `}</style>

      {/* MATCHED NAVBAR */}
      <nav className="w-full px-6 py-6 md:px-12 flex items-center justify-between relative z-50 border-b border-[#2A2A2E] bg-[#151515]">
        {/* Left: Logo */}
        <div className="w-auto md:w-48 flex justify-start">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="InGenuityX" className="h-5 md:h-6 object-contain" />
          </Link>
        </div>
        
        {/* Center: Links */}
        <div className="hidden md:flex items-center justify-center gap-10 text-sm font-semibold tracking-wide flex-1">
          <a href="/#opportunities" className="text-[#A1A1AA] hover:text-white transition-colors">Opportunities</a>
          <Link to="/for-brands" className="text-[#A1A1AA] hover:text-white transition-colors">For Brands</Link>
          <Link to="/about" className="text-white transition-colors">About Us</Link>
        </div>

        {/* Right: Button */}
        <div className="w-auto md:w-48 flex justify-end">
          <Link to="/" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#A1A1AA] border border-[#2A2A2E] px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors">
            BACK TO HOME
          </Link>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 md:px-12 mt-16 md:mt-24 relative z-10">
        
        {/* 1. HERO MANIFESTO */}
        <section className="mb-24 grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3">
            <ScrollReveal direction="left">
              <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-[#A1A1AA] mb-6">
                The Manifesto
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.05] text-white">
                Degrees are everywhere. <br/>
                <span className="text-[#E92A39]">Proof of work is rare.</span>
              </h1>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-2 hidden lg:block">
            <ScrollReveal direction="right">
              <div className="rounded-[2rem] overflow-hidden h-[400px] border border-[#2A2A2E] relative group">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                <ImageWithFallback src={registeredImage} alt="Students building proof of work" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 2. STAT STRIP */}
        <section className="mb-24 md:mb-32">
          <ScrollReveal direction="up">
            <div className="bg-[#0A0A0A] border-y border-[#2A2A2E] grid grid-cols-2 md:grid-cols-4 overflow-hidden">
              {[
                { value: '130+', label: 'Students Surveyed' },
                { value: '6', label: 'Brand Partners' },
                { value: '5', label: 'Core Themes' },
                { value: '2026', label: 'Founding Cohort' },
              ].map((stat, index) => (
                <div key={index} className="py-8 px-6 md:py-12 md:px-10 border-b md:border-b-0 md:border-r border-[#2A2A2E] last:border-r-0 flex flex-col justify-center items-center md:items-start text-center md:text-left hover:bg-[#111] transition-colors">
                  <h3 className="text-4xl md:text-6xl font-black text-white leading-none mb-2">{stat.value}</h3>
                  <p className="text-[10px] md:text-xs font-bold text-[#E92A39] uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* 3. THE PROBLEM VS THE SOLUTION (THE ROAST) */}
        <section className="mb-24 md:mb-32">
          <ScrollReveal>
            <div className="mb-12 text-left">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">Why we built this.</h2>
              <p className="text-[#A1A1AA] font-bold text-lg max-w-2xl">The gap between campus and corporate is broken. We are fixing it.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* The Status Quo */}
            <ScrollReveal direction="left">
              <div className="bg-[#1C1C1E] border-t-4 border-[#71717A] p-8 md:p-12 rounded-[2rem] rounded-tl-sm shadow-xl h-full opacity-80 hover:opacity-100 transition-opacity">
                <h3 className="text-2xl font-black tracking-tight mb-8 text-[#71717A] uppercase">The Status Quo</h3>
                <div className="flex flex-col gap-4">
                  {['6-second resume glances by HR', 'Ghosted by the ATS', 'Internships = Canva + Spreadsheets', 'Theoretical case studies'].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-[#2A2A2E] pb-4 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <X className="w-3 h-3 text-[#71717A]" strokeWidth={3} />
                      </div>
                      <span className="font-bold text-[#A1A1AA] line-through decoration-[#71717A]/50">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* The InGenuityX Way */}
            <ScrollReveal direction="right">
              <div className="bg-[#0A0A0A] border border-[#2A2A2E] border-l-4 border-l-[#E92A39] p-8 md:p-12 rounded-[2rem] rounded-bl-sm shadow-xl h-full">
                <h3 className="text-2xl font-black tracking-tight mb-8 text-white uppercase flex items-center gap-3">
                  The InGenuityX Way <span className="w-2 h-2 rounded-full bg-[#E92A39] animate-pulse"></span>
                </h3>
                <div className="flex flex-col gap-4">
                  {['Real briefs from live brands', 'Proof of work > resume keywords', 'Straight to PPOs & boardroom pitches', 'Actual business problems'].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-[#2A2A2E] pb-4 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-[#E92A39]/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#E92A39]" strokeWidth={3} />
                      </div>
                      <span className="font-bold text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 4. ARTIFACT / VISUAL BREAKER */}
        <section className="mb-24 md:mb-32">
          <ScrollReveal direction="scale">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#2A2A2E] h-[400px] md:h-[500px] group flex items-center justify-center text-center">
              <img src={groupDiscussion} alt="Live boardroom finale" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-[#151515]"></div>
              
              <div className="relative z-10 p-6">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-white drop-shadow-xl">
                  Stop simulating.<br/>Start building.
                </h2>
                <Link to="/#opportunities" className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-8 py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg inline-block">
                  View The Vault
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 5. DUAL CTA (STUDENTS VS BRANDS) */}
        <section>
          <ScrollReveal>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Student CTA */}
              <div className="bg-[#1C1C1E] border border-[#2A2A2E] rounded-[2rem] p-10 md:p-14 flex flex-col justify-between items-start hover:border-[#E92A39]/50 transition-colors h-[300px]">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E92A39] mb-4 block">For Students</span>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">Ready to prove yourself?</h3>
                </div>
                <Link to="/#opportunities" className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:text-[#E92A39] transition-colors">
                  Explore Challenges <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Brand CTA */}
              <div className="bg-[#0A0A0A] border border-[#2A2A2E] rounded-[2rem] p-10 md:p-14 flex flex-col justify-between items-start hover:border-white/50 transition-colors h-[300px] relative overflow-hidden group">
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#A1A1AA] mb-4 block">For Brands</span>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">Need fresh perspectives?</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10 mt-4">
                  <Link to="/for-brands" className="bg-white text-black px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform text-center shadow-md">
                    Hit Us Up
                  </Link>
                  <a href="mailto:storm@minervainnov.com" className="border border-[#2A2A2E] bg-[#161616] text-[#A1A1AA] px-6 py-3.5 rounded-full text-xs font-bold hover:text-white hover:border-gray-500 transition-colors text-center">
                    storm@minervainnov.com
                  </a>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </section>

      </main>
    </div>
  );
}