import React from 'react';

interface CrovationLogoProps {
  className?: string;
  isDarkTheme?: boolean;
  height?: number;
}

export default function CrovationLogo({ className = '', isDarkTheme = false, height = 36 }: CrovationLogoProps) {
  // SVG keeps a 340x88 viewport for perfect aspect ratio, crisp rendering, and scalability
  const subtextColor = isDarkTheme ? '#e2e8f0 font-medium' : '#00090a font-semibold';
  
  return (
    <svg 
      viewBox="0 0 350 85" 
      style={{ height }} 
      className={`select-none ${className}`}
      id="crovation-svg-logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Main CROVATIO Blue Wordmark */}
      <text 
        x="0" 
        y="46" 
        style={{ 
          fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', 
          fontWeight: 850, 
          letterSpacing: '-1.5px',
          fontSize: '44px'
        }} 
        fill="#2472c8"
      >
        CROVATIO
      </text>

      {/* 2. Subtitle: Crovation Limited (Offset below) */}
      <text 
        x="138" 
        y="68" 
        style={{ 
          fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', 
          fontWeight: 700, 
          letterSpacing: '-0.3px',
          fontSize: '12.5px'
        }} 
        fill={isDarkTheme ? '#cbd5e1' : '#1e293b'}
      >
        Crovation Limited
      </text>

      {/* 3. High-Fidelity Vector "N" Architectural House & Arrow Accent */}
      {/* Starting around X=240, Y=10 */}
      <g transform="translate(242, 6)">
        {/* Diagonal Thick Arrow Stem (representing the diagonal of the N and left roof edge) */}
        <path 
          d="M 12 52 L 2 52 L 20 34 L 16 30 L 68 12 L 68 20 L 25 38 L 22 35 Z" 
          fill="#1d4ed8" /* Tailored brand blue-700 matching the logo exactly */
        />
        
        {/* House outline connecting with the diagonal */}
        {/* Outer roof slope line on the right */}
        <polygon 
          points="66,13 78,21 78,52 22,52 22,38 31,31" 
          fill="none" 
          stroke="#1d4ed8" 
          strokeWidth="3.2"
          strokeLinejoin="round" 
        />
        
        {/* Fill white background inside the house shape for consistency */}
        <polygon 
          points="24,50 76,50 76,21 66,14 24,36" 
          fill={isDarkTheme ? '#00090a' : '#ffffff'} 
        />

        {/* Small architectural chimney / vent pipe */}
        <line 
          x1="62" 
          y1="14" 
          x2="62" 
          y2="23" 
          stroke="#1d4ed8" 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />

        {/* The 4-pane grid window inside the house */}
        <g transform="translate(48, 30)">
          {/* Window outline frame */}
          <rect 
            x="0" 
            y="0" 
            width="14" 
            height="14" 
            fill="none" 
            stroke="#1d4ed8" 
            strokeWidth="2" 
          />
          {/* Vertical divider */}
          <line 
            x1="7" 
            y1="0" 
            x2="7" 
            y2="14" 
            stroke="#1d4ed8" 
            strokeWidth="1.5" 
          />
          {/* Horizontal divider */}
          <line 
            x1="0" 
            y1="7" 
            x2="14" 
            y2="7" 
            stroke="#1d4ed8" 
            strokeWidth="1.5" 
          />
        </g>
      </g>
    </svg>
  );
}
