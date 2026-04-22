import React from 'react';

const Logo = ({ className = '', iconSize = 44, ...props }) => {
  return (
    <div className={`flex items-center gap-0 ${className}`} {...props}>
      <div className="relative group flex-shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110"
          role="img"
          aria-label="PieceOfOblivion Logo"
        >
          <title>PieceOfOblivion Logo</title>
          <defs>
            <linearGradient id="bc-knot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="animate-shimmer" />
              <stop offset="100%" stopColor="#f26868" />
            </linearGradient>
            <filter id="knot-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Interlocking 'B' Structure */}
          <path
            d="M 30 20 L 30 80 M 30 20 L 60 20 C 75 20, 75 45, 60 50 L 30 50 M 60 50 C 75 50, 75 80, 60 80 L 30 80"
            stroke="url(#bc-knot-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#knot-glow)"
            className="animate-draw"
          />

          {/* Creative 'C' Overlay (Interlocked) */}
          <path
            d="M 70 30 A 30 30 0 1 0 70 70"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeOpacity="0.8"
            className="drop-shadow-md animate-draw"
            style={{ animationDelay: '0.4s' }}
          />

          {/* Center Point */}
          <circle cx="30" cy="50" r="4" fill="white" className="animate-pulse shadow-primary" />

        </svg>

      </div>

      <div className="flex flex-col pt-2">
        <span className="satisfy-regular text-[28px] tracking-[0.02em] text-white/90 logo-text-glow leading-none">
          PieceOf<span className="text-primary-light italic" style={{ fontFamily: 'Alex Brush, cursive' }}>Oblivion</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
