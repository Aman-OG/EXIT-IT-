import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { BookOpen, CheckCircle2, Clock, Star, ArrowRight, Play, Download } from 'lucide-react';

const courseGradients = [
  { card: 'from-blue-500/10 to-blue-600/5', icon: 'bg-blue-500/10', accent: 'text-blue-500' },
  { card: 'from-emerald-500/10 to-emerald-600/5', icon: 'bg-emerald-500/10', accent: 'text-emerald-500' },
  { card: 'from-violet-500/10 to-violet-600/5', icon: 'bg-violet-500/10', accent: 'text-violet-500' },
  { card: 'from-amber-500/10 to-amber-600/5', icon: 'bg-amber-500/10', accent: 'text-amber-500' },
  { card: 'from-rose-500/10 to-rose-600/5', icon: 'bg-rose-500/10', accent: 'text-rose-500' },
  { card: 'from-cyan-500/10 to-cyan-600/5', icon: 'bg-cyan-500/10', accent: 'text-cyan-500' },
  { card: 'from-indigo-500/10 to-indigo-600/5', icon: 'bg-indigo-500/10', accent: 'text-indigo-500' },
  { card: 'from-teal-500/10 to-teal-600/5', icon: 'bg-teal-500/10', accent: 'text-teal-500' },
];

const CourseCard = ({ course, index, isRecommended, onClick }) => {
  const pct = Number(course.progress_percentage) || 0;
  const [showCheck, setShowCheck] = useState(false);

  // Trigger check animation for completed courses
  useEffect(() => {
    if (pct >= 70) {
      const timer = setTimeout(() => setShowCheck(true), 300 + index * 100);
      return () => clearTimeout(timer);
    }
  }, [pct, index]);
  
  // Determine status styling — using INLINE STYLES for border to guarantee visibility
  const getStatusConfig = () => {
    if (pct >= 70) return { 
      label: 'Completed', 
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      badgeBorder: 'border-emerald-500/20',
      dot: 'bg-emerald-500',
      dotAnim: '',
      borderStyle: { borderColor: 'rgb(16, 185, 129)', borderWidth: '2px' },
      hoverShadow: '0 8px 30px -6px rgba(16, 185, 129, 0.25)',
      bgTint: 'bg-emerald-500/5',
    };
    if (pct > 0) return { 
      label: 'In Progress', 
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-600 dark:text-amber-400',
      badgeBorder: 'border-amber-500/20',
      dot: 'bg-amber-500',
      dotAnim: 'animate-pulse',
      borderStyle: { borderColor: 'rgb(245, 158, 11)', borderWidth: '2px' },
      hoverShadow: '0 8px 30px -6px rgba(245, 158, 11, 0.25)',
      bgTint: 'bg-amber-500/5',
    };
    return { 
      label: 'Not Started', 
      badgeBg: 'bg-neutral-500/10 dark:bg-neutral-800',
      badgeText: 'text-neutral-500 dark:text-neutral-400',
      badgeBorder: 'border-neutral-200 dark:border-neutral-700',
      dot: 'bg-neutral-400',
      dotAnim: '',
      borderStyle: { borderColor: 'rgba(148, 163, 184, 0.3)', borderWidth: '2px' },
      hoverShadow: '0 8px 30px -6px rgba(var(--primary), 0.15)',
      bgTint: '',
    };
  };

  const status = getStatusConfig();
  const theme = courseGradients[index % courseGradients.length];

  return (
    <div
      onClick={onClick}
      style={status.borderStyle}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = status.hoverShadow}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={`relative bg-card ${status.bgTint} rounded-2xl p-5 flex flex-col text-left hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden cursor-pointer ${isRecommended ? 'ring-2 ring-amber-400/50 ring-offset-2 ring-offset-background' : ''}`}
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.card} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Recommended badge */}
      {isRecommended && !showCheck && (
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-300 dark:border-amber-500/30 z-10 shadow-sm">
          <Star size={10} fill="currentColor" />
          <span>Up Next</span>
        </div>
      )}

      {/* Completed check — animated pop-in */}
      {pct >= 70 && (
        <div className={`absolute top-3 right-3 z-10 transition-all duration-500 ${showCheck ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="bg-emerald-500 rounded-full p-1.5 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 size={16} className="text-white" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Course icon + title */}
      <div className="relative z-10 flex items-start space-x-3.5 mb-4">
        <div className={`p-2.5 rounded-xl ${theme.icon} ${theme.accent} group-hover:scale-110 transition-transform duration-300 flex-shrink-0 shadow-sm relative group/icon`}>
          <BookOpen size={20} strokeWidth={2} />
          {/* Course Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`http://localhost:5005/api/materials/download-course/${course.id}`, '_blank');
            }}
            className="absolute -top-2 -right-2 p-1.5 bg-card border border-neutral-200 dark:border-neutral-800 rounded-lg text-text/40 hover:text-primary opacity-0 group-hover/icon:opacity-100 transition-all shadow-md z-20"
            title="Download Course (ZIP)"
          >
            <Download size={12} />
          </button>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-bold text-[13px] leading-snug text-text group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {course.title}
          </h3>
          <p className="text-[10px] text-text/35 font-semibold tracking-wide">{course.code}</p>
        </div>
      </div>

      {/* Progress bar — BIGGER */}
      <div className="relative z-10 mb-3">
        <ProgressBar percentage={pct} size="lg" delay={index * 80} />
      </div>

      {/* Status badge — MUCH BIGGER and BOLDER */}
      <div className="relative z-10 flex items-center justify-between mt-auto pt-2">
        <div className={`flex items-center space-x-2 text-xs font-black px-3.5 py-2 rounded-xl border ${status.badgeBg} ${status.badgeText} ${status.badgeBorder}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${status.dot} ${status.dotAnim}`} />
          <span>{status.label}</span>
        </div>
        
        {course.last_activity && (
          <div className="flex items-center space-x-1 text-[10px] text-text/35 font-medium">
            <Clock size={10} />
            <span>{new Date(course.last_activity).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Action button at bottom */}
      <div className="relative z-10 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/50">
        {pct > 0 && pct < 70 ? (
          <div className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2 group-hover:bg-primary/10 transition-colors">
            <span className="text-xs font-bold text-primary flex items-center space-x-1.5">
              <Play size={12} fill="currentColor" />
              <span>Continue Studying</span>
            </span>
            <ArrowRight size={14} className="text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        ) : pct >= 70 ? (
          <div className="flex items-center justify-between bg-emerald-500/5 rounded-lg px-3 py-2 group-hover:bg-emerald-500/10 transition-colors">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 size={12} />
              <span>Review Materials</span>
            </span>
            <ArrowRight size={14} className="text-emerald-500/50 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        ) : (
          <div className="flex items-center justify-between bg-neutral-500/5 dark:bg-neutral-800/30 rounded-lg px-3 py-2 group-hover:bg-primary/5 transition-colors">
            <span className="text-xs font-bold text-text/40 group-hover:text-primary transition-colors flex items-center space-x-1.5">
              <BookOpen size={12} />
              <span>Start Course</span>
            </span>
            <ArrowRight size={14} className="text-text/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
