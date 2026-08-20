import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Sun, Moon, Book, Eye, Menu, User, Flame, Snowflake, Trophy, Users, MessageSquare } from 'lucide-react';
import ExitItLogo from './ExitItLogo';
import NotificationBell from './NotificationBell';
import FeedbackModal from './FeedbackModal';
import { getAvatarUrl } from '../utils/avatar';

const Navbar = ({ toggleSidebar }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [streakOpen, setStreakOpen] = useState(false);
  const streakRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (streakRef.current && !streakRef.current.contains(event.target)) {
        setStreakOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <header className="h-14 bg-card border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between pl-0 pr-2 md:pr-3 relative z-30 shadow-sm">
      <div className="flex items-center">
        <button className="text-text p-1 md:hidden hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors ml-1" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <Link to="/" className="hidden md:flex items-center space-x-1.5 pl-2 hover:opacity-80 transition-opacity">
          <ExitItLogo size={24} />
          <h1 className="text-sm font-black tracking-tight leading-tight">
            <span className="text-primary">EX-</span><span className="italic text-accent">IT</span>
          </h1>
        </Link>
        <Link to="/" className="md:hidden flex items-center space-x-1 ml-1 hover:opacity-80 transition-opacity">
          <ExitItLogo size={24} />
          <h1 className="text-xs font-black tracking-tight leading-tight">
            <span className="text-primary">EX-</span><span className="italic text-accent">IT</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center space-x-1.5">
        {/* Notification Bell */}
        <NotificationBell />
        
        <div className="relative" ref={streakRef}>
          {/* Streak Indicator (appears only if streak > 0) */}
          {user?.current_streak > 0 && (
            <button 
              onClick={() => setStreakOpen(!streakOpen)}
              className={`flex items-center space-x-1 px-2 py-1 mr-1 rounded-lg transition-all shadow-sm ${streakOpen ? 'bg-orange-500/20 shadow-orange-500/10' : 'bg-orange-500/10 hover:bg-orange-500/20'} border border-orange-500/20 text-orange-500 active:scale-95`}
            >
               <Flame size={16} fill="currentColor" className={streakOpen ? '' : 'animate-pulse'} />
               <span className="font-black text-xs">{user.current_streak}</span>
            </button>
          )}

          {/* Streak Extended Dropdown */}
          {streakOpen && (
             <>
               <div 
                 className="fixed inset-0 bg-black/40 z-40 sm:hidden animate-in fade-in duration-200"
                 onClick={() => setStreakOpen(false)}
               />
               <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-2 sm:top-auto sm:mt-3 w-auto sm:w-72 bg-card z-50 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                     <h3 className="text-white font-black text-2xl drop-shadow-md mb-1 relative z-10">{user?.current_streak} Days</h3>
                     <p className="text-orange-100 font-bold text-sm tracking-wide relative z-10">You're on Fire! 🔥</p>
                  </div>
                  <div className="p-5 space-y-4">
                     <div className="flex justify-between items-center bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-md relative overflow-hidden group/best">
                        <div className="absolute inset-y-0 left-0 w-1 bg-orange-500 rounded-full" />
                        <div className="relative z-10 pl-2">
                           <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest leading-none mb-1">Personal Best</p>
                           <p className="font-black text-xl text-text leading-none">{user?.max_streak} {user?.max_streak === 1 ? 'Day' : 'Days'}</p>
                        </div>
                        <div className="p-2 bg-background rounded-lg shadow-inner border border-neutral-200 dark:border-neutral-800 relative z-10 group-hover/best:scale-110 transition-transform">
                          <Flame size={24} className="text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.4)]" fill="currentColor" />
                        </div>
                     </div>
                     
                     <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 relative overflow-hidden group shadow-md">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                           <Snowflake size={80} className="text-blue-500 text-blue-500/30" />
                        </div>
                        
                        <div className="flex justify-between items-center mb-3 relative z-10">
                           <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Snowflake size={14} className="text-blue-500" /> STREAK FREEZES
                           </p>
                           <div className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-full shadow-sm">
                             {user?.streak_freezes || 0} / 3
                           </div>
                        </div>

                        <div className="flex gap-2 w-full relative z-10">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="flex-1 h-3 rounded-full bg-background p-0.5 border border-neutral-200 dark:border-neutral-800">
                                <div className={`h-full rounded-full transition-all duration-500 ${i <= (user?.streak_freezes || 0) ? 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-transparent'}`} />
                             </div>
                           ))}
                        </div>

                        <p className="text-[10px] font-bold text-text/40 mt-3 leading-tight relative z-10 italic">
                           Earn +1 freeze every 7 days. Use them to protect your streak!
                        </p>
                     </div>
                  </div>
               </div>
             </>
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center space-x-1.5 p-0.5 sm:pr-3 rounded-full transition-all border ${dropdownOpen ? 'bg-primary/10 border-primary/20 shadow-sm' : 'border-transparent hover:bg-primary/5 hover:border-primary/10'}`}
          >
            <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/30 shadow-sm shrink-0 flex items-center justify-center">
              <img 
                src={getAvatarUrl(user)} 
                alt={user?.name || "Profile"} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user?.email || user?.name || 'User')}`;
                }}
              />
            </div>
            <span className={`hidden sm:inline text-xs font-semibold transition-colors ${dropdownOpen ? 'text-primary' : 'text-text/80'}`}>
              {user?.name ? user.name.split(' ')[0] : 'Profile'}
            </span>
          </button>

          {/* User & Theme Dropdown */}
          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/40 z-40 sm:hidden animate-in fade-in duration-200"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="fixed inset-x-3 top-14 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 w-auto sm:w-60 bg-card z-50 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-xl overflow-hidden pt-1 pb-1.5 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/5">
              
              {/* Profile Header */}
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/50 bg-background/50 dark:bg-white/5">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary/30 bg-primary/10 shadow-sm flex-shrink-0">
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
                    <p className="text-xs font-bold text-text truncate">{user?.name}</p>
                    <p className="text-[11px] text-text/60 truncate font-medium">{user?.email}</p>
                  </div>
                </div>

                {user?.bio && (
                  <p className="text-[11px] text-text/75 italic line-clamp-2 mb-2 bg-card/80 p-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80">
                    "{user.bio}"
                  </p>
                )}

                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex flex-col items-center flex-1 bg-card border border-neutral-200 dark:border-neutral-800 rounded-lg py-1.5 shadow-sm">
                     <span className="text-[9px] font-bold text-text/40 uppercase tracking-widest mb-0.5">Points</span>
                     <span className="font-black text-primary text-sm">{user?.total_score || 0}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 bg-card border border-neutral-200 dark:border-neutral-800 rounded-lg py-1.5 shadow-sm">
                     <span className="text-[9px] font-bold text-text/40 uppercase tracking-widest mb-0.5">Peak</span>
                     <span className="font-black text-warning text-sm">{user?.max_streak || 0}</span>
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/50">
                <p className="text-[9px] uppercase tracking-widest text-text/40 font-bold mb-2">Theme</p>
                <div className="grid grid-cols-4 gap-1.5">
                  <button 
                    onClick={() => handleThemeChange('light')} 
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'text-text/50 hover:bg-primary/5 hover:text-primary hover:scale-105'}`}
                  >
                    <Sun size={16} className="mb-0.5" strokeWidth={2.5} />
                    <span className="text-[8px] font-bold">Light</span>
                  </button>
                  <button 
                    onClick={() => handleThemeChange('dark')} 
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'text-text/50 hover:bg-primary/5 hover:text-primary hover:scale-105'}`}
                  >
                     <Moon size={16} className="mb-0.5" strokeWidth={2.5} />
                    <span className="text-[8px] font-bold">Dark</span>
                  </button>
                  <button 
                    onClick={() => handleThemeChange('study')} 
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${theme === 'study' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'text-text/50 hover:bg-primary/5 hover:text-primary hover:scale-105'}`}
                  >
                    <Book size={16} className="mb-0.5" strokeWidth={2.5} />
                    <span className="text-[8px] font-bold">Study</span>
                  </button>
                  <button 
                    onClick={() => handleThemeChange('eye')} 
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${theme === 'eye' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'text-text/50 hover:bg-primary/5 hover:text-primary hover:scale-105'}`}
                  >
                    <Eye size={16} className="mb-0.5" strokeWidth={2.5} />
                    <span className="text-[8px] font-bold">Protect</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-1.5 space-y-0.5 mt-1">
                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-text/70 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors flex items-center space-x-2 group"
                >
                  <User size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/friends'); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-text/70 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors flex items-center space-x-2 group"
                >
                  <Users size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Friends</span>
                </button>
                <button 
                  onClick={() => { setDropdownOpen(false); setFeedbackOpen(true); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-text/70 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors flex items-center space-x-2 group"
                >
                  <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Feedback</span>
                </button>
                <button 
                  onClick={() => { setDropdownOpen(false); logout(); }} 
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center space-x-2 group"
                >
                  <LogOut size={16} className="group-hover:scale-110 transition-transform text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
              
            </div>
            </>
          )}
        </div>
      </div>
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </header>
  );
};

export default Navbar;
