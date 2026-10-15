import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

// --- MINI WIDGET: CAPTION THIS ---
// Quick creative-instinct game — pick the tagline that would actually stick.
function CaptionThis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);

  const rounds = [
    {
      brief: 'A 100-year-old sweet shop wants to feel relevant to Gen-Z.',
      options: [
        { t: 'Legacy in every bite.', good: false },
        { t: 'Your dadi\'s favorite is your new favorite.', good: true },
        { t: 'Premium quality since generations.', good: false },
      ],
      r: 'It borrows nostalgia through a person, not a slogan. That\'s what makes heritage feel current instead of dusty.'
    },
    {
      brief: 'A budget sneaker brand wants to feel aspirational, not cheap.',
      options: [
        { t: 'Unaffordable looks. Affordable price.', good: true },
        { t: 'Best value for money guaranteed.', good: false },
        { t: 'Quality sneakers at low cost.', good: false },
      ],
      r: 'Leads with the aspiration, not the discount. "Value for money" reads like a coupon, not a brand.'
    },
    {
      brief: 'An indie musician wants a campaign that feels like culture, not an ad.',
      options: [
        { t: 'New single out now, streaming everywhere.', good: false },
        { t: 'Stream our latest hit release.', good: false },
        { t: 'This is the song your ex is definitely playing right now.', good: true },
      ],
      r: 'It\'s a scenario, not an announcement. People share scenarios; nobody shares "new single out now."'
    },
  ];

  const handlePick = (opt) => {
    setPicked(opt);
    if (opt.good) setScore(s => s + 100);
    setRevealed(true);
  };

  const nextCard = () => {
    setRevealed(false); setPicked(null);
    if (index + 1 < rounds.length) { setIndex(index + 1); } else { setIsGameOver(true); }
  };

  const resetGame = () => {
    setIsPlaying(false); setIsGameOver(false); setIndex(0); setScore(0); setRevealed(false); setPicked(null);
  };

  return (
    <div className="bg-[#111] border border-[#FB607E]/20 rounded-[2.5rem] shadow-xl overflow-hidden text-white">
      <div className="p-8 md:p-10 flex flex-col min-h-[460px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Caption This</h3>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Pick the line that sticks</p>
          </div>
          {isPlaying && !isGameOver && (
            <div className="bg-white/10 px-4 py-2 rounded-xl text-right shrink-0">
              <p className="text-[9px] uppercase tracking-widest font-bold text-white/50">Score</p>
              <p className="text-xl font-black text-[#FB607E]">{score}</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {!isPlaying ? (
            <div className="animate-fade-in-global w-full">
              <div className="text-5xl mb-6">✍️</div>
              <h4 className="text-2xl font-black leading-tight mb-3">One line. That's all a brand gets.</h4>
              <p className="text-sm font-bold text-white/50 mb-8">Pick the caption that would actually get shared.</p>
              <button onClick={() => setIsPlaying(true)} className="bg-[#FB607E] hover:bg-[#e04a66] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                Start Pitching
              </button>
            </div>
          ) : isGameOver ? (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <h4 className="text-xl font-black leading-tight mb-2">Campaign Wrapped.</h4>
              <p className="text-sm font-bold text-white/50 mb-2 uppercase tracking-widest">Final Score</p>
              <div className="text-6xl font-black text-[#FB607E] mb-3 tracking-tighter">{score} <span className="text-xl opacity-40">/ {rounds.length * 100}</span></div>
              <p className="text-sm font-bold text-white/60 mb-8 max-w-xs">
                {score >= 200 ? "You've got the instinct. Time to pitch it for real." : "The real briefs reward exactly this kind of gut call."}
              </p>
              <button onClick={resetGame} className="bg-white text-[#111] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                Run It Back
              </button>
            </div>
          ) : !revealed ? (
            <div className="animate-fade-in-global w-full">
              <span className="text-[10px] font-black uppercase text-white/30 mb-4 block tracking-widest">Brief {index + 1} / {rounds.length}</span>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-6 min-h-[80px] flex items-center justify-center shadow-inner">
                <p className="text-base md:text-lg font-bold leading-tight">{rounds[index].brief}</p>
              </div>
              <div className="flex flex-col gap-3">
                {rounds[index].options.map((opt, i) => (
                  <button key={i} onClick={() => handlePick(opt)} className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 text-sm md:text-base font-bold text-white px-5 py-4 rounded-xl transition-all hover:scale-[1.02]">
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-md ${picked?.good ? 'bg-[#10b981] text-white' : 'bg-[#E92A39] text-white'}`}>
                {picked?.good ? '+100 · THAT STICKS' : '0 · SAFE, BUT FORGETTABLE'}
              </span>
              <p className="text-sm font-bold bg-white/5 border border-white/10 p-5 rounded-2xl leading-relaxed mb-8">{rounds[index].r}</p>
              <button onClick={nextCard} className="bg-white text-[#111] px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                {index + 1 < rounds.length ? 'Next Brief →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Creativity() {
  const navigate = useNavigate();

  const ideas = [
    { emoji: '💍', title: 'A logo people recognize before they read it.', hook: 'Recognition beats advertising every time.' },
    { emoji: '🎵', title: 'A campaign that feels like culture, not marketing.', hook: 'The best campaigns become conversations.' },
    { emoji: '🍬', title: 'A heritage brand that feels relevant again.', hook: 'Nostalgia is powerful. Relevance is priceless.' }
  ];

  const liveBriefs = [
    { title: 'Next-Gen Smile Challenge', company: 'NovaCare', points: 'PPO + ₹50,000', deadline: 'Oct 15, 2026' },
    { title: 'Ironclad Challenge', company: 'SRMB', points: 'Internship + ₹40,000', deadline: 'Oct 22, 2026' },
  ];

  const goToCreativityBriefs = () => navigate('/#opportunities');

  return (
    <div className="min-h-screen bg-[#FAFCFC] text-[#111] overflow-x-hidden relative font-sans selection:bg-[#FB607E] selection:text-white" data-testid="creativity-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        
        * { font-family: 'Outfit', sans-serif; }

        .film-grain {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.03"/></svg>');
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.6s ease-out both; }
        
        @keyframes pulse-glow-pink {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 96, 126, 0.2); }
          50% { box-shadow: 0 0 40px rgba(251, 96, 126, 0.4); }
        }
        .pulse-glow-pink { animation: pulse-glow-pink 2s ease-in-out infinite; }
        @keyframes fadeInGlobal { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-global { animation: fadeInGlobal 0.4s ease-out forwards; }
      `}</style>

      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none film-grain z-50 mix-blend-multiply opacity-50" />

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

      {/* HERO — trimmed from 4-line prose block to 1 punchline */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FB607E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3BA8E7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#FB607E] mb-6 drop-shadow-sm">Creativity</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-[#111]">
            Everyone remembers <span className="text-[#FB607E]">the ad.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 italic font-bold">
            Almost nobody remembers the media budget.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* WHAT BRANDS ARE TRYING TO CREATE */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFC] via-[#FB607E]/5 to-[#FAFCFC]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FB607E] font-extrabold mb-4">The Mandate</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111]">What brands are actually trying to create</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ideas.map((it, i) => (
              <div
                key={i}
                data-testid={`idea-card-${i}`}
                className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-[#FB607E]/40 hover:-translate-y-1 transition-all duration-300 fade-up group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-5xl mb-6 drop-shadow-sm group-hover:scale-110 transition-transform origin-left w-fit">{it.emoji}</div>
                <h3 className="text-xl font-extrabold tracking-tight mb-4 text-[#111]">{it.title}</h3>
                <p className="text-base text-[#FB607E] font-bold italic">"{it.hook}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPTION THIS — INTERACTIVE GAME */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FB607E] font-extrabold mb-4">Take A Break</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Got the creative instinct?</h3>
          </div>
          <CaptionThis />
        </div>
      </section>

      {/* LIVE CREATIVITY BRIEFS STRIP */}
      <section className="py-24 px-4 bg-[#FFF8E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FB607E] font-extrabold mb-4">Right Now</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Live briefs in this arena</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {liveBriefs.map((b, i) => (
              <div key={i} onClick={goToCreativityBriefs} className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FB607E] mb-3">{b.company}</span>
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
      <section className="py-24 px-4 bg-gradient-to-b from-[#FFF8E7] to-[#FAFCFC] relative overflow-hidden border-t border-gray-100">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FB607E]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3BA8E7]/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

        <div className="text-center relative z-10 max-w-2xl mx-auto">
          <button
            data-testid="cta-primary"
            onClick={goToCreativityBriefs}
            className="bg-[#FB607E] hover:bg-[#e04a66] text-white text-xl md:text-2xl px-12 py-6 rounded-full transition-all hover:-translate-y-1 shadow-md pulse-glow-pink font-black tracking-tight"
          >
            Make it memorable →
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