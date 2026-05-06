import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { BookOpen, Target, Flame, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import { StatSkeleton, ResumeSkeleton } from '../components/Skeleton';
import { StatCard, EmptyState } from '../components/Card';
import StreakFreeze from '../components/StreakFreeze';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState([
    { label: 'Overall Progress', value: '0%', icon: BookOpen, colorClass: 'bg-primary/10 text-primary', key: 'overallProgress' },
    { label: 'Quiz Accuracy', value: '0%', icon: Target, colorClass: 'bg-accent/10 text-accent', key: 'avgAccuracy' },
    { label: 'Weakest Area', value: 'Loading...', icon: Flame, colorClass: 'bg-warning/10 text-warning', key: 'weakestSubject' },
  ]);

  const [examDateStr, setExamDateStr] = React.useState('2026-05-30');
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [lastMaterial, setLastMaterial] = React.useState(null);
  const [currentStreak, setCurrentStreak] = React.useState(0);
  const [streakFreeze, setStreakFreeze] = React.useState(0);
  const [examWarning, setExamWarning] = React.useState(false);
  const [daysUntilExam, setDaysUntilExam] = React.useState(0);

  React.useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Single combined API call instead of 3 separate ones
        const { data } = await api.get('/analytics/dashboard');
        
        setExamDateStr(data.examDate);
        setCurrentStreak(data.currentStreak);
        setStreakFreeze(data.streakFreeze);
        setExamWarning(data.examWarning);
        setDaysUntilExam(data.daysUntilExam);
        setLastMaterial(data.lastMaterial);

        setStats(prev => prev.map(s => ({
          ...s,
          value: data[s.key] || '0%'
        })));

      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(examDateStr) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    // Debounce countdown updates to every 100ms to reduce re-renders
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [examDateStr]);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Banner & Countdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Welcome back, <span className="text-primary">{user?.name ? user.name.split(' ')[0] : 'Student'}</span>
          </h1>
          <p className="text-text/70">Let's continue your exam preparation journey.</p>
        </div>

        {/* Countdown Card Component */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-4 flex items-center space-x-4 shadow-md w-full md:w-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors pointer-events-none" />
          <div className="p-3 bg-card/20 rounded-xl backdrop-blur-sm z-10">
            <Clock size={28} className="text-primary-foreground" />
          </div>
          <div className="z-10 pr-2">
             <p className="text-primary-foreground/90 text-sm font-semibold tracking-wide uppercase">Time until Exam</p>
             <div className="flex items-baseline space-x-2">
                 <p className="text-3xl font-extrabold tracking-tight">
                    {timeLeft.days} <span className="text-lg font-medium opacity-90">Days</span>
                 </p>
                 <p className="text-lg font-bold tracking-tight opacity-90 border-l border-primary-foreground/20 pl-2 ml-1">
                    {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                 </p>
             </div>
          </div>
        </div>
      </div>

      {/* Exam Warning Alert */}
      {examWarning && daysUntilExam > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-2xl p-5 flex items-start space-x-4">
          <AlertTriangle className="text-warning flex-shrink-0 mt-1" size={24} />
          <div>
            <p className="font-bold text-warning mb-1">Exam in {daysUntilExam} days!</p>
            <p className="text-text/70 text-sm">Your exam is coming up soon. Maximize your study time to prepare well.</p>
          </div>
        </div>
      )}

      {/* Streak Freeze Section */}
      {currentStreak > 0 && (
        <StreakFreeze 
          currentStreak={currentStreak} 
          streakFreeze={streakFreeze}
          onFreezeUsed={(data) => {
            setStreakFreeze(data.streakFreeze);
          }}
        />
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <StatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <StatCard 
              key={i}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              colorClass={stat.colorClass}
            />
          ))}
        </div>
      )}

      {/* Resume Studying */}
      {loading ? (
        <ResumeSkeleton />
      ) : lastMaterial ? (
        <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center p-14 text-center min-h-[350px] shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-5 z-10 shadow-sm transition-transform group-hover:-translate-y-1">
            <BookOpen size={36} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold mb-3 z-10">Resume Studying</h3>
          <p className="text-text/70 max-w-md mb-6 z-10 text-lg">
            You left off at <strong className="text-primary">{lastMaterial.course_title}: {lastMaterial.material_title}</strong>. Ready to conquer this topic?
          </p>
          <button onClick={() => navigate(`/study/${lastMaterial.material_id}`)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center space-x-2 z-10">
            <span>Continue Reading</span>
            <ChevronRight size={18} strokeWidth={3} />
          </button>
          {lastMaterial.percentage > 0 && lastMaterial.percentage < 100 && (
            <div className="mt-4 w-64 max-w-full">
              <div className="flex justify-between text-xs font-bold text-text/50 mb-1">
                <span>Progress</span>
                <span>{lastMaterial.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${lastMaterial.percentage}%` }} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState 
          icon={BookOpen}
          title="Ready to start studying?"
          description="You haven't started any study materials yet. Head over to Courses to begin your exam preparation."
          action={() => navigate('/courses')}
          actionText="Browse Courses"
        />
      )}

    </div>
  );
};
};

export default Dashboard;
