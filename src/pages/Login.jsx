import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImage from '../imports/ingenuityx-logo.svg'; 

// --- ENVIRONMENT VARIABLE SETUP ---
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(`${API_URL}/api/auth/local`, {
        identifier: formData.identifier, 
        password: formData.password,
      });

      // Save the VIP pass and user data
      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // SESSION TIMER: Save the exact timestamp they logged in
      localStorage.setItem('session_start', Date.now().toString());

      // Teleport them to the homepage
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Invalid email or password. Try again or register.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFC] text-[#111] flex flex-col items-center justify-center py-12 px-6 font-sans selection:bg-[#E92A39] selection:text-white">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        
        * { font-family: 'Outfit', sans-serif; }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideInUp 0.5s ease-out forwards; }
      `}</style>

      <Link to="/" className="mb-10 hover:scale-105 transition-transform duration-300">
        <img src={logoImage} alt="InGenuityX" className="h-16 md:h-20 object-contain" />
      </Link>

      <div className="bg-white border border-gray-200 p-8 md:p-12 rounded-[3rem] w-full max-w-md animate-slide-in shadow-xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#111]">Welcome Back.</h2>
        <p className="text-gray-500 text-sm mb-10 font-medium">Ready to claim your next opportunity?</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-extrabold text-[10px] text-[#E92A39] uppercase tracking-widest mb-2">Email or Username</label>
            <input 
              required 
              type="text" 
              name="identifier" 
              value={formData.identifier} 
              onChange={handleChange} 
              placeholder="Enter your email"
              className="w-full bg-[#FAFCFC] border border-gray-200 text-[#111] py-4 px-5 rounded-2xl focus:border-[#E92A39] focus:outline-none transition-colors font-bold text-sm placeholder:text-gray-400 placeholder:font-medium" 
            />
          </div>
          <div>
            <label className="block font-extrabold text-[10px] text-[#E92A39] uppercase tracking-widest mb-2">Password</label>
            <input 
              required 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••"
              className="w-full bg-[#FAFCFC] border border-gray-200 text-[#111] py-4 px-5 rounded-2xl focus:border-[#E92A39] focus:outline-none transition-colors font-bold text-sm placeholder:text-gray-400 placeholder:font-medium" 
            />
          </div>

          {errorMsg && (
            <p className="text-[#E92A39] bg-[#E92A39]/10 p-4 rounded-xl text-xs font-bold text-center border border-[#E92A39]/20">
              {errorMsg}
            </p>
          )}

          <button 
            disabled={isLoading} 
            type="submit" 
            className="w-full bg-[#E92A39] hover:bg-[#ff3b4b] text-white py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all mt-4 disabled:opacity-50 hover:shadow-lg hover:-translate-y-1 shadow-md"
          >
            {isLoading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-gray-200 pt-8">
          <p className="text-gray-600 text-sm font-medium">
            Don't have an arsenal yet? <Link to="/register" className="text-[#E92A39] hover:text-[#111] font-bold transition-colors ml-1 underline decoration-[#E92A39]/30 underline-offset-4 hover:decoration-[#111]">Register Here.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}