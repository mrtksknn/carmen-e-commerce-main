import React from 'react';

const Logo = ({ className = '', iconSize = 40, ...props }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 45 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        role="img"
        aria-label="Piece Of Oblivion Logo"
      >
        <title>Piece Of Oblivion Logo</title>
        {/* Brand Mark: Intertwined minimalist C & A */}
        <g transform="translate(2, 5)">
          {/* The 'A' shape */}
          <path
            d="M 10 28 L 22 2 L 34 28"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary transition-all duration-300"
          />
          <path
            d="M 14.5 19 L 29.5 19"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary"
          />

          {/* The 'C' shape wrapping around the 'A' */}
          <path
            d="M 30 8 A 12 12 0 1 0 30 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-white drop-shadow-md"
          />

          {/* Art accent dot */}
          <circle cx="36" cy="16" r="3" fill="currentColor" className="text-primary animate-pulse" />
        </g>
      </svg>

      {/* Typography: PieceOfOblivion as standard HTML text */}
      <span className="satisfy-regular text-[24px] mb-[5px] leading-none tracking-wider pt-2">
        Piece<span className="text-white">Of</span>Oblivion
      </span>
    </div>
  );
};

export default Logo;
