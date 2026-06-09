import React from 'react';
import * as Icons from 'lucide-react';
import { SERVICES } from '../data';

interface ServicesProps {
  onChangePage: (page: 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial') => void;
}

export default function Services({ onChangePage }: ServicesProps) {
  const getPageKey = (id: string): 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial' => {
    if (id === 'srv-1') return 'services/sales';
    if (id === 'srv-2') return 'services/management';
    if (id === 'srv-3') return 'services/advisory';
    return 'services/commercial';
  };

  return (
    <section className="py-20 bg-white" id="services-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header blocks */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block animate-pulse">
            Advisory Suite
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-secondary">
            Bespoke Real Estate Services
          </h2>
          <div className="h-0.5 w-12 bg-primary mx-auto rounded-full" />
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Combining rigorous investment analytical frameworks with premium white-glove spatial solutions.
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {SERVICES.map((srv) => {
            const IconComponent = (Icons as any)[srv.iconName] || Icons.HelpCircle;
            const targetPage = getPageKey(srv.id);

            return (
              <div 
                key={srv.id}
                onClick={() => onChangePage(targetPage)}
                className="group relative bg-slate-50/50 rounded-3xl border border-black/[0.03] p-6 lg:p-7 transition-all duration-300 hover:bg-white hover:border-black/[0.05] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer"
                id={`srv-block-${srv.id}`}
              >
                {/* Header info */}
                <div>
                  <div className="p-3 mb-6 bg-slate-100 rounded-xl inline-flex text-secondary group-hover:bg-primary duration-300 transition-colors">
                    <IconComponent className="h-4.5 w-4.5" />
                  </div>

                  <h3 className="font-extrabold text-base text-secondary mb-2.5">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-sans text-left">
                    {srv.description}
                  </p>
                </div>

                {/* Micro accent arrow footer */}
                <div className="pt-6 mt-6 border-t border-black/[0.02] flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors justify-between">
                  <span>Learn Protocol</span>
                  <Icons.ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 duration-200 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
