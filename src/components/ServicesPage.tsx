import React, { useState, useEffect } from 'react';
import { 
  Construction, 
  Map, 
  BadgeDollarSign, 
  TrendingUp, 
  LineChart, 
  Handshake, 
  FileCheck, 
  Coins, 
  Landmark, 
  ArrowRight, 
  UserCheck 
} from 'lucide-react';

interface ServicesPageProps {
  onOpenInquiry: (subject?: string) => void;
  onNavigateToFullPage: (page: string) => void;
  initialTab?: string;
}

export default function ServicesPage({ onOpenInquiry, onNavigateToFullPage, initialTab }: ServicesPageProps) {
  const [activeTab, setActiveTab] = useState<string>('development');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const clientProtocols = {
    development: {
      title: 'Property Development & Design',
      shortTitle: 'Property Development',
      desc: 'We acquire land, plan, and develop high-quality residential and commercial properties, delivering lasting value and investment potential.',
      icon: Construction,
      steps: [
        { label: 'Acquisition & Planning', body: 'We secure strategic parcels and conduct feasibility studies for optimized spatial footprinting.' },
        { label: 'Architectural Design', body: 'We collaborate with award-winning architects to draft sustainable, state-of-the-art designs.' },
        { label: 'High-Precision Construction', body: 'We execute building works under strict quality engineering standards and premium finishes.' },
        { label: 'Value Delivery', body: 'We deliver luxury spaces with built-in amenities, optimized utility systems, and immediate high-appreciation potential.' },
      ]
    },
    landsales: {
      title: 'Secure Land Sales & Allocation',
      shortTitle: 'Land Sales',
      desc: 'We offer prime land in carefully selected locations with verified titles, providing secure opportunities for ownership and growth.',
      icon: Map,
      steps: [
        { label: 'Location Curation', body: 'We scout and secure high-growth zones with guaranteed infrastructure readiness.' },
        { label: 'Title Verification Check', body: 'Every parcel is pre-vetted with local registries to guarantee zero legal disputes.' },
        { label: 'Flexible Plot Sizes', body: 'We offer premium residential plots, commercial acres, or bulk land portfolios.' },
        { label: 'Allocation Handover', body: 'We provide immediate physical mapping and official documentation signing for absolute peace of mind.' },
      ]
    },
    propertysales: {
      title: 'Residential & Commercial Property Sales',
      shortTitle: 'Property Sales',
      desc: 'We specialize in selling both residential and commercial properties, ensuring clients secure well-designed, valuable spaces.',
      icon: BadgeDollarSign,
      steps: [
        { label: 'Bespoke Asset Catalog', body: 'We present a curated selection of modern family duplexes, luxury terraces, and corporate commercial centers.' },
        { label: 'Transparent Appraisals', body: 'We offer detailed specifications, construction reports, and price breakdowns.' },
        { label: 'Tailored Viewing Protocols', body: 'We arrange private physical walkthroughs or immersive virtual tours to experience the estate details.' },
        { label: 'Ownership Transition', body: 'We provide structured payment timelines and notary-backed transfer of title deeds.' },
      ]
    },
    landbanking: {
      title: 'Land Banking & Wealth Accumulation',
      shortTitle: 'Land Banking',
      desc: 'We help investors acquire strategically located land with strong appreciation potential, fostering long-term wealth.',
      icon: TrendingUp,
      steps: [
        { label: 'Macro Growth Mapping', body: 'We identify fringe urban zones that are positioned for massive infrastructure expansion.' },
        { label: 'Pre-Construction Acquisition', body: 'We secure hectares at ground-floor pricing before surrounding developments launch.' },
        { label: 'Appreciation Gestation', body: 'We hold the assets as they appreciate exponentially while the surrounding corridor develops.' },
        { label: 'Structured Asset Exit', body: 'We help you divest plots or develop the banked land for astronomical multi-fold returns.' },
      ]
    },
    advisory: {
      title: 'Real Estate Investment Advisory',
      shortTitle: 'Investment Advisory',
      desc: 'We provide expert guidance on real estate investments, tailored to your goals, so you can make informed, profitable decisions.',
      icon: LineChart,
      steps: [
        { label: 'Financial Objective Audit', body: 'We analyse your capital allocation goals, risk profiles, and yield timelines.' },
        { label: 'Predictive Analytics', body: 'We review data-driven forecasts, ROI calculations, and market demand indicators.' },
        { label: 'Tailored Portfolio Strategy', body: 'We construct a customized real estate acquisition roadmap suited to your wealth targets.' },
        { label: 'Active Performance Management', body: 'We conduct periodic reviews of asset yields, rental rates, and optimal exit timelines.' },
      ]
    },
    jv: {
      title: 'Joint Venture Development Partnerships',
      shortTitle: 'Joint Venture',
      desc: 'We partner with landowners, investors, and developers to unlock land value through mutually beneficial joint ventures.',
      icon: Handshake,
      steps: [
        { label: 'Asset & Equity Assessment', body: 'Landowner assets are evaluated alongside developer equity and technical competence.' },
        { label: 'JV Contract Configuration', body: 'We draft mutual shareholdings, profit-sharing ratios, and legal safeguards.' },
        { label: 'Execution & Management', body: 'Crovation handles full building planning, permits, construction, and marketing.' },
        { label: 'Revenue Distribution', body: 'We ensure seamless disbursement of returns or built-up properties to joint venture partners.' },
      ]
    },
    title: {
      title: 'Land Title Processing & Sponsorship',
      shortTitle: 'Land Title Processing',
      desc: 'We guide you through securing official land titles, offering financing and sponsorship arrangements so you can gain title security with flexible terms.',
      icon: FileCheck,
      steps: [
        { label: 'Documentation Audit', body: 'We collate survey plans, family receipts, and purchase records to verify file completeness.' },
        { label: 'Government Agency Liaison', body: 'We manage processing through Land Registries, Surveyor General, and Ministry of Lands.' },
        { label: 'Title Sponsorship Finance', body: 'We sponsor the heavy regulatory fees in exchange for agreed flexible payment terms or equity.' },
        { label: 'Secure Certificate Handover', body: 'We handle the delivery of Governor\'s Consent, C of O, or registered deeds to secure your ownership.' },
      ]
    },
    financing: {
      title: 'Real Estate Project Financing & Partnerships',
      shortTitle: 'Project Financing',
      desc: 'We provide tailored financing and strategic partnerships to bring real estate projects to life with the right support and collaboration.',
      icon: Coins,
      steps: [
        { label: 'Feasibility & Cost Audit', body: 'We perform detailed structural and financial auditing to verify project viability.' },
        { label: 'Financing Options Design', body: 'We structure equity funding, construction loans, or private equity partnerships.' },
        { label: 'Fund Management Control', body: 'We manage milestoned fund disbursement matching project execution stages to prevent cost overruns.' },
        { label: 'Partner Alignment & Exit', body: 'We deliver completed architectural projects while maximizing stakeholder payouts.' },
      ]
    }
  };

  const selectedProtocol = clientProtocols[activeTab as keyof typeof clientProtocols];

  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="services-view-page">
      {/* Page Title */}
      <div className="bg-[#000000] text-white py-16 md:py-20 relative overflow-hidden">
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
            
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {(Object.keys(clientProtocols) as Array<keyof typeof clientProtocols>).map((key) => {
                const item = clientProtocols[key];
                const IconComp = item.icon;
                const isSelected = activeTab === key;

                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer relative ${
                      isSelected
                        ? 'bg-secondary text-white border-transparent shadow-lg shadow-secondary/15'
                        : 'bg-white text-gray-400 hover:text-secondary border-black/[0.03] hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary text-secondary' : 'bg-slate-100 text-gray-500'
                    }`}>
                      <IconComp className="h-4.5 w-4.5" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className={`font-extrabold text-xs leading-none ${isSelected ? 'text-white' : 'text-secondary'}`}>
                        {item.shortTitle}
                      </h3>
                      <p className="text-[10px] text-gray-400 line-clamp-1">
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
            <div className="bg-[#000000] rounded-2xl p-6 text-white text-left space-y-4 border border-white/5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-white/5">
                <Landmark className="h-28 w-28 translate-y-6 translate-x-3 pointer-events-none" />
              </div>
              <h4 className="font-bold text-sm text-primary">Need a custom strategy?</h4>
              <p className="text-[11px] text-gray-400 leading-normal leading-relaxed">
                Connect for private consultation on legacy asset distributions or joint-venture sponsorship agreements. We operate with standard confidentiality.
              </p>
              <button
                onClick={() => onOpenInquiry(`Custom Advisory Service Request - (${activeTab.toUpperCase()})`)}
                className="w-full bg-primary hover:bg-white text-secondary font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl duration-300 transition-colors cursor-pointer"
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
                {(activeTab === 'propertysales' || activeTab === 'advisory') && (
                  <button
                    onClick={() => {
                      const targetRoute = activeTab === 'propertysales' ? 'services/sales' : 'services/advisory';
                      onNavigateToFullPage(targetRoute);
                    }}
                    className="border border-secondary hover:bg-slate-100 text-secondary px-4 py-3 rounded-xl font-extrabold text-[10px] uppercase tracking-wider duration-300 transition-colors cursor-pointer"
                  >
                    Learn Protocol Details
                  </button>
                )}
                <button
                  onClick={() => onOpenInquiry(`Initiation request for: ${selectedProtocol.title}`)}
                  className="bg-secondary hover:bg-primary text-white hover:text-secondary px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider duration-300 transition-colors cursor-pointer"
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
