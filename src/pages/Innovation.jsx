import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

// --- MINI WIDGET: MOONSHOT OR MEH ---
// Quick-fire game — is this idea an actual innovation, or just repackaged jargon?
function MoonshotOrMeh() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(null);

  const ideas = [
    { t: '"AI-powered synergy hub for cross-functional ideation."', verdict: 'meh', r: 'Zero nouns you can build. This is a buzzword sandwich.' },
    { t: '"Predict local demand so unsold stock in one city restocks another overnight."', verdict: 'moonshot', r: 'Specific problem, specific mechanism, real supply-chain upside.' },
    { t: '"Disrupting the disruption space with disruptive disruption."', verdict: 'meh', r: 'This sentence has no information in it. Reject on sight.' },
    { t: '"Packaging that biodegrades exactly when the product runs out."', verdict: 'moonshot', r: 'Solves a real waste problem with a mechanism you could actually prototype.' },
    { t: '"Leveraging blockchain to revolutionize the paradigm of loyalty points."', verdict: 'meh', r: 'Tech word salad bolted onto a problem that doesn\'t need it.' },
    { t: '"A returns process that learns why people return things, not just that they did."', verdict: 'moonshot', r: 'Turns a cost center into a data goldmine. Simple, sharp, real.' },
  ];

  const handleGuess = (guess) => {
    const correct = guess === ideas[index].verdict;
    setLastCorrect(correct);
    setScore(s => correct ? s + 100 : Math.max(0, s - 30));
    setRevealed(true);
  };

  const nextCard = () => {
    setRevealed(false); setLastCorrect(null);
    if (index + 1 < ideas.length) { setIndex(index + 1); } else { setIsGameOver(true); }
  };

  const resetGame = () => {
    setIsPlaying(false); setIsGameOver(false); setIndex(0); setScore(0); setRevealed(false); setLastCorrect(null);
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden text-white">
      <div className="p-8 md:p-10 flex flex-col min-h-[440px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Moonshot or Meh</h3>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Spot the real idea</p>
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
              <div className="text-5xl mb-6">🚀</div>
              <h4 className="text-2xl font-black leading-tight mb-3">Every idea sounds smart in a deck.</h4>
              <p className="text-sm font-bold text-white/50 mb-8">Can you tell the breakthroughs from the buzzwords?</p>
              <button onClick={() => setIsPlaying(true)} className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                Start Judging
              </button>
            </div>
          ) : isGameOver ? (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <h4 className="text-xl font-black leading-tight mb-2">Pitch Deck Closed.</h4>
              <p className="text-sm font-bold text-white/50 mb-2 uppercase tracking-widest">Final Score</p>
              <div className="text-6xl font-black text-[#FDE25D] mb-3 tracking-tighter">{score} <span className="text-xl opacity-40">/ {ideas.length * 100}</span></div>
              <p className="text-sm font-bold text-white/60 mb-8 max-w-xs">
                {score >= 400 ? "Sharp eye. Time to pitch your own moonshot." : "The real briefs are trickier — and worth more than 100 points."}
              </p>
              <button onClick={resetGame} className="bg-white text-[#111] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                Run It Back
              </button>
            </div>
          ) : !revealed ? (
            <div className="animate-fade-in-global w-full">
              <span className="text-[10px] font-black uppercase text-white/30 mb-4 block tracking-widest">Idea {index + 1} / {ideas.length}</span>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 min-h-[130px] flex items-center justify-center shadow-inner">
                <h4 className="text-xl md:text-2xl font-black leading-tight">{ideas[index].t}</h4>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleGuess('meh')} className="hover:scale-105 transition-transform bg-white/10 hover:bg-[#E92A39] border border-white/20 text-white px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  Meh
                </button>
                <button onClick={() => handleGuess('moonshot')} className="hover:scale-105 transition-transform bg-white/10 hover:bg-[#10b981] border border-white/20 text-white px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  Moonshot
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-md ${lastCorrect ? 'bg-[#10b981] text-white' : 'bg-[#E92A39] text-white'}`}>
                {lastCorrect ? '+100 · CALLED IT' : '-30 · GOT FOOLED'}
              </span>
              <p className="text-sm font-bold bg-white/5 border border-white/10 p-5 rounded-2xl leading-relaxed mb-8">{ideas[index].r}</p>
              <button onClick={nextCard} className="bg-white text-[#111] px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                {index + 1 < ideas.length ? 'Next Idea →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Innovation() {
  const navigate = useNavigate();

  // Trimmed: dropped the paragraph, kept emoji + short title + one-line hook only
  const problems = [
    { emoji: '📦', title: 'Stock sits unsold here. Demand goes unmet there.', hook: 'Can supply chains predict instead of react?' },
    { emoji: '♻️', title: 'Sustainable — without costing more.', hook: 'Can sustainability be a competitive edge?' },
    { emoji: '🧠', title: 'Millions of customers. One experience.', hook: 'Can every journey feel individually designed?' }
  ];

  const liveBriefs = [
    { title: 'Keep It Lit', company: 'Eveready', points: 'Internship + ₹50,000', deadline: 'Oct 30, 2026' },
    { title: 'Power Protocol', company: 'Legrand', points: '₹1,00,000 + Tech Setup', deadline: 'Oct 20, 2026' },
  ];

  const goToInnovationBriefs = () => navigate('/#opportunities');

  return (
    <div className="min-h-screen bg-[#FAFCFC] text-[#111] overflow-x-hidden font-sans selection:bg-[#E92A39] selection:text-white" data-testid="innovation-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(233, 42, 57, 0.3); }
          50% { box-shadow: 0 0 40px rgba(233, 42, 57, 0.6); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.6s ease-out both; }
        @keyframes fadeInGlobal { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-global { animation: fadeInGlobal 0.4s ease-out forwards; }
      `}</style>

      <button
        data-testid="close-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 right-8 z-50 bg-[#E92A39] hover:bg-[#ff3b4b] text-white p-3 rounded-full transition-all hover:scale-110 shadow-md hover:shadow-lg"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        data-testid="back-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-50 text-gray-500 hover:text-[#E92A39] transition-colors text-xs font-extrabold uppercase tracking-widest flex items-center gap-2"
      >
        <span>←</span> Go Back
      </button>

      {/* HERO — trimmed from 4 lines + closer to 1 headline + 1 punchline */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E92A39]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FDE25D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#E92A39] mb-6">Innovation Challenges</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-[#111]">
            Every company says they're <span className="text-[#E92A39]">innovating.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#E92A39] font-bold italic">Most are still scheduling meetings about it.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* WHAT GLOBAL COMPANIES ARE SOLVING — cards trimmed to title + hook only */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#E92A39] mb-4">The Real Briefs</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111]">What companies are actually solving</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 shadow-sm rounded-[2.5rem] p-8 hover:shadow-xl hover:border-[#E92A39]/30 hover:-translate-y-1 transition-all duration-300 fade-up group"
                style={{ animationDelay: `${i * 0.1}s` }}
                data-testid={`problem-card-${i}`}
              >
                <div className="text-5xl mb-6 drop-shadow-sm group-hover:scale-110 transition-transform origin-left">{p.emoji}</div>
                <h3 className="text-xl font-extrabold tracking-tight mb-4 text-[#111]">{p.title}</h3>
                <p className="text-base text-[#E92A39] font-bold italic">"{p.hook}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOONSHOT OR MEH — INTERACTIVE GAME */}
      <section className="py-24 px-4 bg-[#FFF8E7]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E92A39] font-extrabold mb-4">Take A Break</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Not classroom problems. Not hypotheticals.</h3>
          </div>
          <MoonshotOrMeh />
        </div>
      </section>

      {/* LIVE INNOVATION BRIEFS STRIP */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E92A39] font-extrabold mb-4">Right Now</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Live briefs in this arena</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {liveBriefs.map((b, i) => (
              <div key={i} onClick={goToInnovationBriefs} className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E92A39] mb-3">{b.company}</span>
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
      <section className="py-24 px-4 bg-[#FFF8E7] border-t border-gray-200 relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <button
            data-testid="cta-primary"
            onClick={goToInnovationBriefs}
            className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white text-xl md:text-2xl px-12 py-6 rounded-full transition-all hover:-translate-y-1 shadow-md pulse-glow font-black tracking-tight"
          >
            Let's hear your ideas →
          </button>
          <p className="text-gray-400 mt-8 font-extrabold uppercase text-xs tracking-widest">or</p>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-[#E92A39] transition-colors mt-6 text-sm font-bold border-b-2 border-transparent hover:border-[#E92A39] pb-1">
            Return to opportunities
          </button>
        </div>
      </section>
    </div>
  );
}