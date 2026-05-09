import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Map, FileText, CheckSquare, Award, Trophy, X, Shield, Users, Flag, User, ChevronLeft, ChevronRight } from 'lucide-react';
import ExitItLogo from './ExitItLogo';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isStudyMode = location.pathname.startsWith('/study');
  const isNotesMode = isStudyMode && location.search.includes('mode=notes');
  const isCoursesMode = isStudyMode && !isNotesMode;
  
  const isQuizMode = location.pathname.startsWith('/quiz');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Courses', icon: BookOpen, path: '/courses', isMatch: isCoursesMode },
    { name: 'Roadmap', icon: Map, path: '/roadmap' },
    { name: 'Notes', icon: FileText, path: '/notes', isMatch: isNotesMode },
    { name: 'Quizzes', icon: CheckSquare, path: '/quizzes', isMatch: isQuizMode },
    { name: 'Exam Mode', icon: Award, path: '/exam' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)} 
      />
      <div className={`group absolute inset-y-0 left-0 bg-gradient-to-b from-card to-card border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full z-40 transform transition-all duration-300 ease-in-out shadow-2xl md:shadow-lg overflow-hidden
        w-64 md:w-[90px] md:hover:w-72
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button Header */}
        <div className={`h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-bold text-text">Menu</span>
          <button className="text-text/60 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Logo Section - Desktop Only */}
        <div className="hidden md:flex items-center justify-center py-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <ExitItLogo size={50} />
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => {
                const active = isActive || item.isMatch;
                return `relative flex items-center space-x-4 px-3 py-3 rounded-xl transition-all duration-200 group/item ${
                  active 
                    ? 'bg-primary/15 text-primary shadow-md' 
                    : 'text-text/70 hover:bg-primary/10 hover:text-primary'
                }`;
              }}
            >
              {({ isActive }) => {
                const active = isActive || item.isMatch;
                return (
                  <>
                    {/* Icon Container */}
                    <div className={`relative flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      active 
                        ? 'bg-primary/20' 
                        : 'group-hover/item:bg-primary/20'
                    }`}>
                      <item.icon 
                        size={24} 
                        strokeWidth={2.2}
                        className="transition-all duration-200"
                      />
                      {active && (
                        <div className="absolute inset-0 rounded-lg bg-primary/30 animate-pulse" />
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`text-sm font-semibold transition-all duration-300 whitespace-nowrap
                      md:opacity-0 md:group-hover:opacity-100 
                      ${active ? 'font-bold' : 'font-medium'}
                    `}>
                      {item.name}
                    </span>

                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute right-0 w-1 h-8 bg-primary rounded-full" />
                    )}
                  </>
                );
              }}
            </NavLink>
          ))}

          {/* Secure Admin Routing Node */}
          {user?.role === 'admin' && (
            <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
              <p className="px-3 text-xs font-extrabold text-text/40 uppercase tracking-widest mb-3 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">Admin</p>
              
              <NavLink
                to="/admin"
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `relative flex items-center space-x-4 px-3 py-3 rounded-xl transition-all duration-200 group/item ${
                  isActive 
                    ? 'bg-warning/15 text-warning shadow-md' 
                    : 'text-warning/70 hover:bg-warning/10 hover:text-warning'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-warning/20' 
                        : 'group-hover/item:bg-warning/20'
                    }`}>
                      <Shield size={24} strokeWidth={2.2} />
                      {isActive && <div className="absolute inset-0 rounded-lg bg-warning/30 animate-pulse" />}
                    </div>
                    <span className={`text-sm font-semibold transition-all duration-300 whitespace-nowrap md:opacity-0 md:group-hover:opacity-100`}>Control</span>
                    {isActive && <div className="absolute right-0 w-1 h-8 bg-warning rounded-full" />}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/users"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `relative flex items-center space-x-4 px-3 py-3 rounded-xl transition-all duration-200 group/item ${
                  isActive 
                    ? 'bg-warning/15 text-warning shadow-md' 
                    : 'text-warning/70 hover:bg-warning/10 hover:text-warning'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-warning/20' 
                        : 'group-hover/item:bg-warning/20'
                    }`}>
                      <Users size={24} strokeWidth={2.2} />
                      {isActive && <div className="absolute inset-0 rounded-lg bg-warning/30 animate-pulse" />}
                    </div>
                    <span className={`text-sm font-semibold transition-all duration-300 whitespace-nowrap md:opacity-0 md:group-hover:opacity-100`}>Students</span>
                    {isActive && <div className="absolute right-0 w-1 h-8 bg-warning rounded-full" />}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/reports"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `relative flex items-center space-x-4 px-3 py-3 rounded-xl transition-all duration-200 group/item ${
                  isActive 
                    ? 'bg-warning/15 text-warning shadow-md' 
                    : 'text-warning/70 hover:bg-warning/10 hover:text-warning'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-warning/20' 
                        : 'group-hover/item:bg-warning/20'
                    }`}>
                      <Flag size={24} strokeWidth={2.2} />
                      {isActive && <div className="absolute inset-0 rounded-lg bg-warning/30 animate-pulse" />}
                    </div>
                    <span className={`text-sm font-semibold transition-all duration-300 whitespace-nowrap md:opacity-0 md:group-hover:opacity-100`}>Reports</span>
                    {isActive && <div className="absolute right-0 w-1 h-8 bg-warning rounded-full" />}
                  </>
                )}
              </NavLink>
            </div>
          )}
        </div>

        {/* Footer - Profile Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 flex-shrink-0">
          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `relative flex items-center space-x-4 px-3 py-3 rounded-xl transition-all duration-200 group/item ${
              isActive 
                ? 'bg-accent/15 text-accent shadow-md' 
                : 'text-text/70 hover:bg-accent/10 hover:text-accent'
            }`}
          >
            {({ isActive }) => (
              <>
                <div className={`relative flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-accent/20' 
                    : 'group-hover/item:bg-accent/20'
                }`}>
                  <User size={24} strokeWidth={2.2} />
                  {isActive && <div className="absolute inset-0 rounded-lg bg-accent/30 animate-pulse" />}
                </div>
                <span className={`text-sm font-semibold transition-all duration-300 whitespace-nowrap md:opacity-0 md:group-hover:opacity-100`}>Profile</span>
                {isActive && <div className="absolute right-0 w-1 h-8 bg-accent rounded-full" />}
              </>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
