import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Map, FileText, CheckSquare, Award, Trophy, X, Shield, Users as UsersIcon, Flag, User, BarChart2, Brain, UserPlus } from 'lucide-react';

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
    { name: 'Quizzes', icon: CheckSquare, path: '/quizzes', isMatch: isQuizMode },
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
        w-56 md:w-[68px] md:hover:w-52
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Header - matches navbar height */}
        <div className={`h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 md:hidden`}>
          <span className="font-bold text-text">Menu</span>
          <button className="text-text/60 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 py-6 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => {
                const active = isActive || item.isMatch;
                return `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group/item focus:outline-none ${
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
                      size={22}
                      strokeWidth={2.8}
                      fill={active ? 'currentColor' : 'none'}
                      className="flex-shrink-0 transition-all duration-200"
                    />
                    <span className={`text-sm whitespace-nowrap transition-all duration-300
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
            <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
              <p className="px-3 text-xs font-extrabold text-text/40 uppercase tracking-widest mb-3 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">Admin</p>

              {[
                { to: '/admin', icon: Shield, label: 'Control', end: true },
                { to: '/admin/users', icon: UsersIcon, label: 'Students' },
                { to: '/admin/reports', icon: Flag, label: 'Reports' },
                { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
              ].map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group/item focus:outline-none ${
                    isActive
                      ? 'bg-warning/15 text-warning shadow-md'
                      : 'text-warning/70 hover:bg-warning/10 hover:text-warning'
                  }`}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={22} strokeWidth={2.8} fill={isActive ? 'currentColor' : 'none'} className="flex-shrink-0 transition-all duration-200" />
                      <span className={`text-sm whitespace-nowrap transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Profile */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-2 flex-shrink-0">
          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group/item focus:outline-none ${
              isActive
                ? 'bg-accent/15 text-accent shadow-md'
                : 'text-text/70 hover:bg-accent/10 hover:text-accent'
            }`}
          >
            {({ isActive }) => (
              <>
                <User size={22} strokeWidth={2.8} fill={isActive ? 'currentColor' : 'none'} className="flex-shrink-0 transition-all duration-200" />
                <span className={`text-sm whitespace-nowrap transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 ${isActive ? 'font-bold' : 'font-medium'}`}>Profile</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
