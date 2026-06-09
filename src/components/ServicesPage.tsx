import React, { useState } from 'react';
import { BadgeDollarSign, KeyRound, LineChart, Building2, Landmark, CheckCircle, ArrowRight, Calendar, UserCheck } from 'lucide-react';

interface ServicesPageProps {
  onOpenInquiry: (subject?: string) => void;
  onNavigateToFullPage: (page: 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial') => void;
}

export default function ServicesPage({ onOpenInquiry, onNavigateToFullPage }: ServicesPageProps) {
  const [activeTab, setActiveTab] = useState<'sales' | 'management' | 'advisory' | 'commercial'>('sales');

  const clientProtocols = {
    sales: {
      title: 'Property Sales & Elite Brokerage',
      desc: 'Seamless transaction coordination for buyers and sellers of premium multi-million dollar residential estates and curated modern properties.',
      icon: BadgeDollarSign,
      steps: [
        { label: 'Architectural Appraisal', body: 'We assess spatial parameters, light exposure, and structural premium features to define true value.' },
        { label: 'Bespoke Private Listing', body: 'Confidential catalog indexing visible only to qualified private funds and high-net-worth buyers.' },
        { label: 'Qualified Buyer Screening', body: 'No looky-loos. Every prospect completes premium capital verification before viewing approval.' },
        { label: 'Notary & Trust Escrow Handover', body: 'Our elite legal team drafts the contract configurations for standard or institutional escrow trust.' },
      ]
    },
    management: {
      title: 'Premium Property Trust Management',
      desc: 'Complete hands-off peace of mind. We oversee day-to-day operations, luxury upkeep, maintenance, and concierge tenants facilitation.',
      icon: KeyRound,
      steps: [
        { label: '24/7 Concierge Allocation', body: 'A dedicated estate manager on site coordinates instant maintenance, guest arrivals, and estate health.' },
        { label: 'High-Value Upkeep & Landscape', body: 'Routine professional inspections for infinity pools, cedar decking, HVAC filters, and advanced alarm layers.' },
        { label: 'Revenue Yield Optimization', body: 'Dynamic luxury listing management for high-net-worth seasonal leasing to optimize estate cash reserves.' },
        { label: 'Confidential Consolidated Bills', body: 'Consolidated reporting covering utility schedules, estate staff payroll, and tax deductions in one ledger.' },
      ]
    },
    advisory: {
      title: 'Sovereign Investment Advisory',
      desc: 'Data-driven real estate intelligence identifying fast-appreciating off-market phases, tax advantages, and high-yield developer blocks.',
      icon: LineChart,
      steps: [
        { label: 'Macro Yield Analytics', body: 'Using historical and machine forecasts to determine high-growth zones and regional appreciation lines.' },
        { label: 'Off-Market Phase 0 Priority', body: 'Direct access to pre-launch allocations, letting clients acquire villas before core ground foundation laying.' },
        { label: 'LCC Holding Structuring', body: 'Structuring acquisitions under specialized LLCs or single family trusts to shield identity and optimize taxation.' },
        { label: 'Structured Exit Roadmaps', body: 'Ready liquidity paths with pre-screened buyers when portfolio appreciation targets are achieved.' },
      ]
    },
    commercial: {
      title: 'Corporate & Commercial Real Estate',
      desc: 'Premium strategic workspaces, luxury retail fronts, and corporate centers configured for high business throughput and efficiency.',
      icon: Building2,
      steps: [
        { label: 'Tech & Spatial Alignment', body: 'Configuring fiber lines, backup generation hubs, and zoning optimization for elite corporate activities.' },
        { label: 'LEED Green Compliance', body: 'Auditing thermal performance and solar/greywater recycling to guarantee platinum sustainability scores.' },
        { label: 'Strategic Zoning Research', body: 'Assessing traffic access, transport links, and local employee densities to guarantee business success.' },
        { label: 'Long-Term Corporate Leasing', body: 'Drafting multi-year inflation-indexed lease agreements with global corporations, providing stable low-risk yields.' },
      ]
    }
  };

  const selectedProtocol = clientProtocols[activeTab];

  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="services-view-page">
      {/* Page Title */}
      <div className="bg-[#00090a] text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10 text-left space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">
            Advisory Suite
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Our Bespoke Services
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-xl">
            Crovation Limited merges mathematical investment intelligence with absolute design excellence to provide uncompromising real estate services.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        
        {/* Core Multi-Tab Services Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Tab Buttons (Col span 4) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2">
              Select Services Protocol
            </span>
            
            <div className="flex flex-col gap-3">
              {(Object.keys(clientProtocols) as Array<keyof typeof clientProtocols>).map((key) => {
                const item = clientProtocols[key];
                const IconComp = item.icon;
                const isSelected = activeTab === key;

                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer relative ${
                      isSelected
                        ? 'bg-secondary text-white border-transparent shadow-lg'
                        : 'bg-white text-gray-400 hover:text-secondary border-black/[0.03] hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary text-secondary' : 'bg-slate-100 text-gray-500'
                    }`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className={`font-extrabold text-sm leading-none ${isSelected ? 'text-white' : 'text-secondary'}`}>
                        {key === 'sales' ? 'Property Sales' : key === 'management' ? 'Property Management' : key === 'advisory' ? 'Investment Advisory' : 'Commercial Spaces'}
                      </h3>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                        <ArrowRight className="h-4 w-4 animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* General Inquiry Direct Block */}
            <div className="bg-[#00090a] rounded-2xl p-6 text-white text-left space-y-4 border border-white/5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-white/5">
                <Landmark className="h-28 w-28 translate-y-6 translate-x-3 pointer-events-none" />
              </div>
              <h4 className="font-bold text-sm text-primary">Need a custom strategy?</h4>
              <p className="text-[11px] text-gray-400 leading-normal leading-relaxed">
                Connect for private consultation on legacy asset distributions or multi-agency brokerage lists. We operate with standard NDAs.
              </p>
              <button
                onClick={() => onOpenInquiry(`Custom Advisory Service Request - (${activeTab.toUpperCase()})`)}
                className="w-full bg-primary hover:bg-white text-secondary font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl duration-300 transition-colors"
              >
                Initiate Consultation
              </button>
            </div>
          </div>

          {/* Right Protocol Visualization Page (Col span 8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-black/[0.03] p-6 md:p-8 space-y-8 shadow-sm">
            
            {/* Protocol Summary Header */}
            <div className="text-left space-y-3.5 pb-6 border-b border-black/[0.03]">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-slate-100 text-secondary">
                  <selectedProtocol.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-primary">
                  Underwritten Protocol
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-secondary">
                {selectedProtocol.title}
              </h2>

              <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-3xl">
                {selectedProtocol.desc}
              </p>
            </div>

            {/* Timeline Steps workflow */}
            <div className="text-left">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Execution Phases
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                {selectedProtocol.steps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-black/[0.02] hover:bg-white hover:border-black/[0.04] hover:shadow-md duration-300 transition-all space-y-2 relative"
                  >
                    {/* Index identifier */}
                    <span className="absolute top-4 right-4 text-xs font-mono text-primary font-bold">
                      0{idx + 1}
                    </span>

                    <h5 className="font-extrabold text-sm text-secondary pr-6 leading-tight">
                      {step.label}
                    </h5>

                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans mt-1">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol CTA Footer */}
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-secondary">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Licensed Concierge Advisors</span>
                </div>
                <p className="text-[10px] text-gray-400 max-w-md leading-relaxed font-sans">
                  We guarantee direct interaction with designated partners. No automated ticket bots or entry-level call centers.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 flex-shrink-0">
                <button
                  onClick={() => onNavigateToFullPage(`services/${activeTab}` as any)}
                  className="border border-secondary hover:bg-slate-100 text-secondary px-4 py-3 rounded-xl font-extrabold text-[10px] uppercase tracking-wider duration-300 transition-colors"
                >
                  Learn Protocol Details
                </button>
                <button
                  onClick={() => onOpenInquiry(`Initiation request for: ${selectedProtocol.title}`)}
                  className="bg-secondary hover:bg-primary text-white hover:text-secondary px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider duration-300 transition-colors"
                >
                  Initiate Protocol
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
