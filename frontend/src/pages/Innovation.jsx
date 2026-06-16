import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function Innovation() {
  const navigate = useNavigate();

  const problems = [
    {
      emoji: '📦',
      title: 'Products reaching stores. Not customers.',
      body: 'Companies spend millions manufacturing and distributing products every day. Yet inventory still sits unsold in one market while demand goes unmet in another.',
      hook: 'Can supply chains become predictive instead of reactive?'
    },
    {
      emoji: '♻️',
      title: 'Consumers want sustainable products. Without paying more for them.',
      body: 'Businesses are under pressure to reduce waste, emissions, and packaging — without increasing costs or sacrificing growth.',
      hook: 'Can sustainability become a competitive advantage?'
    },
    {
      emoji: '🧠',
      title: 'Millions of customers. One-size-fits-all experiences.',
      body: 'Consumers expect brands to understand their needs, preferences, and behaviors in real time. Most customer journeys are still far from personal.',
      hook: 'Can every customer experience feel individually designed?'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden" data-testid="innovation-page">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.8); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.6s ease-out both; }
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

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-orange-950/30 to-neutral-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-5xl">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-400 mb-6">Innovation</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-10">
            Every company says they're <span className="text-orange-500">innovating.</span>
          </h1>
          <div className="space-y-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            <p>Some are trying to predict demand before it happens.</p>
            <p>Some are trying to eliminate waste before customers notice it.</p>
            <p>Some are trying to understand customers before customers understand themselves.</p>
            <p className="text-orange-400 italic">And some are still scheduling meetings about it. (Ouch)</p>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      </div>

      {/* WHAT GLOBAL COMPANIES ARE SOLVING */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400 mb-3">The Real Briefs</p>
            <h2 className="text-3xl md:text-5xl font-bold">What global companies are actually trying to solve</h2>
          </div>

          <div className="space-y-8">
            {problems.map((p, i) => (
              <div
                key={i}
                className="bg-neutral-900/60 border border-orange-900/30 rounded-2xl p-8 md:p-10 hover:border-orange-500 transition-all fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
                data-testid={`problem-card-${i}`}
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{p.title}</h3>
                <p className="text-base md:text-lg text-gray-400 mb-6 leading-relaxed">{p.body}</p>
                <p className="text-lg md:text-xl text-orange-400 italic">{p.hook}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent mb-12" />
            <div className="text-center space-y-3 text-gray-300">
              <p className="text-lg md:text-xl">Not classroom problems.</p>
              <p className="text-lg md:text-xl">Not hypothetical case studies.</p>
              <p className="text-lg md:text-xl text-white">The kind of challenges companies are investing millions to solve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-neutral-950 to-orange-950/60">
        <div className="text-center max-w-2xl mx-auto">
          <button
            data-testid="cta-primary"
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xl md:text-2xl px-12 py-6 rounded-full transition-all hover:scale-105 pulse-glow font-semibold"
          >
            Let's hear your ideas →
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
