import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Search } from 'lucide-react';

import heroImage1 from '../imports/image.png';
import heroImage2 from '../imports/image-4.png';
import heroImage3 from '../imports/image-5.png';
import registeredImage from '../imports/image-1.png';
import campusRegistration from '../imports/image-2.png';
import groupDiscussion from '../imports/image-3.png';
import stagePresentation from '../imports/image-8.png';
import winningMoment from '../imports/image-5.png';
import certificateImage from '../imports/image-6.png';
import logoImage from '../imports/ingenuityx-logo.jpg';
import mascotImage from '../imports/image-12.png';
import rhinoMascot from '../imports/rhino-mascot.png';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wallSubmissions, setWallSubmissions] = useState([
    { text: "Never challenged for real-world skills.", reactions: { '💀 too real': 23, 'felt.': 18, 'same bro': 31 } },
    { text: "My internship was mostly Canva & random calls.", reactions: { '💀 too real': 45, 'felt.': 29, 'bro cooked': 12 } },
    { text: "We have certificates. Not clarity.", reactions: { '💀 too real': 38, 'felt.': 42, 'same bro': 27 } },
    { text: "Everyone says upskill. Nobody explains how.", reactions: { 'felt.': 56, 'same bro': 34, 'bro cooked': 8 } },
    { text: "Our exposure feels outdated.", reactions: { '💀 too real': 19, 'felt.': 25, 'same bro': 22 } },
    { text: "Too qualified for internships. Too inexperienced for jobs.", reactions: { '💀 too real': 67, 'felt.': 54, 'same bro': 49 } }
  ]);
  const [newSubmission, setNewSubmission] = useState('');
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [activeDidYouKnow, setActiveDidYouKnow] = useState(null);
  const [heroFactIndex, setHeroFactIndex] = useState(0);
  const [showHeroFact, setShowHeroFact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const heroSlides = [
    {
      title: 'Your "I made it" era starts here.',
      subtitle: "Let's kickstart your best career decision moments…",
      image: heroImage1
    },
    {
      title: 'What if your next assignment... was for your favourite brand?',
      subtitle: 'They are looking for their next superstars, ready to get noticed by them?',
      image: heroImage2
    },
    {
      title: 'Picture abhi baaki hai, mere dost.',
      subtitle: 'Aur tumhara breakthrough bhi.',
      microcopy: 'Main character arc loading... 🎬',
      image: heroImage3
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Rotating "Did you know?" popups in hero
  useEffect(() => {
    const show = setTimeout(() => setShowHeroFact(true), 3500);
    const rotator = setInterval(() => {
      setShowHeroFact(false);
      setTimeout(() => {
        setHeroFactIndex((p) => (p + 1) % 6);
        setShowHeroFact(true);
      }, 600);
    }, 9000);
    return () => { clearTimeout(show); clearInterval(rotator); };
  }, []);

  const handleWallSubmit = (e) => {
    e.preventDefault();
    if (newSubmission.trim()) {
      setWallSubmissions([{ text: newSubmission, reactions: {} }, ...wallSubmissions]);
      setNewSubmission('');
      setShowSubmitMessage(true);
      setTimeout(() => setShowSubmitMessage(false), 3000);
    }
  };

  const handleReaction = (submissionIndex, reactionType) => {
    const updated = [...wallSubmissions];
    if (!updated[submissionIndex].reactions[reactionType]) {
      updated[submissionIndex].reactions[reactionType] = 0;
    }
    updated[submissionIndex].reactions[reactionType]++;
    setWallSubmissions(updated);
  };

  const opportunities = [
    {
      id: 1,
      title: 'Summer Marketing Intern',
      company: 'Coca-Cola',
      type: 'Internship',
      category: 'Marketing',
      duration: '3 months',
      points: '₹15k/month',
      description: 'Help us story-board the greatest hits for millennials. Tech work on an campaign but without the boring meetings.',
      tags: ['#BeCreative', 'Marketing', 'Consumer Insights'],
      deadline: '15 days left',
      color: 'orange'
    },
    {
      id: 2,
      title: 'Product Innovation Challenge',
      company: 'Google',
      type: 'Competition',
      category: 'Product',
      duration: 'Prize: ₹2.5 Lakh',
      points: '50 points',
      description: 'Got a "what if this" or "but what about?" idea that might change how people find stuff online? Pitch. 25 → 10 finalists.',
      tags: ['Research', 'Product', 'Innovation'],
      deadline: 'Most Recent',
      color: 'purple'
    },
    {
      id: 3,
      title: 'Social Media Intern',
      company: 'Zomato',
      type: 'Internship',
      category: 'Marketing',
      duration: '6 months',
      points: 'PPO Available',
      description: 'Want to create content hungry for a target? We need someone who can create engaging & viral food content that actually makes people download the app.',
      tags: ['#WittyContent', 'Social', 'Marketing'],
      deadline: '8 days left',
      color: 'orange'
    },
    {
      id: 4,
      title: 'Beauty Content Creator',
      company: 'Nykaa',
      type: 'Internship',
      category: 'Content',
      duration: '4 months',
      points: 'Flexible',
      description: 'Know your skincare from your makeup? Help us create content that actually helps (and sells!) beauty products online.',
      tags: ['Beauty', 'Content', 'Video editing'],
      deadline: '12 days left',
      color: 'orange'
    },
    {
      id: 5,
      title: 'Product Design Intern',
      company: 'Microsoft',
      type: 'Internship',
      category: 'Design',
      duration: '6 months',
      points: 'PPO Track',
      description: 'Help us make terrible less terrible (and beautiful) for product feedback functionality.',
      tags: ['UI/UX', 'Figma', 'Design Systems'],
      deadline: '20 days left',
      color: 'orange'
    },
    {
      id: 6,
      title: 'Sustainability Challenge',
      company: 'Unilever',
      type: 'Competition',
      category: 'Sustainability',
      duration: 'Prize: ₹3L',
      points: '100 points',
      description: 'Show us your most out of the world idea to make packaging sustainable. Literally. Win cash + internship if you are amazing.',
      tags: ['Sustainability', 'CSR', 'Impact'],
      deadline: '25 days left',
      color: 'purple'
    }
  ];

  const didYouKnows = [
    {
      id: 1,
      text: "73% of hiring managers say they can't find candidates with \"real-world problem-solving skills\" — despite millions of graduates every year. The gap isn't your degree. It's your exposure.",
      source: "LinkedIn Global Talent Trends"
    },
    {
      id: 2,
      text: "The average corporate employee spends 31 hours per month in meetings they consider unproductive. That's almost a full work week. Every. Single. Month.",
      tag: "WELCOME TO CORPORATE 🫡"
    },
    {
      id: 3,
      text: "In most big companies, the idea that gets implemented is rarely the smartest one. It's the one that had the best internal sponsor. Learning to \"sell\" your idea is a skill. A very real, very learnable skill.",
      tag: "THE CORPORATE GAME IS REAL"
    },
    {
      id: 4,
      text: "Many companies hire fresh graduates specifically for brand challenges because they want unconditioned thinking — perspectives that haven't been filtered by 10 years of corporate norms. Your \"inexperience\" is literally your competitive advantage right now.",
      tag: "TIMESTAMP THIS"
    },
    {
      id: 5,
      text: "The average resume gets 6–7 seconds of HR attention in the first pass. Six. Seconds. The real screening happens in the conversation after — which means how you talk about your work matters infinitely more than bullet points.",
      tag: "READ THAT AGAIN"
    },
    {
      id: 6,
      text: "Apple, Google, and several other Fortune 500 companies have officially removed degree requirements from many of their roles. The new currency? Demonstrated ability. Portfolio. Proof of work.",
      tag: "THE ERA HAS SHIFTED"
    }
  ];

  const categories = [
    {
      emoji: '📊',
      title: 'Marketing & Business Challenges',
      quote: '"Pooja… what is this (consumer) behaviour?"',
      tagline: 'Brand strategy, GTM, consumer research, corporate yapping — the real ones know.',
      route: '/marketing-business'
    },
    {
      emoji: '💡',
      title: 'Innovation Challenges',
      quote: '"For that one bro who thinks he can be the next Elon Musk after one cool idea."',
      tagline: "Okay but what if your idea is actually good? Here's your structured shot at proving it.",
      route: '/innovation'
    },
    {
      emoji: '💻',
      title: 'Tech & Hackathons',
      quote: '"Placement ke pehle thoda iconic bhi ban jao."',
      tagline: 'Build something that actually works, in 24-48 hours, on 3 hours of sleep and 2 cups of chai. The classic origin story.',
      route: '/tech-hackathons'
    },
    {
      emoji: '🌍',
      title: 'Sustainability',
      quote: '"Basically Earth\'s unpaid PR team."',
      tagline: 'Someone has to care. Might as well be the person who will eventually manage a brand that affects millions of people. Start now.',
      route: '/sustainability'
    },
    {
      emoji: '🎨',
      title: 'Creativity',
      quote: '"For our \'Can we make it pop more?\' trauma survivors."',
      tagline: "If you've ever redesigned a deck at 2AM and felt nothing — this is your therapy. Except it pays (or gets you hired).",
      route: '/creativity'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'REGISTER ✍️',
      quote: '"It all started with one harmless click."',
      description: 'Welcome to the first best decision of your career.',
      image: campusRegistration
    },
    {
      number: 2,
      title: 'PICK YOUR CHALLENGES 🎯',
      quote: 'See a brand brief.\nGet unnecessarily excited.\nPick the one that makes your brain go: "wait… this is actually cool."',
      didYouKnow: "💡 Most Fortune 500 companies hire more from campus challenges and competitions than from traditional campus recruitment. That resume you've been perfecting? It gets you in the room. What you DO gets you the offer.",
      image: registeredImage
    },
    {
      number: 3,
      title: 'WORK WORK WORK WORK 💀',
      quote: '"Rihanna warned us."',
      description: 'Start working on the brief…the real challenge begins from this step onwards',
      didYouKnow: '💡 McKinsey found that students who work on real business problems — not simulations — are 3x more likely to land their target roles. The work IS the credential.',
      image: null
    },
    {
      number: 4,
      title: 'SUBMISSIONS 🚨',
      quote: '"Submit the Final_FINAL_v27_REAL.pdf"',
      description: "The file is ready. It has been ready for 3 hours. You've opened it 11 times since then just to check. It's fine. Submit it. Let go. You did that.",
      image: null
    },
    {
      number: 5,
      title: 'WAITING FOR SHORTLISTS ⏳',
      quote: '"Aaj results aayenge. Refresh. Refresh. Refresh."',
      didYouKnow: '💡 Companies typically receive 200–500 submissions per challenge. Making it to shortlists puts you in the top 5–10% of applicants — which, fun fact, is a stat you can now actually put on your resume.',
      image: null
    },
    {
      number: 6,
      title: 'FINAL ROUND PREP 🎤',
      quote: '"Good morning respected jury…" final boss arc.',
      description: "You made it past the first filter. Now the actual game begins. Tighten your deck. Sharpen your narrative. Prepare for questions that will make you briefly forget your own name. You got it though.",
      image: groupDiscussion
    },
    {
      number: 7,
      title: 'GRAND FINALE PRESENTATIONS 🔥',
      quote: '"Absolute cinema."',
      description: 'Present in front of real company executives.',
      didYouKnow: '💡 Most students who present at brand-level competitions report it as the most confidence-defining experience of their college life — above any internship. Because nothing builds you like high stakes.',
      image: stagePresentation
    },
    {
      number: 8,
      title: 'WINNING CEREMONY + MAGAZINE FEATURE 🏆',
      quote: '"Be the campus celebrity overnight."',
      description: "Your name. In print. Literally. InGenuityX features winners in their editorial — the kind of thing your parents will screenshot and send to every WhatsApp group they're in. You've been warned.",
      image: winningMoment
    },
    {
      number: 9,
      title: 'DREAM COMPANY ARC 🚀',
      quote: '"If you are the chosen one."',
      image: certificateImage
    }
  ];

  const hrMistakes = [
    {
      percent: '97%',
      title: 'Indian introductions have had the same software update since 2009.',
      quote: '"Myself Rahul. I am passionate, hardworking and a quick learner…"',
      punchline: 'Bro this intro has more sequels than Fast & Furious.'
    },
    {
      percent: '84%',
      title: 'Indian resumes still running on Windows XP energy.',
      details: '"Microsoft Word ⭐⭐⭐⭐⭐"\n"PowerPoint ⭐⭐⭐⭐"\n"Canva ⭐⭐⭐⭐⭐"',
      punchline: 'Bhai Canva toh ab breathing skill category mein aata hai 😭'
    },
    {
      percent: '73%',
      title: "Mass applying everywhere like it's Big Billion Day sale.",
      details: 'LinkedIn. Naukri. Internshala. Cold mails. Carrier pigeons.\nJD says: "Looking for a backend developer."\nBro applying with Canva + "good communication skills"',
      punchline: ''
    },
    {
      percent: '91%',
      title: '"I\'m deeply passionate about your company."',
      details: 'Interviewer: "So what do we actually do?"\nCandidate:\n"Aree… innovation… technology… growth… ecosystem…"',
      punchline: 'Basically saying absolutely nothing with full confidence like a Bollywood politician speech. 💀'
    },
    {
      percent: '67%',
      title: "Students still using 'quick learner' like it's an Infinity Stone.",
      details: 'Bro the market moved to AI agents and automation.\nMeanwhile candidates:\n"Sir I can learn quickly if trained 🥺"\nChatGPT and Claude: "yeh toh hum ek prompt mein kar lenge"',
      punchline: ''
    },
    {
      percent: '88%',
      title: "In the resume the 'Wolf of the Wall Street' mode gets on.",
      details: '"I can do 120 sales calls/day."\n"Can generate 50 reel ideas daily."\n"Can onboard 40 clients monthly."\nReal interview:\nOne unexpected client call comes in and bro stares at the ringing phone thinking\n"Yeh mere saath prank ho raha hai kya?" 💀',
      punchline: ''
    }
  ];

  const confessions = [
    { text: '"Never challenged for real-world skills."', tags: ['ACADEMIC BUBBLE', 'CAMPUS REALITY CHECK'] },
    { text: '"My internship was mostly Canva & random calls."', tags: ['INTERNSHIP ERA', 'CORPORATE NPC ARC'] },
    { text: '"We have certificates. Not clarity."', tags: ['PLACEMENT PANIC', 'CREDENTIAL COLLECTOR'] },
    { text: '"Everyone says upskill. Nobody explains how."', tags: ['AI FEAR', 'LOST IN THE NOISE'] },
    { text: '"Our exposure feels outdated."', tags: ['SYLLABUS GAP', 'REAL WORLD VS COLLEGE'] },
    { text: '"Too qualified for internships. Too inexperienced for jobs."', tags: ['PLACEMENT PANIC', 'THE CRUEL PARADOX'] }
  ];

  const filters = ['All', 'Internships', 'Competitions', 'Projects', 'PPO', 'Remote', 'Paid', 'Tech', 'Marketing', 'Design', 'Business', 'Content'];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = activeFilter === 'All' || opp.type === activeFilter || opp.category === activeFilter || (activeFilter === 'PPO' && opp.points.includes('PPO'));
    const matchesSearch = searchQuery === '' ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white cursor-custom" data-testid="home-page">
      <style>{`
        .cursor-custom {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23FF5722" d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z"/></svg>') 12 12, auto;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideInUp 0.5s ease-out; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 87, 34, 0.5); }
          50% { box-shadow: 0 0 40px rgba(255, 87, 34, 0.8); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes rhino-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
        .rhino-float { animation: rhino-float 4s ease-in-out infinite; }
        @keyframes fact-in {
          from { opacity: 0; transform: translate(-50%, 12px) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .fact-in { animation: fact-in 0.5s ease-out both; }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative h-screen overflow-hidden" data-testid="hero-section">
        {/* Top-left InGenuityX Logo */}
        <div className="absolute top-5 left-5 md:top-7 md:left-9 z-30" data-testid="hero-logo">
          <img
            src={logoImage}
            alt="InGenuityX"
            className="h-12 md:h-16 w-auto object-contain bg-white/95 rounded-lg px-3 py-1 shadow-lg"
          />
        </div>

        {/* Top-right floating Rhino mascot */}
        <div className="absolute top-3 right-3 md:top-5 md:right-7 z-30 pointer-events-none" data-testid="hero-rhino">
          <img
            src={rhinoMascot}
            alt="InGenuityX Rhino"
            className="h-40 md:h-56 lg:h-64 w-auto object-contain rhino-float drop-shadow-2xl"
          />
        </div>

        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <ImageWithFallback
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />
            </div>
            <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
              <h1 className="text-5xl md:text-7xl mb-6 max-w-5xl font-bold animate-slide-in">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-3xl">{slide.subtitle}</p>
              {slide.microcopy && (
                <p className="text-sm text-gray-300 mb-8">{slide.microcopy}</p>
              )}
              <button
                data-testid="hero-cta-btn"
                onClick={() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-black px-8 py-4 rounded-full text-lg hover:bg-gray-200 transition-all hover:scale-105 pulse-glow"
              >
                Show me the opportunities →
              </button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              data-testid={`hero-dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Rotating "Did You Know?" popup in hero */}
        {showHeroFact && didYouKnows[heroFactIndex] && (
          <div
            data-testid="hero-fact-popup"
            className="fact-in absolute left-1/2 bottom-24 md:bottom-28 z-30 max-w-md w-[92%] md:w-auto bg-gray-900/90 backdrop-blur-md border border-orange-500/40 rounded-2xl p-4 md:p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1 text-left">
                <p className="text-[10px] uppercase tracking-[0.25em] text-orange-300 mb-1">Did you know?</p>
                <p className="text-sm md:text-base text-white leading-snug">{didYouKnows[heroFactIndex].text}</p>
                {didYouKnows[heroFactIndex].source && (
                  <p className="text-[10px] text-orange-300/80 mt-2">— {didYouKnows[heroFactIndex].source}</p>
                )}
                {didYouKnows[heroFactIndex].tag && (
                  <p className="text-[10px] text-orange-300/80 mt-2">{didYouKnows[heroFactIndex].tag}</p>
                )}
              </div>
              <button
                onClick={() => setShowHeroFact(false)}
                className="text-gray-400 hover:text-white text-sm leading-none"
                aria-label="dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </section>

      {/* OPPORTUNITIES BUFFET */}
      <section id="opportunities" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900 relative" data-testid="opportunities-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl mb-4 font-bold">Opportunities Buffet 🍕</h2>
            <p className="text-2xl text-gray-300 mb-2">Pick a brand. Cook respectfully.</p>
            <p className="text-lg text-gray-400 mb-8">Other amazing brands who want to work with you — like, actually want to.</p>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" />
                <input
                  data-testid="opportunity-search"
                  type="text"
                  placeholder="Search opportunities, brands, or roles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-full border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {filters.map(filter => (
                <button
                  key={filter}
                  data-testid={`filter-${filter.toLowerCase()}`}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    activeFilter === filter
                      ? 'bg-orange-600 border-orange-500 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Hm. That's not here yet. Try a different filter — or check back. New gigs drop weekly.</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                data-testid={`opportunity-card-${opp.id}`}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-orange-500 transition-all hover:scale-105 animate-slide-in group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs mb-2 ${
                      opp.type === 'Internship' ? 'bg-orange-900/50 text-orange-300' : 'bg-purple-900/50 text-purple-300'
                    }`}>
                      {opp.type}
                    </span>
                    <h3 className="text-xl mb-1 font-semibold group-hover:text-orange-500 transition-colors">{opp.title}</h3>
                    <p className="text-orange-500">{opp.company}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4">{opp.description}</p>

                <div className="flex gap-2 mb-4 text-sm">
                  <span className="text-gray-500">⏱️ {opp.duration}</span>
                  <span className="text-gray-500">📍 {opp.points}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{opp.deadline}</span>
                  <button
                    data-testid={`apply-btn-${opp.id}`}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                  >
                    Apply Now →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-3xl text-center mb-12 font-bold">5 THEMES — On a Platter For You 🫡</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.route}
                data-testid={`category-${index}`}
                className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all hover:scale-105 group block"
                onMouseEnter={() => setActiveDidYouKnow(index)}
                onMouseLeave={() => setActiveDidYouKnow(null)}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{category.emoji}</div>
                <h4 className="text-xl mb-2 font-semibold">{category.title}</h4>
                <p className="text-gray-300 italic mb-3">{category.quote}</p>
                <p className="text-sm text-gray-400">{category.tagline}</p>
              </Link>
            ))}
          </div>
        </div>

        {activeDidYouKnow !== null && didYouKnows[activeDidYouKnow] && (
          <div className="fixed bottom-8 right-8 max-w-md bg-orange-900 border-2 border-orange-500 rounded-xl p-6 shadow-2xl animate-slide-in z-50">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💡</span>
              <div className="flex-1">
                <h4 className="text-sm uppercase tracking-wide text-orange-300 mb-2">DID YOU KNOW?</h4>
                <p className="text-sm text-white mb-2">{didYouKnows[activeDidYouKnow].text}</p>
                {didYouKnows[activeDidYouKnow].source && (
                  <p className="text-xs text-orange-300">[{didYouKnows[activeDidYouKnow].source}]</p>
                )}
                {didYouKnows[activeDidYouKnow].tag && (
                  <p className="text-xs text-orange-300">[{didYouKnows[activeDidYouKnow].tag}]</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CAMPUS TO BOARDROOM */}
      <section className="py-20 px-4 bg-black" data-testid="campus-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 font-bold">Campus Se Boardroom Tak 🫡</h2>
            <p className="text-2xl text-gray-300">May the odds be ever in your favour. No, seriously.</p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="flex-1">
                  <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full mb-4 text-sm">
                    STEP {step.number}
                  </div>
                  <h3 className="text-3xl mb-4 font-bold">{step.title}</h3>
                  <p className="text-xl text-gray-300 mb-4 whitespace-pre-line italic">{step.quote}</p>
                  {step.description && (
                    <p className="text-gray-400 mb-4">{step.description}</p>
                  )}
                  {step.didYouKnow && (
                    <div className="bg-gray-900 border border-orange-700 p-4 rounded-xl hover:border-orange-500 transition-colors">
                      <p className="text-sm text-gray-300">{step.didYouKnow}</p>
                    </div>
                  )}
                </div>
                {step.image && (
                  <div className="flex-1">
                    <ImageWithFallback
                      src={step.image}
                      alt={step.title}
                      className="w-full rounded-2xl object-cover shadow-2xl hover:scale-105 transition-transform"
                      style={{ aspectRatio: '4/3' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HR INTERVIEW AURA GUIDE */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-red-950" data-testid="hr-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 font-bold">HR Interview Aura Guide 🫡</h2>
            <p className="text-2xl text-gray-300">Mistakes to avoid. Crimes against your own career. A PSA.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {hrMistakes.map((mistake, index) => (
              <div key={index} className="bg-gray-900 border border-red-900 p-8 rounded-2xl hover:border-red-500 transition-all hover:scale-105">
                <div className="text-5xl text-red-500 mb-4 font-bold">{mistake.percent}</div>
                <h4 className="text-xl mb-3 font-semibold">{mistake.title}</h4>
                {mistake.quote && (
                  <p className="text-gray-300 italic mb-3">{mistake.quote}</p>
                )}
                {mistake.details && (
                  <p className="text-sm text-gray-400 mb-3 whitespace-pre-line">{mistake.details}</p>
                )}
                {mistake.punchline && (
                  <p className="text-gray-300">{mistake.punchline}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT CONFESSIONS */}
      <section className="py-20 px-4 bg-black" data-testid="confessions-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4 font-bold">WE ASKED 130+ GEN-Z STUDENTS WHAT'S ACTUALLY GOING ON.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {confessions.map((confession, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-700 p-6 rounded-2xl hover:border-orange-500 transition-all hover:scale-105"
              >
                <p className="text-lg mb-4 italic">{confession.text}</p>
                <div className="flex flex-wrap gap-2">
                  {confession.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs bg-gray-800 px-3 py-1 rounded-full border border-gray-600 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE WALL */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900" data-testid="wall-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl mb-4 font-bold">The Wall 🧱</h2>
            <p className="text-2xl text-gray-300 mb-4">What's something students are silently struggling with?</p>
            <p className="text-gray-400">Placements? Burnout? Fake internships? AI fear? Toxic hustle culture? Spill everything. This is a judgment-free zone.</p>
          </div>

          <form onSubmit={handleWallSubmit} className="mb-12">
            <textarea
              data-testid="wall-textarea"
              value={newSubmission}
              onChange={(e) => setNewSubmission(e.target.value)}
              placeholder="Type anonymously…"
              className="w-full bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none min-h-32 mb-4 transition-colors"
            />
            <button
              data-testid="wall-submit-btn"
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-full text-lg transition-all hover:scale-105"
            >
              Drop Lore 🔥
            </button>
          </form>

          {showSubmitMessage && (
            <div className="bg-green-900 border border-green-700 p-4 rounded-xl mb-8 text-center animate-slide-in">
              <p className="text-lg">Damn. That was real.</p>
              <p className="text-gray-300">Added to the wall. You're not alone in this.</p>
            </div>
          )}

          <div className="text-center mb-8">
            <p className="text-gray-400 text-lg">{wallSubmissions.length} students have dropped their lore. The wall doesn't lie.</p>
          </div>

          <div className="space-y-4">
            {wallSubmissions.map((submission, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-orange-500 transition-colors">
                <p className="text-gray-200 mb-3">{submission.text}</p>
                <div className="flex gap-3 flex-wrap">
                  {['💀 too real', 'felt.', 'same bro', 'bro cooked'].map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => handleReaction(index, reaction)}
                      className="text-sm px-3 py-1 bg-gray-700 hover:bg-orange-600 rounded-full transition-all hover:scale-110 text-white"
                    >
                      {reaction}
                      {submission.reactions[reaction] ? ` (${submission.reactions[reaction]})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 bg-black border-t border-gray-800" data-testid="footer">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={logoImage}
              alt="InGenuityX Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={mascotImage}
              alt="InGenuityX Mascot"
              className="h-32 w-auto object-contain"
            />
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">Your "I made it" era starts here.</p>
            <p className="text-sm text-gray-500 mt-2">© 2026 InGenuityX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
