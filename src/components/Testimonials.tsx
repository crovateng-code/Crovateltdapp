import React from 'react';
import { Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data';

export default function Testimonials() {
  return (
    <section className="py-20 bg-brandbg border-t border-black/[0.02]" id="testimonials-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header content */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">
            Satisfied Voices
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-secondary">
            Endorsements From Our Private Clients
          </h2>
          <div className="h-0.5 w-12 bg-primary mx-auto rounded-full" />
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Read from some of our global private individuals, architects, and high-yield estate brokers.
          </p>
        </div>

        {/* 3-column card mapping */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={t.id}
              className="bg-white rounded-[24px] p-6 lg:p-8 border border-black/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] duration-300 transition-all flex flex-col justify-between text-left relative"
              id={`testi-${t.id}`}
            >
              {/* Subtle top quote decorative watermark */}
              <div className="absolute top-6 right-6 text-slate-100">
                <Quote className="h-10 w-10 rotate-180 opacity-60" />
              </div>

              {/* Rating Star layout */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Message text */}
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-8 italic relative z-10">
                "{t.review}"
              </p>

              {/* Client Profile and Credits */}
              <div className="flex items-center gap-4 border-t border-black/[0.03] pt-6">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-black/10 bg-slate-50 flex-shrink-0">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-secondary">
                    {t.name}
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-primary tracking-wider block mt-0.5">
                    {t.position}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
