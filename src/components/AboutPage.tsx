import React from 'react';
import { Shield, Sparkles, UserCheck, Star, Award, ChevronRight, Landmark } from 'lucide-react';

interface AboutPageProps {
  onOpenInquiry: (subject?: string) => void;
}

export default function AboutPage({ onOpenInquiry }: AboutPageProps) {
  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="about-view-page">
      {/* Editorial Hero Frame */}
      <div className="bg-[#000000] text-white py-20 md:py-28 relative overflow-hidden">
        {/* Subtle circular accents */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40%] h-[40%] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="mx-auto max-w-5xl px-4 md:px-8 relative z-10 text-center space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">
            Lineage & Integrity
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Crafting Legacy Portfolios For Modern Living
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Founded on absolute trust, Crovation Limited stands at the intersection of high-fidelity architectural design, smart wealth preservation, and bespoke client advisory.
          </p>
        </div>
      </div>

      {/* Brand values banner */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 space-y-20">
        
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block">
              Our Philosophy
            </span>
            <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-secondary">
              A Private Family Office Mindset Built Into Every Structure
            </h2>
            <div className="h-0.5 w-12 bg-primary rounded-full" />
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans">
              Unlike typical commercial brokers, Crovation Limited manages estates as permanent generational wealth. We understand that a luxury villa is not merely square footage; it is an intimate ecosystem framing your morning thoughts, private high-profile gatherings, and children's inheritances.
            </p>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans">
              Our advisory model takes a holistic view of tax structuring, cross-border transactional confidentiality, and long-term land values.
            </p>
            <div className="pt-4">
              <button
                onClick={() => onOpenInquiry('Investor Advisory Story Meeting')}
                className="bg-secondary hover:bg-primary text-white hover:text-secondary px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider duration-300 transition-all cursor-pointer"
              >
                Schedule Private Meeting
              </button>
            </div>
          </div>

          {/* Luxury interior picture container */}
          <div className="relative">
            <div className="absolute -inset-2 bg-primary/10 rounded-3xl blur-xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-black/5 aspect-video md:aspect-square">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury real estate architectural process"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Milestone Timeline Section */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block">
              The Crovation Journey
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-secondary">
              Decade of Expansion & Solid Trust
            </h2>
            <p className="text-xs text-gray-400">
              Tracing our progress from high-end regional broker to digital real estate SaaS leader.
            </p>
          </div>

          <div className="relative border-l border-gray-200 ml-4 md:ml-32 space-y-12 text-left">
            {/* 2015 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-secondary" />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8">
                <span className="md:col-span-2 text-xl font-extrabold text-[#000000] md:-ml-32 md:text-right md:block">
                  2015
                </span>
                <div className="md:col-span-10 space-y-1.5">
                  <h4 className="font-extrabold text-base text-secondary">The Founding Concept</h4>
                  <p className="text-xs text-gray-400 max-w-2xl">
                    Launched in Beverly Hills with a dedicated portfolio of seven private coastal villas. Operating with absolute client anonymity under private trust holdings.
                  </p>
                </div>
              </div>
            </div>

            {/* 2018 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-secondary" />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8">
                <span className="md:col-span-2 text-xl font-extrabold text-[#000000] md:-ml-32 md:text-right md:block">
                  2018
                </span>
                <div className="md:col-span-10 space-y-1.5">
                  <h4 className="font-extrabold text-base text-secondary">Manhattan Integration</h4>
                  <p className="text-xs text-gray-400 max-w-2xl">
                    Established the Olympian Towers office in Midtown Manhattan. Built direct strategic integrations with premier architectural designers, offering bespoke custom duplex configurations.
                  </p>
                </div>
              </div>
            </div>

            {/* 2021 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-secondary" />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8">
                <span className="md:col-span-2 text-xl font-extrabold text-[#000000] md:-ml-32 md:text-right md:block">
                  2021
                </span>
                <div className="md:col-span-10 space-y-1.5">
                  <h4 className="font-extrabold text-base text-secondary">Global Sovereign Hubs</h4>
                  <p className="text-xs text-gray-400 max-w-2xl">
                    Expanded advisory suite to Palm Jumeirah, Dubai. Authored unique multi-million dollar cross-border escrow transaction frameworks to allow seamless investment streams.
                  </p>
                </div>
              </div>
            </div>

            {/* 2025 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-secondary" />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8">
                <span className="md:col-span-2 text-xl font-extrabold text-primary md:-ml-32 md:text-right md:block animate-pulse">
                  2025
                </span>
                <div className="md:col-span-10 space-y-1.5">
                  <h4 className="font-extrabold text-base text-secondary">Digital SaaS Portal Launch & Expansion</h4>
                  <p className="text-xs text-gray-400 max-w-2xl">
                    Introduced the high-tech real-time private search portal allowing clients to securely execute verified title diligence and book immediate luxury tours safely. Over 500+ private clients served.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Partners / Directors */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block">
              Core Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-secondary">
              The Partners Board
            </h2>
            <p className="text-xs text-gray-400">
              Steered by global experts averaging 15+ years across real estate acquisition and design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl border border-black/[0.03] overflow-hidden p-5 flex flex-col items-center text-center space-y-4 hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] duration-300 transition-all">
              <div className="h-44 w-44 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80"
                  alt="Elizabeth Crovath"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-secondary">Elizabeth Crovath, JD</h4>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Co-Founder & Chief acquisition</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xs">
                Former international tax lawyer focusing on high-density generational land allocations and offshore trusts.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl border border-black/[0.03] overflow-hidden p-5 flex flex-col items-center text-center space-y-4 hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] duration-300 transition-all">
              <div className="h-44 w-44 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
                  alt="Andrew Vance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-secondary">Andrew Vance</h4>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Architectural Advisor Partner</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xs">
                Acclaimed designer of raw glass structural frames and ocean-resilient concrete villas in Trousdale, CA.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl border border-black/[0.03] overflow-hidden p-5 flex flex-col items-center text-center space-y-4 hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] duration-300 transition-all">
              <div className="h-44 w-44 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
                  alt="Helena Rostova"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-secondary">Helena Rostova</h4>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Executive Director, Client Service</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xs">
                Direct coordinator of high-net-worth client accounts, managing cross-border transactions and estate handovers.
              </p>
            </div>
          </div>
        </div>

        {/* Credentials and Partnerships */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-black/[0.02] grid grid-cols-2 md:grid-cols-4 gap-6 text-center items-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 block uppercase">Affiliated</span>
            <div className="text-sm font-extrabold text-slate-700">Sotheby's Network</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 block uppercase">Standard</span>
            <div className="text-sm font-extrabold text-slate-700">LEED Green Builder</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 block uppercase">Ranked</span>
            <div className="text-sm font-extrabold text-slate-700">Top 5 Luxury Broker</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 block uppercase font-sans">Compliant</span>
            <div className="text-sm font-extrabold text-slate-700">Title Deed Audited</div>
          </div>
        </div>

      </div>
    </div>
  );
}
