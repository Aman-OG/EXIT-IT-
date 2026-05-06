import React, { useState, useEffect } from 'react';

const ProgressBar = ({ percentage = 0, size = 'md', showLabel = true, animate = true, delay = 0 }) => {
  const clampedPct = Math.min(100, Math.max(0, Math.round(percentage)));
  const [displayWidth, setDisplayWidth] = useState(animate ? 0 : clampedPct);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setDisplayWidth(clampedPct), 150 + delay);
      return () => clearTimeout(timer);
    } else {
      setDisplayWidth(clampedPct);
    }
  }, [clampedPct, animate, delay]);
  
  // Use inline styles for guaranteed color rendering
  const getBarStyle = () => {
    if (clampedPct >= 70) return { 
      background: 'linear-gradient(90deg, #34d399, #10b981)',
      boxShadow: displayWidth > 0 ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
    };
    if (clampedPct > 0) return { 
      background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
      boxShadow: displayWidth > 0 ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none'
    };
    return { background: '#94a3b8' };
  };

  const getTextColor = () => {
    if (clampedPct >= 70) return { color: '#10b981' };
    if (clampedPct > 0) return { color: '#f59e0b' };
    return { color: 'rgba(var(--text), 0.4)' };
  };

  const heights = {
    sm: '4px',
    md: '8px',
    lg: '10px',
    xl: '14px',
  };

  const barHeight = heights[size] || heights.md;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text/40">Progress</span>
          <span className="text-xs font-black" style={getTextColor()}>
            {clampedPct}%
          </span>
        </div>
      )}
      <div 
        className="w-full rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800"
        style={{ height: barHeight }}
      >
        <div
          className="rounded-full"
          style={{ 
            height: barHeight,
            width: `${displayWidth}%`,
            ...getBarStyle(),
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
