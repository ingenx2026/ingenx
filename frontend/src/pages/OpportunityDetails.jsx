import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logoImage from '../imports/ingenuityx-logo.svg';

// --- LOCAL LOGOS ---
import nuvocoLogo from '../imports/logo_nuvoco.jpg';
import srmbLogo from '../imports/srmb.jpg';
import ingenxLogo from '../imports/ingenx.png';       
import trootechLogo from '../imports/trootech.png';   
import colgateBg from '../imports/SmileBright.png'; 

// --- NEW POSTER UPLOADS ---
import legrandBg from '../imports/legrand.png';
import nuvocoGreenBg from '../imports/nuvoco (1).png';
import srmbShiftBg from '../imports/nuvoco.png'; 
import srmbGreenProBg from '../imports/srmb (1).png';
import srmbIroncladBg from '../imports/srmb.png';
import trootechPosterBg from '../imports/Trootech (2).png';
import ingenxPosterBg from '../imports/IngenX (2).png';
import evereadyBg from '../imports/eveready.png';

// --- ENVIRONMENT VARIABLE SETUP ---
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337';

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  
  // State for the company's custom questions
  const [customAnswers, setCustomAnswers] = useState({ answer1: '', answer2: '' });

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        // --- INJECT ALL DUMMY CHALLENGES ---
        const DUMMY_CHALLENGES = [
          {
            id: "dummy-eveready-1",
            title: "Keep It Lit",
            company: "Eveready",
            logoUrl: null,
            bgImage: evereadyBg,
            type: "Innovation Project",
            category: "Innovation",
            duration: "4 Weeks",
            points: "Internship + ₹50,000",
            description: "Reinvent portable lighting for rural and everyday India. Design a robust, affordable, and sustainable portable lighting solution that addresses the unique challenges of rural electrification and everyday utility.",
            eligibility: "Open to Product Design, Engineering, and Innovation students.",
            roundStructure: "Round 1: Concept & Sketches\nRound 2: CAD Model & Feasibility\nRound 3: Final Prototype Pitch",
            judgingCriteria: "Affordability, Durability, Sustainability, User-Centric Design",
            submissionFormat: "A 10-slide pitch deck including design renders and cost estimates.",
            registrationDeadline: "Oct 30, 2026",
            shortlistDate: "Nov 15, 2026",
            finaleDate: "Nov 30, 2026",
            teamSize: "2-4 Members",
            mode: "Hybrid",
            companyBio: "Eveready is a pioneer in portable energy and lighting solutions in India.",
            question1: "What is the biggest flaw in current rural lighting solutions?",
            question2: "How does your design incorporate sustainable or renewable elements?",
            tags: ["#Innovation", "Product Design", "Sustainability"]
          },
          {
            id: "dummy-trootech-1",
            title: "TrooTech 2030: The Identity Problem",
            company: "TrooTech Business Solutions",
            logoUrl: trootechLogo,
            bgImage: trootechPosterBg,
            type: "Innovation Challenge",
            category: "Innovation",
            duration: "5 Weeks",
            points: "Pre-Placement Interview",
            description: "TrooTech is a 350+ person AI company with an ambitious 2030 vision. The problem? Their brand story needs an identity shift. Innovate, collaborate, and change the game in this challenge built for the next generation of thinkers. Ideas today. Impact tomorrow.",
            eligibility: "Open to students with a flair for business strategy, tech innovation, or branding.",
            roundStructure: "Round 1: Initial Identity Pitch\nRound 2: Strategic Roadmap\nRound 3: Final Presentation",
            judgingCriteria: "Strategic Vision, Creativity, Feasibility, Brand Alignment",
            submissionFormat: "A comprehensive 5-8 slide strategy deck.",
            registrationDeadline: "Oct 28, 2026",
            shortlistDate: "Nov 12, 2026",
            finaleDate: "Nov 28, 2026",
            teamSize: "1-4 Members",
            mode: "Remote",
            companyBio: "TrooTech Business Solutions is a forward-thinking AI and enterprise tech company.",
            question1: "How would you redefine an enterprise AI brand for 2030?",
            question2: "What is the biggest mistake tech companies make with their brand identity?",
            tags: ["#Innovation", "Brand Identity", "AI"]
          },
          {
            id: "dummy-ingenuityx-1",
            title: "Market InGenuityX. Seriously.",
            company: "InGenuityX",
            logoUrl: ingenxLogo,
            bgImage: ingenxPosterBg,
            type: "Competition",
            category: "Marketing",
            duration: "3 Weeks",
            points: "PPO Available",
            description: "We connect India's sharpest Gen-Z students with real brand challenges. But here's the thing — we need YOUR help to market us. A marketing challenge for the bold and the brilliant. Pitch the ultimate growth and brand strategy for InGenuityX itself.",
            eligibility: "Open to all students.",
            roundStructure: "Round 1: Marketing Strategy Deck\nRound 2: Live Pitch",
            judgingCriteria: "Viral Potential, Growth Metrics, Audience Understanding",
            submissionFormat: "A 5-slide PDF outlining a killer marketing campaign.",
            registrationDeadline: "Oct 25, 2026",
            shortlistDate: "Nov 05, 2026",
            finaleDate: "Nov 15, 2026",
            teamSize: "1-3 Members",
            mode: "Remote",
            companyBio: "InGenuityX bridges the gap between Gen-Z talent and real-world brand briefs.",
            question1: "What is the most effective way to market a platform to college students?",
            question2: "Draft a 140-character viral tweet for InGenuityX.",
            tags: ["#Marketing", "Growth Strategy", "B2C"]
          },
          {
            id: "dummy-legrand-1",
            title: "Power Protocol",
            company: "Legrand",
            logoUrl: null,
            bgImage: legrandBg,
            type: "Tech Hackathon",
            category: "Tech & Code",
            duration: "3 Weeks",
            points: "₹1,00,000 + Tech Setup",
            description: "AI Ready Data Centre Power Challenge. Design the next generation of intelligent, energy-efficient power distribution systems capable of sustaining high-density AI data centers.",
            eligibility: "Open to Engineering and Tech students.",
            roundStructure: "Round 1: Architecture Pitch\nRound 2: Technical Deep Dive\nRound 3: Final Presentation",
            judgingCriteria: "Innovation, Energy Efficiency, Scalability, Technical Feasibility",
            submissionFormat: "A detailed technical architecture deck (max 10 slides).",
            registrationDeadline: "Oct 20, 2026",
            shortlistDate: "Nov 05, 2026",
            finaleDate: "Nov 25, 2026",
            teamSize: "2-4 Members",
            mode: "Hybrid",
            companyBio: "Legrand is a global specialist in electrical and digital building infrastructures.",
            question1: "What is the biggest power constraint in modern AI data centers?",
            question2: "Briefly describe your approach to dynamic load balancing.",
            tags: ["#Tech", "#AI", "Data Centers", "Hardware"]
          },
          {
            id: "dummy-nuvoco-1",
            title: "Grey 2 Green",
            company: "Nuvoco",
            logoUrl: nuvocoLogo,
            bgImage: nuvocoGreenBg,
            type: "Sustainability Project",
            category: "Sustainability",
            duration: "4 Weeks",
            points: "PPI + ₹50,000",
            description: "Green Cement and Decarbonisation Systems. Develop innovative strategies to drastically reduce the carbon footprint in cement manufacturing and supply chains.",
            eligibility: "Open to all students.",
            roundStructure: "Round 1: Idea Pitch\nRound 2: Detailed Business/Tech Model\nRound 3: Executive Pitch",
            judgingCriteria: "Environmental Impact, Commercial Viability, Innovation",
            submissionFormat: "A 5-slide deck detailing your decarbonization strategy.",
            registrationDeadline: "Oct 18, 2026",
            shortlistDate: "Nov 02, 2026",
            finaleDate: "Nov 15, 2026",
            teamSize: "1-3 Members",
            mode: "Remote",
            companyBio: "Nuvoco Vistas Corp. Ltd. is a leading building materials company driving sustainable construction.",
            question1: "Why is the cement industry so difficult to decarbonize?",
            question2: "What is your primary proposed solution?",
            tags: ["#Sustainability", "Green Tech", "Decarbonization"]
          },
          {
            id: "dummy-srmb-1",
            title: "Solid Shift Challenge",
            company: "SRMB",
            logoUrl: srmbLogo,
            bgImage: srmbShiftBg,
            type: "Innovation Challenge",
            category: "Innovation Challenges",
            duration: "5 Weeks",
            points: "₹75,000 Pool",
            description: "Reimagine Advanced Materials and Smart Concrete. Pitch a revolutionary approach to building materials that adapt to environmental stress and increase longevity.",
            eligibility: "Open to Engineering, Architecture, and Design students.",
            roundStructure: "Round 1: Concept Submission\nRound 2: Prototype/Simulation Design\nRound 3: Finale",
            judgingCriteria: "Material Innovation, Structural Integrity, Market Potential",
            submissionFormat: "Technical report or simulation model link.",
            registrationDeadline: "Oct 25, 2026",
            shortlistDate: "Nov 10, 2026",
            finaleDate: "Nov 30, 2026",
            teamSize: "2-4 Members",
            mode: "Hybrid",
            companyBio: "SRMB Srijan Private Limited is a pioneer in the TMT bar industry.",
            question1: "What defines a 'smart' material in construction?",
            question2: "How does your idea improve structural lifespan?",
            tags: ["#Innovation", "Smart Materials", "Engineering"]
          },
          {
            id: "dummy-srmb-2",
            title: "Sustainable Green Pro",
            company: "SRMB",
            logoUrl: srmbLogo,
            bgImage: srmbGreenProBg,
            type: "Sustainability Project",
            category: "Sustainability",
            duration: "3 Weeks",
            points: "PPO + ₹25,000",
            description: "Building a Greener Tomorrow. Stronger Together. Propose actionable, closed-loop recycling processes for steel manufacturing to eliminate industrial waste.",
            eligibility: "Open to all students.",
            roundStructure: "Round 1: Abstract Submission\nRound 2: Mentorship & Refinement\nRound 3: Jury Pitch",
            judgingCriteria: "Sustainability Metric, Feasibility, Cost-Effectiveness",
            submissionFormat: "A comprehensive PDF report.",
            registrationDeadline: "Oct 12, 2026",
            shortlistDate: "Oct 28, 2026",
            finaleDate: "Nov 10, 2026",
            teamSize: "1-4 Members",
            mode: "Remote",
            companyBio: "SRMB is committed to sustainable and green manufacturing practices.",
            question1: "How can steel plants minimize water/energy waste?",
            question2: "",
            tags: ["#Sustainability", "Green Pro", "Recycling"]
          },
          {
            id: "dummy-srmb-3",
            title: "Ironclad Challenge",
            company: "SRMB",
            logoUrl: srmbLogo,
            bgImage: srmbIroncladBg,
            type: "Marketing Campaign",
            category: "Marketing & Business",
            duration: "4 Weeks",
            points: "Internship + ₹40,000",
            description: "Design a robust go-to-market and brand positioning strategy to solidify SRMB as the undeniable leader in resilient construction materials for Gen-Z homeowners and modern builders.",
            eligibility: "Open to Business and Marketing students.",
            roundStructure: "Round 1: Marketing Deck\nRound 2: Campaign Pitch",
            judgingCriteria: "Creativity, Brand Voice Alignment, Reach Potential",
            submissionFormat: "A 10-slide campaign strategy deck.",
            registrationDeadline: "Oct 22, 2026",
            shortlistDate: "Nov 05, 2026",
            finaleDate: "Nov 22, 2026",
            teamSize: "1-3 Members",
            mode: "On-Campus Finale",
            companyBio: "SRMB is a premium TMT bar brand synonymous with strength and reliability.",
            question1: "How do you market steel to a digital-first generation?",
            question2: "",
            tags: ["#Marketing", "Brand Strategy", "B2C"]
          },
          {
            id: "dummy-illustrative-123",
            title: "Next-Gen Smile Challenge",
            company: "NovaCare (Illustrative)",
            logoUrl: null, 
            bgImage: colgateBg, 
            type: "Marketing Campaign",
            category: "Marketing",
            duration: "4 Weeks",
            points: "PPO + ₹50,000",
            description: "Oral care is seen as a chore. NovaCare wants to make it a lifestyle. Gen-Z is getting swayed by aesthetic DTC brands—your job is to make the OG brand iconic again.",
            eligibility: "Open to all undergraduate and postgraduate students.\nCross-specialization teams are highly encouraged.",
            roundStructure: "Round 1: The Elevator Pitch (1-page PDF or 60s Video)\nRound 2: The Strategy Deck (Detailed Go-to-Market Plan)\nRound 3: The Boardroom",
            judgingCriteria: "1. Creativity & Originality\n2. Feasibility\n3. Brand Alignment\n4. Viral Potential",
            submissionFormat: "A single 3-slide PDF deck outlining your core idea, the target audience, and the execution strategy. Keep it punchy.",
            registrationDeadline: "Oct 15, 2026",
            shortlistDate: "Nov 01, 2026",
            finaleDate: "Nov 20, 2026",
            teamSize: "1-4 Members",
            mode: "Hybrid",
            companyBio: "NovaCare is a global consumer products company focused on Oral Care, Personal Care, and Home Care.",
            question1: "In one sentence, why do you think traditional toothpaste marketing fails with Gen-Z?",
            question2: "What is the most creative marketing campaign you've seen recently, and why did it work?",
            tags: ["#Marketing", "Marketing Campaign", "DTC"]
          }
        ];

        // Bypass Strapi if it's one of our hardcoded dummies
        const foundDummy = DUMMY_CHALLENGES.find(c => c.id === id);
        if (foundDummy) {
          setChallenge(foundDummy);
          setIsLoading(false);
          return;
        }

        // Otherwise fetch from Strapi
        const response = await axios.get(`${API_URL}/api/challenges/${id}`);
        const attr = response.data.data.attributes || response.data.data;
        
        // --- LOGO MAPPING LOGIC ---
        const compNameLower = (attr.company || '').toLowerCase();
        let logoUrl = attr.logoUrl;
        if (!logoUrl) {
          if (compNameLower.includes('nuvoco')) logoUrl = nuvocoLogo;
          else if (compNameLower.includes('srmb')) logoUrl = srmbLogo;
          else if (compNameLower.includes('ingenx') || compNameLower.includes('ingenuityx')) logoUrl = ingenxLogo;
          else if (compNameLower.includes('trootech')) logoUrl = trootechLogo;
          else logoUrl = null;
        }

        // --- SAFE STRAPI BLOCKS TEXT PARSER ---
        const parseStrapiText = (field) => {
          if (!field) return null;
          if (Array.isArray(field)) {
            return field.map(block => block.children ? block.children.map(child => child.text).join('') : '').join('\n');
          }
          return field; // Return as-is if it's just a standard string
        };

        setChallenge({ 
          id: response.data.data.documentId || response.data.data.id, 
          ...attr, 
          logoUrl,
          description: parseStrapiText(attr.description),
          eligibility: parseStrapiText(attr.eligibility) || 'Open to all students',
          roundStructure: parseStrapiText(attr.roundStructure),
          judgingCriteria: parseStrapiText(attr.judgingCriteria),
          submissionFormat: parseStrapiText(attr.submissionFormat),
          registrationDeadline: attr.registrationDeadline,
          shortlistDate: attr.shortlistDate,
          finaleDate: attr.finaleDate,
          teamSize: attr.teamSize,
          mode: attr.mode,
          companyBio: attr.companyBio,
          question1: attr.question1,
          question2: attr.question2,
          tags: attr.tags || []
        });

      } catch (err) {
        console.error("Error fetching challenge:", err);
        setErrorMsg("Could not find this challenge. It may have been removed.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

  const handleAnswerChange = (e) => {
    setCustomAnswers({ ...customAnswers, [e.target.name]: e.target.value });
  };

  const handleApply = async (e) => {
    if (e) e.preventDefault(); 
    
    const jwt = localStorage.getItem('jwt');
    const userStr = localStorage.getItem('user');

    if (!jwt || !userStr) {
      setShowLoginModal(true); 
      return;
    }

    const userObj = JSON.parse(userStr);
    setIsApplying(true);
    setErrorMsg('');

    try {
      // If applying to the dummy challenge, just simulate a successful save
      if (challenge.id.startsWith("dummy-")) {
        setTimeout(() => {
          setApplySuccess(true);
          setIsApplying(false);
        }, 1500);
        return;
      }

      await axios.post(`${API_URL}/api/registrations`, {
        data: {
          user: userObj.documentId || userObj.id,
          challenge: challenge.documentId || challenge.id, 
          answer1: customAnswers.answer1,
          answer2: customAnswers.answer2,
          fullName: userObj.name || userObj.fullName || userObj.username || 'Anonymous Student',
          email: userObj.email || '',
          phone: userObj.phone || userObj.phoneNumber || ''
        }
      }, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      setApplySuccess(true);
    } catch (err) { 
      console.error("Apply Error:", err);
      setErrorMsg("Failed to apply. You might have already applied to this challenge!");
    } finally {
      setIsApplying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  // Helper for Days Remaining
  const getDaysRemaining = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadlineDate = new Date(deadlineStr);
    if (isNaN(deadlineDate.getTime())) {
      return { raw: true, text: deadlineStr };
    }
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { raw: false, days: diffDays };
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#FAFCFC] flex flex-col items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        * { font-family: 'Outfit', sans-serif; }
      `}</style>
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E92A39] rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-bold tracking-widest uppercase text-gray-400">Loading Brief...</p>
    </div>
  );
  
  if (!challenge) return (
    <div className="min-h-screen bg-[#FAFCFC] text-[#111] font-bold flex items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        * { font-family: 'Outfit', sans-serif; }
      `}</style>
      {errorMsg}
    </div>
  );

  const hasQuestions = challenge.question1 || challenge.question2;
  const daysInfo = getDaysRemaining(challenge.deadline);
  const tagsToRender = challenge.tags?.length ? challenge.tags : [challenge.category, challenge.type].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFCFC] text-[#111] pt-10 px-6 pb-24 font-sans selection:bg-[#E92A39] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        @keyframes fadeInGlobal { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-global { animation: fadeInGlobal 0.5s ease-out forwards; }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideInUp 0.5s ease-out; }
      `}</style>

      {/* NAVBAR */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <Link to="/"><img src={logoImage} alt="InGenuityX" className="h-16 md:h-20 -my-4 md:-my-5 w-auto object-contain hover:scale-105 transition-transform duration-300" /></Link>
        <Link to="/" className="text-gray-500 hover:text-[#E92A39] text-xs transition-colors font-extrabold tracking-widest uppercase flex items-center gap-2">
          <span>←</span> Back to Vault
        </Link>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="max-w-6xl mx-auto animate-fade-in-global">
        {applySuccess ? (
          <div className="bg-white border border-gray-200 p-8 md:p-16 rounded-[3rem] shadow-xl text-center py-16 animate-slide-in max-w-3xl mx-auto">
            <div className="text-7xl mb-8 drop-shadow-md">🎯</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[#111]">Application Secured.</h2>
            <p className="text-gray-600 mb-10 max-w-md mx-auto font-medium leading-relaxed">
              Your profile, arsenal, and answers have been securely vaulted and sent to <b className="text-black">{challenge.company}</b>. Keep an eye on your email.
            </p>
            <Link to="/" className="inline-block bg-[#E92A39] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-[#ff3b4b] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              Find More Challenges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            
            {/* LEFT COLUMN: THE BRIEF */}
            <div className="bg-white border border-gray-200 p-8 md:p-12 rounded-[3rem] shadow-sm">
              
              {/* HEADER SECTION WITH LOGO */}
              <div className="mb-10 border-b border-gray-100 pb-10 flex flex-col md:flex-row gap-6 md:items-center">
                <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-3xl font-black text-[#E92A39] shadow-sm shrink-0 overflow-hidden">
                  {challenge.logoUrl ? (
                    <img src={challenge.logoUrl} alt={challenge.company} className="w-full h-full object-contain scale-[1.15]" />
                  ) : (
                    challenge.company.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <span className="bg-[#E92A39]/10 text-[#E92A39] px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4 inline-block">
                    {challenge.type}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-[#111] leading-tight">{challenge.title}</h1>
                  <p className="text-xl font-bold text-[#111]">
                    {challenge.company}
                    <span className="block md:inline mt-1 md:mt-0 md:ml-3 text-xs text-[#2E73E6] uppercase tracking-widest">✓ Verified Brief</span>
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                {/* THE BRIEF */}
                <div>
                  <h3 className="text-xs text-gray-400 uppercase tracking-widest font-extrabold mb-4">The Brief</h3>
                  <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100 font-medium">
                    {challenge.description}
                  </p>
                </div>

                {/* ELIGIBILITY */}
                {challenge.eligibility && (
                  <div>
                    <h3 className="text-xs text-gray-400 uppercase tracking-widest font-extrabold mb-4">Eligibility</h3>
                    <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100 font-medium">
                      {challenge.eligibility}
                    </p>
                  </div>
                )}

                {/* ROUND STRUCTURE */}
                {challenge.roundStructure && (
                  <div>
                    <h3 className="text-xs text-gray-400 uppercase tracking-widest font-extrabold mb-4">Round Structure</h3>
                    <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100 font-medium">
                      {challenge.roundStructure}
                    </p>
                  </div>
                )}

                {/* JUDGING CRITERIA */}
                {challenge.judgingCriteria && (
                  <div>
                    <h3 className="text-xs text-gray-400 uppercase tracking-widest font-extrabold mb-4">How You'll Be Judged</h3>
                    <div className="text-[15px] text-gray-700 leading-relaxed bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100 font-medium">
                      {challenge.judgingCriteria.includes('\n') ? (
                        <ol className="list-decimal pl-5 space-y-2">
                          {challenge.judgingCriteria.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}
                        </ol>
                      ) : (
                        <p>{challenge.judgingCriteria}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* SUBMISSION FORMAT */}
                {challenge.submissionFormat && (
                  <div>
                    <h3 className="text-xs text-gray-400 uppercase tracking-widest font-extrabold mb-4">What to Submit</h3>
                    <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100 font-medium">
                      {challenge.submissionFormat}
                    </p>
                  </div>
                )}

                {/* KEY DATES */}
                {(challenge.registrationDeadline || challenge.shortlistDate || challenge.finaleDate) && (
                  <div>
                    <h3 className="text-xs text-gray-400 uppercase tracking-widest font-extrabold mb-4">Key Dates</h3>
                    <ul className="space-y-3 bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100">
                      {challenge.registrationDeadline && (
                        <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500 font-bold text-sm mb-1 sm:mb-0">Registration closes</span>
                          <span className="font-black text-[#111] text-sm">{challenge.registrationDeadline}</span>
                        </li>
                      )}
                      {challenge.shortlistDate && (
                        <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500 font-bold text-sm mb-1 sm:mb-0">Shortlist announced</span>
                          <span className="font-black text-[#111] text-sm">{challenge.shortlistDate}</span>
                        </li>
                      )}
                      {challenge.finaleDate && (
                        <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500 font-bold text-sm mb-1 sm:mb-0">Grand Finale</span>
                          <span className="font-black text-[#111] text-sm">{challenge.finaleDate}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* SKILLS & TAGS */}
                {tagsToRender.length > 0 && (
                  <div>
                    <h3 className="text-xs text-gray-400 uppercase tracking-widest font-extrabold mb-4">Skills & Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tagsToRender.map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 rounded-full px-4 py-1.5 text-xs font-bold border border-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* COMPANY QUESTIONS FORM */}
              <form id="apply-form" onSubmit={handleApply} className="space-y-8 border-t border-gray-100 pt-10 mt-10">
                {challenge.question1 && (
                  <div className="animate-fade-in relative">
                    <label className="block font-extrabold text-[11px] text-[#E92A39] uppercase tracking-widest mb-3">Company Question 1</label>
                    <p className="text-[#111] mb-4 font-bold text-sm">{challenge.question1}</p>
                    <textarea 
                      disabled
                      name="answer1" 
                      maxLength={500}
                      value={customAnswers.answer1} 
                      onChange={handleAnswerChange} 
                      className="w-full bg-gray-100 text-gray-400 font-medium border border-gray-200 py-4 px-5 pb-8 rounded-[2rem] focus:outline-none transition-all min-h-[140px] resize-none cursor-not-allowed shadow-sm" 
                      placeholder="Registrations open 27th July..."
                    />
                    <div className="absolute bottom-4 right-5 text-[10px] text-gray-400 font-bold">
                      0/500
                    </div>
                  </div>
                )}

                {challenge.question2 && (
                  <div className="animate-fade-in mt-6 relative">
                    <label className="block font-extrabold text-[11px] text-[#E92A39] uppercase tracking-widest mb-3">Company Question 2</label>
                    <p className="text-[#111] mb-4 font-bold text-sm">{challenge.question2}</p>
                    <textarea 
                      disabled
                      name="answer2" 
                      maxLength={500}
                      value={customAnswers.answer2} 
                      onChange={handleAnswerChange} 
                      className="w-full bg-gray-100 text-gray-400 font-medium border border-gray-200 py-4 px-5 pb-8 rounded-[2rem] focus:outline-none transition-all min-h-[140px] resize-none cursor-not-allowed shadow-sm"
                      placeholder="Registrations open 27th July..." 
                    />
                    <div className="absolute bottom-4 right-5 text-[10px] text-gray-400 font-bold">
                      0/500
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* RIGHT COLUMN: STICKY SIDEBAR */}
            <aside className="sticky top-24 space-y-6">
              
              {/* COMPANY CARD */}
              <div className="bg-white rounded-[2rem] border border-gray-200 p-6 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-xl font-black text-[#E92A39] shrink-0 overflow-hidden">
                  {challenge.logoUrl ? (
                    <img src={challenge.logoUrl} alt={challenge.company} className="w-full h-full object-contain scale-[1.15]" />
                  ) : (
                    challenge.company.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#111]">{challenge.company}</h3>
                  <p className="text-xs text-[#2E73E6] font-bold mt-0.5 tracking-wide">✓ VERIFIED BRIEF</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed px-2">
                {challenge.companyBio || `Running a live ${challenge.category} challenge for student innovators.`}
              </p>

              {/* STATS PILLS */}
              <div className="bg-white rounded-[2rem] border border-gray-200 p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Prize / Perks</span>
                  <span className="font-black text-[#111] text-sm text-right">{challenge.points}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Duration</span>
                  <span className="font-black text-[#111] text-sm text-right">{challenge.duration}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Team Size</span>
                  <span className="font-black text-[#111] text-sm text-right">{challenge.teamSize || "1–4 members"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Mode</span>
                  <span className="font-black text-[#111] text-sm text-right">{challenge.mode || "Remote"}</span>
                </div>
              </div>

              {/* DAYS REMAINING */}
              {daysInfo && (
                <div className="bg-white rounded-[2rem] border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Time Remaining</span>
                  {daysInfo.raw ? (
                    <span className="font-black text-[#111] text-lg">⏰ {daysInfo.text}</span>
                  ) : daysInfo.days > 0 ? (
                    <span className="font-black text-[#E92A39] text-3xl tracking-tighter">{daysInfo.days} <span className="text-sm tracking-normal">days left</span></span>
                  ) : (
                    <span className="font-black text-gray-400 text-lg">Applications closed</span>
                  )}
                </div>
              )}

              {/* PPO PATHWAY BANNER */}
              {challenge.points?.includes('PPO') && (
                <div className="bg-[#E92A39]/10 border border-[#E92A39]/20 rounded-[1.5rem] p-5 text-center">
                  <p className="font-black text-[#E92A39] text-sm uppercase tracking-widest mb-2">PPO Pathway</p>
                  <p className="text-xs text-[#E92A39]/80 font-bold leading-relaxed">This challenge includes a pre-placement offer pathway for shortlisted finalists.</p>
                </div>
              )}

              {/* CTA BLOCK */}
              <div className="pt-2">
                {errorMsg && <p className="text-[#E92A39] bg-[#E92A39]/10 p-3 rounded-xl text-xs font-bold text-center mb-4">{errorMsg}</p>}

                {challenge.deadline && (
                  <p className="text-[#E92A39] text-xs font-black uppercase tracking-widest text-center mb-3">
                    ⏰ Applications close {challenge.deadline}
                  </p>
                )}

                <button 
                  disabled
                  className="w-full bg-gray-300 text-gray-700 py-5 rounded-full font-extrabold uppercase tracking-widest text-sm transition-all duration-300 cursor-not-allowed mb-4 shadow-sm"
                >
                  ⏳ Registrations Open 27th July
                </button>
                
                <p className="text-center text-gray-500 font-bold text-[11px] mb-6">
                  Joining 130+ students across InGenuityX challenges
                </p>

                <button 
                  onClick={handleShare}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-[#111] py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {showCopyToast ? "Link Copied! ✓" : "Share Challenge 🔗"}
                </button>
              </div>

            </aside>
          </div>
        )}
      </main>
      
      {/* CUSTOM LOGIN REQUIRED MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#FAFCFC]/90 backdrop-blur-sm px-4">
          <div className="bg-white border border-gray-200 p-8 md:p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-slide-in">
            <span className="text-5xl mb-4 block drop-shadow-sm">🔒</span>
            <h3 className="text-2xl font-extrabold mb-2 text-[#111] tracking-tight">Hold up.</h3>
            <p className="text-gray-600 mb-8 text-sm font-medium leading-relaxed">
              You need to log in to your vault to share your profile and apply for this challenge.
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#E92A39] hover:bg-[#ff3b4b] text-white px-4 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-4 rounded-full font-bold transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}