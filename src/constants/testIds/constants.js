import heroImage2 from '../imports/image-4.png';
import heroImage3 from '../imports/image-5.png';
import registeredImage from '../imports/image-1.png';
import groupDiscussion from '../imports/image-3.png';
import billboardImage from '../imports/Gemini_Generated_Image_1l2vfz1l2vfz1l2v.png';
import evereadyBg from '../imports/eveready.png';
import trootechPosterBg from '../imports/Trootech (2).png';
import ingenxPosterBg from '../imports/IngenX (2).png';
import legrandBg from '../imports/legrand.png';
import nuvocoGreenBg from '../imports/nuvoco (1).png';
import srmbShiftBg from '../imports/nuvoco.png'; 
import srmbGreenProBg from '../imports/srmb (1).png';
import srmbIroncladBg from '../imports/srmb.png';
import colgateBg from '../imports/SmileBright.png';
import trootechLogo from '../imports/trootech.png';
import ingenxLogo from '../imports/ingenx.png';
import nuvocoLogo from '../imports/logo_nuvoco.jpg';
import srmbLogo from '../imports/srmb.jpg';

export const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337';
export const PLACEHOLDER_BG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

export const heroSlides = [
  { isCustom: true, image: billboardImage },
  { title: 'Your "I made it" era starts here.', subtitle: "Let's kickstart your best career decision moments…", image: heroImage2 },
  { title: 'What if your next assignment... was for your favourite brand?', subtitle: 'They are looking for their next superstars, ready to get noticed by them?', image: heroImage3 },
  { title: 'Confined by boundaries? Not me ', subtitle: 'Aur tumhara breakthrough bhi.', microcopy: 'Main character arc loading... 🎬', image: heroImage2 }
];

export const didYouKnows = [
  { text: "The average resume gets 6-7 seconds of HR attention in the first pass. Six. Seconds. The real screening happens in the conversation after — which means how you talk about your work matters infinitely more than bullet points.", tag: "READ THAT AGAIN" },
  { text: "73% of hiring managers say they can't find candidates with \"real-world problem-solving skills\" — despite millions of graduates every year. The gap isn't your degree. It's your exposure.", source: "LinkedIn Global Talent Trends" },
  { text: "In most big companies, the idea that gets implemented is rarely the smartest one. It's the one that had the best internal sponsor. Learning to \"sell\" your idea is a skill.", tag: "THE CORPORATE GAME IS REAL" },
  { text: "Many companies hire fresh graduates specifically for brand challenges because they want unconditioned thinking — perspectives that haven't been filtered by 10 years of corporate norms.", tag: "TIMESTAMP THIS" }
];

export const categories = [
  { title: 'Marketing & Business', quote: '"Pooja… what is this (consumer) behaviour?"', tagline: 'Brand strategy, GTM, consumer research, corporate yapping — the real ones know.', route: '/marketing-business', colors: 'bg-[#2E73E6] text-white', quoteColor: 'text-white/90', taglineColor: 'text-white/90' },
  {  title: 'Innovation Challenges', quote: '"For that one bro who thinks he can be the next Elon Musk after one cool idea."', tagline: "Okay but what if your idea is actually good? Here's your structured shot at proving it.", route: '/innovation', colors: 'bg-[#E92A39] text-white', quoteColor: 'text-white/90', taglineColor: 'text-white/90' },
  { title: 'Tech & Hackathons', quote: '"Placement ke pehle thoda iconic bhi ban jao."', tagline: 'Build something that actually works, in 24-48 hours, on 3 hours of sleep and 2 cups of chai. The classic origin story.', route: '/tech-hackathons', colors: 'bg-[#FDE25D] text-[#111]', quoteColor: 'text-[#111]/90', taglineColor: 'text-[#111]/90' },
  {  title: 'Sustainability', quote: '"Basically Earth\'s unpaid PR team."', tagline: 'Someone has to care. Might as well be the person who will eventually manage a brand that affects millions of people. Start now.', route: '/sustainability', colors: 'bg-[#3BA8E7] text-white', quoteColor: 'text-white/90', taglineColor: 'text-white/90' },
  {  title: 'Creativity', quote: '"For our \'Can we make it pop more?\' trauma survivors."', tagline: "If you've ever redesigned a deck at 2AM and felt nothing — this is your therapy. Except it pays (or gets you hired).", route: '/creativity', colors: 'bg-[#FB607E] text-white', quoteColor: 'text-white/90', taglineColor: 'text-white/90' }
];

export const hrMistakes = [
  { percent: '97%', title: 'Indian introductions have had the same software update since 2009.', quote: '"Myself Rahul. I am passionate, hardworking and a quick learner…"', punchline: 'Bro this intro has more sequels than Fast & Furious.' },
  { percent: '84%', title: 'Indian resumes still running on Windows XP energy.', details: '"Microsoft Word ⭐⭐⭐⭐⭐"\n"PowerPoint ⭐⭐⭐⭐"\n"Canva ⭐⭐⭐⭐⭐"', punchline: 'Bhai Canva toh ab breathing skill category mein aata hai 😭' },
  { percent: '73%', title: "Mass applying everywhere like it's Big Billion Day sale.", details: 'LinkedIn. Naukri. Internshala. Cold mails. Carrier pigeons.\nJD says: "Looking for a backend developer."\nBro applying with Canva + "good communication skills"', punchline: '' }
];

