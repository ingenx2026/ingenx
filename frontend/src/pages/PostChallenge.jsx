import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PostChallenge() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'Competition',
    category: 'Marketing',
    duration: '',
    points: '',
    description: '',
    deadline: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Note: Strapi requires custom collection data to be wrapped in a "data" object!
      await axios.post('http://localhost:1337/api/challenges', {
        data: formData
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission Error:", error);
      setErrorMsg(error.response?.data?.error?.message || "Something went wrong. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center px-6 text-center animate-fade-in">
        <div className="text-6xl mb-6">🤝</div>
        <h2 className="text-5xl font-display font-bold tracking-tighter mb-4">Brief Received.</h2>
        <p className="text-zinc-400 mb-8 max-w-md">
          Your challenge has been securely submitted to the IngenuityX vault. Our team will review the brief to ensure it aligns with our community, and we'll reach out before it goes live.
        </p>
        <button onClick={() => window.location.reload()} className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase hover:bg-[#FF4500] hover:text-white transition-colors">
          Post Another
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white antialiased pb-20">
      <nav className="w-full max-w-4xl mx-auto px-6 py-10 flex justify-between items-end border-b border-dashed border-white/10 mb-12">
        <div className="flex flex-col z-10">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Partner Portal</span>
          <Link to="/" className="font-display font-bold text-2xl tracking-tight text-white hover:text-[#FF4500] transition-colors">
            Ingenuity<span className="text-[#FF4500]">X</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-5xl font-display font-bold mb-4">Drop a Challenge.</h1>
          <p className="text-zinc-400 text-lg">No boring corporate JDs allowed. Pitch a real problem to the smartest kids on campus.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">Company Name</label>
              <input required type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Zomato" className="w-full bg-black/50 border border-white/10 py-3 px-4 rounded-lg focus:border-[#FF4500] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">Challenge Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Gen-Z Viral Marketing Campaign" className="w-full bg-black/50 border border-white/10 py-3 px-4 rounded-lg focus:border-[#FF4500] focus:outline-none transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-black/50 border border-white/10 py-3 px-4 rounded-lg focus:border-[#FF4500] focus:outline-none transition-colors appearance-none">
                <option value="Competition">Competition</option>
                <option value="Internship">Internship</option>
                <option value="Project">Live Project</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/50 border border-white/10 py-3 px-4 rounded-lg focus:border-[#FF4500] focus:outline-none transition-colors appearance-none">
                <option value="Marketing">Marketing</option>
                <option value="Tech">Tech</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Sustainability">Sustainability</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">The Brief (Keep it raw & honest)</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} placeholder="What is the actual problem you need solved?" className="w-full bg-black/50 border border-white/10 py-3 px-4 rounded-lg focus:border-[#FF4500] focus:outline-none transition-colors min-h-[120px] resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">Prize / Perks</label>
              <input required type="text" name="points" value={formData.points} onChange={handleChange} placeholder="₹50k / PPO Track" className="w-full bg-black/50 border border-white/10 py-3 px-4 rounded-lg focus:border-[#FF4500] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">Duration</label>
              <input required type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 2 Weeks" className="w-full bg-black/50 border border-white/10 py-3 px-4 rounded-lg focus:border-[#FF4500] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block font-bold text-xs text-zinc-400 uppercase tracking-widest mb-2">Deadline</label>
              <input required type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full bg-black/50 border border-white/10 py-3 px-4 rounded-lg focus:border-[#FF4500] focus:outline-none transition-colors text-white [color-scheme:dark]" />
            </div>
          </div>

          {errorMsg && <p className="text-red-500 font-bold text-sm uppercase text-center mt-4">{errorMsg}</p>}

          <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-[#FF4500] hover:text-white transition-all disabled:opacity-50 mt-8">
            {isSubmitting ? 'Submitting to Vault...' : 'Launch Challenge 🚀'}
          </button>
        </form>
      </main>
    </div>
  );
}