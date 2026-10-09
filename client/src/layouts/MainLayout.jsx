import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isStudyMode = location.pathname.startsWith('/study');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-text transition-colors duration-300">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Spacer for desktop floating sidebar */}
        <div className="hidden md:block w-[80px] flex-shrink-0" />
        
        <main className={`flex-1 ${isStudyMode ? 'overflow-hidden flex flex-col h-full min-h-0' : 'overflow-y-auto'} bg-background`}>
          <div className={`w-full relative ${isStudyMode ? 'h-full flex-1 flex flex-col min-h-0' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
