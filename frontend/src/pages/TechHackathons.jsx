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

  return (
    <div className="min-h-screen bg-black text-green-400 overflow-x-hidden font-mono" data-testid="tech-page">
      <style>{`
        @keyframes terminal-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .terminal-cursor { animation: terminal-blink 1s infinite; }
        .terminal-glow { text-shadow: 0 0 10px rgba(34, 197, 94, 0.8); }
      `}</style>

      <button
        data-testid="close-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 right-8 z-50 bg-green-600 hover:bg-green-700 p-3 rounded-full transition-all hover:scale-110 shadow-2xl shadow-green-500/50"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <button
        data-testid="back-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-50 text-green-400/70 hover:text-green-400 transition-colors text-sm uppercase tracking-wider"
      >
        ← Go Back
      </button>

      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback src={techImage} alt="Tech workspace" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/30 to-black" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-8 leading-none terminal-glow font-bold">48 hours.</h1>
          <p className="text-3xl md:text-5xl text-green-300 italic">That's enough to build something real.</p>
          <div className="mt-16 inline-block text-left bg-black/80 border border-green-500/50 p-2 rounded shadow-2xl shadow-green-500/20">
            <div className="flex items-center gap-2 bg-green-950/50 px-3 py-1 border-b border-green-500/30">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-green-400 ml-2">terminal</span>
            </div>
            <div className="p-4 text-sm">
              <p className="text-green-400">$ ready to build?</p>
              <p className="text-green-400">$ <span className="terminal-cursor">_</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black to-green-950/10">
        <div className="max-w-4xl space-y-8 text-green-300">
          <p className="text-2xl">Dark hostel room.</p>
          <p className="text-2xl">Laptop glow only light source.</p>
          <p className="text-2xl">Rain outside window.</p>
          <p className="text-2xl">Discord sounds.</p>
          <p className="text-2xl terminal-glow">Terminal logs moving in real-time.</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <div className="bg-black border-2 border-green-500/50 rounded-lg shadow-2xl shadow-green-500/30 overflow-hidden">
            <div className="flex items-center gap-2 bg-green-950/50 px-4 py-2 border-b border-green-500/30">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-green-400 ml-2">~/hackathon-project</span>
            </div>
            <div className="p-6 min-h-96 font-mono text-sm">
              {terminalLines.map((line, index) => (
                <div key={index} className="mb-1">
                  {line.startsWith('✓') ? (
                    <span className="text-green-400 terminal-glow">{line}</span>
                  ) : line.startsWith('$') ? (
                    <span className="text-green-300">{line}</span>
                  ) : line.includes('[04:17 AM]') ? (
                    <span className="text-yellow-400">{line}</span>
                  ) : line.includes('SUCCESS') ? (
                    <span className="text-green-400 text-xl terminal-glow">{line}</span>
                  ) : (
                    <span className="text-green-500/70">{line}</span>
                  )}
                </div>
              ))}
              {currentLine < terminalSequence.length && <span className="terminal-cursor">_</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black to-green-950/20">
        <div className="max-w-6xl">
          <h3 className="text-4xl md:text-6xl mb-16 text-center terminal-glow font-bold">WHAT YOU'RE ACTUALLY BUILDING</h3>
          <div className="space-y-8">
            {[
              { e: '🏗️', t: 'A manufacturing dashboard replacing a ₹40L workflow' },
              { e: '🧬', t: 'A rural health tool replacing paper tracking' },
              { e: '🎓', t: 'A personalised revision engine for students' }
            ].map((it, i) => (
              <div key={i} className="bg-black border border-green-500/30 p-8 rounded-2xl hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
                <span className="text-4xl mb-4 block">{it.e}</span>
                <p className="text-2xl text-green-300">{it.t}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl text-green-400/70 mt-12 text-center font-sans">Three industries. Same 48 hours. Same chai.</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl space-y-16">
          <h3 className="text-5xl md:text-7xl terminal-glow font-bold">WHAT THIS DOES TO YOU</h3>
          <div className="space-y-8 font-sans">
            <div className="border-l-4 border-green-500 pl-8">
              <p className="text-3xl mb-2">🛠️</p>
              <p className="text-2xl text-green-300">You stop being someone who codes.</p>
              <p className="text-2xl text-green-400 terminal-glow">You become someone who ships.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-8">
              <p className="text-3xl mb-2">🔓</p>
              <p className="text-2xl text-green-300">Your GitHub starts looking more valuable than your résumé.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-black">
        <div className="text-center max-w-4xl">
          <div className="inline-block text-left bg-black/80 border border-green-500/50 p-8 rounded shadow-2xl shadow-green-500/30">
            <p className="text-green-400 text-2xl mb-4">[SUCCESS]</p>
            <div className="h-8" />
            <p className="text-green-400 text-4xl terminal-glow">Build complete.</p>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black to-green-950">
        <div className="text-center font-sans">
          <button
            data-testid="cta-primary"
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-black text-2xl md:text-3xl px-12 md:px-16 py-6 md:py-8 rounded-full transition-all hover:scale-105 shadow-2xl shadow-green-500/50 terminal-glow font-bold"
          >
            Start the clock. →
          </button>
          <p className="text-green-400/50 mt-8">or</p>
          <button onClick={() => navigate('/')} className="text-green-400/70 hover:text-green-400 transition-colors mt-4 text-lg">
            Return to opportunities
          </button>
        </div>
      </section>
    </div>
  );
}
