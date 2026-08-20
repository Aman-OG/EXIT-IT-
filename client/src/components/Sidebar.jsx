import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Map, FileText, CheckSquare, Award, Trophy, X, Shield, Users as UsersIcon, Flag, User, BarChart2, Brain, UserPlus, MessageSquare } from 'lucide-react';
import ExitItLogo from './ExitItLogo';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isStudyMode = location.pathname.startsWith('/study');
  const isNotesMode = isStudyMode && location.search.includes('mode=notes');
  const isCoursesMode = isStudyMode && !isNotesMode;
  const isQuizMode = location.pathname.startsWith('/quiz');
  const isFlashcardsMode = location.pathname.startsWith('/flashcards');
  const isFriendsMode = location.pathname.startsWith('/friends');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Courses', icon: BookOpen, path: '/courses', isMatch: isCoursesMode },
    { name: 'Roadmap', icon: Map, path: '/roadmap' },
    { name: 'Notes', icon: FileText, path: '/notes', isMatch: isNotesMode },
    { name: 'Flashcards', icon: Brain, path: '/flashcards', isMatch: isFlashcardsMode },
    { name: 'Friends', icon: UserPlus, path: '/friends', isMatch: isFriendsMode },
    { name: 'Exam Mode', icon: Award, path: '/exam' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`group fixed md:absolute inset-y-0 left-0 top-0 md:top-0 bg-gradient-to-b from-card to-card border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full z-50 md:z-40 transform transition-all duration-300 ease-in-out shadow-2xl md:shadow-lg overflow-hidden
        w-56 md:w-[52px] md:hover:w-48
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Header - matches navbar height */}
        <div className={`h-14 flex items-center justify-between px-3 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 md:hidden`}>
          <div className="flex items-center space-x-1.5">
            <ExitItLogo size={20} />
            <span className="font-black text-xs leading-none">
              <span className="text-primary">EX-</span><span className="italic text-accent">IT</span>
            </span>
          </div>
          <button className="text-text/60 p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 py-4 px-1.5 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => {
                const active = isActive || item.isMatch;
                return `flex items-center space-x-2.5 px-2.5 py-2.5 rounded-lg transition-all duration-200 group/item focus:outline-none ${
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
                    <item.icon
                      size={18}
                      strokeWidth={2.8}
                      fill={active ? 'currentColor' : 'none'}
                      className="flex-shrink-0 transition-all duration-200"
                    />
                    <span className={`text-xs whitespace-nowrap transition-all duration-300
                      md:opacity-0 md:group-hover:opacity-100
                      ${active ? 'font-bold' : 'font-medium'}
                    `}>
                      {item.name}
                    </span>
                  </>
                );
              }}
            </NavLink>
          ))}

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-0.5">
              <p className="px-2.5 text-[9px] font-extrabold text-text/40 uppercase tracking-widest mb-2 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">Admin</p>

              {[
                { to: '/admin', icon: Shield, label: 'Control', end: true },
                { to: '/admin/users', icon: UsersIcon, label: 'Students' },
                { to: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
                { to: '/admin/reports', icon: Flag, label: 'Reports' },
                { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
              ].map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `flex items-center space-x-2.5 px-2.5 py-2.5 rounded-lg transition-all duration-200 group/item focus:outline-none ${
                    isActive
                      ? 'bg-warning/15 text-warning shadow-md'
                      : 'text-warning/70 hover:bg-warning/10 hover:text-warning'
                  }`}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} strokeWidth={2.8} fill={isActive ? 'currentColor' : 'none'} className="flex-shrink-0 transition-all duration-200" />
                      <span className={`text-xs whitespace-nowrap transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Profile */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-1.5 flex-shrink-0">
          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `flex items-center space-x-2.5 px-2.5 py-2.5 rounded-lg transition-all duration-200 group/item focus:outline-none ${
              isActive
                ? 'bg-accent/15 text-accent shadow-md'
                : 'text-text/70 hover:bg-accent/10 hover:text-accent'
            }`}
          >
            {({ isActive }) => (
              <>
                <User size={18} strokeWidth={2.8} fill={isActive ? 'currentColor' : 'none'} className="flex-shrink-0 transition-all duration-200" />
                <span className={`text-xs whitespace-nowrap transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 ${isActive ? 'font-bold' : 'font-medium'}`}>Profile</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
