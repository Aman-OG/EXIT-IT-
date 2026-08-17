import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Brain, Trophy, ArrowRight, Sparkles, Zap, Target, 
  FlaskConical, CheckCircle2, ShieldCheck, 
  Code, Database, Globe, Network, Cpu, ArrowUpRight, Award,
  Star, ChevronRight
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
  { title: 'Information Assurance and Security', code: 'IAS315', category: 'Security', icon: ShieldCheck },
];

const CATEGORIES = ['All', 'Software Dev', 'Networking', 'Databases', 'Hardware & Systems', 'Management', 'Security'];

const LandingPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [starCount, setStarCount] = useState(null);

  // Fetch live GitHub Stars count
  useEffect(() => {
    fetch('https://api.github.com/repos/Aman-OG/EXIT-IT-')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch repo data');
        return res.json();
      })
      .then(data => {
        if (typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // Fallback gracefully
        setStarCount(null);
      });
  }, []);

  const filteredCourses = activeCategory === 'All' 
    ? COURSES_LIST 
    : COURSES_LIST.filter(c => c.category.toLowerCase().includes(activeCategory.toLowerCase()) || (activeCategory === 'Software Dev' && (c.category === 'Web Dev' || c.category === 'Mobile & Web')));

  return (
    <div className="min-h-screen bg-background text-text font-inter selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden relative">
      
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 md:px-12 py-3 border-b border-text/5 bg-background/85 backdrop-blur-xl transition-all h-16 flex items-center">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group cursor-pointer">
            <ExitItLogo size={30} />
            <span className="text-xl sm:text-2xl font-black font-outfit tracking-tighter">
              <span className="text-primary">EX-</span><span className="text-accent italic">IT</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-3.5">
            {/* GitHub Star Button */}
            <a
              href="https://github.com/Aman-OG/EXIT-IT-"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-text/5 hover:bg-text/10 border border-text/10 text-xs font-bold transition-all active:scale-95 group shadow-sm"
              title="Star EXIT-IT on GitHub"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
              <span className="hidden xs:inline font-bold">Star</span>
              <Star size={13} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
              {starCount !== null && (
                <span className="px-1.5 py-0.5 bg-text/10 rounded-full text-[10px] sm:text-[11px] font-black text-text/80">
                  {starCount}
                </span>
              )}
            </a>

            <Link 
              to="/login" 
              className="text-[11px] sm:text-xs font-black opacity-70 hover:opacity-100 transition-all uppercase tracking-widest px-2 sm:px-3 py-2"
            >
              Log in
            </Link>

            <Link 
              to="/register" 
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-text text-background text-[11px] sm:text-xs font-black rounded-full hover:opacity-90 transition-all active:scale-95 uppercase tracking-wider shadow-md flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={13} className="hidden sm:inline" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex items-center min-h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-text/5 border border-text/10 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-text/70">
              <Sparkles size={13} className="text-primary animate-pulse" />
              <span>ETHIOPIAN NATIONAL EXIT EXAM ECOSYSTEM</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-outfit tracking-tighter leading-[1.08] sm:leading-[1.02]">
              Your IT Exit Exam <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent italic">
                Companion.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-text/70 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Complete study companion for all 15 Ministry of Education exit exam courses. Interactive quizzes, official mock exams, and chapter breakdowns designed for high scores.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-text text-background font-black text-xs sm:text-sm rounded-full hover:opacity-90 transition-all shadow-xl flex items-center justify-center space-x-2.5 tracking-wider uppercase group active:scale-95"
              >
                <span>Start Practicing Free</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a 
                href="#courses"
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-text/5 hover:bg-text/10 border border-text/10 text-text font-bold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center space-x-2 tracking-wider uppercase text-center active:scale-95"
              >
                <span>Explore 15 Courses</span>
              </a>
            </div>

            {/* Micro proof badges */}
            <div className="pt-3 flex items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-text/60 font-semibold flex-wrap">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>15 MOE Courses</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>860+ Questions</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>100% Free</span>
              </div>
            </div>

          </div>

          {/* Right Column: Graduation Hat Visual Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]">
              
              {/* Glass Frame Card */}
              <div className="p-2 sm:p-2.5 rounded-3xl bg-card border border-text/10 shadow-2xl overflow-hidden relative group">
                <img 
                  src={graduationHat} 
                  alt="Graduation Cap and Diploma" 
                  className="w-full h-auto object-cover rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-[1.02] max-h-[360px]"
                />
                
                {/* Floating pill badge on the image */}
                <div className="absolute bottom-5 left-5 right-5 p-3 rounded-2xl bg-background/90 backdrop-blur-md border border-text/10 shadow-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <Award size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-tight leading-tight">National Exit Standard</p>
                      <p className="text-[10px] text-text/60 font-medium">100% Aligned Curriculum</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-primary/10 text-primary rounded-full uppercase">
                    15/15 Active
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* KPI DASHBOARD HIGHLIGHTS (3 Cards) */}
      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 md:px-12 border-y border-text/10 bg-text/[0.02]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 border-b border-text/10 pb-5">
            <div>
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-1">
                TRUSTED BY FUTURE IT GRADUATES
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-outfit tracking-tight">
                National Benchmarks & Platform Standards
              </h2>
            </div>
            <p className="text-xs font-bold text-text/50 uppercase tracking-wider">
              Mapped To Official Ministry of Education Specs
            </p>
          </div>

          {/* 3 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Card 1 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-text/10 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between space-y-5 group">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit text-primary tracking-tight">15 / 15</span>
                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                  <BookOpen size={22} />
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-outfit tracking-tight">All 15 Courses Covered</h3>
                <p className="text-xs text-text/60 font-medium mt-1 leading-relaxed">
                  100% comprehensive coverage of all Ministry of Education required IT exit exam courses.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-text/10 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-5 group">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit text-emerald-500 tracking-tight">860+</span>
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                  <Award size={22} />
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-outfit tracking-tight">Practice Exam Questions</h3>
                <p className="text-xs text-text/60 font-medium mt-1 leading-relaxed">
                  Carefully segmented quizzes with in-depth rationales for every single option.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-text/10 shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-5 group">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit text-accent tracking-tight">100%</span>
                <div className="p-3 bg-accent/10 rounded-2xl text-accent group-hover:scale-110 transition-transform">
                  <Brain size={22} />
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-outfit tracking-tight">Free For All Students</h3>
                <p className="text-xs text-text/60 font-medium mt-1 leading-relaxed">
                  Open educational access designed specifically for Ethiopian university graduates.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CURRICULUM SECTION: ALL 15 COURSES */}
      <section id="courses" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-10 sm:space-y-12">
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Full Curriculum</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit tracking-tight">
            All 15 Exit Exam Courses
          </h2>
          <p className="text-sm sm:text-base text-text/60 font-medium max-w-2xl">
            Everything required by the Ethiopian Ministry of Education for IT exit examination, organized and ready to practice.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-text/5 hover:bg-text/10 text-text/70 border border-text/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCourses.map((course) => {
            const IconComp = course.icon;
            return (
              <div 
                key={course.code} 
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-text/10 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg space-y-3.5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black px-2.5 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                      {course.code}
                    </span>
                    <div className="p-2 bg-text/5 rounded-xl text-text/60 group-hover:text-primary transition-colors">
                      <IconComp size={16} />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black font-outfit tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-text/5">
                  <span className="text-[11px] text-text/50 font-bold uppercase tracking-wider">
                    {course.category}
                  </span>
                  <Link 
                    to="/register" 
                    className="text-xs font-bold text-primary flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Practice</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE CAPABILITIES: "Start your journey." (3 Columns) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-text/[0.02] border-y border-text/5">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          <div className="space-y-3 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit tracking-tight">
              Start your journey.
            </h2>
            <p className="text-sm sm:text-base text-text/60 font-medium max-w-2xl">
              Turn your preparation into high-scoring performance with focused practice and clear explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Column 1 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-text/10 space-y-5 hover:border-text/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-text/5 border border-text/10 flex items-center justify-center text-text">
                  <BookOpen size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black font-outfit tracking-tight">Be inspired.</h3>
                  <p className="text-xs sm:text-sm text-text/70 font-medium leading-relaxed">
                    Master all 15 exit exam courses with structured chapter breakdowns, downloadable PDFs, and targeted summary guides.
                  </p>
                </div>
              </div>
              <Link to="/register" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-primary hover:underline pt-2">
                <span>EXPLORE COURSES</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Column 2 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-text/10 space-y-5 hover:border-text/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Brain size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black font-outfit tracking-tight">Practice & Learn.</h3>
                  <p className="text-xs sm:text-sm text-text/70 font-medium leading-relaxed">
                    Test yourself with over 860 practice questions with comprehensive explanations for both right and wrong choices.
                  </p>
                </div>
              </div>
              <Link to="/register" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-primary hover:underline pt-2">
                <span>START QUIZZES</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Column 3 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-text/10 space-y-5 hover:border-text/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <FlaskConical size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black font-outfit tracking-tight">Equip yourself.</h3>
                  <p className="text-xs sm:text-sm text-text/70 font-medium leading-relaxed">
                    Simulate official MOE timed exams, measure real accuracy percentiles, and track your streak and progress nationwide.
                  </p>
                </div>
              </div>
              <Link to="/register" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-primary hover:underline pt-2">
                <span>TAKE MOCK EXAMS</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: The Architect (Aman Baye) - PRESERVED EXACT TEXT & PHOTO */}
      <section className={`py-20 sm:py-28 px-4 sm:px-6 md:px-12 relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 sm:gap-16 relative z-10">
          
          {/* Creator Photo - Kept exact photo path & styling */}
          <div className="relative shrink-0 group">
            <div className="absolute -inset-3 sm:-inset-4 bg-primary/20 rounded-[36px] sm:rounded-[48px] group-hover:scale-105 transition-transform duration-500 -rotate-2" />
            <img 
              src="/aman-baye.jpg" 
              alt="Aman Baye" 
              className="w-[260px] h-[320px] sm:w-[360px] sm:h-[420px] md:w-[400px] md:h-[460px] object-cover rounded-[32px] sm:rounded-[40px] relative z-10 shadow-2xl border-4 border-primary/30" 
            />
          </div>
          
          {/* Creator Details - Kept exact text */}
          <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.35em]">Designed & Engineered By</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-outfit tracking-tighter italic">
                Aman Baye.
              </h2>
              <div className={`h-1.5 w-20 sm:w-24 rounded-full mx-auto lg:mx-0 ${theme === 'dark' ? 'bg-white' : 'bg-slate-950'}`} />
            </div>

            <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug">
              "IT student building practical tools to make studying simpler and more effective."
            </p>
            
            <p className="text-sm sm:text-base md:text-lg opacity-80 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              EX-IT was created to turn the pressure of a 15-course exit exam into a clear, structured path, so students can focus on learning, not just surviving the workload.
            </p>

            <div className="pt-2 flex justify-center lg:justify-start">
              <a 
                href="https://github.com/Aman-OG/EXIT-IT-" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`inline-flex items-center space-x-3.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 ${theme === 'dark' ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                <div className="text-left">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-[9px] sm:text-[10px] font-black opacity-50 uppercase tracking-widest leading-none">GitHub Repo</p>
                    {starCount !== null && (
                      <span className="flex items-center space-x-0.5 text-[9px] font-black text-amber-400">
                        <Star size={10} fill="currentColor" />
                        <span>{starCount}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-black tracking-tight leading-none uppercase mt-0.5">AMAN-OG / EXIT-IT</p>
                </div>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALLOUT SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-card p-6 sm:p-10 md:p-14 rounded-3xl border border-text/10 shadow-2xl">
          
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit tracking-tighter">
              Get started today.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-text/70 font-medium leading-relaxed">
              Join your classmates on EX-IT. Prepare with confidence, track your daily streak, and master every concept required for the Ethiopian National Exit Exam.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center sm:items-start justify-center sm:justify-start gap-3 sm:gap-5 text-xs sm:text-sm font-bold text-text/70">
              <span className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Instant Free Setup</span>
              </span>
              <span className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>All 15 Courses Included</span>
              </span>
              <span className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>No Credit Card Required</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-background p-6 sm:p-8 rounded-2xl border border-text/10 shadow-lg text-center space-y-5">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto">
              <Zap size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-black font-outfit tracking-tight">Start Your Journey</h3>
              <p className="text-xs text-text/60 font-medium">Create your free account and access all study materials immediately.</p>
            </div>
            <div className="space-y-2.5 pt-1">
              <Link 
                to="/register" 
                className="w-full py-3.5 bg-text text-background text-xs font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-wider block shadow-md active:scale-95"
              >
                Create Free Account
              </Link>
              <Link 
                to="/login" 
                className="w-full py-3 bg-text/5 hover:bg-text/10 text-text text-xs font-bold rounded-xl transition-all uppercase tracking-wider block text-center active:scale-95 border border-text/5"
              >
                Log In
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 border-t border-text/10 bg-background text-center px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex items-center justify-center space-x-2.5">
            <ExitItLogo size={28} />
            <span className="text-2xl sm:text-3xl font-black font-outfit tracking-tighter">
              <span className="text-primary">EX-</span><span className="text-accent italic">IT</span>
            </span>
          </div>

          <p className="text-[11px] sm:text-xs font-bold text-text/40 tracking-widest uppercase max-w-xl mx-auto">
            © {new Date().getFullYear()} Aman Baye — High Fidelity Educational Systems for Ethiopian Universities
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
