import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Map, FileText, CheckSquare, Award, Trophy, X, Shield, Users, Flag, User } from 'lucide-react';

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
      <div className={`group absolute inset-y-0 left-0 bg-card border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full z-40 transform transition-all duration-300 ease-in-out shadow-2xl md:shadow-none hover:shadow-2xl overflow-hidden whitespace-nowrap
        w-64 md:w-[80px] md:hover:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button Header */}
        <div className={`h-16 flex items-center justify-end px-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
           <button className="text-text/60 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
             <X size={24} />
           </button>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => {
                const active = isActive || item.isMatch;
                return `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active 
                    ? 'text-primary' 
                    : 'text-text/70 hover:bg-primary/5 hover:text-primary font-medium'
                }`;
              }}
            >
              {({ isActive }) => {
                const active = isActive || item.isMatch;
                return (
                  <>
                    <item.icon size={26} fill={active ? "currentColor" : "none"} strokeWidth={2} className="flex-shrink-0 transition-all" />
                    <span className={`transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 ${active ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
                  </>
                );
              }}
            </NavLink>
          ))}

          {/* Secure Admin Routing Node */}
          {user?.role === 'admin' && (
             <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
               <p className="px-4 text-[10px] font-extrabold text-text/40 uppercase tracking-widest mb-3 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">Security & Config</p>
               <NavLink
                 to="/admin"
                 end
                 onClick={() => setIsOpen(false)}
                 className={({ isActive }) => 
                   `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                     isActive 
                       ? 'text-warning' 
                       : 'text-warning/70 hover:bg-warning/10 hover:text-warning font-medium'
                   }`
                 }
               >
                 {({ isActive }) => (
                   <>
                     <Shield size={26} fill={isActive ? "currentColor" : "none"} strokeWidth={2} className="flex-shrink-0 transition-all" />
                     <span className={`transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 ${isActive ? 'font-bold' : 'font-medium'}`}>Control Center</span>
                   </>
                 )}
               </NavLink>
               <NavLink
                 to="/admin/users"
                 onClick={() => setIsOpen(false)}
                 className={({ isActive }) => 
                   `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                     isActive 
                       ? 'text-warning' 
                       : 'text-warning/70 hover:bg-warning/10 hover:text-warning font-medium'
                   }`
                 }
               >
                 {({ isActive }) => (
                   <>
                     <Users size={26} fill={isActive ? "currentColor" : "none"} strokeWidth={2} className="flex-shrink-0 transition-all" />
                     <span className={`transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 ${isActive ? 'font-bold' : 'font-medium'}`}>Student Auditing</span>
                   </>
                 )}
               </NavLink>
               <NavLink
                 to="/admin/reports"
                 onClick={() => setIsOpen(false)}
                 className={({ isActive }) => 
                   `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                     isActive 
                       ? 'text-warning' 
                       : 'text-warning/70 hover:bg-warning/10 hover:text-warning font-medium'
                   }`
                 }
               >
                 {({ isActive }) => (
                   <>
                     <Flag size={26} fill={isActive ? "currentColor" : "none"} strokeWidth={2} className="flex-shrink-0 transition-all" />
                     <span className={`transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 ${isActive ? 'font-bold' : 'font-medium'}`}>Question Reports</span>
                   </>
                 )}
               </NavLink>
             </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
