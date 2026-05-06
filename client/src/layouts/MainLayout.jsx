import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-text transition-colors duration-300">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Spacer for desktop floating sidebar */}
        <div className="hidden md:block w-[80px] flex-shrink-0" />
        
        <main className="flex-1 overflow-hidden bg-background">
          <div className="h-full w-full relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
