import React from 'react';

interface CrovationLogoProps {
  className?: string;
  isDarkTheme?: boolean;
  height?: number;
}

export default function CrovationLogo({ className = '', isDarkTheme = false, height = 36 }: CrovationLogoProps) {
  // Use the new branded PNG logo image. URL encode spaces as %20 for robust browser compatibility.
  return (
    <div className={`inline-flex items-center justify-center bg-white py-1 px-3 rounded-lg border border-slate-200 shadow-sm ${className}`}>
      <img 
        src="/img/Crovation%20limited%20logo%20.png" 
        alt="Crovation Limited Logo"
        style={{ height: height - 8 > 12 ? height - 8 : height }}
        className="object-contain max-w-full block"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
