const ExitItLogo = ({ size = 40, className = '' }) => {
  const uid = `eil_${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size, color: 'rgb(var(--primary))' }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`${uid}_tassel`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Top board (mortarboard) — diamond shape */}
        <polygon
          points="50,12 95,38 50,52 5,38"
          fill="currentColor"
        />

        {/* Cap band / base curve */}
        <path
          d="M25,42 L25,62 Q50,78 75,62 L75,42 L50,52 L25,42 Z"
          fill="currentColor"
          opacity="0.85"
        />

        {/* Tassel string */}
        <line x1="50" y1="38" x2="22" y2="52" stroke={`url(#${uid}_tassel)`} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="52" x2="22" y2="72" stroke={`url(#${uid}_tassel)`} strokeWidth="2.5" strokeLinecap="round" />
        {/* Tassel knot */}
        <circle cx="22" cy="73" r="3" fill="#FBBF24" />
        {/* Tassel fringe */}
        <path d="M19,76 L22,84 L25,76" fill="#F59E0B" />

        {/* Button on top */}
        <circle cx="50" cy="37" r="4" fill="#FBBF24" />
      </svg>
    </div>
  );
};

export default ExitItLogo;
