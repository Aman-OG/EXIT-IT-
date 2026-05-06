import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, CheckCircle, Trophy, ArrowRight, Sparkles, Layout, Zap, Target, Sun, Moon, FlaskConical } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const LandingPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-text font-inter selection:bg-primary/30 transition-colors duration-500 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-card/60 backdrop-blur-3xl border border-text/5 rounded-[40px] px-8 h-20 shadow-2xl">
          <div className="flex items-center group cursor-pointer">
            <h1 className="text-3xl font-black font-outfit tracking-tighter">
              <span className="text-primary italic">EXIT</span><span className="text-accent">-IT</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-6 md:space-x-8">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-3 bg-text/5 hover:bg-text/10 rounded-full transition-all active:scale-90"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
            </button>

            <Link to="/login" className="text-sm font-black opacity-60 hover:opacity-100 transition-all uppercase tracking-widest hidden sm:block">LOGIN</Link>
            <Link to="/register" className="px-10 py-3.5 bg-primary text-primary-foreground text-xs font-black rounded-full hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 shadow-xl uppercase tracking-widest leading-none">START NOW</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-60 pb-40 px-6 overflow-hidden">
        {/* The Aurora Effect */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] blur-[160px] rounded-full animate-aurora -z-10 ${theme === 'dark' ? 'bg-primary/20' : 'bg-primary/10'}`} />
        <div className={`absolute top-40 left-1/4 w-[400px] h-[400px] blur-[120px] rounded-full animate-aurora -z-10 delay-700 ${theme === 'dark' ? 'bg-accent/10' : 'bg-accent/5'}`} />

        <div className="max-w-6xl mx-auto text-center space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          <h2 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter leading-[1.05] max-w-5xl mx-auto">
            <span className="text-text opacity-90">Your complete system to pass</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent italic whitespace-nowrap drop-shadow-sm">IT Exit Exam.</span>
          </h2>
          
          <p className="text-xl md:text-2xl opacity-60 max-w-3xl mx-auto font-medium leading-relaxed italic">
            "Your intelligent preparation ecosystem for all 14 courses. Designed to build confidence and ensure absolute success."
          </p>

          <div className="flex items-center justify-center pt-16">
            <Link to="/register" className="w-[380px] py-9 bg-primary text-primary-foreground font-black text-2xl rounded-[60px] shadow-[0_30px_80px_rgba(var(--primary),0.25)] hover:shadow-primary/50 hover:-translate-y-2 transition-all flex items-center justify-center space-x-4 tracking-tighter">
              <span>GET STARTED FREE</span>
              <ArrowRight size={28} />
            </Link>
          </div>
          
          {/* Trust Indicators - NO HOVER, 2X LARGER */}
          <div className="pt-32 flex flex-col items-center space-y-12">
             <p className="text-xs font-black opacity-30 uppercase tracking-[0.5em]">Trusted By Future Leaders Of Ethiopia</p>
             <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32">
                <div className="flex items-center space-x-8 text-text">
                   <img src="/MOE.jpg" alt="MOE" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-text/10 shadow-2xl" />
                   <span className="text-3xl md:text-5xl font-black font-outfit tracking-tighter uppercase italic">MOE STANDARDS</span>
                </div>
                <div className="flex items-center space-x-8 text-text">
                   <Target size={80} className="text-primary hidden md:block" />
                   <Target size={60} className="text-primary md:hidden" />
                   <span className="text-3xl md:text-5xl font-black font-outfit tracking-tighter uppercase italic">14 COURSES</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* The Bento Hub */}
      <section className="py-40 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-24">
          
          <div className="flex flex-col items-center text-center space-y-4">
             <h3 className="text-sm font-black text-primary uppercase tracking-[0.4em] italic mb-2 tracking-widest">Efficiency Driven</h3>
             <h4 className="text-4xl md:text-6xl font-black font-outfit tracking-tighter leading-tight italic max-w-5xl">“Built to help students pass the 14-course exit exam efficiently.”</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[800px]">
             
             {/* Bento Item 1: Smart Study System */}
             <div className="lg:col-span-7 bg-card/60 p-12 md:p-20 rounded-[80px] border border-text/5 relative overflow-hidden group hover:border-primary/50 transition-all duration-700 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 space-y-10 text-center sm:text-left">
                   <div className="w-24 h-24 bg-primary/10 backdrop-blur-2xl rounded-[40px] flex items-center justify-center text-primary shadow-2xl mx-auto sm:mx-0">
                      <BookOpen size={48} strokeWidth={2.5} />
                   </div>
                   <div className="space-y-6">
                      <h5 className="text-5xl font-black font-outfit tracking-tighter flex items-center justify-center sm:justify-start gap-4">
                         <span>📚 Smart Study System</span>
                      </h5>
                      <p className="text-2xl opacity-60 font-bold leading-relaxed max-w-2xl">
                         Master every required competency node through a structured, interactive learning path designed for IT students.
                      </p>
                   </div>
                </div>
             </div>

             {/* Bento Item 2: AI Explanations */}
             <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary/80 p-12 md:p-20 rounded-[80px] border border-text/5 relative overflow-hidden group shadow-2xl text-primary-foreground">
                <div className="relative z-10 space-y-10 flex flex-col items-center text-center">
                   <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[40px] flex items-center justify-center shadow-inner">
                      <Brain size={48} strokeWidth={2.5} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                   </div>
                   <div className="space-y-6">
                      <h5 className="text-4xl font-black font-outfit tracking-tighter leading-tight">🧠 AI Explanations</h5>
                      <p className="text-xl font-bold leading-relaxed italic opacity-80">
                         Get instant, deep-dive AI breakdowns for binary logic, databases, and system analysis topics.
                      </p>
                   </div>
                </div>
             </div>

             {/* Bento Item 3: Practice & Exam Mode */}
             <div className="lg:col-span-5 bg-card/60 p-12 md:p-20 rounded-[80px] border border-text/5 relative overflow-hidden group hover:border-accent/50 transition-all duration-700 shadow-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10 space-y-8 text-center sm:text-left">
                   <div className="w-16 h-16 bg-accent/20 rounded-[28px] flex items-center justify-center mx-auto sm:mx-0">
                      <FlaskConical size={32} className="text-accent" />
                   </div>
                   <h5 className="text-3xl font-black font-outfit tracking-tighter leading-tight italic underline decoration-accent/20 underline-offset-8 flex items-center justify-center sm:justify-start gap-4">
                      <span>🧪 Practice & Exam Mode</span>
                   </h5>
                   <p className="text-lg opacity-60 font-bold leading-relaxed">
                      Toggle between trial labs for focused learning and strict exams mirroring official MOE pressure.
                   </p>
                </div>
             </div>

             {/* Bento Item 4: Leaderboard & Competition */}
             <div className="lg:col-span-7 bg-card/60 p-12 md:p-20 rounded-[80px] border border-text/5 relative overflow-hidden group hover:border-warning/50 transition-all duration-700 shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                   <div className="shrink-0 w-32 h-32 bg-warning/10 rounded-full flex items-center justify-center border-2 border-warning/20 group-hover:scale-110 transition-transform duration-700">
                      <Trophy size={64} className="text-warning drop-shadow-[0_0_20px_rgba(var(--warning),0.4)]" />
                   </div>
                   <div className="space-y-4 text-center md:text-left">
                      <h5 className="text-4xl font-black font-outfit tracking-tighter">🏆 Leaderboard & competition</h5>
                      <p className="text-xl opacity-60 font-bold italic">
                         Track your competitive percentile and compete against IT students across the country in real-time.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* The Architect Section */}
      <section className={`py-40 px-6 md:px-12 relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24 relative z-10 py-20">
          <div className="relative shrink-0 group">
             <div className="absolute -inset-8 bg-primary/10 rounded-[100px] group-hover:bg-primary/20 transition-all duration-700 -rotate-3" />
             <div className="absolute -inset-4 border-4 border-primary/10 rounded-[100px] -rotate-1 group-hover:rotate-2 transition-transform duration-700" />
             <img src="/aman-baye.jpg" alt="Aman Baye" className="w-[420px] h-[480px] object-cover rounded-[80px] relative z-10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border-4 border-primary/20" />
          </div>
          
          <div className="flex-1 space-y-16">
             <div className="space-y-6">
                <div>
                   <h3 className="text-sm font-black text-primary uppercase tracking-[0.5em] mb-6">Designed & Engineered By</h3>
                   <h4 className="text-7xl md:text-9xl font-black font-outfit tracking-tighter leading-none italic">Aman Baye.</h4>
                </div>
                <div className={`h-2 w-32 rounded-full ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`} />
                <p className="text-3xl md:text-4xl font-bold leading-snug tracking-tighter">
                   "IT student building practical tools to make studying simpler and more effective."
                </p>
                <p className="text-xl opacity-80 font-medium leading-relaxed max-w-3xl">
                   EXIT-IT was created to turn the pressure of a 14-course exit exam into a clear, structured path, so students can focus on learning, not just surviving the workload.
                </p>
             </div>
             
             <div className="flex flex-wrap gap-8">
                <a href="https://github.com/aman-og" target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-4 px-12 py-6 rounded-[40px] hover:scale-105 transition-all shadow-2xl group ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'}`}>
                   <svg className="w-10 h-10 fill-current group-hover:rotate-12 transition-transform duration-500" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                   <div className="text-left">
                      <p className="text-[10px] font-black opacity-50 uppercase tracking-widest leading-none mb-1">Github Repository</p>
                      <p className="text-lg font-black tracking-tight leading-none uppercase">AMAN-OG</p>
                   </div>
                </a>
             </div>
          </div>
        </div>
      </section>

      {/* The Final Gate */}
      <section className="py-80 px-6 text-center border-t border-text/5 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[400px] bg-primary/10 blur-[180px] animate-pulse rounded-full pointer-events-none" />
         
         <div className="max-w-5xl mx-auto space-y-20 relative z-10">
            <div className="space-y-6">
                <h4 className="text-7xl md:text-[10rem] font-black font-outfit tracking-tighter leading-none italic group">
                  Success Starts <span className="text-primary">Here.</span>
                </h4>
                <p className="text-2xl opacity-40 font-bold tracking-widest uppercase">Ready to secure your future?</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-10">
               <Link to="/register" className="w-[420px] py-9 bg-primary text-primary-foreground font-black text-2xl rounded-[60px] shadow-[0_40px_100px_rgba(var(--primary),0.3)] hover:shadow-primary/60 hover:-translate-y-4 transition-all tracking-tighter uppercase">
                  CREATE SECURE ACCOUNT
               </Link>
            </div>
            <Link to="/login" className="inline-block text-lg font-black opacity-40 hover:opacity-100 uppercase tracking-[0.4em] transition-all py-10">ALREADY SIGNED UP? CLICK HERE</Link>
         </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-24 bg-card border-t border-text/5 text-center">
         <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex items-center justify-center space-x-4 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
               <Zap size={32} className="text-primary" fill="currentColor" />
               <h1 className="text-4xl font-black font-outfit tracking-tighter italic">
                  <span className="text-primary">EXIT</span><span className="text-accent">-IT</span>
               </h1>
            </div>
            <div className="space-y-4">
               <p className="text-xs font-black opacity-30 tracking-[0.6em] uppercase">
                  © {new Date().getFullYear()} Aman Baye — High Fidelity Educational Systems
               </p>
               <div className="flex flex-wrap items-center justify-center gap-12 pt-4">
                  {['Privacy Policy', 'Terms of Use', 'MOE Standards'].map(link => (
                    <Link key={link} to="/" className="text-[10px] font-black opacity-40 uppercase tracking-widest hover:text-primary transition-colors">{link}</Link>
                  ))}
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
