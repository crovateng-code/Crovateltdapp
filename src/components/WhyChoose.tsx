import React from 'react';
import * as Icons from 'lucide-react';
import { WHY_CHOOSE_ITEMS } from '../data';

export default function WhyChoose() {
  return (
    <section className="py-20 bg-white border-y border-black/[0.02]" id="why-choose-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header content */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">
            The Crovation Standard
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-secondary">
            Why Discerning Clients Trust Us
          </h2>
          <div className="h-0.5 w-12 bg-primary mx-auto rounded-full" />
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Experience exceptional integrity and highly authenticated luxury transactions driven by strategic investment professionals.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {WHY_CHOOSE_ITEMS.map((item) => {
            // Dyn import resolvers
            const IconComponent = (Icons as any)[item.iconName] || Icons.HelpCircle;

            return (
              <div
                key={item.id}
                className="group relative bg-slate-50/55 rounded-3xl border border-black/[0.03] p-6 lg:p-8 transition-all duration-300 hover:bg-white hover:border-black/[0.06] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 flex flex-col items-start text-left"
                id={`why-card-${item.id}`}
              >
                {/* Icon Base */}
                <div className="p-3.5 mb-6 rounded-2xl bg-secondary text-primary group-hover:bg-primary group-hover:text-secondary duration-300 transition-all flex items-center justify-center">
                  <IconComponent className="h-5 w-5" />
                </div>

                <h3 className="font-bold text-lg text-secondary mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  {item.description}
                </p>

                {/* Subtle bottom indicator */}
                <div className="absolute bottom-5 right-5 h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
