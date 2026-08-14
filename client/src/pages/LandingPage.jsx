import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Brain, Trophy, ArrowRight, Sparkles, Zap, Target, 
  Sun, Moon, FlaskConical, CheckCircle2, ShieldCheck, 
  Code, Database, Globe, Network, Cpu, ArrowUpRight, Award 
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import ExitItLogo from '../components/ExitItLogo';
import graduationHat from '../assets/graduation hat.jpg';

const COURSES_LIST = [
  { title: 'Computer Maintenance and Technical Support', code: 'CMTS301', category: 'Hardware & Systems', icon: Cpu },
  { title: 'Object-Oriented Programming in Java', code: 'OOP302', category: 'Software Dev', icon: Code },
  { title: 'IT Project Management', code: 'ITPM303', category: 'Management', icon: Target },
  { title: 'Event-Driven Programming', code: 'EDP304', category: 'Software Dev', icon: Code },
  { title: 'System Analysis and Design', code: 'SAD305', category: 'Systems', icon: Brain },
  { title: 'Advanced Programming', code: 'AP306', category: 'Software Dev', icon: Code },
  { title: 'Fundamentals of Database Systems', code: 'FDS307', category: 'Databases', icon: Database },
  { title: 'Advanced Database Systems', code: 'ADS308', category: 'Databases', icon: Database },
  { title: 'Internet Programming I', code: 'IP1309', category: 'Web Dev', icon: Globe },
  { title: 'Internet Programming II', code: 'IP2310', category: 'Web Dev', icon: Globe },
  { title: 'Mobile Application Development', code: 'MAD311', category: 'Mobile & Web', icon: Globe },
  { title: 'Data Communications & Computer Networks', code: 'DCCN312', category: 'Networking', icon: Network },
  { title: 'System and Network Administration', code: 'SNA313', category: 'Networking', icon: Network },
  { title: 'Network Devices and Configuration', code: 'NDC314', category: 'Networking', icon: Network },
];

const LandingPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-text font-inter selection:bg-primary/30 transition-colors duration-500 overflow-x-hidden">
      
      {/* Navigation - Reduced height header */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-3 border-b border-text/5 bg-background/80 backdrop-blur-2xl transition-colors h-16 flex items-center">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group cursor-pointer">
            <ExitItLogo size={32} />
            <h1 className="text-2xl font-black font-outfit tracking-tighter">
              <span className="text-primary">EX-</span><span className="text-accent italic">IT</span>
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 bg-text/5 hover:bg-text/10 rounded-full transition-all active:scale-90 border border-text/10"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
            </button>

            <Link 
              to="/login" 
              className="text-xs font-black opacity-70 hover:opacity-100 transition-all uppercase tracking-widest px-3 py-2"
            >
              Log in
            </Link>

            <Link 
              to="/register" 
              className="px-5 py-2.5 bg-text text-background text-xs font-black rounded-full hover:opacity-90 transition-all active:scale-95 uppercase tracking-widest shadow-lg flex items-center space-x-2"
            >
              <span>Start Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION: Fits full page height so CTAs & image are immediately visible */}
      <section className="relative min-h-[calc(100vh-4rem)] pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-text/5 border border-text/10 text-[11px] font-bold tracking-wider uppercase text-text/70">
              <Sparkles size={13} className="text-primary" />
              <span>ETHIOPIAN NATIONAL EXIT EXAM ECOSYSTEM</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-outfit tracking-tighter leading-[1.02]">
              Your IT Exit Exam <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent italic">
                Companion.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-text/70 font-medium leading-relaxed max-w-2xl">
              Your intelligent preparation ecosystem for all 14 courses. Designed to build confidence and ensure absolute academic success.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-text text-background font-black text-xs sm:text-sm rounded-full hover:opacity-90 transition-all shadow-2xl flex items-center justify-center space-x-3 tracking-wider uppercase group"
              >
                <span>Start Your Journey</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/login" 
                className="px-7 py-4 bg-text/5 hover:bg-text/10 border border-text/10 text-text font-bold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center space-x-2 tracking-wider uppercase text-center"
              >
                <span>Log In To Account</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Graduation Hat Image */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px]">
              <div className="p-2.5 rounded-3xl bg-card border border-text/10 shadow-2xl overflow-hidden">
                <img 
                  src={graduationHat} 
                  alt="Graduation Hat" 
                  className="w-full h-auto object-cover rounded-2xl shadow-md max-h-[380px]"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FULL-WIDTH KPI DASHBOARD CARDS SECTION - 3 CARDS ONLY */}
      <section className="w-full py-16 px-6 md:px-12 border-y border-text/10 bg-text/[0.02]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-text/10 pb-6">
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-1">
                TRUSTED BY FUTURE LEADERS OF ETHIOPIA
              </p>
              <h2 className="text-2xl sm:text-3xl font-black font-outfit tracking-tighter">
                National Benchmarks & Platform Standards
              </h2>
            </div>
            <p className="text-xs font-bold text-text/50 uppercase tracking-widest">
              Mapped To Official Ministry of Education Specs
            </p>
          </div>

          {/* KPI Cards Grid (3 Cards Only) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI Card 1: 14/14 Courses */}
            <div className="p-8 rounded-3xl bg-card border border-text/10 shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
              <div className="flex items-center justify-between">
                <span className="text-4xl md:text-5xl font-black font-outfit text-primary tracking-tight">14 / 14</span>
                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black font-outfit tracking-tight">MOE Standards Aligned</h3>
                <p className="text-xs text-text/60 font-medium mt-1 leading-relaxed">
                  100% comprehensive coverage of all Ministry of Education required IT exit exam courses.
                </p>
              </div>
            </div>

            {/* KPI Card 2: 100% Free */}
            <div className="p-8 rounded-3xl bg-card border border-text/10 shadow-lg hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
              <div className="flex items-center justify-between">
                <span className="text-4xl md:text-5xl font-black font-outfit text-emerald-500 tracking-tight">100%</span>
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black font-outfit tracking-tight">Free For All Students</h3>
                <p className="text-xs text-text/60 font-medium mt-1 leading-relaxed">
                  Open educational access designed specifically for Ethiopian university graduates.
                </p>
              </div>
            </div>

            {/* KPI Card 3: AI-Powered */}
            <div className="p-8 rounded-3xl bg-card border border-text/10 shadow-lg hover:shadow-2xl hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit text-accent tracking-tight">AI-Powered</span>
                <div className="p-3 bg-accent/10 rounded-2xl text-accent group-hover:scale-110 transition-transform">
                  <Brain size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black font-outfit tracking-tight">Smart Analytics & Tutors</h3>
                <p className="text-xs text-text/60 font-medium mt-1 leading-relaxed">
                  Instant concept explanations, automated summaries, and personalized progress tracking.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: 14 COURSES SHOWCASE */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Complete Curriculum</span>
          <h2 className="text-4xl sm:text-5xl font-black font-outfit tracking-tighter">
            All 14 Exit Exam Courses
          </h2>
          <p className="text-lg text-text/60 font-medium max-w-2xl">
            Everything required by the Ethiopian Ministry of Education for IT exit examination, organized and ready to study.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES_LIST.map((course, idx) => {
            const IconComp = course.icon;
            return (
              <div 
                key={course.code} 
                className="p-6 rounded-3xl bg-card border border-text/10 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                    {course.code}
                  </span>
                  <div className="p-2 bg-text/5 rounded-xl text-text/60 group-hover:text-primary transition-colors">
                    <IconComp size={18} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black font-outfit tracking-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-text/50 font-bold mt-1 uppercase tracking-wider">
                    {course.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: "Start your journey." (3-Column Layout) */}
      <section className="py-24 px-6 md:px-12 bg-text/[0.02] border-y border-text/5">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black font-outfit tracking-tighter">
              Start your journey.
            </h2>
            <p className="text-lg text-text/60 font-medium max-w-2xl">
              Come as you are. Bring your dedication, your brilliance, and your goals — let's turn your preparation into high-scoring performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1 */}
            <div className="p-8 rounded-3xl bg-card border border-text/10 space-y-6 hover:border-text/30 transition-all duration-300 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-text/5 border border-text/10 flex items-center justify-center text-text">
                <BookOpen size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black font-outfit tracking-tight">Be inspired.</h3>
                <p className="text-sm text-text/70 font-medium leading-relaxed">
                  Master all 14 exit exam courses with structured chapter breakdowns, downloadable PDFs, and targeted summary guides.
                </p>
              </div>
              <Link to="/register" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-primary hover:underline">
                <span>EXPLORE COURSES</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Column 2 */}
            <div className="p-8 rounded-3xl bg-card border border-text/10 space-y-6 hover:border-text/30 transition-all duration-300 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Brain size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black font-outfit tracking-tight">Get AI intelligence.</h3>
                <p className="text-sm text-text/70 font-medium leading-relaxed">
                  Get instant explanations for difficult concepts, AI-generated chapter summaries, and auto-created flashcard decks.
                </p>
              </div>
              <Link to="/register" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-primary hover:underline">
                <span>TRY AI TOOLS</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Column 3 */}
            <div className="p-8 rounded-3xl bg-card border border-text/10 space-y-6 hover:border-text/30 transition-all duration-300 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <FlaskConical size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black font-outfit tracking-tight">Equip yourself.</h3>
                <p className="text-sm text-text/70 font-medium leading-relaxed">
                  Simulate official MOE timed exams, measure real accuracy percentiles, and track your streak against classmates nationwide.
                </p>
              </div>
              <Link to="/register" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-primary hover:underline">
                <span>TAKE MOCK EXAMS</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: The Architect (Aman Baye) - PRESERVED EXACT TEXT & PHOTO */}
      <section className={`py-28 px-6 md:px-12 relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Creator Photo - Kept exact photo path & styling */}
          <div className="relative shrink-0 group">
            <div className="absolute -inset-4 bg-primary/20 rounded-[48px] group-hover:scale-105 transition-transform duration-500 -rotate-2" />
            <img 
              src="/aman-baye.jpg" 
              alt="Aman Baye" 
              className="w-[340px] h-[400px] sm:w-[400px] sm:h-[460px] object-cover rounded-[40px] relative z-10 shadow-2xl border-4 border-primary/30" 
            />
          </div>
          
          {/* Creator Details - Kept exact text */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <p className="text-xs font-black text-primary uppercase tracking-[0.4em]">Designed & Engineered By</p>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black font-outfit tracking-tighter italic">
                Aman Baye.
              </h2>
              <div className={`h-1.5 w-24 rounded-full mx-auto lg:mx-0 ${theme === 'dark' ? 'bg-white' : 'bg-slate-950'}`} />
            </div>

            <p className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              "IT student building practical tools to make studying simpler and more effective."
            </p>
            
            <p className="text-base sm:text-lg opacity-80 font-medium leading-relaxed max-w-2xl">
              EX-IT was created to turn the pressure of a 14-course exit exam into a clear, structured path, so students can focus on learning, not just surviving the workload.
            </p>

            <div className="pt-4 flex justify-center lg:justify-start">
              <a 
                href="https://github.com/aman-og" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`inline-flex items-center space-x-4 px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl ${theme === 'dark' ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}
              >
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                <div className="text-left">
                  <p className="text-[10px] font-black opacity-50 uppercase tracking-widest leading-none mb-1">Github Repository</p>
                  <p className="text-sm font-black tracking-tight leading-none uppercase">AMAN-OG</p>
                </div>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: "Get started today." Callout Section */}
      <section className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-card p-10 md:p-16 rounded-3xl border border-text/10 shadow-2xl">
          
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black font-outfit tracking-tighter">
              Get started today.
            </h2>
            <p className="text-lg text-text/70 font-medium leading-relaxed">
              Join your classmates on EX-IT. Prepare with confidence, track your daily streak, and master every concept required for the Ethiopian National Exit Exam.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-text/60">
              <span className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Instant Account Setup</span>
              </span>
              <span className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Full Access to 14 Courses</span>
              </span>
              <span className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>No Credit Card Required</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-background p-8 rounded-2xl border border-text/10 shadow-lg text-center space-y-6">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto">
              <Zap size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black font-outfit tracking-tight">Start Your Journey</h3>
              <p className="text-xs text-text/60 font-medium">Create your free account and access all study materials immediately.</p>
            </div>
            <div className="space-y-3 pt-2">
              <Link 
                to="/register" 
                className="w-full py-4 bg-text text-background text-xs font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-wider block shadow-md"
              >
                Create Account
              </Link>
              <Link 
                to="/login" 
                className="w-full py-3 bg-text/5 hover:bg-text/10 text-text text-xs font-bold rounded-xl transition-all uppercase tracking-wider block text-center"
              >
                Log In
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-text/10 bg-background text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex items-center justify-center space-x-2.5">
            <ExitItLogo size={32} />
            <h1 className="text-3xl font-black font-outfit tracking-tighter">
              <span className="text-primary">EX-</span><span className="text-accent italic">IT</span>
            </h1>
          </div>

          <p className="text-xs font-bold text-text/40 tracking-widest uppercase">
            © {new Date().getFullYear()} Aman Baye — High Fidelity Educational Systems for Ethiopian Universities
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
