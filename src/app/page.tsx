'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Code, Terminal, CheckCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    interests: [] as string[],
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const interests = ['Web Dev', 'Robotics', 'AI/ML', 'Game Dev', 'Cybersecurity', 'Hardware'];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    
    setStatus('loading');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to register');
      
      setStatus('success');
      setFormData({ name: '', email: '', grade: '', interests: [] });
      
      // Reset success message after 3 seconds to allow another registration
      setTimeout(() => setStatus('idle'), 3000);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-[#00f3ff] selection:text-black">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#bd00ff] rounded-full blur-[128px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00f3ff] rounded-full blur-[128px] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-4xl">
        
        {/* Header / Hero */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="relative p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm neon-border">
              <Cpu size={48} className="text-[#00f3ff]" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] via-white to-[#bd00ff] neon-text">
            TECH TRIBE CLUB
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Build the future. Join the elite community of makers, coders, and innovators.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
        >
          {[
            { icon: <Code />, title: "Collaborate", desc: "Work on real projects" },
            { icon: <Zap />, title: "Innovate", desc: "Access cutting-edge tech" },
            { icon: <Terminal />, title: "Learn", desc: "Workshops & Hackathons" },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
              <div className="text-[#bd00ff] mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Registration Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f3ff] to-[#bd00ff] rounded-2xl blur opacity-30"></div>
          <div className="relative p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-[#00f3ff]">&gt;_</span> Member Registration
            </h2>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Welcome Aboard!</h3>
                <p className="text-gray-400">You have been successfully registered.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00f3ff] transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00f3ff] transition-all"
                      placeholder="jane@school.edu"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Year</label>
                  <select 
                    required
                    value={formData.grade}
                    onChange={e => setFormData({...formData, grade: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00f3ff] transition-all text-gray-300"
                  >
                    <option value="" disabled>Select your grade</option>
                    <option value="9">First year (1st)</option>
                    <option value="10">Second Year (2nd)</option>
                    <option value="11">3third year (3rd)</option>
                    <option value="12">fourth year(4th)</option>
                    <option value="Staff">Faculty / Staff</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400">Areas of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={clsx(
                          "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                          formData.interests.includes(interest)
                            ? "bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#00f3ff] to-[#bd00ff] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4 text-black"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" /> Registering...
                    </>
                  ) : (
                    "Join the Club"
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
        
        <footer className="text-center text-gray-600 mt-16 text-sm">
          &copy; {new Date().getFullYear()} Tech Club. All systems operational.
        </footer>
      </div>
    </main>
  );
}