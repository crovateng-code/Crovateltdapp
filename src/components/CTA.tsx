import React from 'react';
import { ArrowUpRight, MessageSquareCode } from 'lucide-react';

interface CTAProps {
  onOpenInquiry: (subject?: string) => void;
  onExploreProperties: () => void;
}

export default function CTA({ onOpenInquiry, onExploreProperties }: CTAProps) {
  return (
    <section className="bg-secondary text-white py-24 relative overflow-hidden" id="cta-section">
      {/* Decorative ambient background rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 md:px-8 relative z-10 text-center space-y-8">
        
        {/* Core Subtitle Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary uppercase text-xs font-bold tracking-widest mx-auto">
          <span>Private Club Registry</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight" id="cta-header">
          Ready To Find Your Next Property?
        </h2>

        {/* Subtext */}
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto leading-relaxed" id="cta-subtext">
          Our team is ready to help you secure the perfect investment. Work with Crovation Limited today.
        </p>

        {/* CTA Buttons in Theme Primary Color */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onExploreProperties}
            className="bg-primary text-secondary hover:bg-white hover:text-secondary font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl shadow-[0_10px_30px_rgba(2,206,237,0.25)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-1.5 cursor-pointer animate-pulse"
            id="btn-cta-explore"
          >
            Explore Properties
            <ArrowUpRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onOpenInquiry('Direct Advisory Request')}
            className="bg-white/5 border border-white/10 hover:border-primary hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl duration-300 transition-all flex items-center gap-1.5 cursor-pointer"
            id="btn-cta-speak"
          >
            <MessageSquareCode className="h-4 w-4 text-primary" />
            Speak With Us
          </button>
        </div>

      </div>
    </section>
  );
}
