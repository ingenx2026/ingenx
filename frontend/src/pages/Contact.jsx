import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';

import logoImage from '../imports/ingenuityx-logo.svg';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337';

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Brand/Partner',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API_URL}/api/contacts`, {
        data: {
          name: formData.name,
          email: formData.email,
          type: formData.type,
          message: formData.message
        }
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', type: 'Brand/Partner', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);

    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Oops! Something went wrong sending your message. Please try again.");
      setIsSubmitting(false);
    }
  };

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

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
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
          <Link to="/for-brands" className="text-white transition-colors">For Brands</Link>
          <Link to="/about" className="text-[#A1A1AA] hover:text-white transition-colors">About Us</Link>
        </div>

        {/* Right: Button */}
        <div className="w-auto md:w-48 flex justify-end">
          <Link to="/" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#A1A1AA] border border-[#2A2A2E] px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors">
            BACK TO HOME
          </Link>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-12 mt-12 md:mt-24 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* LEFT COLUMN - PROFESSIONAL HEADER & INFO */}
          <div className="space-y-12">
            <ScrollReveal direction="left">
              <div>
                <span className="text-[#E92A39] text-xs font-bold uppercase tracking-[0.2em] mb-6 block">Enterprise Partnerships</span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
                  Discover your next <br/>
                  <span className="text-[#71717A]">superstar.</span>
                </h1>
                <p className="text-[#A1A1AA] text-lg font-medium leading-relaxed max-w-md">
                  Launch a corporate challenge, tap into India's sharpest Gen-Z minds, and build a pipeline of proven talent.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={100}>
              <div className="space-y-6 border-t border-[#2A2A2E] pt-10">
                <div className="flex flex-col items-start transition-transform hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-2">Partnerships Team</span>
                  <a href="mailto:storm@minervainnov.com" className="text-xl md:text-2xl font-semibold text-white hover:text-[#E92A39] transition-colors break-all">
                    storm@minervainnov.com
                  </a>
                </div>
                
                <div className="flex flex-col items-start transition-transform hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-2">Direct Contact</span>
                  <a href="tel:+918320262013" className="text-xl md:text-2xl font-semibold text-white hover:text-[#E92A39] transition-colors">
                    +91 8320 262 013
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT COLUMN: PROFESSIONAL FORM */}
          <ScrollReveal direction="right" delay={200}>
            <div className="bg-[#0A0A0A] border border-[#2A2A2E] p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
              
              {isSuccess && (
                <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-8 animate-fade-in border border-[#10B981]/30 rounded-[2rem]">
                  <CheckCircle2 className="w-16 h-16 text-[#10B981] mb-6" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Inquiry received.</h3>
                  <p className="text-[#A1A1AA] font-medium text-sm">Our partnerships team will be in touch shortly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Type Toggle */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">Inquiry Type</label>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {['Brand/Partner', 'Press', 'General Inquiry'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`px-5 py-2 text-xs font-semibold rounded-full transition-all border ${
                          formData.type === type 
                            ? 'bg-white text-black border-white shadow-md' 
                            : 'bg-[#151515] text-[#A1A1AA] border-[#2A2A2E] hover:border-[#71717A] hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Jane Doe" 
                    className="w-full bg-[#151515] border border-[#2A2A2E] text-white focus:border-white rounded-xl py-3.5 px-5 transition-colors outline-none font-medium placeholder:text-[#4b4b4f] text-sm"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">Work Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="jane@company.com" 
                    className="w-full bg-[#151515] border border-[#2A2A2E] text-white focus:border-white rounded-xl py-3.5 px-5 transition-colors outline-none font-medium placeholder:text-[#4b4b4f] text-sm"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">How can we help?</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about the challenge you want to solve..." 
                    className="w-full bg-[#151515] border border-[#2A2A2E] text-white focus:border-white rounded-xl py-3.5 px-5 min-h-[140px] resize-none transition-colors outline-none font-medium placeholder:text-[#4b4b4f] text-sm"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#E92A39] hover:bg-[#ff3b4b] text-white py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </ScrollReveal>

        </div>
      </main>
    </div>
  );
}