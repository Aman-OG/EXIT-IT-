import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { User, Target, Flame, BrainCircuit, Award, BookOpen, Clock, Activity, CheckCircle, Calendar, Sun, Moon, Lock, Edit2, Check, X, Trophy } from 'lucide-react';
import ActivityHeatmap from '../components/ActivityHeatmap';
import Trophy3D from '../components/Trophy3D';

const Profile = () => {
    const navigate = useNavigate();
    const { user: authUser, setUser, evaluateBadges } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editNameValue, setEditNameValue] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/analytics/profile');
                setProfileData(res.data);

                // ── Badge unlock detection ──
                if (authUser?.id) {
                    evaluateBadges();
                }
            } catch (err) {
                console.error("Failed to fetch profile data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateName = async () => {
        if (!editNameValue.trim() || editNameValue === profileData?.user?.name) {
            return setIsEditingName(false);
        }
        try {
            const res = await api.put('/users/name', { name: editNameValue });
            setProfileData({...profileData, user: {...profileData.user, name: res.data.name}});
            setUser((prev) => ({...prev, name: res.data.name}));
            setIsEditingName(false);
        } catch (err) {
            console.error("Failed to update name", err);
        }
    };

    if (loading || !profileData) {
        return (
            <div className="h-full flex items-center justify-center min-h-[500px]">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const { user, stats, radarData, timeline, badges } = profileData;

    // Dicebear avatar base
    const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user.email || user.name)}`;

    const badgeMap = [
        { id: 'initiator', name: 'The Initiator', desc: 'Started your first practice quiz', icon: '🚀', color: 'from-purple-500 to-indigo-500', shadow: 'shadow-indigo-500/30' },
        { id: 'flawless', name: 'Flawless Victory', desc: 'Achieved a perfect 100% score', icon: '💎', color: 'from-cyan-400 to-blue-500', shadow: 'shadow-blue-500/30' },
        { id: 'consistent', name: 'Consistent Learner', desc: 'Reached a 3-day active streak', icon: '🔥', color: 'from-orange-400 to-red-500', shadow: 'shadow-red-500/30' },
        { id: 'marathon', name: 'Marathon Reader', desc: 'Read 5 different study PDFs', icon: '📚', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/30' },
        { id: 'weekend', name: 'Weekend Warrior', desc: 'Studied on a Saturday or Sunday', icon: '🌞', color: 'from-yellow-400 to-amber-500', shadow: 'shadow-amber-500/30' },
        { id: 'nightowl', name: 'Night Owl', desc: 'Studied late (Midnight to 4AM)', icon: '🦉', color: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-800/30' },
        { id: 'centurion', name: 'The Centurion', desc: 'Solved 100 total questions', icon: '💯', color: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-500/30' },
        { id: 'examready', name: 'Exam Ready', desc: 'Completed > 85% of platform materials', icon: '🏆', color: 'from-amber-300 to-yellow-500', shadow: 'shadow-yellow-500/30' }
    ];

    return (
        <div className="h-full overflow-y-auto w-full p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* HERO BANNER */}
            <div className="relative overflow-hidden rounded-[2rem] bg-card border border-neutral-200 dark:border-neutral-800 shadow-xl p-8 md:p-12 transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card/30 to-transparent opacity-80" />
                
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                    <div className={`w-28 h-28 md:w-32 md:h-32 rounded-[2rem] shadow-2xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800 rotate-3 hover:rotate-0 transition-transform duration-300 ring-4 ring-card`}>
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-2 mt-2 md:mt-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            {isEditingName ? (
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="text" 
                                        className="text-2xl md:text-3xl font-black bg-card border-2 border-primary/50 rounded-xl px-4 py-1 text-text focus:outline-none focus:border-primary w-full md:w-auto"
                                        value={editNameValue}
                                        onChange={(e) => setEditNameValue(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                                    />
                                    <button onClick={handleUpdateName} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow">
                                        <Check size={18} strokeWidth={3} />
                                    </button>
                                    <button onClick={() => setIsEditingName(false)} className="p-2 bg-black/10 dark:bg-neutral-800 text-text/60 rounded-lg hover:bg-black/20 dark:hover:bg-neutral-700 transition-colors">
                                        <X size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 group h-12">
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text">{user.name}</h1>
                                    <button 
                                        onClick={() => { setEditNameValue(user.name); setIsEditingName(true); }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-text/40 hover:text-primary transition-all bg-card border border-neutral-200 dark:border-neutral-800 rounded-lg translate-y-1 group-hover:translate-y-0 ml-1"
                                        title="Edit display name"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            )}
                            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest rounded-full self-center md:self-auto border border-primary/20">
                                <Award size={14} />
                                <span>{stats.avg_accuracy >= 80 ? 'Elite Scholar' : stats.questions_solved > 50 ? 'Dedicated Learner' : 'Novice Explorer'}</span>
                            </span>
                        </div>
                        <p className="text-text/50 font-medium text-lg">{user.email}</p>
                        <p className="text-sm font-bold text-text/40 tracking-widest uppercase mt-4">
                            Enrolled {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="hidden lg:block w-48 h-48 -mr-8 -mt-8 relative">
                        <Trophy3D color={stats.avg_accuracy >= 80 ? 'amber' : 'emerald'} size="250px" />
                    </div>
                </div>
            </div>

            {/* QUICK STATS BENTO ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
                    <Flame className="text-amber-500 mb-4" size={28} />
                    <p className="text-3xl font-black text-text mb-1">{user.current_streak} <span className="text-lg text-text/40">Days</span></p>
                    <p className="text-xs font-bold uppercase tracking-widest text-text/40">Current Streak</p>
                </div>

                <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
                    <Target className="text-emerald-500 mb-4" size={28} />
                    <p className="text-3xl font-black text-text mb-1">{stats.avg_accuracy}<span className="text-lg text-text/40">%</span></p>
                    <p className="text-xs font-bold uppercase tracking-widest text-text/40">Overall Accuracy</p>
                </div>

                <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
                    <BrainCircuit className="text-blue-500 mb-4" size={28} />
                    <p className="text-3xl font-black text-text mb-1">{stats.questions_solved}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-text/40">Questions Solved</p>
                </div>

                <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
                    <BookOpen className="text-purple-500 mb-4" size={28} />
                    <p className="text-3xl font-black text-text mb-1">{stats.courses_active}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-text/60">Mastered Zones</p>
                </div>
            </div>

            {/* MAIN ANALYTICS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* RADAR CHART COMPONENT */}
                <div className="lg:col-span-2 bg-card border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 md:p-8 flex flex-col shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-text">Knowledge Matrix</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-text/40">Performance Across Subjects</p>
                        </div>
                    </div>
                    
                    <div className="w-full h-[350px]">
                        {radarData && radarData.length > 0 && radarData[0].subject !== 'General' ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="currentColor" strokeOpacity={0.1} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12, fontWeight: 700 }} />
                                    <PolarRadiusAxis 
                                        angle={90} 
                                        domain={[0, 100]} 
                                        tick={{ fill: 'currentColor', opacity: 0.4, fontSize: 10 }}
                                        tickCount={6}
                                    />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '1rem', border: '1px solid var(--color-border)', fontWeight: 700 }}
                                        itemStyle={{ color: 'var(--color-primary)' }}
                                    />
                                    <Radar name="Accuracy %" dataKey="accuracy" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-text/40 font-medium border-2 border-dashed border-neutral-200 dark:border-neutral-800 w-full h-full flex flex-col items-center justify-center rounded-2xl p-6">
                                <p>No course data available yet.</p>
                                <p className="text-xs mt-1">Take some quizzes to build your matrix!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* TIMELINE COMPONENT */}
                <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-text">Activity Feeds</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-text/40">Recent Milestones</p>
                        </div>
                    </div>

                    <div className="flex-1 max-h-[350px] overflow-y-auto pr-2 space-y-6 relative">
                        {/* Vertical Path Line */}
                        <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-neutral-100 dark:bg-neutral-800 z-0" />
                        
                        {timeline.length > 0 ? timeline.map((event, idx) => (
                            <div key={idx} className="relative z-10 flex items-start space-x-4">
                                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 border-4 border-card ${event.type === 'quiz' ? 'bg-primary' : 'bg-emerald-500'}`} />
                                <div>
                                    <p className="text-sm font-bold text-text mb-0.5">{event.action}</p>
                                    <p className="text-xs text-text/40 font-bold uppercase tracking-widest">
                                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-text/40 font-medium py-10">
                                <p>No recent activity.</p>
                                <p className="text-xs mt-1">Start studying to fill this timeline.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* HEATMAP SECTION */}
            <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 md:p-8 shadow-sm mt-6">
                 <div className="flex items-center space-x-3 mb-6">
                     <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                         <Calendar size={20} />
                     </div>
                     <div className="text-left">
                         <h3 className="text-xl font-black text-text">Activity Heatmap</h3>
                         <p className="text-xs font-bold uppercase tracking-widest text-text/40">Consistency is Key (Last 90 Days)</p>
                     </div>
                 </div>
                 <div className="w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                     <ActivityHeatmap data={profileData?.heatmap || []} />
                 </div>
            </div>

            {/* TROPHIES WALL SECTION */}
            <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 text-center md:p-8 shadow-sm mt-8">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                        <Award size={20} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-2xl font-black text-text">Trophies & Achievements</h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-text/40">Unlock milestones by taking action</p>
                    </div>
                    <div className="flex-1" />
                    <button 
                        onClick={() => navigate('/trophies')}
                        className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                    >
                        <Trophy size={18} />
                        <span>Enter Trophy Hall</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {badgeMap.map((b) => {
                        const badgeData = badges && badges[b.id];
                        const isUnlocked = badgeData?.isUnlocked;
                        const current = badgeData?.current || 0;
                        const max = badgeData?.max || 1;
                        const progressPct = Math.min(100, Math.round((current / max) * 100));

                        return (
                            <button 
                                key={b.id} 
                                onClick={() => setSelectedBadge(b.id === selectedBadge ? null : b.id)}
                                className={`relative p-5 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 border-2 w-full outline-none
                                    ${isUnlocked 
                                        ? 'bg-amber-500/10 border-amber-500/40 hover:border-amber-500 border-dashed hover:border-solid hover:-translate-y-1 shadow-md' 
                                        : 'bg-neutral-100/30 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800/80 hover:border-primary/30 opacity-60 grayscale hover:grayscale-0 hover:-translate-y-1'
                                    }`
                                }
                            >
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl mb-3 flex items-center justify-center shrink-0 relative
                                    ${isUnlocked ? `bg-gradient-to-br ${b.color} shadow-lg ${b.shadow} ${selectedBadge === b.id ? 'animate-bounce' : ''}` : 'bg-neutral-200 dark:bg-neutral-800'}
                                `}>
                                    {isUnlocked && b.id === 'examready' ? (
                                        <div className="scale-150">
                                            <Trophy3D color="amber" size="64px" />
                                        </div>
                                    ) : (
                                        <span className="text-3xl filter drop-shadow hover:scale-110 transition-transform">
                                            {b.icon}
                                        </span>
                                    )}
                                </div>
                                <h4 className={`font-black text-sm mb-1 ${isUnlocked ? 'text-amber-600 dark:text-amber-400' : 'text-text'}`}>
                                    {b.name}
                                </h4>
                                
                                {selectedBadge === b.id ? (
                                    <div className="text-xs text-text/80 font-bold animate-in fade-in slide-in-from-bottom-1 mt-1 bg-card rounded-lg p-2 border border-neutral-300 dark:border-neutral-700 absolute bottom-2 left-2 right-2 shadow-2xl z-20 w-[calc(100%-1rem)]">
                                        {b.desc}
                                    </div>
                                ) : (
                                    <div className="w-full mt-2 flex flex-col items-center opacity-80">
                                         <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-1.5">
                                              <div className={`h-full ${isUnlocked ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-primary'} transition-all duration-1000`} style={{ width: `${progressPct}%` }} />
                                         </div>
                                         <span className="text-[10px] font-black uppercase tracking-widest text-text/40">{current} / {max}{badgeData?.isPercentage ? '%' : ''}</span>
                                    </div>
                                )}

                                {!isUnlocked && (
                                    <div className="absolute top-2 right-2 text-text/30">
                                        <Lock size={14} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Profile;