export const confessions = [
  { text: '"Never challenged for real-world skills."', tags: ['ACADEMIC BUBBLE', 'CAMPUS REALITY CHECK'] },
  { text: '"My internship was mostly Canva & random calls."', tags: ['INTERNSHIP ERA', 'CORPORATE NPC ARC'] },
  { text: '"We have certificates. Not clarity."', tags: ['PLACEMENT PANIC', 'CREDENTIAL COLLECTOR'] },
  { text: '"Everyone says upskill. Nobody explains how."', tags: ['AI FEAR', 'LOST IN THE NOISE'] },
  { text: '"Our exposure feels outdated."', tags: ['SYLLABUS GAP', 'REAL WORLD VS COLLEGE'] },
  { text: '"Too qualified for internships. Too inexperienced for jobs."', tags: ['PLACEMENT PANIC', 'THE CRUEL PARADOX'] }
];

export const confessionStyles = [
  { bg: 'bg-[#2E73E6]', text: 'text-white', tagBg: 'bg-white/20 text-white' },
  { bg: 'bg-[#FDE25D]', text: 'text-[#111]', tagBg: 'bg-black/10 text-[#111]' },
  { bg: 'bg-[#FB607E]', text: 'text-white', tagBg: 'bg-white/20 text-white' },
  { bg: 'bg-[#3BA8E7]', text: 'text-white', tagBg: 'bg-white/20 text-white' },
  { bg: 'bg-[#126769]', text: 'text-white', tagBg: 'bg-white/20 text-white' }, 
  { bg: 'bg-[#E92A39]', text: 'text-white', tagBg: 'bg-white/20 text-white' },
];

export const filters = ['All', 'Internships', 'Competitions', 'Projects', 'PPO', 'Remote', 'Paid', 'Tech', 'Marketing', 'Design', 'Business', 'Content'];

export const DUMMY_CHALLENGES = [
  {
    id: "dummy-eveready-1", title: "Keep It Lit", company: "Eveready", logoUrl: null, bgImage: evereadyBg, type: "Innovation Project", category: "Innovation", duration: "4 Weeks", points: "Internship + ₹50,000", description: "Reinvent portable lighting for rural and everyday India.", deadline: "Oct 30, 2026", tags: ["#Innovation", "Product Design", "Sustainability"]
  },
  {
    id: "dummy-trootech-1", title: "TrooTech 2030", company: "TrooTech Business Solutions", logoUrl: trootechLogo, bgImage: trootechPosterBg, type: "Innovation Challenge", category: "Innovation", duration: "5 Weeks", points: "Pre-Placement Interview", description: "TrooTech is a 350+ person AI company with an ambitious 2030 vision.", deadline: "Oct 28, 2026", tags: ["#Innovation", "Brand Identity", "AI"]
  },
  {
    id: "dummy-ingenuityx-1", title: "Market InGenuityX", company: "InGenuityX", logoUrl: ingenxLogo, bgImage: ingenxPosterBg, type: "Competition", category: "Marketing", duration: "3 Weeks", points: "PPO Available", description: "Pitch the ultimate growth and brand strategy for InGenuityX itself.", deadline: "Oct 25, 2026", tags: ["#Marketing", "Growth Strategy", "B2C"]
  },
  {
    id: "dummy-legrand-1", title: "Power Protocol", company: "Legrand", logoUrl: null, bgImage: legrandBg, type: "Tech Hackathon", category: "Tech", duration: "3 Weeks", points: "₹1,00,000 + Tech Setup", description: "Design energy-efficient power distribution systems capable of sustaining high-density AI data centers.", deadline: "Oct 20, 2026", tags: ["#Tech", "AI", "Data Centers"]
  },
  {
    id: "dummy-nuvoco-1", title: "Grey 2 Green", company: "Nuvoco", logoUrl: nuvocoLogo, bgImage: nuvocoGreenBg, type: "Sustainability Project", category: "Sustainability", duration: "4 Weeks", points: "PPI + ₹50,000", description: "Develop innovative strategies to drastically reduce the carbon footprint.", deadline: "Oct 18, 2026", tags: ["#Sustainability", "Green Tech"]
  },
  {
    id: "dummy-srmb-1", title: "Solid Shift Challenge", company: "SRMB", logoUrl: srmbLogo, bgImage: srmbShiftBg, type: "Innovation Challenge", category: "Design", duration: "5 Weeks", points: "₹75,000 Pool", description: "Reimagine Advanced Materials and Smart Concrete.", deadline: "Oct 25, 2026", tags: ["#Design", "Smart Materials"]
  },
  {
    id: "dummy-srmb-2", title: "Sustainable Green Pro", company: "SRMB", logoUrl: srmbLogo, bgImage: srmbGreenProBg, type: "Sustainability Project", category: "Sustainability", duration: "3 Weeks", points: "PPO + ₹25,000", description: "Propose actionable, closed-loop recycling processes for steel manufacturing.", deadline: "Oct 12, 2026", tags: ["#Sustainability", "Recycling"]
  },
  {
    id: "dummy-srmb-3", title: "Ironclad Challenge", company: "SRMB", logoUrl: srmbLogo, bgImage: srmbIroncladBg, type: "Marketing Campaign", category: "Marketing", duration: "4 Weeks", points: "Internship + ₹40,000", description: "Design a robust go-to-market and brand positioning strategy.", deadline: "Oct 22, 2026", tags: ["#Marketing", "Brand Strategy"]
  },
  {
    id: "dummy-illustrative-123", title: "Next-Gen Smile Challenge", company: "NovaCare (Illustrative)", logoUrl: null, bgImage: colgateBg, type: "Marketing Campaign", category: "Marketing", duration: "4 Weeks", points: "PPO + ₹50,000", description: "Make the OG brand iconic again.", deadline: "Oct 15, 2026", tags: ["#Marketing", "Marketing Campaign"]
  }
];