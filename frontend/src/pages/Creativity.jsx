import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function Creativity() {
  const navigate = useNavigate();

  const ideas = [
    {
      emoji: '💍',
      title: 'A jewellery brand people recognize before they read the logo.',
      hook: 'Recognition beats advertising every time.'
    },
    {
      emoji: '🎵',
      title: 'A music campaign that feels like culture, not marketing.',
      hook: 'The best campaigns become conversations.'
    },
    {
      emoji: '🍬',
      title: 'A heritage brand that feels relevant again.',
      hook: 'Nostalgia is powerful. Relevance is priceless.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative" data-testid="creativity-page">
      <style>{`
        .film-grain {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.6s ease-out both; }
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

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-5xl">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400 mb-6">Creativity</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-10">
            Everyone remembers <span className="text-pink-400">the ad.</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-10 italic">Almost nobody remembers the media budget.</p>

          <div className="space-y-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            <p>Some campaigns become catchphrases.</p>
            <p>Some logos become shortcuts.</p>
            <p>Some packaging gets photographed more than the product itself.</p>
            <p className="text-purple-400 italic">And some ideas end up in a folder called <span className="font-mono">Final_Final_v27</span>.</p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
      </div>

      {/* WHAT BRANDS ARE TRYING TO CREATE */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400 mb-3">The Mandate</p>
            <h2 className="text-3xl md:text-5xl font-bold">What brands are actually trying to create</h2>
          </div>

          <div className="space-y-8">
            {ideas.map((it, i) => (
              <div
                key={i}
                data-testid={`idea-card-${i}`}
                className="bg-purple-950/30 border border-purple-900/50 rounded-2xl p-8 md:p-10 hover:border-pink-500 transition-all fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{it.emoji}</div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{it.title}</h3>
                <p className="text-lg md:text-xl text-pink-300 italic">{it.hook}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-purple-950/30 to-black relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="text-center relative z-10 max-w-2xl mx-auto">
          <button
            data-testid="cta-primary"
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl md:text-2xl px-12 py-6 rounded-full transition-all hover:scale-105 shadow-2xl shadow-purple-500/50 font-semibold"
          >
            Make it memorable →
          </button>
          <p className="text-gray-400 mt-8">or</p>
          <button onClick={() => navigate('/')} className="text-white/70 hover:text-white transition-colors mt-4 text-base">
            Return to opportunities
          </button>
        </div>
      </section>
    </div>
  );
}
