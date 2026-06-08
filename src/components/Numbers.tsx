import React from 'react';
import { STATS } from '../data';

export default function Numbers() {
  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden" id="numbers-section">
      {/* Background aesthetics */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[30%] h-[30%] bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center divider-x divider-white/5">
          {STATS.map((stat, i) => (
            <div 
              key={stat.id} 
              className={`space-y-2.5 transition-all duration-300 hover:scale-[1.03] ${
                i > 0 ? 'border-l-0 sm:border-l border-white/10' : ''
              } py-4`}
              id={`stat-block-${stat.id}`}
            >
              {/* Massive Value Heading */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary font-sans">
                {stat.value}
              </div>

              {/* Minimalist Subtext */}
              <div className="text-xs uppercase font-medium text-gray-400 tracking-widest leading-none">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
