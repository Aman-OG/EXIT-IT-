import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Flame, Medal, Award, Crown, Star, Target, BookOpen, ChevronUp, Lock } from 'lucide-react';

const Leaderboard = () => {
  const { user: authUser } = useContext(AuthContext);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('total_score'); // 'total_score', 'streak', 'accuracy', 'quizzes'

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let sortParam = '';
      if (sortBy === 'streak') sortParam = 'streak';
      if (sortBy === 'accuracy') sortParam = 'accuracy';
      if (sortBy === 'quizzes') sortParam = 'quizzes';
      
      const res = await api.get(`/analytics/leaderboard${sortParam ? `?sort=${sortParam}` : ''}`);
      setLeaders(res.data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  // Find current user's position
  const currentUserEntry = leaders.find(l => l.id === authUser?.id);
  const userRank = currentUserEntry?.rank;
  const userAbove = userRank > 1 ? leaders[userRank - 2] : null;

  const getMetricValue = (u) => {
    if (sortBy === 'streak') return `${u.current_streak} Days`;
    if (sortBy === 'accuracy') return `${u.avg_accuracy}%`;
    if (sortBy === 'quizzes') return `${u.total_quizzes} Quizzes`;
    return u.total_score;
  };

  const getMetricLabel = () => {
    if (sortBy === 'streak') return 'Streak';
    if (sortBy === 'accuracy') return 'Accuracy';
    if (sortBy === 'quizzes') return 'Quizzes';
    return 'Points';
  };

  const getAvatar = (email, name) => {
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(email || name)}`;
  };

  if (loading && leaders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto w-full flex flex-col bg-background relative pb-32 transition-colors duration-300 rounded-tl-3xl">
      
      {/* HERO SECTION: SIDE-BY-SIDE */}
      <div className="relative w-full overflow-hidden border-b border-neutral-200 dark:border-neutral-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-20 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: INFO & TABS */}
            <div className="flex-1 space-y-8 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-xl shadow-primary/5 mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Trophy size={42} className="text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]" />
                </div>
                <div>
                    <h1 className="text-4xl lg:text-6xl font-black text-text tracking-tight mb-4">Hall of Fame</h1>
                    <p className="text-text/60 max-w-lg lg:mx-0 mx-auto font-medium text-lg leading-relaxed">
                        Compete with the best. Track your streaks, accuracy, and total performance across the ecosystem.
                    </p>
                </div>

                {/* COMPACT FILTER PANEL */}
                <div className="bg-card/75 backdrop-blur-2xl p-2 rounded-[1.25rem] border border-neutral-200 dark:border-neutral-800 inline-flex flex-wrap justify-center lg:justify-start gap-1 shadow-2xl">
                    {[
                        { id: 'total_score', label: 'Points', icon: <Trophy size={14} /> },
                        { id: 'streak', label: 'Streak', icon: <Flame size={14} /> },
                        { id: 'accuracy', label: 'Accuracy', icon: <Target size={14} /> },
                        { id: 'quizzes', label: 'Quizzes', icon: <BookOpen size={14} /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSortBy(tab.id)}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                                sortBy === tab.id 
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
                                : 'hover:bg-primary/5 dark:hover:bg-neutral-800 text-text/50'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT COLUMN: 3D PODIUM */}
            <div className="flex-1 flex justify-center order-1 lg:order-2 w-full max-w-2xl">
                <div className="flex justify-center items-end gap-1.5 md:gap-4 w-full transform scale-95 lg:scale-100 pb-4">
                    {/* RANK 2 */}
                    {top3[1] && (
                        <div className="flex flex-col items-center w-24 md:w-32 group">
                            <div className="relative mb-3">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 border-slate-300 bg-card shadow-xl group-hover:scale-110 transition-transform duration-500 ring-2 ring-slate-100 dark:ring-transparent">
                                    <img src={getAvatar(top3[1].email, top3[1].name)} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 border-2 border-background flex items-center justify-center text-[8px] font-black text-white shadow-lg">2</div>
                            </div>
                            <div className="text-center mb-2 px-1">
                                <p className="font-bold text-[10px] md:text-xs text-text truncate w-full opacity-80">{top3[1].name}</p>
                                <p className="text-primary font-black text-[9px] md:text-[10px]">{getMetricValue(top3[1])}</p>
                            </div>
                            <div className="w-full h-16 md:h-24 bg-gradient-to-t from-slate-200/50 to-white/40 dark:from-slate-800/80 dark:to-slate-700/40 rounded-t-2xl border-t-2 border-slate-300 dark:border-slate-600 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                                <Medal size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 opacity-20 translate-y-1" />
                            </div>
                        </div>
                    )}

                    {/* RANK 1 */}
                    {top3[0] && (
                        <div className="flex flex-col items-center w-32 md:w-40 z-10 group">
                            <div className="relative mb-4">
                                <Crown size={24} className="text-yellow-500 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] animate-bounce" />
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] overflow-hidden border-4 border-yellow-400 bg-card shadow-[0_0_30px_rgba(250,204,21,0.3)] group-hover:scale-110 transition-transform duration-500 ring-4 ring-yellow-400/10">
                                    <img src={getAvatar(top3[0].email, top3[0].name)} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 border-2 border-background flex items-center justify-center text-xs font-black text-yellow-900 shadow-xl">1</div>
                            </div>
                            <div className="text-center mb-2 px-1">
                                <p className="font-black text-xs md:text-sm text-text truncate w-full">{top3[0].name}</p>
                                <p className="text-primary font-black text-[11px] md:text-xs">{getMetricValue(top3[0])} {getMetricLabel()}</p>
                            </div>
                            <div className="w-full h-24 md:h-36 bg-gradient-to-t from-yellow-200/20 to-white/30 dark:from-yellow-900/40 dark:to-yellow-800/20 rounded-t-[2.5rem] border-t-4 border-yellow-400 shadow-3xl relative overflow-hidden backdrop-blur-sm">
                                <Crown size={56} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500 opacity-15 translate-y-2" />
                            </div>
                        </div>
                    )}

                    {/* RANK 3 */}
                    {top3[2] && (
                        <div className="flex flex-col items-center w-24 md:w-32 group">
                            <div className="relative mb-3">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 border-amber-600 bg-card shadow-xl group-hover:scale-110 transition-transform duration-500 ring-2 ring-amber-100 dark:ring-transparent">
                                    <img src={getAvatar(top3[2].email, top3[2].name)} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 border-2 border-background flex items-center justify-center text-[8px] font-black text-white shadow-lg">3</div>
                            </div>
                            <div className="text-center mb-2 px-1">
                                <p className="font-bold text-[10px] md:text-xs text-text truncate w-full opacity-80">{top3[2].name}</p>
                                <p className="text-primary font-black text-[9px] md:text-[10px]">{getMetricValue(top3[2])}</p>
                            </div>
                            <div className="w-full h-12 md:h-20 bg-gradient-to-t from-amber-100/50 to-white/40 dark:from-amber-900/80 dark:to-amber-800/40 rounded-t-2xl border-t-2 border-amber-600 dark:border-amber-700 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                                <Award size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 opacity-20 translate-y-1" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* THE LIST SECTION */}
      <div className="max-w-5xl mx-auto w-full px-6 lg:px-12 py-12 space-y-4 relative z-10">
        <div className="flex items-center justify-between px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-text/30">
            <div className="flex items-center space-x-12">
                <span>Rank Position</span>
                <span className="ml-4">Scholar Identity</span>
            </div>
            <span>Global {getMetricLabel()}</span>
        </div>
        
        {rest.length > 0 ? rest.map((u) => (
            <div 
              key={u.id}
              className={`group flex items-center justify-between p-4 rounded-[1.5rem] border transition-all duration-500 ${
                u.id === authUser?.id 
                ? 'bg-primary/5 border-primary/40 shadow-xl shadow-primary/5 -translate-y-1' 
                : 'bg-card border-neutral-200 dark:border-neutral-800 hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl dark:shadow-none'
              }`}
            >
                <div className="flex items-center space-x-6 md:space-x-10">
                    <div className="w-10 text-center">
                        <span className={`text-xl font-black ${u.id === authUser?.id ? 'text-primary' : 'text-text/20'}`}>#{u.rank}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 shadow-sm group-hover:rotate-6 transition-transform">
                            <img src={getAvatar(u.email, u.name)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-black text-text flex items-center">
                                {u.name}
                                {u.id === authUser?.id && (
                                    <span className="ml-2 px-2 py-0.5 bg-primary text-[10px] text-primary-foreground rounded-full uppercase tracking-tighter shadow-md">You</span>
                                )}
                            </p>
                            <div className="flex items-center space-x-3 text-[10px] font-bold text-text/40 uppercase tracking-widest mt-1">
                                <span className="flex items-center"><Flame size={12} className="text-warning mr-1" /> {u.current_streak}</span>
                                <span className="flex items-center"><Target size={12} className="text-blue-500 mr-1" /> {u.avg_accuracy}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-2xl font-black ${u.id === authUser?.id ? 'text-primary' : 'text-text'}`}>{getMetricValue(u)}</span>
                    <span className="text-[11px] font-black text-text/30 uppercase tracking-widest">{getMetricLabel()}</span>
                </div>
            </div>
        )) : (
            <div className="text-center py-20 opacity-20 italic font-bold text-xl">No other challengers in this league yet...</div>
        )}
      </div>

      {/* STICKY USER FOOTER / OVERTAKE LOGIC */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background/80 to-transparent pt-16 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-primary text-primary-foreground rounded-[2rem] p-4 md:p-6 shadow-2xl shadow-primary/50 flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-white/10 dark:border-white/5 transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary-foreground/30 bg-primary-foreground/10 shadow-inner">
                        <img src={getAvatar(authUser?.email, authUser?.name)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-80 font-mono">My Global Identity</p>
                        <p className="text-xl font-black">Rank #{userRank || '?'}</p>
                    </div>
                </div>

                {userAbove ? (
                    <div className="flex items-center space-x-3 bg-primary-foreground/10 px-4 py-2 rounded-2xl animate-pulse">
                        <ChevronUp className="text-primary-foreground" />
                        <p className="text-sm font-bold">
                            Only <span className="text-primary-foreground underline font-black">{
                                sortBy === 'total_score' 
                                ? (userAbove.total_score - (currentUserEntry?.total_score || 0)) 
                                : sortBy === 'streak' 
                                ? (userAbove.current_streak - (currentUserEntry?.current_streak || 0))
                                : sortBy === 'accuracy'
                                ? (userAbove.avg_accuracy - (currentUserEntry?.avg_accuracy || 0))
                                : (userAbove.total_quizzes - (currentUserEntry?.total_quizzes || 0))
                            }</span> {getMetricLabel()} to overtake <span className="font-black italic underline">{userAbove.name}</span>!
                        </p>
                    </div>
                ) : userRank === 1 ? (
                    <div className="flex items-center space-x-3 bg-primary-foreground/10 px-4 py-2 rounded-2xl">
                        <Crown className="text-yellow-300" />
                        <p className="text-sm font-black italic uppercase tracking-[0.1em]">Top of the World: Undisputed Champion</p>
                    </div>
                ) : (
                    <div className="text-sm font-bold opacity-80 italic">Climb the ranks by starting a session!</div>
                )}

                <div className="hidden md:flex flex-col items-end">
                    <p className="text-2xl font-black leading-none">{getMetricValue(currentUserEntry || { [sortBy]: 0 })}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Personal Total</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
