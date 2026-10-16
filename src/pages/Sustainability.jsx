import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import sustainImage from '../imports/image-17.png';

// --- MINI WIDGET: GREENWASH OR REAL ---
// Spot genuine sustainability moves vs empty green-marketing claims.
function GreenwashOrReal() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(null);

  const claims = [
    { t: '"100% eco-friendly packaging" printed on a plastic-wrapped box.', verdict: 'greenwash', r: 'The claim contradicts the material in your hand. Classic greenwash.' },
    { t: 'A factory publishes its actual water usage numbers, including where they fell short.', verdict: 'real', r: 'Transparency about shortfalls is rare — and it\'s the strongest signal of a real effort.' },
    { t: '"Made with love for the planet" on a product with no ingredient or sourcing info.', verdict: 'greenwash', r: 'Feel-good language with zero verifiable substance behind it.' },
    { t: 'A brand redesigns packaging to use 40% less material and publishes the before/after weight.', verdict: 'real', r: 'Specific, measurable, and checkable. This is a real reduction.' },
    { t: 'A logo turns green for one week in June, nothing else changes.', verdict: 'greenwash', r: 'Cosmetic gesture timed to a trend, no operational change.' },
    { t: 'A company switches its delivery fleet to EVs and shares the emissions math.', verdict: 'real', r: 'Structural change with numbers to back it — not just a slogan.' },
  ];

  const handleGuess = (guess) => {
    const correct = guess === claims[index].verdict;
    setLastCorrect(correct);
    setScore(s => correct ? s + 100 : Math.max(0, s - 30));
    setRevealed(true);
  };

  const nextCard = () => {
    setRevealed(false); setLastCorrect(null);
    if (index + 1 < claims.length) { setIndex(index + 1); } else { setIsGameOver(true); }
  };

  const resetGame = () => {
    setIsPlaying(false); setIsGameOver(false); setIndex(0); setScore(0); setRevealed(false); setLastCorrect(null);
  };

  return (
    <div className="bg-[#0d1f18] border border-[#059669]/20 rounded-[2.5rem] shadow-xl overflow-hidden text-white">
      <div className="p-8 md:p-10 flex flex-col min-h-[440px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Greenwash or Real</h3>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Spot the substance</p>
          </div>
          {isPlaying && !isGameOver && (
            <div className="bg-white/10 px-4 py-2 rounded-xl text-right shrink-0">
              <p className="text-[9px] uppercase tracking-widest font-bold text-white/50">Score</p>
              <p className="text-xl font-black text-[#FDE25D]">{score}</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {!isPlaying ? (
            <div className="animate-fade-in-global w-full">
              <div className="text-5xl mb-6">🌿</div>
              <h4 className="text-2xl font-black leading-tight mb-3">Everyone claims to be green now.</h4>
              <p className="text-sm font-bold text-white/50 mb-8">Can you tell substance from spin?</p>
              <button onClick={() => setIsPlaying(true)} className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                Start Spotting
              </button>
            </div>
          ) : isGameOver ? (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <h4 className="text-xl font-black leading-tight mb-2">Report Filed.</h4>
              <p className="text-sm font-bold text-white/50 mb-2 uppercase tracking-widest">Final Score</p>
              <div className="text-6xl font-black text-[#FDE25D] mb-3 tracking-tighter">{score} <span className="text-xl opacity-40">/ {claims.length * 100}</span></div>
              <p className="text-sm font-bold text-white/60 mb-8 max-w-xs">
                {score >= 400 ? "You'd make a solid sustainability lead. Go pitch a real fix." : "The real briefs need this exact instinct — come sharpen it."}
              </p>
              <button onClick={resetGame} className="bg-white text-[#0d1f18] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                Run It Back
              </button>
            </div>
          ) : !revealed ? (
            <div className="animate-fade-in-global w-full">
              <span className="text-[10px] font-black uppercase text-white/30 mb-4 block tracking-widest">Claim {index + 1} / {claims.length}</span>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 min-h-[130px] flex items-center justify-center shadow-inner">
                <h4 className="text-lg md:text-xl font-black leading-tight">{claims[index].t}</h4>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleGuess('greenwash')} className="hover:scale-105 transition-transform bg-white/10 hover:bg-[#E92A39] border border-white/20 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  Greenwash
                </button>
                <button onClick={() => handleGuess('real')} className="hover:scale-105 transition-transform bg-white/10 hover:bg-[#059669] border border-white/20 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  Real Move
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-md ${lastCorrect ? 'bg-[#059669] text-white' : 'bg-[#E92A39] text-white'}`}>
                {lastCorrect ? '+100 · GOOD EYE' : '-30 · FOOLED YOU'}
              </span>
              <p className="text-sm font-bold bg-white/5 border border-white/10 p-5 rounded-2xl leading-relaxed mb-8">{claims[index].r}</p>
              <button onClick={nextCard} className="bg-white text-[#0d1f18] px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                {index + 1 < claims.length ? 'Next Claim →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sustainability() {
  const navigate = useNavigate();

  const problems = [
    { e: '👗', t: '"What do we do with 2 lakh unsold kurtas?"' },
    { e: '🥫', t: '"Can sustainable packaging stop looking boring?"' },
    { e: '🏠', t: '"How do we make eco-housing aspirational?"' }
  ];

  const liveBriefs = [
    { title: 'Grey 2 Green', company: 'Nuvoco', points: 'PPI + ₹50,000', deadline: 'Oct 18, 2026' },
    { title: 'Sustainable Green Pro', company: 'SRMB', points: 'PPO + ₹25,000', deadline: 'Oct 12, 2026' },
  ];

  const goToSustainabilityBriefs = () => navigate('/#opportunities');

  return (
    <div className="min-h-screen bg-[#FAFCFC] text-[#111] overflow-x-hidden font-sans selection:bg-[#059669] selection:text-white" data-testid="sustainability-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        
        * { font-family: 'Outfit', sans-serif; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(5, 150, 105, 0.2); }
          50% { box-shadow: 0 0 40px rgba(5, 150, 105, 0.4); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: slideInUp 0.6s ease-out both; }
        @keyframes fadeInGlobal { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-global { animation: fadeInGlobal 0.4s ease-out forwards; }
      `}</style>

      {/* TOP NAVIGATION BUTTONS */}
      <button
        data-testid="close-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 right-8 z-50 bg-[#111] hover:bg-black text-white p-3 rounded-full transition-all hover:scale-110 shadow-md hover:shadow-lg"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        data-testid="back-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-50 text-gray-500 hover:text-[#111] transition-colors text-xs font-extrabold uppercase tracking-widest flex items-center gap-2"
      >
        <span>←</span> Go Back
      </button>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <ImageWithFallback src={sustainImage} alt="Sustainability" className="w-full h-full object-cover grayscale opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAFCFC]/80 to-[#FAFCFC]" />
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FDE25D]/10 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 text-center max-w-5xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#059669] mb-6 drop-shadow-sm">Sustainability</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-[1.1] font-black tracking-tight text-[#111]">
            The brands of <span className="bg-[#059669] text-white px-4 rounded-2xl inline-block shadow-sm">2035</span><br />
            are being designed{' '}
            <span className="text-[#059669]">right now.</span>
          </h1>
        </div>
      </section>

      {/* VISUAL CONTRADICTION */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFC] via-[#059669]/5 to-[#FAFCFC]" />
        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <p className="text-xl md:text-2xl text-gray-500 font-bold tracking-tight">Beautiful product shots slowly transition into:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base text-[#111]">
            {['landfills', 'waste', 'overheated cities', 'pollution', 'excess inventory', 'plastic', 'fast fashion', 'carbon'].map((w, i) => (
              <div key={i} className="bg-white border border-gray-200 font-bold uppercase tracking-widest p-5 rounded-2xl shadow-sm hover:border-[#059669]/40 hover:-translate-y-1 transition-all duration-300">
                {w}
              </div>
            ))}
          </div>
          <p className="text-base md:text-lg text-gray-400 font-bold italic pt-4">No narration needed.<br />Visual contradiction tells the story.</p>
        </div>
      </section>

      {/* SCROLL MOMENTS */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl text-[#111] font-black tracking-tight">2 lakh unsold kurtas.</h2>
            <h2 className="text-4xl md:text-6xl text-[#059669] font-black tracking-tight">Now what?</h2>
          </div>
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl text-gray-600 font-bold tracking-tight">Can sustainability stop looking boring?</h2>
          </div>
        </div>
      </section>

      {/* WHAT YOU'RE SOLVING */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#FAFCFC] to-[#FFF8E7] relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#059669] font-extrabold mb-4">The Briefs</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-[#111]">What you're actually solving</h3>
          </div>
          <div className="space-y-6">
            {problems.map((it, i) => (
              <div key={i} className="bg-white border border-gray-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-[#059669]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-6 group">
                <span className="text-5xl block drop-shadow-sm group-hover:scale-110 transition-transform origin-left">{it.e}</span>
                <p className="text-xl md:text-2xl font-bold leading-tight text-[#111]">{it.t}</p>
              </div>
            ))}
          </div>
          <p className="text-xl md:text-2xl font-medium text-gray-500 mt-16 text-center">
            Not awareness campaigns.{' '}
            <span className="text-[#111] font-black tracking-tight">Business survival questions.</span>
          </p>
        </div>
      </section>

      {/* GREENWASH OR REAL — INTERACTIVE GAME */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#059669] font-extrabold mb-4">Take A Break</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Can you spot real change vs. marketing spin?</h3>
          </div>
          <GreenwashOrReal />
        </div>
      </section>

      {/* WHAT THIS DOES TO YOU */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-4xl mx-auto space-y-12">
          <h3 className="text-4xl md:text-5xl font-black tracking-tight text-[#111]">What this does to you</h3>
          <div className="space-y-10">
            <div className="border-l-4 border-[#059669] pl-8 py-2">
              <p className="text-3xl mb-4 drop-shadow-sm">🌱</p>
              <p className="text-xl md:text-2xl font-black text-[#111] tracking-tight">You develop long-term thinking.</p>
            </div>
            <div className="border-l-4 border-[#059669] pl-8 py-2">
              <p className="text-3xl mb-4 drop-shadow-sm">📊</p>
              <p className="text-xl md:text-2xl font-black text-[#111] tracking-tight">You learn the language shaping modern boardrooms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-32 px-4 bg-white border-y border-gray-100 relative">
        <div className="text-center max-w-3xl mx-auto relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none" />
          </div>
          <h2 className="relative text-4xl md:text-6xl text-[#059669] leading-tight font-black tracking-tighter">"The future is a design problem."</h2>
        </div>
      </section>

      {/* LIVE SUSTAINABILITY BRIEFS STRIP */}
      <section className="py-24 px-4 bg-[#FFF8E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#059669] font-extrabold mb-4">Right Now</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Live briefs in this arena</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {liveBriefs.map((b, i) => (
              <div key={i} onClick={goToSustainabilityBriefs} className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] mb-3">{b.company}</span>
                <h4 className="text-xl font-black text-[#111] mb-4 tracking-tight flex-1">{b.title}</h4>
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 pt-4 border-t border-gray-100">
                  <span>{b.points}</span>
                  <span>{b.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#FFF8E7] to-[#FAFCFC] relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <button
            data-testid="cta-primary"
            onClick={goToSustainabilityBriefs}
            className="bg-[#059669] hover:bg-[#047857] text-white text-xl md:text-2xl px-12 py-6 rounded-full transition-all hover:-translate-y-1 shadow-md pulse-glow font-black tracking-tight"
          >
            The problem is real. Are you? →
          </button>
          <p className="text-gray-400 mt-8 font-extrabold uppercase text-xs tracking-widest">or</p>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-[#111] transition-colors mt-6 text-sm font-bold border-b-2 border-transparent hover:border-[#111] pb-1">
            Return to opportunities
          </button>
        </div>
      </section>
    </div>
  );
}