import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import sustainImage from '../imports/image-17.png';

export default function Sustainability() {
  const navigate = useNavigate();

  const problems = [
    { e: '👗', t: '"What do we do with 2 lakh unsold kurtas?"' },
    { e: '🥫', t: '"Can sustainable packaging stop looking boring?"' },
    { e: '🏠', t: '"How do we make eco-housing aspirational?"' }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-white overflow-x-hidden" data-testid="sustainability-page">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(5, 150, 105, 0.5); }
          50% { box-shadow: 0 0 40px rgba(5, 150, 105, 0.8); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <button
        data-testid="close-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 right-8 z-50 bg-emerald-700 hover:bg-emerald-800 p-3 rounded-full transition-all hover:scale-110 shadow-2xl"
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
        <div className="absolute inset-0 opacity-40">
          <ImageWithFallback src={sustainImage} alt="Sustainability" className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-emerald-950/40 to-stone-950" />
        </div>
        <div className="relative z-10 text-center max-w-5xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400 mb-6">Sustainability</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight font-bold">
            The brands of <span className="text-emerald-500">2035</span><br />
            are being designed{' '}
            <span className="text-emerald-400">right now.</span>
          </h1>
        </div>
      </section>

      {/* VISUAL CONTRADICTION */}
      <section className="py-24 px-4 bg-gradient-to-b from-stone-950 to-stone-900">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <p className="text-lg md:text-xl text-gray-300">Beautiful product shots slowly transition into:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base md:text-lg text-gray-400">
            {['landfills', 'waste', 'overheated cities', 'pollution', 'excess inventory', 'plastic', 'fast fashion', 'carbon'].map((w, i) => (
              <div key={i} className="bg-stone-900 border border-stone-700 p-5 rounded-lg">{w}</div>
            ))}
          </div>
          <p className="text-base md:text-lg text-gray-500 italic">No narration needed.<br />Visual contradiction tells the story.</p>
        </div>
      </section>

      {/* SCROLL MOMENTS */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl text-stone-200 font-bold">2 lakh unsold kurtas.</h2>
            <h2 className="text-3xl md:text-5xl text-emerald-500 font-bold">Now what?</h2>
          </div>
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl text-stone-300 font-bold">Can sustainability stop looking boring?</h2>
          </div>
        </div>
      </section>

      {/* WHAT YOU'RE SOLVING */}
      <section className="py-24 px-4 bg-gradient-to-b from-stone-950 to-stone-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400 mb-3">The Briefs</p>
            <h3 className="text-3xl md:text-5xl font-bold">What you're actually solving</h3>
          </div>
          <div className="space-y-6">
            {problems.map((it, i) => (
              <div key={i} className="bg-stone-900/80 border border-emerald-900/30 p-8 rounded-2xl hover:border-emerald-600 transition-all">
                <span className="text-4xl mb-4 block">{it.e}</span>
                <p className="text-lg md:text-xl">{it.t}</p>
              </div>
            ))}
          </div>
          <p className="text-lg md:text-xl text-gray-400 mt-12 text-center">
            Not awareness campaigns.{' '}
            <span className="text-emerald-400">Business survival questions.</span>
          </p>
        </div>
      </section>

      {/* WHAT THIS DOES TO YOU */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          <h3 className="text-3xl md:text-5xl font-bold">What this does to you</h3>
          <div className="space-y-8">
            <div className="border-l-4 border-emerald-600 pl-8">
              <p className="text-2xl mb-2">🌱</p>
              <p className="text-lg md:text-xl">You develop long-term thinking.</p>
            </div>
            <div className="border-l-4 border-emerald-600 pl-8">
              <p className="text-2xl mb-2">📊</p>
              <p className="text-lg md:text-xl">You learn the language shaping modern boardrooms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-24 px-4 bg-stone-950 relative">
        <div className="text-center max-w-3xl mx-auto relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
          <h2 className="relative text-3xl md:text-5xl text-emerald-400 leading-tight font-bold">"The future is a design problem."</h2>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-stone-900 to-emerald-950">
        <div className="text-center max-w-2xl mx-auto">
          <button
            data-testid="cta-primary"
            onClick={() => navigate('/')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xl md:text-2xl px-12 py-6 rounded-full transition-all hover:scale-105 pulse-glow shadow-2xl shadow-emerald-900/50 font-semibold"
          >
            The problem is real. Are you? →
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
