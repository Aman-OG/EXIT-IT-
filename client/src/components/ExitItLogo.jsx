const ExitItLogo = ({ size = 40, className = '' }) => {
  return (
    <div className={`flex items-center justify-center flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Rounded square background */}
        <rect x="4" y="4" width="92" height="92" rx="22" ry="22" fill="url(#logoGrad)" />

        {/* Shine overlay */}
        <rect x="4" y="4" width="92" height="46" rx="22" ry="22" fill="url(#shineGrad)" />

        {/* Bold "E" lettermark */}
        <g fill="white">
          {/* Top bar */}
          <rect x="28" y="26" width="44" height="10" rx="5" />
          {/* Middle bar (shorter) */}
          <rect x="28" y="45" width="34" height="10" rx="5" />
          {/* Bottom bar */}
          <rect x="28" y="64" width="44" height="10" rx="5" />
          {/* Vertical stem */}
          <rect x="28" y="26" width="10" height="48" rx="5" />
        </g>

        {/* Small accent dot — top right */}
        <circle cx="78" cy="22" r="7" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  );
};

export default ExitItLogo;
