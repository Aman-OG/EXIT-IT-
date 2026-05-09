import React from 'react';

const ExitItLogo = ({ size = 40, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Main circle background */}
        <defs>
          <linearGradient id="exitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(30, 58, 138)" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" />
          </linearGradient>
          <style>
            {`
              @keyframes exitPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.05); }
              }
              .exit-animate {
                animation: exitPulse 2s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        {/* Outer circle */}
        <circle cx="60" cy="60" r="55" fill="url(#exitGradient)" opacity="0.1" />
        <circle cx="60" cy="60" r="55" fill="none" stroke="url(#exitGradient)" strokeWidth="2" />

        {/* Exit text path */}
        <path
          id="exitPath"
          d="M 20 60 A 40 40 0 0 1 100 60"
          fill="none"
        />
        <text
          fontSize="24"
          fontWeight="bold"
          fill="rgb(30, 58, 138)"
          letterSpacing="2"
        >
          <textPath href="#exitPath" startOffset="50%" textAnchor="middle">
            EXIT-IT
          </textPath>
        </text>

        {/* Central icon - Exit door */}
        <g className="exit-animate">
          {/* Door frame */}
          <rect x="45" y="35" width="30" height="40" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="2.5" rx="2" />
          
          {/* Door handle */}
          <circle cx="72" cy="55" r="2.5" fill="rgb(34, 197, 94)" />
          
          {/* Arrow pointing out */}
          <line x1="60" y1="48" x2="60" y2="62" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="48" x2="56" y2="52" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="48" x2="64" y2="52" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Success checkmark */}
        <path
          d="M 75 70 L 80 75 L 90 65"
          fill="none"
          stroke="rgb(34, 197, 94)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="exit-animate"
          style={{ animationDelay: '0.3s' }}
        />
      </svg>
    </div>
  );
};

export default ExitItLogo;
