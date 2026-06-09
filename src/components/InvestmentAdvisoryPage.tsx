import React, { useState } from 'react';
import { LineChart, ArrowLeft, TrendingUp, BarChart3, HelpCircle, Sparkles, Send } from 'lucide-react';

interface InvestmentAdvisoryPageProps {
  onBack: () => void;
  onOpenInquiry: (subject?: string) => void;
}

export default function InvestmentAdvisoryPage({ onBack, onOpenInquiry }: InvestmentAdvisoryPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investmentStrategy: 'Off-Market Pre-Launch Yield',
    riskProfile: 'Balanced Growth',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const strategyOptions = [
    'Off-Market Pre-Launch Yield',
    'Commercial Grade Real Estate',
    'Strategic Land Banking Assets',
    'Joint-Venture Custom Duplex Blocks'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newInquiry = {
      id: `lead-advisory-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Preferred Strategy: ${formData.investmentStrategy}. Risk Parameter: ${formData.riskProfile}. Message: ${formData.message}`,
      propertyName: `Service Liaison: Investment Advisory (Strategy: ${formData.investmentStrategy})`,
      createdAt: new Date().toISOString()
    };

    try {
      const savedInquiries = localStorage.getItem('crovation_local_inquiries');
      const currentList = savedInquiries ? JSON.parse(savedInquiries) : [];
      currentList.unshift(newInquiry);
      localStorage.setItem('crovation_local_inquiries', JSON.stringify(currentList));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('LocalStorage advisory lead backup failed:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        investmentStrategy: 'Off-Market Pre-Launch Yield',
        riskProfile: 'Balanced Growth',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="investment-advisory-page">
      {/* Upper navigation header */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-6 pb-2">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
          id="btn-back-from-advisory"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 duration-200 transition-transform" />
          <span>Back to All Services</span>
        </button>
      </div>

      {/* Hero section */}
      <div className="bg-[#00090a] text-white py-16 md:py-20 relative overflow-hidden mt-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10 text-left space-y-3">
          <div className="p-3 mb-2 bg-white/5 rounded-2xl inline-flex text-primary">
            <LineChart className="h-7 w-7" />
          </div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">
            Macro-Economic Real Estate Intelligence
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Investment Advisory
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
            Data-driven market intelligence identifying high-yield developer phases and long-term land appreciations.
          </p>
        </div>
      </div>

      {/* Page Content Grid */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Detailed Description Column (Col Span 7) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-secondary tracking-tight">
                Sovereign Investment Allocations
              </h2>
              <div className="h-0.5 w-12 bg-primary rounded-full animate-pulse" />
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                Real estate represents the most secure shield against inflationary cycles, provided acquisitions are backed by meticulous data models and verified growth variables.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                Our strategic advisory partners offer high-net-worth individuals and corporate funds direct priority pathways into multi-acre site coordinates, phase-0 pricing margins before structural construction begins, and secure holdings configurations.
              </p>
            </div>

            {/* Strategic Value Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-black/[0.03] space-y-2">
                <div className="p-2 w-max rounded-lg bg-teal-50 text-teal-600">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-secondary">Pre-Launch Sourcing</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Acquiring premium parcels and buildings during foundation phase, locking in up to 30%-40% paper appreciation during development cycles.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-black/[0.03] space-y-2">
                <div className="p-2 w-max rounded-lg bg-indigo-50 text-indigo-600">
                  <BarChart3 className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-secondary">Zoning Intelligence</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Deep analysis of public infrastructures, business corridor extensions, and estate boundaries to identify stable future values.
                </p>
              </div>
            </div>

            {/* Step execution timeline */}
            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm sm:text-base text-secondary uppercase tracking-wider">
                Our Advisory Methodology
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Goal Setting & Allocation Criteria', text: 'We map your target cash flow, tax-shield parameters, and multi-generational wealth preservation targets.' },
                  { title: 'Confidential Site Curation', text: 'Reviewing off-market land holdings or high-end multi-family parcels currently undergoing legal and spatial clearing.' },
                  { title: 'Tax & Entity Optimization', text: 'We coordinate with your financial advisors to establish secure corporate structures (LLCs/Trusts) suited for regional asset laws.' }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-black/[0.02]">
                    <span className="font-mono text-xs font-bold text-primary bg-secondary text-white px-2 py-0.5 rounded-md">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h5 className="font-bold text-xs sm:text-sm text-secondary leading-tight">{step.title}</h5>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column (Col Span 5) */}
          <div className="lg:col-span-1" />
          <div className="lg:col-span-4" id="advisory-form-container">
            <div className="bg-white rounded-3xl border border-black/[0.04] p-6 md:p-8 space-y-6 shadow-xl sticky top-28">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Private Intelligence Desk
                </span>
                <h3 className="text-lg font-bold text-secondary">
                  Request Consultation
                </h3>
                <p className="text-[11px] text-gray-400 font-sans leading-normal">
                  Connect privately with our principal real estate advisory associates. Complete the form to establish representational parameters.
                </p>
              </div>

              {success ? (
                <div className="p-6 bg-emerald-50 rounded-2xl text-emerald-800 border border-emerald-100 text-center space-y-3 animate-fade-in">
                  <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                    ✓
                  </div>
                  <h4 className="font-bold text-xs">Advisory Partner Allocated</h4>
                  <p className="text-[11px] text-emerald-600 font-sans leading-relaxed">
                    Splendid! Your investment advisory request has been dispatched directly to the main executive office system. A Principal Partner from our team will personally check your details and schedule an NDA briefing.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-[11px] text-emerald-800 underline block mx-auto font-mono hover:text-emerald-950"
                  >
                    Submit New Advisory Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Chief Olumide Adebayo"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. olumide@adebayoholdings.com"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +234 80 5555 1111"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Advisory Focus</label>
                      <select
                        value={formData.investmentStrategy}
                        onChange={(e) => setFormData({ ...formData, investmentStrategy: e.target.value })}
                        className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                      >
                        {strategyOptions.map((strat) => (
                          <option key={strat} value={strat}>{strat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Risk Parameter</label>
                      <select
                        value={formData.riskProfile}
                        onChange={(e) => setFormData({ ...formData, riskProfile: e.target.value })}
                        className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                      >
                        <option value="Conservative Shield">Conservative Shield</option>
                        <option value="Balanced Growth">Balanced Growth</option>
                        <option value="Aggressive High-Yield">Aggressive High-Yield</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Acreage / Specific Requirements</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Gbagada Phase 2 land appreciation potential, commercial zoning targets, budget range details"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50 resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary hover:bg-primary text-white hover:text-secondary font-extrabold uppercase tracking-wider text-[10px] py-4 rounded-xl flex items-center justify-center gap-2 duration-300 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Formulating Brief...</span>
                    ) : (
                      <>
                        <span>Submit Advisory Request</span>
                        <Send className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
