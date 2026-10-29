import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import axios from 'axios';

// --- ENVIRONMENT VARIABLE SETUP ---
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337';

// --- CONFIGURATION & CONSTANTS ---
const EMAILJS_CONFIG = { PUBLIC_KEY: "ThJxoI9bg5wTLThG5", SERVICE_ID: "service_da4bk3x", OTP_TEMPLATE_ID: "template_1c4m33z", WELCOME_TEMPLATE_ID: "template_n9dcd4n" };
const BANNED_PHRASES = ["im a fast learner", "i'm a fast learner", "i am a fast learner", "team player", "can wwork under pressure", "can work under pressure", "can work underpressure", "good communicator", "handle the projects but have not worked", "learner", "negotiation skills"];
const COMMON_CITIES = ["Mumbai", "Delhi", "Bangalore", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow", "Kanpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Mysore", "Gurgaon", "Gurugram", "Bhubaneswar", "Dehradun"];
const NEW_DOMAINS = ["Strategy & Business", "Design & Arts", "Tech & Code", "Marketing & Growth", "Sustainability", "Content & Media"];

const SKILL_SETS = {
    "Strategy & Business": ['Public Speaking', 'Project Mgmt', 'Finance', 'Leadership', 'Strategy', 'Pitching', 'Operations', 'Sales', 'Negotiation'],
    "Design & Arts": ['Figma', '3D Design', 'Video Editing', 'Motion Graphics', 'UI/UX', 'Illustration', 'Blender', 'Photography', 'After Effects'],
    "Tech & Code": ['React', 'Python', 'AWS', 'Rust', 'AI/ML', 'Node.js', 'Cybersecurity', 'Blockchain', 'Flutter', 'Data Science', 'DevOps', 'Go', 'Full Stack'],
    "Marketing & Growth": ['Growth Hacking', 'SEO', 'TikTok Strategy', 'Copywriting', 'Content Creation', 'Google Ads', 'Branding', 'Community Mgmt', 'Email Marketing'],
    "Sustainability": ['ESG Reporting', 'Circular Economy', 'Green Tech', 'Carbon Accounting', 'Policy Analysis', 'Sustainable Packaging', 'Renewable Energy'],
    "Content & Media": ['Podcasting', 'Storytelling', 'Journalism', 'Scriptwriting', 'Content Strategy', 'Social Media', 'Creative Direction']
};

const roasts = {
    'brag': { short: "That won't shut up Pummy aunty. Try harder.", long: "Mic drop! Rishtedars are typing... 🎤", empty: "Sharmane ka time gaya. Flex it!", extra: "Bro leave some ego for the rest of us 🔥" },
    'failure': { short: "That's not trauma, that's Tuesday.", long: "Villain origin story certified 🍿", empty: "Everyone takes Ls. Drop yours.", funny: "Moye moye fr 😭" },
    'motivation': { short: "Paisa? Fame? Sach bol de bhai.", long: "Bro has a whole masterplan 📝", empty: "Aise hi aagaye kya bina soche?", hype: "Wait, let him cook 👀" },
    'dream_job': { short: "Sharma ji's kid is laughing rn. Aim higher.", long: "Sharma ji is officially intimidated 📉", empty: "Berozgar rehne ka irada hai kya?" },
    'password': { short: "GIRL! My grandma can hack this 👵", medium: "Okay, but I can still guess it.", long: "Fort Knox level security 🏰" }
};
const PATTERNS = { email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/ };

export default function Register() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [stepHistory, setStepHistory] = useState([]);
    const [answers, setAnswers] = useState({ interests: [], extra_links: [], skills_list: [] });
    const [verificationCodes, setVerificationCodes] = useState({});
    const [uiErrors, setUiErrors] = useState({});
    const [roastState, setRoastState] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [clichePopup, setClichePopup] = useState({ visible: false, word: "" });
    const [resumeLoading, setResumeLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    
    const contactCheckTimers = useRef({});
    const mediaRecorder = useRef(null);
    const recordedChunks = useRef([]);
    const activeStream = useRef(null);
    const recordTimerInterval = useRef(null);
    const [recordingState, setRecordingState] = useState({ status: 'idle', seconds: 0, videoUrl: null });

    useEffect(() => { 
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY); 
        
        if (!window.pdfjsLib) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.async = true;
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            };
            document.body.appendChild(script);
        }
    }, []);

    // --- THEME CONFIGURATION ---
    const getThemeStyles = () => {
        if (theme === 'dark') return {
            bg: "bg-[#09090B] text-white",
            card: "bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl",
            input: "bg-black/50 border border-white/10 text-white focus:border-[#2E73E6] rounded-xl",
            btn: "bg-[#2E73E6] text-white hover:bg-blue-600 rounded-xl disabled:opacity-50",
            accent: "text-[#2E73E6]",
            tag: "bg-white/10 text-white border-white/20",
            tagActive: "bg-[#2E73E6] text-white border-[#2E73E6]",
            font: "font-sans"
        };
        if (theme === 'chaotic') return {
            bg: "bg-[#FDE25D] text-[#111]",
            card: "bg-white border-4 border-black rounded-none shadow-[12px_12px_0px_#111]",
            input: "bg-white border-4 border-black text-[#111] focus:bg-pink-50 rounded-none font-bold",
            btn: "bg-[#FB607E] text-white border-4 border-black shadow-[4px_4px_0px_#111] hover:translate-y-1 hover:shadow-none uppercase font-black disabled:opacity-50",
            accent: "text-[#E92A39]",
            tag: "bg-white text-[#111] border-4 border-black font-bold",
            tagActive: "bg-black text-[#FDE25D] border-4 border-black font-black",
            font: "font-mono"
        };
        return {
            bg: "bg-[#FAFCFC] text-[#111]",
            card: "bg-white border border-gray-200 rounded-[3rem] shadow-xl",
            input: "bg-[#FAFCFC] border border-gray-200 text-[#111] focus:border-[#E92A39] rounded-2xl font-medium",
            btn: "bg-[#E92A39] hover:bg-[#ff3b4b] text-white rounded-full font-bold shadow-md hover:-translate-y-1 disabled:opacity-50",
            accent: "text-[#E92A39]",
            tag: "bg-gray-50 text-gray-600 border border-gray-200 font-bold rounded-full",
            tagActive: "bg-[#E92A39] text-white border-[#E92A39] font-bold rounded-full",
            font: "font-sans"
        };
    };
    const styles = getThemeStyles();

    // --- LOGIC FUNCTIONS ---
    const showRoast = (fieldId, type) => {
        const text = (roasts[fieldId] && roasts[fieldId][type]) ? roasts[fieldId][type] : "";
        if (!text) return;
        setRoastState(prev => ({ ...prev, [fieldId]: text }));
        setTimeout(() => setRoastState(prev => ({ ...prev, [fieldId]: null })), 3000);
    };

    const handleSave = (id, val) => { 
        setAnswers(prev => ({ ...prev, [id]: val })); 
        if(uiErrors[id]) setUiErrors(prev => ({ ...prev, [id]: null }));
    };

    const handleInputRoast = (id, val) => {
        if (['brag', 'failure', 'motivation', 'dream_job'].includes(id) && val.length > 80) showRoast(id, 'long');
        if (id === 'brag' && val.length > 150) showRoast(id, 'extra');
        if (id === 'password') {
            if (val.length >= 6 && val.length < 10) showRoast(id, 'medium');
            else if (val.length >= 10 && /[0-9]/.test(val)) showRoast(id, 'long');
        }
    };

    const handleBlurRoast = (id, val) => {
        if (!val) showRoast(id, 'empty');
        if (id === 'password' && val.length < 5 && val.length > 0) showRoast(id, 'short');
        if (id === 'brag' && val.length > 0 && val.length < 20) showRoast(id, 'short');
    };

    const debouncedContactCheck = (fieldId, val) => {
        if (contactCheckTimers.current[fieldId]) clearTimeout(contactCheckTimers.current[fieldId]);
        contactCheckTimers.current[fieldId] = setTimeout(async () => {
            if (!val || (fieldId === 'email' && !PATTERNS.email.test(val)) || (fieldId === 'phone' && val.length < 10)) return;
            try {
                // FIXED: Uses API_URL variable instead of localhost
                const response = await axios.get(`${API_URL}/api/users?filters[${fieldId}][$eq]=${val}`);
                if (response.data.length > 0) {
                    setUiErrors(prev => ({ ...prev, [fieldId]: "ALREADY REGISTERED" }));
                    setAnswers(prev => ({ ...prev, [`${fieldId}_taken`]: true }));
                } else {
                    setUiErrors(prev => ({ ...prev, [fieldId]: null }));
                    setAnswers(prev => ({ ...prev, [`${fieldId}_taken`]: false }));
                }
            } catch (e) { console.error(e); }
        }, 800);
    };

    const triggerOtp = async (fieldId) => {
        const val = answers[fieldId];
        if (!val || (fieldId === 'email' && !PATTERNS.email.test(val))) return alert("Please enter a valid " + fieldId);
        try {
            // FIXED: Uses API_URL variable instead of localhost
            const response = await axios.get(`${API_URL}/api/users?filters[${fieldId}][$eq]=${val}`);
            if (response.data.length > 0) {
                setUiErrors(prev => ({ ...prev, [fieldId]: "ALREADY REGISTERED" }));
                setAnswers(prev => ({ ...prev, [`${fieldId}_taken`]: true }));
                return;
            }
        } catch (e) { console.error(e); }

        // --- DEV MODE BYPASS ---
        // Instantly skip the EmailJS logic and move to the input field
        setAnswers(prev => ({ ...prev, [`${fieldId}_otp_sent`]: true }));
    };

    const verifyOtp = (fieldId) => {
        const inputCode = verificationCodes[`${fieldId}_input`];
        
        // --- DEV MODE BYPASS ---
        // Accept ANY code that the user types as long as it isn't empty
        if (inputCode && inputCode.trim().length > 0) {
            setAnswers(prev => ({ ...prev, [`${fieldId}_verified`]: true }));
            setUiErrors(prev => ({ ...prev, [`${fieldId}_otp_msg`]: null }));
        } else {
            setUiErrors(prev => ({ ...prev, [`${fieldId}_otp_msg`]: "PLEASE ENTER A DUMMY CODE" }));
        }
    };

    const parseResume = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!window.pdfjsLib) {
            alert("Resume parser is still loading. Please wait a second and try again.");
            return;
        }

        setAnswers(prev => ({ ...prev, resumeFile: file }));
        setResumeLoading(true);
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = "";
            for (let i = 1; i <= Math.min(2, pdf.numPages); i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map(item => item.str).join(" ") + " ";
            }
            
            let updates = {};
            const emailMatch = fullText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/);
            if (emailMatch) updates.email = emailMatch[0];
            
            const phoneMatch = fullText.match(/(\+91[\-\s]?)?[6-9]\d{9}/);
            if (phoneMatch) updates.phone = phoneMatch[0];
            
            let foundCity = COMMON_CITIES.find(city => new RegExp(`\\b${city}\\b`, 'i').test(fullText));
            if (foundCity) updates.city = foundCity;

            const cgpaMatch = fullText.match(/(?:cgpa|gpa|percentage)[\s:=]*([0-9]{1,2}(?:\.[0-9]{1,2})?)/i);
            if (cgpaMatch) updates.cgpa = cgpaMatch[1];
            
            const yearMatch = fullText.match(/(?:202[0-9]|203[0-9])/);
            if (yearMatch) updates.grad_year = yearMatch[0];

            const streamMatch = fullText.match(/\b(B\.Tech|B\.E\.?|BBA|B\.Sc|M\.Tech|MBA|Bachelor|Master|Diploma)[A-Za-z\s.,&]+/i);
            if (streamMatch) updates.stream = streamMatch[0].substring(0, 40).trim();

            const uniMatch = fullText.match(/\b((?:[A-Za-z.&-]+\s+){1,5}(?:University|College|Institute)(?:\s+of\s+[A-Za-z.&-]+)?|(?:University|College|Institute)\s+of\s+(?:[A-Za-z.&-]+\s*){1,3})\b/i);
            if (uniMatch) updates.uni = uniMatch[0].substring(0, 60).trim();

            const firstContactIndex = Math.min(
                emailMatch ? fullText.indexOf(emailMatch[0]) : fullText.length,
                phoneMatch ? fullText.indexOf(phoneMatch[0]) : fullText.length
            );
            
            if (firstContactIndex > 0 && firstContactIndex < 150) {
                const possibleName = fullText.substring(0, firstContactIndex).trim().split(/\s+/).slice(0, 2).join(' ');
                if (possibleName) updates.name = possibleName.replace(/[^a-zA-Z ]/g, "");
            } else {
                const words = fullText.trim().split(/\s+/);
                if (words.length >= 2) updates.name = `${words[0]} ${words[1]}`.replace(/[^a-zA-Z ]/g, "");
            }

            setAnswers(prev => ({ ...prev, ...updates }));
        } catch (err) { 
            console.error("PDF Parsing failed:", err);
            alert("We had trouble reading that PDF. Please fill in the details manually.");
        } finally {
            setResumeLoading(false);
        }
    };

    const startVideoRecord = async () => {
        try {
            activeStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const videoPreview = document.getElementById('video-preview');
            videoPreview.srcObject = activeStream.current;
            videoPreview.play();
            videoPreview.muted = true;
            
            mediaRecorder.current = new MediaRecorder(activeStream.current);
            recordedChunks.current = [];
            mediaRecorder.current.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.current.push(e.data); };
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                setAnswers(prev => ({ ...prev, hype_video: blob }));
                videoPreview.srcObject = null;
                setRecordingState(prev => ({ ...prev, status: 'finished', videoUrl: URL.createObjectURL(blob) }));
                if (activeStream.current) activeStream.current.getTracks().forEach(track => track.stop());
                clearInterval(recordTimerInterval.current);
            };
            mediaRecorder.current.start();
            setRecordingState({ status: 'recording', seconds: 0, videoUrl: null });
            recordTimerInterval.current = setInterval(() => {
                setRecordingState(prev => {
                    if (prev.seconds >= 120) stopVideoRecord();
                    return { ...prev, seconds: prev.seconds + 1 };
                });
            }, 1000);
        } catch (err) { alert("Camera permission denied."); }
    };

    const stopVideoRecord = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            clearInterval(recordTimerInterval.current);
        }
    };

    const handleNext = async () => {
        if (currentStepIndex === 1 || currentStepIndex === 2) {
            let foundCliche = false; let blockedWord = "";
            ['brag', 'motivation'].forEach(id => {
                BANNED_PHRASES.forEach(phrase => { if ((answers[id] || "").toLowerCase().includes(phrase)) { foundCliche = true; blockedWord = phrase; } });
            });
            if (foundCliche) return setClichePopup({ visible: true, word: blockedWord });
        }

        // --- STRICT VALIDATION PER STEP ---
        if (currentStepIndex === 0) {
            if (!answers.domain) return alert("Pick your main vibe to continue.");
            if (!answers.interests || answers.interests.length === 0) return alert(`Select at least one specific interest in ${answers.domain}.`);
        }
        if (currentStepIndex === 1) {
            if (!answers.skills_list || answers.skills_list.length === 0) return alert("Drop at least one superpower/skill.");
            if (!answers.brag || answers.brag.trim() === "") return alert("Don't be shy, tell us about your biggest W (Win).");
        }
        if (currentStepIndex === 2) {
            if (!answers.personality_type) return alert("Pick a personality type to continue.");
            if (!answers.motivation || answers.motivation.trim() === "") return alert("We need a hot take to proceed. Let's hear it.");
        }
        if (currentStepIndex === 3) {
            if (!answers.name || !answers.uni || !answers.stream || !answers.cgpa || !answers.grad_year || !answers.city) {
                return alert("Please fill out all the basic details (Name, College, Degree, CGPA, Year, City).");
            }
        }
        if (currentStepIndex === 4) {
            if (!answers.linkedin || !answers.linkedin.trim()) {
                return alert("Your LinkedIn page link is mandatory to continue.");
            }
            if (!PATTERNS.url.test(answers.linkedin.trim())) {
                return alert("Please enter a valid URL for your LinkedIn (e.g., https://linkedin.com/in/yourname).");
            }
        }
        if (currentStepIndex === 5) {
            if (!answers.email || !answers.phone || !answers.password) return alert("We need your email, phone, and a password to set this up.");
            if (answers.email_taken || answers.phone_taken) return alert("Looks like this email or phone is already registered.");
            if (!answers.email_verified) return alert("Please verify your email address with the OTP to continue.");
            
            await submitForm();
            return;
        }

        setStepHistory([...stepHistory, currentStepIndex]);
        setCurrentStepIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrev = () => {
        if (stepHistory.length > 0) {
            const prevHist = [...stepHistory];
            setCurrentStepIndex(prevHist.pop());
            setStepHistory(prevHist);
        }
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (answers.skills_list.length < 3) {
                setAnswers(prev => ({ ...prev, skills_list: [...prev.skills_list, skillInput.trim()] }));
                setSkillInput("");
            } else {
                alert("Keep it to your top 3 best skills!");
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setAnswers(prev => ({ ...prev, skills_list: prev.skills_list.filter(s => s !== skillToRemove) }));
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        try {
            const generatedUsername = (answers.name || 'user').replace(/\s+/g, '').toLowerCase() + Math.floor(1000 + Math.random() * 9000);

            const coreAuthData = {
                username: generatedUsername,
                email: answers.email,
                password: answers.password
            };

            // FIXED: Uses API_URL variable instead of localhost
            const registerRes = await axios.post(`${API_URL}/api/auth/local/register`, coreAuthData);
            const userId = registerRes.data.user.id;
            const jwtToken = registerRes.data.jwt;
            
            localStorage.setItem('jwt', jwtToken);
            localStorage.setItem('user', JSON.stringify(registerRes.data.user));
            
            const customProfileData = {
                name: answers.name,
                phone: answers.phone,
                city: answers.city,
                domain: answers.domain + (answers.interests?.length > 0 ? ` (${answers.interests.join(", ")})` : ""),
                personality_type: answers.personality_type,
                motivation: answers.motivation, 
                brag: answers.brag,             
                skills: answers.skills_list.join(", "),
                linkedin: answers.linkedin,
                portfolio: answers.portfolio,
                university: answers.uni,
                stream: answers.stream,
                cgpa: answers.cgpa,
                grad_year: answers.grad_year
            };

            // FIXED: Uses API_URL variable instead of localhost
            await axios.put(`${API_URL}/api/users/${userId}`, customProfileData, {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });

            const uploadFile = async (file, fieldName, fileName) => {
                const formData = new FormData();
                formData.append('files', file, fileName);
                formData.append('ref', 'plugin::users-permissions.user');
                formData.append('refId', userId);
                formData.append('field', fieldName);
                
                // FIXED: Uses API_URL variable instead of localhost
                await axios.post(`${API_URL}/api/upload`, formData, {
                    headers: { Authorization: `Bearer ${jwtToken}` }
                });
            };

            if (answers.resumeFile) await uploadFile(answers.resumeFile, 'resume', answers.resumeFile.name);
            if (answers.hype_video) await uploadFile(answers.hype_video, 'videoPitchPath', `${answers.name || 'user'}_pitch.webm`); 

            // Sending Email is disabled in DEV mode but the code is kept intact for later
            // try { await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.WELCOME_TEMPLATE_ID, { to_name: answers.name || 'User', to_email: answers.email, reg_id: `IX-${userId}` }); } 
            // catch (e) { console.error("Email failed:", e); }

            setIsSuccess(true);
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (e) {
            console.error("Submission Error:", e);
            const errorMessage = e.response?.data?.error?.message || e.message;
            alert("Oops: " + errorMessage);
        } finally { setIsSubmitting(false); }
    };

    if (isSuccess) {
        return (
            <div className={`flex flex-col items-center justify-center animate-fade-in text-center h-screen px-6 ${styles.bg} ${styles.font}`}>
                <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
                  .font-sans { font-family: 'Outfit', sans-serif; }
                `}</style>
                <div className="text-7xl mb-8 drop-shadow-md">🚀</div>
                <h2 className={`text-4xl md:text-6xl font-black tracking-tight mb-6 ${theme === 'chaotic' ? 'uppercase' : ''}`}>You're in.</h2>
                <p className="opacity-70 mb-10 text-lg max-w-md mx-auto font-medium">We've saved your profile and securely logged you in. Redirecting...</p>
                <Link to="/login" className={`px-10 py-4 transition-all ${styles.btn}`}>Go to Login Manually</Link>
            </div>
        );
    }
