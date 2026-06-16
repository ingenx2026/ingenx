import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import presentationImage from '../imports/image-18.png';

export default function Innovation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden" data-testid="innovation-page">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.8); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <button
        data-testid="close-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 right-8 z-50 bg-orange-600 hover:bg-orange-700 p-3 rounded-full transition-all hover:scale-110 shadow-2xl"
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
          <ImageWithFallback src={presentationImage} alt="Innovation presentation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-orange-950/40 to-neutral-950" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-none font-bold">
            Uske paas ek<br />
            <span className="text-orange-500">idea tha.</span>
          </h1>
          <p className="text-3xl md:text-5xl text-gray-300 italic">Ab uske paas ek company hai.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-orange-900/30 to-transparent pointer-events-none" />
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-neutral-950 to-orange-950/20">
        <div className="max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-400 text-xl mb-4">Slow rotating shot of:</p>
              <ul className="space-y-4 text-2xl text-gray-300">
                <li>• broken public systems</li>
                <li>• traffic</li>
                <li>• hospital queues</li>
                <li>• logistics trucks</li>
                <li>• handwritten forms</li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-4xl text-orange-500 mb-8">Then suddenly:</p>
              <p className="text-3xl">napkin sketches</p>
              <p className="text-3xl">+ prototypes</p>
              <p className="text-3xl">+ diagrams</p>
            </div>
          </div>
          <p className="text-4xl md:text-5xl text-center mt-16 text-orange-400 italic">"someone has to fix this."</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl">
          <h2 className="text-6xl md:text-8xl mb-8 font-bold">40% of appointments.</h2>
          <div className="h-32" />
          <h2 className="text-6xl md:text-8xl text-orange-500 font-bold">Gone.</h2>
          <p className="text-sm text-gray-500 mt-8">— public hospital no-show rates</p>
          <div className="h-32" />
          <h2 className="text-5xl md:text-7xl mb-8 font-bold">The algorithm sees them.</h2>
          <div className="h-24" />
          <h2 className="text-5xl md:text-7xl text-orange-500 font-bold">The money doesn't.</h2>
          <p className="text-sm text-gray-500 mt-8">— regional creators</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-neutral-950 to-orange-950/30">
        <div className="max-w-6xl">
          <h3 className="text-4xl md:text-6xl mb-16 text-center font-bold">WHAT YOU'RE ACTUALLY SOLVING</h3>
          <div className="space-y-8">
            {[
              { e: '🚛', t: 'Cold-chain logistics in Tier 2 India' },
              { e: '🏥', t: 'Public hospital no-show rates' },
              { e: '🎙️', t: 'Regional creators with no monetisation path' }
            ].map((it, i) => (
              <div key={i} className="bg-neutral-900/50 border border-orange-900/30 p-8 rounded-2xl hover:border-orange-500 transition-all">
                <span className="text-4xl mb-4 block">{it.e}</span>
                <p className="text-2xl">{it.t}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl text-gray-400 mt-12 text-center">Real problems. Already happening.</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl space-y-16">
          <h3 className="text-5xl md:text-7xl font-bold">WHAT THIS DOES TO YOU</h3>
          <div className="space-y-8">
            <div className="border-l-4 border-orange-500 pl-8">
              <p className="text-3xl mb-2">🔥</p>
              <p className="text-2xl">You learn to think in systems, not hacks.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-8">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-2xl">Your ideas start sounding executable, not theoretical.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-black relative">
        <div className="text-center max-w-4xl">
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-3xl bg-orange-500/20 rounded-full" />
            <p className="relative text-5xl md:text-7xl italic text-orange-400 transform -rotate-3">"What if we just…"</p>
          </div>
          <div className="h-32" />
          <div className="w-full h-px bg-orange-500/50" />
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-neutral-950 to-orange-950">
        <div className="text-center max-w-3xl">
          <p className="text-xl text-orange-400 italic mb-12">"The first draft of something billion-dollar."</p>
          <button
            data-testid="cta-primary"
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white text-2xl md:text-3xl px-12 md:px-16 py-6 md:py-8 rounded-full transition-all hover:scale-105 pulse-glow"
          >
            What's your napkin moment? →
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
