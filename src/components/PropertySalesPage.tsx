import React, { useState } from 'react';
import { BadgeDollarSign, ArrowLeft, Shield, UserCheck, Calendar, Sparkles, Send } from 'lucide-react';

interface PropertySalesPageProps {
  onBack: () => void;
  onOpenInquiry: (subject?: string) => void;
  onAddInquiry?: (inquiry: any) => void;
}

export default function PropertySalesPage({ onBack, onOpenInquiry, onAddInquiry }: PropertySalesPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestType: 'Buying Elite Estate',
    preferredBudget: '₦250M - ₦500M',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const budgets = [
    '₦100M - ₦250M',
    '₦250M - ₦500M',
    '₦500M - ₦1B',
    '₦1B+ / High Estate'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newInquiry = {
      id: `lead-sales-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Interest: ${formData.interestType}. Preferred Budget Range: ${formData.preferredBudget}. Message: ${formData.message}`,
      propertyName: `Service Liaison: Property Sales (Budget: ${formData.preferredBudget})`,
      createdAt: new Date().toISOString()
    };

    if (onAddInquiry) {
      onAddInquiry(newInquiry);
    } else {
      try {
        const savedInquiries = localStorage.getItem('crovation_local_inquiries');
        const currentList = savedInquiries ? JSON.parse(savedInquiries) : [];
        currentList.unshift(newInquiry);
        localStorage.setItem('crovation_local_inquiries', JSON.stringify(currentList));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.warn('LocalStorage sales lead backup failed:', err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        interestType: 'Buying Elite Estate',
        preferredBudget: '₦250M - ₦500M',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="property-sales-page">
      {/* Upper navigation header */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-6 pb-2">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
          id="btn-back-from-sales"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 duration-200 transition-transform" />
          <span>Back to All Services</span>
        </button>
      </div>

      {/* Hero section */}
      <div className="bg-[#000000] text-white py-16 md:py-20 relative overflow-hidden mt-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10 text-left space-y-3">
          <div className="p-3 mb-2 bg-white/5 rounded-2xl inline-flex text-primary">
            <BadgeDollarSign className="h-7 w-7" />
          </div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">
            Elite Brokerage Protocol
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Property Sales & Brokerage
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
            Seamless transaction orchestration for buyers and sellers of premium multi-million dollar residential estates and upscale modern residences.
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
                Our Signature Sales Strategy
              </h2>
              <div className="h-0.5 w-12 bg-primary rounded-full animate-pulse" />
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                At Crovation Limited, property sales are not merely transactional exchanges; they are carefully engineered asset movements. We blend unmatched national and international buyer databases with custom visual layouts and complete pricing transparency.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                Our private portfolio handles premium land layout phases, newly laid structures, luxury off-grid duplex configurations across Gbagada, Lagos, and prominent national estates, guaranteeing absolute regulatory validation and deed clarity.
              </p>
            </div>

            {/* Strategic Value Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-black/[0.03] space-y-2">
                <div className="p-2 w-max rounded-lg bg-teal-50 text-teal-600">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-secondary">Absolute Confidentiality</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Pre-listing catalog directories accessible strictly to audited funds and verified high-net-worth buyers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-black/[0.03] space-y-2">
                <div className="p-2 w-max rounded-lg bg-indigo-50 text-indigo-600">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-secondary">Verified Screening</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Prioritizing serious investors and removing unsolicited noise to guarantee direct and fast handovers.
                </p>
              </div>
            </div>

            {/* Step execution timeline */}
            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm sm:text-base text-secondary uppercase tracking-wider">
                Exemplary Selling Phases
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Architectural Value Appraisal', text: 'We assess spatial parameters, light exposure, and premium finish metrics to guarantee optimized market placement.' },
                  { title: 'Curation of Premium Media', text: 'Visual rendering, cinema-grade video, and spatial scanning tailored for high-profile investors.' },
                  { title: 'Escrow Account Structuring', text: 'Secured transactional setups protected under standard notary systems.' }
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
          <div className="lg:col-span-4" id="sales-form-container">
            <div className="bg-white rounded-3xl border border-black/[0.04] p-6 md:p-8 space-y-6 shadow-xl sticky top-28">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Direct Desk Liaison
                </span>
                <h3 className="text-lg font-bold text-secondary">
                  Initiate Property Sale
                </h3>
                <p className="text-[11px] text-gray-400 font-sans leading-normal">
                  Fill in your acquisition details. Our executive team will reach out directly.
                </p>
              </div>

              {success ? (
                <div className="p-6 bg-emerald-50 rounded-2xl text-emerald-800 border border-emerald-100 text-center space-y-3 animate-fade-in">
                  <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                    ✓
                  </div>
                  <h4 className="font-bold text-xs">Submission Confirmed</h4>
                  <p className="text-[11px] text-emerald-600 font-sans leading-relaxed">
                    Greetings! Your Property Sales inquiry has been received with high priority. Our premium brokerage desk has saved your request in the Admin Portal and will coordinate a call soon.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-[11px] text-emerald-800 underline block mx-auto font-mono hover:text-emerald-950"
                  >
                    Send Another Proposal
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
                      placeholder="e.g. Babajide Alao"
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
                      placeholder="e.g. babajide@mail.com"
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
                      placeholder="e.g. +234 80 8872 2777"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">I Want To</label>
                      <select
                        value={formData.interestType}
                        onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                        className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                      >
                        <option value="Buying Elite Estate">Buy Estate</option>
                        <option value="Listing With Crovation">List/Sell Estate</option>
                        <option value="Off-Market Portfolios">Joint Venture</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Budget</label>
                      <select
                        value={formData.preferredBudget}
                        onChange={(e) => setFormData({ ...formData, preferredBudget: e.target.value })}
                        className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                      >
                        {budgets.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Message / Requirements</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail specific preferences (e.g. duplex in Gbagada Phase 2, land specs, structural finishes)"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50 resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary hover:bg-primary text-white hover:text-secondary font-extrabold uppercase tracking-wider text-[10px] py-4 rounded-xl flex items-center justify-center gap-2 duration-300 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Connection...</span>
                    ) : (
                      <>
                        <span>Submit Private Request</span>
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
