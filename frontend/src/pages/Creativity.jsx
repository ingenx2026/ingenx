import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import creativeImage from '../imports/ChatGPT_Image_May_29__2026__07_54_56_PM.png';

export default function Creativity() {
  const navigate = useNavigate();
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => {};
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 300);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative" data-testid="creativity-page">
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .glitch { animation: glitch 0.3s infinite; }
        .film-grain {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none film-grain z-50" />

      <button
        data-testid="close-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 right-8 z-50 bg-purple-600 hover:bg-purple-700 p-3 rounded-full transition-all hover:scale-110 shadow-2xl shadow-purple-500/50"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        data-testid="back-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-50 text-white/70 hover:text-white transition-colors text-sm uppercase tracking-wider"
      >
        ← Go Back
      </button>

      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback src={creativeImage} alt="Creative workspace" className="w-full h-full object-cover saturate-150" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/50 to-black" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight font-bold">
            Ek din koi tumhara kaam dekhega<br />aur poochega —
          </h1>
          <p className="text-4xl md:text-6xl text-pink-400 italic">'Yeh kisne banaya?'</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-purple-900/30 to-transparent pointer-events-none" />
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-5xl space-y-12">
          <div className="grid md:grid-cols-2 gap-8 text-2xl text-gray-300">
            <div className="space-y-4">
              <p className="text-pink-500">Flash photography.</p>
              <p>Hostel walls filled with posters.</p>
              <p>Storyboards.</p>
              <p>Random screenshots.</p>
            </div>
            <div className="space-y-4">
              <p>Camera flashes.</p>
              <p className="text-purple-400">Chaotic genius energy.</p>
              <p>Beautiful imperfections.</p>
              <p>Indie-film stills.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl text-center">
          <h2 className="text-6xl md:text-8xl mb-16 font-bold">Make it pop.</h2>
          <div className="h-24" />
          <button
            data-testid="glitch-btn"
            onClick={triggerGlitch}
            className={`text-6xl md:text-8xl text-pink-500 font-bold ${glitchActive ? 'glitch' : ''}`}
          >
            No.
          </button>
          <div className="h-24" />
          <h2 className="text-5xl md:text-7xl text-purple-400 font-bold">Make it unforgettable.</h2>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black to-purple-950/30">
        <div className="max-w-6xl">
          <h3 className="text-4xl md:text-6xl mb-16 text-center font-bold">WHAT YOU'RE ACTUALLY CREATING</h3>
          <div className="space-y-8">
            {[
              { e: '💍', t: 'A jewellery brand identity moving from D2C to retail' },
              { e: '🎵', t: 'A regional music campaign rooted in actual culture' },
              { e: '🍬', t: 'A mithai rebrand balancing nostalgia & modern aesthetics' }
            ].map((it, i) => (
              <div key={i} className="bg-purple-950/30 border border-purple-900/50 p-8 rounded-2xl hover:border-pink-500 transition-all hover:scale-105">
                <span className="text-4xl mb-4 block">{it.e}</span>
                <p className="text-2xl">{it.t}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl text-gray-400 mt-12 text-center">
            Three industries. One truth:<br />
            <span className="text-pink-400">the right idea changes everything.</span>
          </p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl space-y-16">
          <h3 className="text-5xl md:text-7xl font-bold">WHAT THIS DOES TO YOU</h3>
          <div className="space-y-8">
            <div className="border-l-4 border-pink-500 pl-8">
              <p className="text-3xl mb-2">👁️</p>
              <p className="text-2xl">You develop taste. Real taste.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-8">
              <p className="text-3xl mb-2">✨</p>
              <p className="text-2xl">You graduate with a body of work, not just a degree.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-black relative">
        <div className="text-center max-w-4xl">
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
            <div className="relative bg-gray-900 border border-purple-900/50 p-12 rounded-2xl">
              <p className="text-xl text-gray-400 mb-4">Old Fevicol ad hanging in messy hostel room.</p>
              <div className="h-px bg-purple-500/50 my-8" />
              <p className="text-3xl text-pink-400 italic">"This is the standard now."</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-purple-950/30 to-black relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="text-center relative z-10">
          <button
            data-testid="cta-primary"
            onClick={() => navigate('/')}
            onMouseEnter={triggerGlitch}
            className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl md:text-3xl px-12 md:px-16 py-6 md:py-8 rounded-full transition-all hover:scale-105 shadow-2xl shadow-purple-500/50 ${glitchActive ? 'glitch' : ''}`}
          >
            Make something they remember. →
          </button>
          <p className="text-gray-400 mt-8">or</p>
          <button onClick={() => navigate('/')} className="text-white/70 hover:text-white transition-colors mt-4 text-lg">
            Return to opportunities
          </button>
        </div>
      </section>
    </div>
  );
}
