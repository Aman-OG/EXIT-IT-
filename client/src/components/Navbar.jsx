import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Sun, Moon, Book, Eye, Menu, User, Flame, Snowflake, Trophy } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    <header className="h-16 bg-card border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 md:px-6 relative z-30">
      <div className="flex items-center">
        <button className="text-text p-2 -ml-2 mr-4 md:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-primary">EXIT<span className="text-accent">-IT</span></h2>
      </div>

      <div className="flex items-center">
        <div className="relative" ref={streakRef}>
          {/* Streak Indicator (appears only if streak > 0) */}
          {user?.current_streak > 0 && (
            <button 
              onClick={() => setStreakOpen(!streakOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 mr-2 rounded-xl transition-all shadow-sm ${streakOpen ? 'bg-orange-500/20 shadow-orange-500/10' : 'bg-orange-500/10 hover:bg-orange-500/20'} border border-orange-500/20 text-orange-500 active:scale-95`}
            >
               <Flame size={18} fill="currentColor" className={streakOpen ? '' : 'animate-pulse'} />
               <span className="font-black text-sm">{user.current_streak}</span>
            </button>
          )}

          {/* Streak Extended Dropdown */}
          {streakOpen && (
             <div className="absolute right-2 mt-3 w-72 bg-card z-50 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
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
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center space-x-2 p-1.5 pr-4 rounded-full transition-all border ${dropdownOpen ? 'bg-primary/10 border-primary/20 shadow-sm' : 'border-transparent hover:bg-primary/5 hover:border-primary/10'}`}
          >
            <div className="h-9 w-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
            </div>
            <span className={`text-sm font-semibold transition-colors ${dropdownOpen ? 'text-primary' : 'text-text/80'}`}>
              {user?.name ? user.name.split(' ')[0] : 'Profile'}
            </span>
          </button>

          {/* User & Theme Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-card z-50 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl overflow-hidden pt-1 pb-2 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/5">
              
              {/* Profile Header */}
              <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/50 bg-background/50 dark:bg-white/5">
                <p className="text-sm font-bold text-text mb-0.5">{user?.name}</p>
                <p className="text-xs text-text/60 truncate font-medium mb-2">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-2 mb-1">
                  <div className="flex flex-col items-center flex-1 bg-card border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 shadow-sm">
                     <span className="text-xs font-bold text-text/40 uppercase tracking-widest mb-0.5">Points</span>
                     <span className="font-black text-primary text-lg">{user?.total_score || 0}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 bg-card border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 shadow-sm">
                     <span className="text-xs font-bold text-text/40 uppercase tracking-widest mb-0.5">Peak Streak</span>
                     <span className="font-black text-warning text-lg">{user?.max_streak || 0}</span>
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/50">
                <p className="text-[10px] uppercase tracking-widest text-text/40 font-bold mb-3">Theme Preferences</p>
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    onClick={() => handleThemeChange('light')} 
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'text-text/50 hover:bg-primary/5 hover:text-primary hover:scale-105'}`}
                  >
                    <Sun size={20} className="mb-1" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Light</span>
                  </button>
                  <button 
                    onClick={() => handleThemeChange('dark')} 
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'text-text/50 hover:bg-primary/5 hover:text-primary hover:scale-105'}`}
                  >
                     <Moon size={20} className="mb-1" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Dark</span>
                  </button>
                  <button 
                    onClick={() => handleThemeChange('study')} 
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${theme === 'study' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'text-text/50 hover:bg-primary/5 hover:text-primary hover:scale-105'}`}
                  >
                    <Book size={20} className="mb-1" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Study</span>
                  </button>
                  <button 
                    onClick={() => handleThemeChange('eye')} 
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${theme === 'eye' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'text-text/50 hover:bg-primary/5 hover:text-primary hover:scale-105'}`}
                  >
                    <Eye size={20} className="mb-1" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Protect</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-2 space-y-1 mt-1">
                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-text/70 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors flex items-center space-x-3 group"
                >
                  <User size={18} className="group-hover:scale-110 transition-transform" />
                  <span>View Profile</span>
                </button>
                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/trophies'); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-text/70 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors flex items-center space-x-3 group"
                >
                  <Trophy size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>Trophy Hall</span>
                </button>
                <button 
                  onClick={() => { setDropdownOpen(false); logout(); }} 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-warning/90 hover:bg-warning/10 hover:text-warning rounded-xl transition-colors flex items-center space-x-3 group"
                >
                  <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Log out securely</span>
                </button>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
