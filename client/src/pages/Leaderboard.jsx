import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Flame, Medal, Award, Crown, Target, BookOpen, ChevronUp, Sparkles, UserPlus, UserCheck, Clock } from 'lucide-react';
import { getAvatarUrl } from '../utils/avatar';

const ScholarAvatarWithHover = ({ 
  user, 
  sizeClass = "w-12 h-12 rounded-2xl", 
  showCrown = false,
  placement = "top", // 'top' | 'bottom'
  align = "left",    // 'left' | 'center' | 'right'
  onFollow,
  authUserId
}) => {
  // Placement (vertical)
  const isBottom = placement === "bottom";
  const positionClasses = isBottom ? "top-full mt-3" : "bottom-full mb-3";
  const arrowClasses = isBottom ? "bottom-full -mb-1 border-l border-t" : "top-full -mt-1 border-r border-b";

  // Alignment (horizontal)
  let alignClasses = "left-0 sm:-left-4 translate-x-0";
  let arrowAlignClasses = "left-6";

  if (align === "center") {
    alignClasses = "left-1/2 -translate-x-1/2";
    arrowAlignClasses = "left-1/2 -translate-x-1/2";
  } else if (align === "right") {
    alignClasses = "right-0 sm:-right-4 left-auto translate-x-0";
    arrowAlignClasses = "right-6 left-auto";
  }

  return (
    <div className="relative group/popover inline-block">
      {showCrown && (
        <Crown size={24} className="text-yellow-500 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] animate-bounce z-10 pointer-events-none" />
      )}
      
      <div className={`${sizeClass} overflow-hidden bg-neutral-200/50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 shadow-md group-hover/popover:scale-105 transition-all duration-300 flex-shrink-0 cursor-pointer`}>
        <img 
          src={getAvatarUrl(user)} 
          alt={user?.name || "Scholar"} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user?.email || user?.name || 'User')}`;
          }}
        />
      </div>

      {/* MINI PROFILE POPUP ON HOVER */}
      <div className={`absolute ${positionClasses} ${alignClasses} w-64 max-w-[calc(100vw-2rem)] p-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 shadow-2xl z-50 pointer-events-none group-hover/popover:pointer-events-auto opacity-0 invisible group-hover/popover:opacity-100 group-hover/popover:visible transition-all duration-200 transform scale-95 group-hover/popover:scale-100 ring-1 ring-black/10 text-left ${isBottom ? 'before:absolute before:-top-3 before:left-0 before:right-0 before:h-3' : 'after:absolute after:-bottom-3 after:left-0 after:right-0 after:h-3'}`}>
        {/* User Identity Header */}
        <div className="flex items-center space-x-3 mb-2.5">
          <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-primary/30 bg-primary/10 shadow-sm shrink-0">
            <img 
              src={getAvatarUrl(user)} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user?.email || user?.name || 'User')}`;
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-sm text-text truncate leading-tight">{user?.name}</p>
            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              Rank #{user?.rank || '?'}
            </span>
          </div>
        </div>

        {/* Bio Section - only show if bio is present */}
        {user?.bio && user.bio.trim().length > 0 && (
          <div className="bg-background/90 rounded-xl p-2.5 border border-neutral-200/70 dark:border-neutral-800/70 mb-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text/40 mb-1">Bio</p>
            <p className="text-xs text-text/85 font-medium italic line-clamp-3 leading-relaxed">
              "{user.bio.trim()}"
            </p>
          </div>
        )}

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-3 gap-1.5 text-center mb-1">
          <div className="bg-primary/5 rounded-lg py-1 px-1 border border-primary/10">
            <span className="text-[9px] font-bold uppercase text-text/40 block">Points</span>
            <span className="text-xs font-black text-primary">{user?.total_score?.toLocaleString() || 0}</span>
          </div>
          <div className="bg-amber-500/5 rounded-lg py-1 px-1 border border-amber-500/10">
            <span className="text-[9px] font-bold uppercase text-text/40 block">Streak</span>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5">
              <Flame size={10} className="fill-amber-500 text-amber-500" />
              {user?.current_streak || 0}d
            </span>
          </div>
          <div className="bg-blue-500/5 rounded-lg py-1 px-1 border border-blue-500/10">
            <span className="text-[9px] font-bold uppercase text-text/40 block">Accuracy</span>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">{user?.avg_accuracy || 0}%</span>
          </div>
        </div>

        {/* Follow / Friends Action Button */}
        {authUserId && user?.id !== authUserId && (
          <div className="mt-2.5 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/60">
            {user?.is_friends || user?.friendship_status === 'accepted' ? (
              <div className="flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-full">
                <UserCheck size={14} className="stroke-[2.5]" />
                <span>Friends</span>
              </div>
            ) : user?.is_pending || user?.friendship_status === 'pending' ? (
              <div className="flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold w-full">
                <Clock size={14} className="stroke-[2.5]" />
                <span>Requested</span>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollow?.(user.id);
                }}
                className="flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold w-full shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <UserPlus size={14} className="stroke-[2.5]" />
                <span>Follow</span>
              </button>
            )}
          </div>
        )}

        {/* Arrow pointer */}
        <div className={`absolute ${arrowClasses} ${arrowAlignClasses} w-2.5 h-2.5 bg-card rotate-45 border-neutral-200 dark:border-neutral-700`} />
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const { user: authUser } = useContext(AuthContext);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/leaderboard');
      setLeaders(res.data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      await api.post('/friends/request', { friendId: targetUserId });
      setLeaders(prev => prev.map(u => u.id === targetUserId ? { ...u, friendship_status: 'pending', is_pending: true } : u));
    } catch (err) {
      console.error('Failed to send friend request:', err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  // Find current user's position
  const currentUserEntry = leaders.find(l => l.id === authUser?.id);
  const userRank = currentUserEntry?.rank;
  const userAbove = userRank > 1 ? leaders[userRank - 2] : null;

  if (loading && leaders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto w-full flex flex-col bg-background relative pb-4 transition-colors duration-300 rounded-tl-3xl">
      
      {/* HERO SECTION: SIDE-BY-SIDE */}
      <div className="relative w-full border-b border-neutral-200 dark:border-neutral-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-20 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: INFO */}
            <div className="flex-1 space-y-6 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-xl shadow-primary/5 mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Trophy size={42} className="text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]" />
                </div>
                <div>
                    <h1 className="text-4xl lg:text-6xl font-black text-text tracking-tight mb-4">Hall of Fame</h1>
                    <p className="text-text/60 max-w-lg lg:mx-0 mx-auto font-medium text-lg leading-relaxed">
                        Compete with the top scholars. Rankings are determined by total points earned through quizzes, exams, and daily mastery.
                    </p>
                </div>

                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-md text-xs font-bold text-text/70">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>Leaderboard ranked by Total Points</span>
                </div>
            </div>

            {/* RIGHT COLUMN: 3D PODIUM */}
            <div className="flex-1 flex justify-center order-1 lg:order-2 w-full max-w-2xl min-h-[200px]">
                <div className="flex justify-center items-end gap-1.5 md:gap-4 w-full transform scale-95 lg:scale-100 pb-4">
                    {/* RANK 2 */}
                    {top3[1] && (
                        <div className="flex flex-col items-center w-24 md:w-32 group">
                            <div className="relative mb-3">
                                <ScholarAvatarWithHover 
                                  user={top3[1]} 
                                  sizeClass="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-slate-300 ring-2 ring-slate-100 dark:ring-transparent" 
                                  placement="bottom"
                                  align="left"
                                  onFollow={handleFollow}
                                  authUserId={authUser?.id}
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 border-2 border-background flex items-center justify-center text-[8px] font-black text-white shadow-lg pointer-events-none">2</div>
                            </div>
                            <div className="text-center mb-2 px-1">
                                <p className="font-bold text-[10px] md:text-xs text-text truncate w-full opacity-80">{top3[1].name}</p>
                                <p className="text-primary font-black text-[9px] md:text-[10px]">{top3[1].total_score.toLocaleString()} Points</p>
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
                                <ScholarAvatarWithHover 
                                  user={top3[0]} 
                                  sizeClass="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] border-yellow-400 ring-4 ring-yellow-400/10 shadow-[0_0_30px_rgba(250,204,21,0.3)]" 
                                  showCrown={true}
                                  placement="bottom"
                                  align="center"
                                  onFollow={handleFollow}
                                  authUserId={authUser?.id}
                                />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 border-2 border-background flex items-center justify-center text-xs font-black text-yellow-900 shadow-xl pointer-events-none">1</div>
                            </div>
                            <div className="text-center mb-2 px-1">
                                <p className="font-black text-xs md:text-sm text-text truncate w-full">{top3[0].name}</p>
                                <p className="text-primary font-black text-[11px] md:text-xs">{top3[0].total_score.toLocaleString()} Points</p>
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
                                <ScholarAvatarWithHover 
                                  user={top3[2]} 
                                  sizeClass="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-amber-600 ring-2 ring-amber-100 dark:ring-transparent" 
                                  placement="bottom"
                                  align="right"
                                  onFollow={handleFollow}
                                  authUserId={authUser?.id}
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 border-2 border-background flex items-center justify-center text-[8px] font-black text-white shadow-lg pointer-events-none">3</div>
                            </div>
                            <div className="text-center mb-2 px-1">
                                <p className="font-bold text-[10px] md:text-xs text-text truncate w-full opacity-80">{top3[2].name}</p>
                                <p className="text-primary font-black text-[9px] md:text-[10px]">{top3[2].total_score.toLocaleString()} Points</p>
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
            <span>Global Points</span>
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
                        <ScholarAvatarWithHover 
                          user={u} 
                          sizeClass="w-12 h-12 rounded-2xl" 
                          placement="top" 
                          align="left"
                          onFollow={handleFollow}
                          authUserId={authUser?.id}
                        />
                        <div>
                            <p className="font-black text-text flex items-center">
                                {u.name}
                                {u.id === authUser?.id && (
                                    <span className="ml-2 px-2 py-0.5 bg-primary text-[10px] text-primary-foreground rounded-full uppercase tracking-tighter shadow-md">You</span>
                                )}
                            </p>
                            
                            {/* STATS: Streak (filled flame), Accuracy, and Quizzes (icons + numbers only, name on hover) */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                <span 
                                    title={`Streak: ${u.current_streak || 0} ${u.current_streak === 1 ? 'day' : 'days'}`}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold cursor-default hover:bg-amber-500/20 transition-colors"
                                >
                                    <Flame size={13} className="text-amber-500 fill-amber-500 mr-1 flex-shrink-0" />
                                    {u.current_streak || 0}
                                </span>
                                <span 
                                    title={`Accuracy: ${u.avg_accuracy || 0}%`}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold cursor-default hover:bg-blue-500/20 transition-colors"
                                >
                                    <Target size={13} className="text-blue-500 mr-1 flex-shrink-0" />
                                    {u.avg_accuracy || 0}%
                                </span>
                                <span 
                                    title={`Quizzes: ${u.total_quizzes || 0} completed`}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold cursor-default hover:bg-emerald-500/20 transition-colors"
                                >
                                    <BookOpen size={13} className="text-emerald-500 mr-1 flex-shrink-0" />
                                    {u.total_quizzes || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end pl-4">
                    <span className={`text-2xl font-black ${u.id === authUser?.id ? 'text-primary' : 'text-text'}`}>{u.total_score?.toLocaleString() || 0}</span>
                    <span className="text-[11px] font-black text-text/30 uppercase tracking-widest">Points</span>
                </div>
            </div>
        )) : (
            <div className="text-center py-20 opacity-20 italic font-bold text-xl">No other challengers in this league yet...</div>
        )}
      </div>

      {/* COMPACT STICKY USER FOOTER */}
      <div className="sticky bottom-0 left-0 right-0 z-20 px-4 py-2.5 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none mt-auto">
        <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2.5 shadow-xl shadow-primary/25 flex items-center justify-between gap-3 border border-white/15 transition-all duration-300">
                {/* User Identity & Rank */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary-foreground/30 bg-primary-foreground/10 shadow-inner flex-shrink-0">
                        <img 
                          src={getAvatarUrl(authUser)} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(authUser?.email || authUser?.name || 'User')}`;
                          }}
                        />
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 hidden sm:inline">Rank</span>
                        <span className="text-sm md:text-base font-black">#{userRank || '?'}</span>
                    </div>
                </div>

                {/* Gap to next rank */}
                <div className="flex-1 flex justify-center px-2 min-w-0">
                  {userAbove ? (
                      <div className="inline-flex items-center space-x-1.5 bg-primary-foreground/15 px-3 py-1 rounded-xl text-center max-w-full truncate">
                          <ChevronUp size={15} className="text-primary-foreground flex-shrink-0" />
                          <p className="text-xs font-medium truncate">
                              <span className="font-black text-primary-foreground">
                                  {((userAbove.total_score || 0) - (currentUserEntry?.total_score || 0)).toLocaleString()}
                              </span> pts to overtake <span className="font-bold">{userAbove.name}</span>
                          </p>
                      </div>
                  ) : userRank === 1 ? (
                      <div className="inline-flex items-center space-x-1.5 bg-primary-foreground/15 px-3 py-1 rounded-xl">
                          <Crown size={15} className="text-yellow-300" />
                          <span className="text-xs font-black uppercase tracking-wider">Champion</span>
                      </div>
                  ) : (
                      <div className="text-xs font-bold opacity-80 italic">Climb the ranks!</div>
                  )}
                </div>

                {/* Personal Total Points */}
                <div className="flex items-baseline space-x-1 flex-shrink-0 text-right">
                    <span className="text-base md:text-lg font-black leading-none">{(currentUserEntry?.total_score || 0).toLocaleString()}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">pts</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
