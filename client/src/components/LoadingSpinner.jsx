import React from 'react';
import { GraduationCap } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <div className="w-16 h-16 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
        
        {/* Glowing inner icon */}
        <div className="absolute inset-0 flex items-center justify-center text-primary animate-pulse">
          <GraduationCap size={24} />
        </div>
      </div>
      
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-text/40 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;
