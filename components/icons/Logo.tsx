import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 40" 
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="logo-title"
    >
      <title id="logo-title">FancyFam Logo</title>
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--theme-primary)" />
          <stop offset="100%" stopColor="var(--theme-secondary)" />
        </linearGradient>
      </defs>
      
      {/* Icon */}
      <g>
        <rect x="0" y="0" width="40" height="40" rx="8" fill="url(#logo-gradient)" />
        <text 
          x="20" 
          y="21" 
          dominantBaseline="central" 
          textAnchor="middle" 
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
          fontSize="22" 
          fontWeight="bold" 
          fill="white"
        >
          FF
        </text>
      </g>
      
      {/* Text */}
      <text 
        x="52" 
        y="21" 
        dominantBaseline="central" 
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="var(--text-header)"
      >
        FancyFam
      </text>
    </svg>
  );
};

export default Logo;
