import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import techImage from '../imports/ChatGPT_Image_May_29__2026__07_51_12_PM.png';

const terminalSequence = [
  '$ npm run build',
  '> building...',
  '✓ compiled successfully',
  '',
  '$ git push origin main',
  'Enumerating objects: 47, done.',
  'Counting objects: 100% (47/47), done.',
  'Delta compression using up to 8 threads',
  'Compressing objects: 100% (28/28), done.',
  'Writing objects: 100% (28/28), 3.42 KiB | 3.42 MiB/s, done.',
  'Total 28 (delta 19), reused 0 (delta 0)',
  '',
  '$ deploying to production...',
  '✓ Build successful',
  '✓ Assets optimized',
  '✓ Deployment complete',
  '',
  '[04:17 AM]',
  '✓ SUCCESS',
];

// --- MINI WIDGET: SHIP IT OR SKIP IT ---
// Terminal-themed bug-spotting game — matches the page's existing aesthetic.
function ShipItOrSkipIt() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(null);

  const snippets = [
    { t: 'if (user.password === inputPassword) { login(); }', verdict: 'skip', r: 'Plaintext password comparison. Hash it, always.' },
    { t: 'const debounced = useMemo(() => debounce(fn, 300), [fn]);', verdict: 'ship', r: 'Clean, memoized debounce. This ships.' },
    { t: 'useEffect(() => { fetchData() }); // no dependency array', verdict: 'skip', r: 'Runs on every render. Infinite fetch loop incoming.' },
    { t: 'const [state, setState] = useState(() => expensiveInit());', verdict: 'ship', r: 'Lazy initializer — expensiveInit only runs once. Solid.' },
    { t: 'localStorage.setItem("jwt", token); // no expiry check', verdict: 'skip', r: 'Classic. Token never expires client-side, security hole.' },
    { t: 'export default memo(Component, (prev, next) => prev.id === next.id);', verdict: 'ship', r: 'Targeted memo comparison. Prevents unnecessary re-renders.' },
  ];

  const handleGuess = (guess) => {
    const correct = guess === snippets[index].verdict;
    setLastCorrect(correct);
    setScore(s => correct ? s + 100 : Math.max(0, s - 30));
    setRevealed(true);
  };

  const nextCard = () => {
    setRevealed(false); setLastCorrect(null);
    if (index + 1 < snippets.length) { setIndex(index + 1); } else { setIsGameOver(true); }
  };

  const resetGame = () => {
    setIsPlaying(false); setIsGameOver(false); setIndex(0); setScore(0); setRevealed(false); setLastCorrect(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="w-3 h-3 rounded-full bg-[#E92A39]" />
        <div className="w-3 h-3 rounded-full bg-[#FDE25D]" />
        <div className="w-3 h-3 rounded-full bg-[#2E73E6]" />
        <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 ml-3 font-sans">code-review.tsx</span>
      </div>
      <div className="p-8 md:p-10 flex flex-col min-h-[420px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-[#111]">Ship It or Skip It</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Spot the bug before it ships</p>
          </div>
          {isPlaying && !isGameOver && (
            <div className="bg-gray-100 px-4 py-2 rounded-xl text-right shrink-0">
              <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Score</p>
              <p className="text-xl font-black text-[#E92A39]">{score}</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {!isPlaying ? (
            <div className="animate-fade-in-global w-full">
              <div className="text-5xl mb-6">🐛</div>
              <h4 className="text-2xl font-black leading-tight mb-3 text-[#111]">Every PR looks fine at 2 AM.</h4>
              <p className="text-sm font-bold text-gray-500 mb-8">Can you catch what review missed?</p>
              <button onClick={() => setIsPlaying(true)} className="bg-[#111] hover:bg-black text-[#FDE25D] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                Open PR
              </button>
            </div>
          ) : isGameOver ? (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <h4 className="text-xl font-black leading-tight mb-2 text-[#111]">PR Closed.</h4>
              <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Final Score</p>
              <div className="text-6xl font-black text-[#E92A39] mb-3 tracking-tighter">{score} <span className="text-xl opacity-40 text-gray-400">/ {snippets.length * 100}</span></div>
              <p className="text-sm font-bold text-gray-500 mb-8 max-w-xs">
                {score >= 400 ? "You'd survive a real code review. Go build something." : "Real hackathon code review hits different — come find out."}
              </p>
              <button onClick={resetGame} className="bg-[#111] text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                Run It Back
              </button>
            </div>
          ) : !revealed ? (
            <div className="animate-fade-in-global w-full">
              <span className="text-[10px] font-black uppercase text-gray-400 mb-4 block tracking-widest">Snippet {index + 1} / {snippets.length}</span>
              <div className="bg-[#FAFCFC] border border-gray-200 p-6 rounded-2xl mb-8 min-h-[100px] flex items-center justify-center shadow-inner">
                <code className="text-sm md:text-base font-mono font-bold text-[#111] break-words">{snippets[index].t}</code>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleGuess('skip')} className="hover:scale-105 transition-transform bg-gray-100 hover:bg-[#E92A39] hover:text-white border border-gray-200 text-[#111] px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  Skip It
                </button>
                <button onClick={() => handleGuess('ship')} className="hover:scale-105 transition-transform bg-gray-100 hover:bg-[#10b981] hover:text-white border border-gray-200 text-[#111] px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  Ship It
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-md text-white ${lastCorrect ? 'bg-[#10b981]' : 'bg-[#E92A39]'}`}>
                {lastCorrect ? '+100 · GOOD CATCH' : '-30 · MISSED IT'}
              </span>
              <p className="text-sm font-bold bg-[#FAFCFC] border border-gray-200 p-5 rounded-2xl leading-relaxed mb-8 text-gray-700">{snippets[index].r}</p>
              <button onClick={nextCard} className="bg-[#111] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                {index + 1 < snippets.length ? 'Next Snippet →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TechHackathons() {
  const navigate = useNavigate();
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine < terminalSequence.length) {
      const timeout = setTimeout(() => {
        setTerminalLines(prev => [...prev, terminalSequence[currentLine]]);
        setCurrentLine(prev => prev + 1);
      }, Math.random() * 200 + 100);
      return () => clearTimeout(timeout);
    }
  }, [currentLine]);

  const liveBriefs = [
    { title: 'Power Protocol', company: 'Legrand', points: '₹1,00,000 + Tech Setup', deadline: 'Oct 20, 2026' },
    { title: 'Keep It Lit', company: 'Eveready', points: 'Internship + ₹50,000', deadline: 'Oct 30, 2026' },
  ];

  const goToTechBriefs = () => navigate('/#opportunities');

  return (
    <div className="min-h-screen bg-[#FAFCFC] text-[#111] overflow-x-hidden font-sans selection:bg-[#FDE25D] selection:text-[#111]" data-testid="tech-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        
        * { font-family: 'Outfit', sans-serif; }

        @keyframes terminal-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .terminal-cursor { animation: terminal-blink 1s infinite; }
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
          <ImageWithFallback src={techImage} alt="Tech workspace" className="w-full h-full object-cover grayscale opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAFCFC]/80 to-[#FAFCFC]" />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#E92A39] mb-6 drop-shadow-sm">Tech & Hackathons</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-none font-black tracking-tighter text-[#111]">
            <span className="bg-[#FDE25D] px-4 rounded-2xl inline-block shadow-sm">48 hours.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-bold italic mb-12">That's enough to build something real.</p>
          
          {/* Mini Static Terminal */}
          <div className="inline-block text-left bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden min-w-[280px]">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="w-3 h-3 rounded-full bg-[#E92A39]" />
              <div className="w-3 h-3 rounded-full bg-[#FDE25D]" />
              <div className="w-3 h-3 rounded-full bg-[#2E73E6]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-2 font-sans">terminal</span>
            </div>
            <div className="p-5 text-sm font-mono font-medium text-gray-600">
              <p className="mb-1"><span className="text-[#2E73E6] font-bold">$</span> ready to build?</p>
              <p><span className="text-[#2E73E6] font-bold">$</span> <span className="terminal-cursor font-bold text-[#111]">_</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED TERMINAL SECTION */}
      <section className="py-24 px-4 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFC] via-[#FDE25D]/5 to-[#FAFCFC]" />
        
        <div className="w-full max-w-4xl relative z-10">
          <div className="bg-white border border-gray-200 rounded-[2rem] shadow-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center gap-2 bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="w-3 h-3 rounded-full bg-[#E92A39]" />
              <div className="w-3 h-3 rounded-full bg-[#FDE25D]" />
              <div className="w-3 h-3 rounded-full bg-[#2E73E6]" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 ml-3 font-sans">~/hackathon-project</span>
            </div>
            <div className="p-8 min-h-96 font-mono text-sm leading-relaxed bg-[#FAFCFC]">
              {terminalLines.map((line, index) => (
                <div key={index} className="mb-1.5">
                  {line.startsWith('✓') ? (
                    <span className="text-[#2E73E6] font-bold">{line}</span>
                  ) : line.startsWith('$') ? (
                    <span className="text-[#111] font-bold">{line}</span>
                  ) : line.includes('[04:17 AM]') ? (
                    <span className="text-gray-400 text-xs font-sans font-bold uppercase tracking-widest">{line}</span>
                  ) : line.includes('SUCCESS') ? (
                    <span className="text-[#E92A39] text-lg font-black tracking-tight">{line}</span>
                  ) : (
                    <span className="text-gray-500 font-medium">{line}</span>
                  )}
                </div>
              ))}
              {currentLine < terminalSequence.length && <span className="terminal-cursor text-[#2E73E6] font-bold">_</span>}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU'RE BUILDING */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#E92A39] mb-4">The Briefs</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-[#111]">What you're actually building</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { e: '🏗️', t: 'A manufacturing dashboard replacing a ₹40L workflow' },
              { e: '🧬', t: 'A rural health tool replacing paper tracking' },
              { e: '🎓', t: 'A personalised revision engine for students' }
            ].map((it, i) => (
              <div key={i} className="bg-white border border-gray-200 p-8 md:p-10 rounded-[2.5rem] hover:shadow-xl hover:border-[#FDE25D] transition-all duration-300 hover:-translate-y-1 group">
                <span className="text-5xl mb-6 block drop-shadow-sm group-hover:scale-110 transition-transform origin-left">{it.e}</span>
                <p className="text-xl font-bold leading-tight text-[#111]">{it.t}</p>
              </div>
            ))}
          </div>
          <p className="text-xl font-medium text-gray-500 mt-16 text-center">
            Three industries. Same 48 hours. <span className="font-black text-[#111]">Same chai.</span>
          </p>
        </div>
      </section>

      {/* SHIP IT OR SKIP IT — INTERACTIVE GAME */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E92A39] font-extrabold mb-4">Take A Break</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Think your code review game is strong?</h3>
          </div>
          <ShipItOrSkipIt />
        </div>
      </section>

      {/* WHAT THIS DOES TO YOU */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-4xl mx-auto space-y-12">
          <h3 className="text-4xl md:text-5xl font-black tracking-tight text-[#111]">What this does to you</h3>
          <div className="space-y-10">
            <div className="border-l-4 border-[#FDE25D] pl-8 py-2">
              <p className="text-3xl mb-4 drop-shadow-sm">🛠️</p>
              <p className="text-xl md:text-2xl font-bold text-gray-600 mb-2">You stop being someone who codes.</p>
              <p className="text-xl md:text-2xl font-black text-[#111] tracking-tight">You become someone who ships.</p>
            </div>
            <div className="border-l-4 border-[#FDE25D] pl-8 py-2">
              <p className="text-3xl mb-4 drop-shadow-sm">🔓</p>
              <p className="text-xl md:text-2xl font-black text-[#111] tracking-tight leading-tight">Your GitHub starts looking more valuable than your résumé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS BLOCK */}
      <section className="py-32 px-4 bg-white border-y border-gray-100 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <div className="inline-block text-center bg-[#FAFCFC] border border-gray-200 p-10 md:p-12 rounded-[3rem] shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-extrabold text-gray-400 mb-4 uppercase tracking-widest">[SUCCESS]</p>
            <p className="text-[#111] text-4xl md:text-6xl font-black tracking-tighter">Build complete.</p>
          </div>
        </div>
      </section>

      {/* LIVE TECH BRIEFS STRIP */}
      <section className="py-24 px-4 bg-[#FFF8E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E92A39] font-extrabold mb-4">Right Now</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Live briefs in this arena</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {liveBriefs.map((b, i) => (
              <div key={i} onClick={goToTechBriefs} className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
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
      <section className="py-24 px-4 bg-gradient-to-b from-[#FFF8E7] to-[#FAFCFC] relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <button
            data-testid="cta-primary"
            onClick={goToTechBriefs}
            className="bg-[#111] hover:bg-black text-[#FDE25D] text-xl md:text-2xl px-12 py-6 rounded-full transition-all hover:-translate-y-1 shadow-md font-black tracking-tight flex items-center gap-3 justify-center mx-auto"
          >
            Start the clock. <span>→</span>
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