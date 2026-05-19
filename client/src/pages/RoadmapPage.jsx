import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import { Target, Star, BookOpen, TrendingUp, Loader2, Filter, ArrowRight, Award, CheckCircle2, Clock, Zap } from 'lucide-react';

const FILTERS = [
  { key: 'all', label: 'All Courses' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'not_started', label: 'Not Started' },
];

const RoadmapPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [overallData, setOverallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [issuingCert, setIssuingCert] = useState(null);
  const [certSuccess, setCertSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roadmapRes, overallRes] = await Promise.all([
          api.get('/progress/roadmap'),
          api.get('/progress/overall-course'),
        ]);
        setCourses(roadmapRes.data);
        setOverallData(overallRes.data);
      } catch (err) {
        console.error('Failed to load roadmap data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const overallPct = Number(overallData?.overall_progress) || 0;
  const totalCourses = Number(overallData?.total_courses) || 0;
  const startedCourses = Number(overallData?.started_courses) || 0;
  const completedCourses = courses.filter(c => Number(c.progress_percentage) >= 70).length;
  const inProgressCourses = startedCourses - completedCourses > 0 ? startedCourses - completedCourses : 0;
  const notStartedCourses = totalCourses - startedCourses;

  // Filter courses
  const filteredCourses = useMemo(() => {
    switch (activeFilter) {
      case 'in_progress':
        return courses.filter(c => { const p = Number(c.progress_percentage) || 0; return p > 0 && p < 70; });
      case 'completed':
        return courses.filter(c => Number(c.progress_percentage) >= 70);
      case 'not_started':
        return courses.filter(c => Number(c.progress_percentage) === 0);
      default:
        return courses;
    }
  }, [courses, activeFilter]);

  // Find recommended course: lowest progress that's not completed, preferring not-started
  const recommendedCourse = courses.reduce((best, c) => {
    const pct = Number(c.progress_percentage) || 0;
    if (pct >= 70) return best;
    if (!best) return c;
    const bestPct = Number(best.progress_percentage) || 0;
    if (pct < bestPct) return c;
    return best;
  }, null);

  const handleCourseClick = (course) => {
    localStorage.setItem('expanded_course_id', course.course_id);
    navigate('/courses');
  };

  const handleGetCertificate = async (courseId) => {
    setIssuingCert(courseId);
    try {
      const res = await api.post(`/progress/certificates/${courseId}`);
      setCertSuccess(res.data.certificate_code);
      setTimeout(() => setCertSuccess(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIssuingCert(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 size={40} className="text-primary animate-spin" />
          <p className="text-text/50 font-semibold">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Study Roadmap</h1>
          <p className="text-text/60 text-sm">Track your progress across all courses and plan your study journey.</p>
        </div>
      </div>

      {/* Overall Progress — Enhanced Visual */}
      <div className="relative bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
        
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            
            {/* Left: Progress ring + percentage */}
            <div className="flex items-center space-x-6 flex-shrink-0">
              {/* Circular progress indicator */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-neutral-100 dark:text-neutral-800" />
                  <circle 
                    cx="50" cy="50" r="42" fill="none" 
                    stroke="url(#progressGrad)" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    strokeDasharray={`${overallPct * 2.64} ${264 - overallPct * 2.64}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(var(--primary))" />
                      <stop offset="100%" stopColor="rgb(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-text">{overallPct}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-text/40 uppercase tracking-widest mb-1">Overall Progress</p>
                <p className="text-sm text-text/60 leading-relaxed">
                  {overallPct === 0 
                    ? "Start studying to track your progress!" 
                    : overallPct >= 70 
                      ? "Great work! You're well prepared." 
                      : "Keep going — every course counts!"}
                </p>
              </div>
            </div>

            {/* Right: Stats cards */}
            <div className="flex-1 grid grid-cols-3 gap-3 lg:gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-center group hover:bg-emerald-500/10 transition-colors cursor-default">
                <div className="flex items-center justify-center space-x-1.5 mb-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">Completed</span>
                </div>
                <p className="text-3xl font-black text-emerald-500">{completedCourses}</p>
                <p className="text-[10px] text-text/30 mt-0.5">of {totalCourses} courses</p>
              </div>
              
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-center group hover:bg-amber-500/10 transition-colors cursor-default">
                <div className="flex items-center justify-center space-x-1.5 mb-1.5">
                  <Zap size={14} className="text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70">In Progress</span>
                </div>
                <p className="text-3xl font-black text-amber-500">{inProgressCourses}</p>
                <p className="text-[10px] text-text/30 mt-0.5">active now</p>
              </div>
              
              <div className="bg-neutral-500/5 border border-neutral-500/10 rounded-xl p-4 text-center group hover:bg-neutral-500/10 transition-colors cursor-default">
                <div className="flex items-center justify-center space-x-1.5 mb-1.5">
                  <Clock size={14} className="text-text/40" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text/40">Not Started</span>
                </div>
                <p className="text-3xl font-black text-text/50">{notStartedCourses}</p>
                <p className="text-[10px] text-text/30 mt-0.5">remaining</p>
              </div>
            </div>
          </div>

          {/* Progress bar spanning full width */}
          <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/50">
            <ProgressBar percentage={overallPct} size="lg" showLabel={false} />
            {/* Exam mode teaser */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-xs text-text/40">
                <Award size={13} />
                <span className="font-semibold">
                  {overallPct >= 50 
                    ? "✅ Exam Mode is ready — you've passed the 50% milestone!" 
                    : `🎯 ${50 - overallPct}% more to reach the recommended Exam threshold`}
                </span>
              </div>
              <button 
                onClick={() => navigate('/exam')}
                className="text-[11px] font-bold text-primary/60 hover:text-primary transition-colors hidden md:block"
              >
                Go to Exam →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Course — Actionable */}
      {recommendedCourse && (
        <div className="relative bg-gradient-to-r from-amber-500/5 via-amber-500/8 to-amber-500/5 border border-amber-400/20 rounded-2xl p-5 md:p-6 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-amber-500/10 group-hover:to-amber-500/5 transition-all duration-500" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover:scale-110 transition-transform flex-shrink-0 shadow-sm border border-amber-500/10">
                <Star size={24} fill="currentColor" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/60 mb-0.5">⭐ Recommended Next</p>
                <p className="font-bold text-text truncate text-lg">{recommendedCourse.title}</p>
                <p className="text-xs text-text/40 mt-0.5">
                  {Number(recommendedCourse.progress_percentage) === 0 
                    ? '🆕 Not started yet — begin your journey here' 
                    : `📊 ${recommendedCourse.progress_percentage}% complete — pick up where you left off`}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleCourseClick(recommendedCourse)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/20 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-md flex-shrink-0"
            >
              {Number(recommendedCourse.progress_percentage) > 0 ? (
                <>
                  <TrendingUp size={16} />
                  <span>Continue Course</span>
                </>
              ) : (
                <>
                  <ArrowRight size={16} />
                  <span>Start Course</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Course Grid Header + Filters */}
      {courses.length === 0 ? (
        <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-16 text-center">
          <BookOpen size={48} className="mx-auto text-text/30 mb-4" />
          <p className="text-text/60 text-lg">No courses available yet.</p>
          <p className="text-text/40 text-sm mt-2">Courses will appear here once they're added to the system.</p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-bold text-text flex items-center space-x-2">
              <BookOpen size={20} className="text-primary" />
              <span>All Courses</span>
              <span className="text-text/30 font-medium text-sm ml-1">({courses.length})</span>
            </h2>
            
            {/* Filter pills */}
            <div className="flex items-center space-x-1.5 bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl p-1">
              {FILTERS.map(f => {
                const count = f.key === 'all' ? courses.length 
                  : f.key === 'completed' ? completedCourses 
                  : f.key === 'in_progress' ? inProgressCourses 
                  : notStartedCourses;
                return (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      activeFilter === f.key 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-text/50 hover:text-text hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      activeFilter === f.key 
                        ? 'bg-primary-foreground/20 text-primary-foreground' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-text/40'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-card/50 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
              <Filter size={32} className="mx-auto text-text/20 mb-3" />
              <p className="text-text/40 font-semibold">No courses match this filter</p>
              <button onClick={() => setActiveFilter('all')} className="text-xs text-primary font-bold mt-2 hover:underline">Show all courses</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCourses.map((course, idx) => (
                <div key={course.course_id} className="flex flex-col">
                  <CourseCard
                    course={course}
                    index={idx}
                    isRecommended={recommendedCourse?.course_id === course.course_id}
                    onClick={() => handleCourseClick(course)}
                  />
                  {Number(course.progress_percentage) >= 70 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleGetCertificate(course.course_id || course.id); }}
                      disabled={issuingCert === (course.course_id || course.id)}
                      className="mt-2 w-full flex items-center justify-center space-x-2 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl text-xs font-bold hover:bg-accent/20 transition disabled:opacity-50"
                    >
                      <Award size={12} />
                      <span>{issuingCert === (course.course_id || course.id) ? 'Issuing...' : 'Get Certificate'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certificate success toast */}
      {certSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-accent text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm animate-in slide-in-from-bottom-4 duration-300">
          ✅ Certificate issued! Code: {certSuccess}
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
