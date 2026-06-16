import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import billboardImage from '../imports/Gemini_Generated_Image_1l2vfz1l2vfz1l2v.png';

export default function MarketingBusiness() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      if (progress > 30) setShowNotifications(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    { app: 'Zomato', text: 'Your order is out for delivery', time: '2m ago', color: 'red' },
    { app: 'Swiggy', text: 'Flash sale: 60% OFF', time: '5m ago', color: 'orange' },
    { app: 'Blinkit', text: 'Groceries in 10 minutes', time: '8m ago', color: 'yellow' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" data-testid="marketing-page">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.5); }
          50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.8); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideInUp 0.5s ease-out; }
      `}</style>

      <button
        data-testid="close-btn"
        onClick={() => navigate('/')}
        className="fixed top-8 right-8 z-50 bg-red-600 hover:bg-red-700 p-3 rounded-full transition-all hover:scale-110 shadow-2xl"
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
        <div className="absolute inset-0 opacity-40">
          <ImageWithFallback src={billboardImage} alt="Marketing campaign" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/50 to-black" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-none font-bold">
            Duniya ke sabse bade brands ke<br />
            <span className="text-red-500">sabse bade problems.</span>
          </h1>
          <p className="text-3xl md:text-5xl text-gray-300 italic">Yours to crack.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-red-900/30 to-transparent pointer-events-none" />
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />
        <div className="relative z-10 max-w-5xl">
          <h2 className="text-6xl md:text-8xl mb-8 font-bold">10M downloads.</h2>
          <div className="h-32" />
          <h2 className="text-6xl md:text-8xl text-red-500 font-bold">Zero loyalty.</h2>
          <p className="text-sm text-gray-500 mt-8">— fintech team, mildly panicking</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl w-full space-y-16">
          <h2 className="text-5xl md:text-7xl font-bold">
            "Why is Gen Z buying our <span className="text-red-500">competitor's drink</span>?"
          </h2>
          <div className="bg-gray-900 border border-red-900/50 p-8 rounded-3xl max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎙️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">Voice Note</p>
                <div className="bg-red-900/50 h-8 rounded-full flex items-center px-3">
                  <div className="w-full h-1 bg-red-500/30 rounded-full relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-red-500 w-1/3 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg italic">"Guys… the campaign isn't landing."</p>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black to-red-950/30">
        <div className="max-w-6xl">
          <h3 className="text-4xl md:text-6xl mb-16 text-center font-bold">WHAT YOU'RE ACTUALLY SOLVING</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { e: '🥤', t: '"Why is Gen Z buying our competitor\'s drink?"' },
              { e: '👟', t: '"How do we make this sneaker brand feel less… uncle?"' },
              { e: '📱', t: '"10M downloads. Zero loyalty."' }
            ].map((it, i) => (
              <div key={i} className="bg-gray-900/50 border border-red-900/30 p-8 rounded-2xl hover:border-red-500 transition-all">
                <span className="text-4xl mb-4 block">{it.e}</span>
                <p className="text-xl">{it.t}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl text-gray-400 mt-12 text-center">
            Three industries. Same chaos:<br />
            <span className="text-white">attention is harder to earn now.</span>
          </p>
        </div>
      </section>

      {showNotifications && (
        <div className="fixed bottom-8 right-8 space-y-3 z-40 animate-slide-in">
          {notifications.map((notif, index) => (
            <div key={index} className="bg-gray-900 border border-red-900/50 p-4 rounded-xl shadow-2xl w-80">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1 ${
                  notif.color === 'red' ? 'bg-red-500' :
                  notif.color === 'orange' ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{notif.app}</p>
                  <p className="text-white">{notif.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl space-y-16">
          <h3 className="text-5xl md:text-7xl font-bold">WHAT THIS DOES TO YOU</h3>
          <div className="space-y-8">
            <div className="border-l-4 border-red-500 pl-8">
              <p className="text-3xl mb-2">🧠</p>
              <p className="text-2xl">You stop seeing brands as logos.</p>
              <p className="text-xl text-gray-400">You start seeing psychology, culture & behaviour everywhere.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-8">
              <p className="text-3xl mb-2">🌍</p>
              <p className="text-2xl">You build a point of view people remember.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-black">
        <div className="text-center max-w-4xl">
          <p className="text-sm text-gray-600 mb-16">"I didn't get placed here."</p>
          <h2 className="text-7xl md:text-9xl text-red-500 font-bold">I got obsessed.</h2>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black to-red-950">
        <div className="text-center">
          <button
            data-testid="cta-primary"
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white text-2xl md:text-3xl px-12 md:px-16 py-6 md:py-8 rounded-full transition-all hover:scale-105 pulse-glow"
          >
            Take the brief. Break it open. →
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
