import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import billboardImage from '../imports/Gemini_Generated_Image_1l2vfz1l2vfz1l2v.png';

// --- MINI WIDGET: PITCH OR FLOP ---
// Rapid-fire "boardroom" game — read the pitch, decide if it flies or dies.
function PitchOrFlop() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [swipeDir, setSwipeDir] = useState(null);

  const pitches = [
    { t: '"Let\'s get a meme page to post our logo for free."', verdict: 'flop', r: 'Meme pages want cash upfront. "Exposure" isn\'t a currency they accept.' },
    { t: '"What if the ad just... showed the product actually working?"', verdict: 'pitch', r: 'Wild concept. Consumers respond to honesty more than 4 dancers and a jingle.' },
    { t: '"Let\'s hire the same celebrity every other brand in this category uses."', verdict: 'flop', r: 'Zero differentiation. You just became the 6th ad this month with the same face.' },
    { t: '"Let\'s build the campaign around one real customer complaint."', verdict: 'pitch', r: 'Turning a real pain point into the hook = instant relatability.' },
    { t: '"Add \'synergy\' and \'paradigm shift\' to the tagline."', verdict: 'flop', r: 'Corporate jargon has never once made a 19-year-old feel something.' },
    { t: '"Let the community vote on the next flavor/design."', verdict: 'pitch', r: 'Co-creation = built-in launch hype and free word-of-mouth.' },
    { t: '"Just repost the same billboard ad but on Instagram."', verdict: 'flop', r: 'Different platform, different behaviour. Billboard energy dies in a scroll feed.' },
  ];

  const handleSwipe = (dir) => {
    const guess = dir === 'right' ? 'pitch' : 'flop';
    const correct = guess === pitches[index].verdict;
    setSwipeDir(dir);
    setLastCorrect(correct);
    setScore(s => correct ? s + 100 : Math.max(0, s - 30));
    setTimeout(() => setRevealed(true), 200);
  };

  const nextCard = () => {
    setRevealed(false); setLastCorrect(null); setSwipeDir(null);
    if (index + 1 < pitches.length) { setIndex(index + 1); } else { setIsGameOver(true); }
  };

  const resetGame = () => {
    setIsPlaying(false); setIsGameOver(false); setIndex(0); setScore(0); setRevealed(false); setLastCorrect(null); setSwipeDir(null);
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden text-white relative">
      <div className="p-8 md:p-10 flex flex-col min-h-[460px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">Pitch or Flop</h3>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">The Boardroom Simulator</p>
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
              <div className="text-5xl mb-6">🎤</div>
              <h4 className="text-2xl font-black leading-tight mb-3">You're in the room. The idea just landed.</h4>
              <p className="text-sm font-bold text-white/50 mb-8">Swipe right to greenlight. Swipe left to kill it.</p>
              <button onClick={() => setIsPlaying(true)} className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                Enter the Room
              </button>
            </div>
          ) : isGameOver ? (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <h4 className="text-xl font-black leading-tight mb-2">Meeting Adjourned.</h4>
              <p className="text-sm font-bold text-white/50 mb-2 uppercase tracking-widest">Final Score</p>
              <div className="text-6xl font-black text-[#FDE25D] mb-3 tracking-tighter">{score} <span className="text-xl opacity-40">/ {pitches.length * 100}</span></div>
              <p className="text-sm font-bold text-white/60 mb-8 max-w-xs">
                {score >= 500 ? "You've got boardroom instincts. Go break a real brief." : "The real briefs are messier — and way more fun."}
              </p>
              <button onClick={resetGame} className="bg-white text-[#111] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                Run It Back
              </button>
            </div>
          ) : !revealed ? (
            <div className="animate-fade-in-global w-full">
              <span className="text-[10px] font-black uppercase text-white/30 mb-4 block tracking-widest">Pitch {index + 1} / {pitches.length}</span>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8 min-h-[140px] flex items-center justify-center shadow-inner">
                <h4 className="text-xl md:text-2xl font-black leading-tight">{pitches[index].t}</h4>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleSwipe('left')} className="hover:scale-105 transition-transform bg-white/10 hover:bg-[#E92A39] border border-white/20 text-white px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  ← Kill It
                </button>
                <button onClick={() => handleSwipe('right')} className="hover:scale-105 transition-transform bg-white/10 hover:bg-[#10b981] border border-white/20 text-white px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">
                  Greenlight →
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-global w-full flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-md ${lastCorrect ? 'bg-[#10b981] text-white' : 'bg-[#E92A39] text-white'}`}>
                {lastCorrect ? '+100 · GOOD CALL' : '-30 · MISREAD THE ROOM'}
              </span>
              <p className="text-sm font-bold bg-white/5 border border-white/10 p-5 rounded-2xl leading-relaxed mb-8">{pitches[index].r}</p>
              <button onClick={nextCard} className="bg-white text-[#111] px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
                {index + 1 < pitches.length ? 'Next Pitch →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketingBusiness() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsDismissed, setNotificationsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (notificationsDismissed) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      if (progress > 30) setShowNotifications(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [notificationsDismissed]);

  const notifications = [
    { app: 'Nuvoco', text: 'Your brief drops in 2 days', time: '2m ago', color: 'red' },
    { app: 'SRMB', text: 'Cohort 01 applications closing soon', time: '5m ago', color: 'orange' },
    { app: 'InGenuityX', text: 'A brand just posted a new problem', time: '8m ago', color: 'yellow' },
  ];

  const problems = [
    { e: '🥤', t: '"Why is Gen Z buying our competitor\'s drink?"' },
    { e: '👟', t: '"How do we make this sneaker brand feel less… uncle?"' },
    { e: '📱', t: '"10M downloads. Zero loyalty."' }
  ];

  // Live briefs tagged for this category — same card data shape as Home.jsx
  const liveBriefs = [
    { title: 'Market InGenuityX. Seriously.', company: 'InGenuityX', points: 'PPO Available', deadline: 'Oct 25, 2026' },
    { title: 'Ironclad Challenge', company: 'SRMB', points: 'Internship + ₹40,000', deadline: 'Oct 22, 2026' },
  ];

  const goToMarketingBriefs = () => navigate('/#opportunities');

  return (
    <div className="min-h-screen bg-[#FAFCFC] text-[#111] overflow-x-hidden font-sans selection:bg-[#E92A39] selection:text-white" data-testid="marketing-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(233, 42, 57, 0.3); }
          50% { box-shadow: 0 0 40px rgba(233, 42, 57, 0.6); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideInUp 0.5s ease-out; }
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

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src={billboardImage} 
            alt="Marketing campaign billboard" 
            className="w-full h-full object-cover opacity-[0.6]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAFCFC]/60 to-[#FAFCFC]" />
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2E73E6]/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E92A39]/5 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 text-center max-w-5xl mt-12">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#E92A39] mb-6 drop-shadow-sm">Marketing & Business</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-8 leading-[1.1] font-black tracking-tight text-[#111]">
            Duniya ke sabse bade brands ke<br />
            <span className="text-[#E92A39]">sabse bade problems.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 italic font-bold">Yours to crack.</p>
        </div>
      </section>

      {/* SCROLL MOMENT */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFC] via-[#E92A39]/5 to-[#FAFCFC]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#111]">10M downloads.</h2>
          <h2 className="text-4xl md:text-6xl text-[#E92A39] font-black tracking-tight">Zero loyalty.</h2>
          <p className="text-sm text-gray-500 pt-6 font-bold uppercase tracking-widest">— fintech team, mildly panicking</p>
        </div>
      </section>

      {/* WHAT YOU'RE SOLVING */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#FAFCFC] to-[#FFF8E7] relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E92A39] font-extrabold mb-4">The Briefs</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-[#111]">What you're actually solving</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((it, i) => (
              <div key={i} className="bg-white border border-gray-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-[#E92A39]/40 hover:-translate-y-1 transition-all duration-300 group">
                <span className="text-5xl mb-6 block drop-shadow-sm group-hover:scale-110 transition-transform origin-left">{it.e}</span>
                <p className="text-xl font-bold leading-tight text-[#111]">{it.t}</p>
              </div>
            ))}
          </div>
          
          <p className="text-xl md:text-2xl font-medium text-gray-500 mt-16 text-center">
            Three industries. Same chaos:{' '}
            <span className="text-[#111] font-black tracking-tight">attention is harder to earn now.</span>
          </p>
        </div>
      </section>

      {/* PITCH OR FLOP — INTERACTIVE GAME */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E92A39] font-extrabold mb-4">Take A Break</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Think you've got the instincts?</h3>
          </div>
          <PitchOrFlop />
        </div>
      </section>

      {/* FLOATING NOTIFICATIONS WITH CLOSE BUTTON */}
      {showNotifications && !notificationsDismissed && (
        <div className="fixed bottom-8 right-8 z-40 animate-slide-in">
          
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setNotificationsDismissed(true)} 
              className="bg-white border border-gray-200 text-gray-400 hover:text-[#E92A39] hover:border-[#E92A39]/30 p-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              aria-label="Dismiss notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <div key={index} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-2xl w-80 hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    notif.color === 'red' ? 'bg-[#E92A39]' :
                    notif.color === 'orange' ? 'bg-[#EC802B]' : 'bg-[#FDE25D]'
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">{notif.app}</p>
                    <p className="text-[#111] font-bold text-sm">{notif.text}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHAT THIS DOES TO YOU */}
      <section className="py-24 px-4 bg-[#FAFCFC]">
        <div className="max-w-4xl mx-auto space-y-12">
          <h3 className="text-4xl md:text-5xl font-black tracking-tight text-[#111]">What this does to you</h3>
          <div className="space-y-10">
            <div className="border-l-4 border-[#E92A39] pl-8 py-2">
              <p className="text-3xl mb-4 drop-shadow-sm">🧠</p>
              <p className="text-xl md:text-2xl font-black text-[#111] mb-2 tracking-tight">You stop seeing brands as logos.</p>
              <p className="text-base md:text-lg font-medium text-gray-600">You start seeing psychology, culture & behaviour everywhere.</p>
            </div>
            <div className="border-l-4 border-[#E92A39] pl-8 py-2">
              <p className="text-3xl mb-4 drop-shadow-sm">🌍</p>
              <p className="text-xl md:text-2xl font-black text-[#111] tracking-tight">You build a point of view people remember.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC QUOTE */}
      <section className="py-32 px-4 bg-white border-y border-gray-100">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-base font-bold text-gray-400 mb-4 uppercase tracking-widest">"I didn't get placed here."</p>
          <h2 className="text-5xl md:text-7xl text-[#E92A39] font-black tracking-tighter">I got obsessed.</h2>
        </div>
      </section>

      {/* LIVE MARKETING BRIEFS STRIP */}
      <section className="py-24 px-4 bg-[#FFF8E7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E92A39] font-extrabold mb-4">Right Now</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#111]">Live briefs in this arena</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {liveBriefs.map((b, i) => (
              <div key={i} onClick={goToMarketingBriefs} className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
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
            onClick={goToMarketingBriefs}
            className="bg-[#E92A39] hover:bg-[#ff3b4b] text-white text-xl md:text-2xl px-12 py-6 rounded-full transition-all hover:-translate-y-1 shadow-md pulse-glow font-black tracking-tight"
          >
            Take the brief. Break it open. →
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