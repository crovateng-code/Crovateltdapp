import React, { useState } from 'react';
import { KeyRound, ArrowLeft, Shield, CheckCircle, PenTool, Sparkles, Send } from 'lucide-react';

interface PropertyManagementPageProps {
  onBack: () => void;
  onOpenInquiry: (subject?: string) => void;
  onAddInquiry?: (inquiry: any) => void;
}

export default function PropertyManagementPage({ onBack, onOpenInquiry, onAddInquiry }: PropertyManagementPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: 'Residential Duplex',
    numberOfUnits: '1 Unit',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const unitsOptions = [
    '1 Unit',
    '2 - 5 Units',
    '6 - 15 Units',
    '16+ Multi-Tenant Complex'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newInquiry = {
      id: `lead-mgmt-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Property Type: ${formData.propertyType}. Units: ${formData.numberOfUnits}. Message: ${formData.message}`,
      propertyName: `Service Liaison: Property Management (Type: ${formData.propertyType}, Units: ${formData.numberOfUnits})`,
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
        console.warn('LocalStorage management lead backup failed:', err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: 'Residential Duplex',
        numberOfUnits: '1 Unit',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="property-management-page">
      {/* Upper navigation header */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-6 pb-2">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
          id="btn-back-from-management"
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
            <KeyRound className="h-7 w-7" />
          </div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">
            End-To-End Luxury Operations
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Property Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
            Complete hands-off peace of mind including maintenance oversight, leasing operations, and luxury upkeep.
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
                Hands-Off Asset Preservation
              </h2>
              <div className="h-0.5 w-12 bg-primary rounded-full animate-pulse" />
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                Our property management division guarantees that your prime physical holdings are protected, and optimized for maximum yield. We handle every step of active operations, from screening executive renters to executing routine structural surveys.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                By appointing Crovation, estate owners, family offices, and diaspora trustees guarantee absolute peace of mind. We maintain structural finishing parameters to international metrics and keep records perfectly organized on your behalf.
              </p>
            </div>

            {/* Strategic Value Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-black/[0.03] space-y-2">
                <div className="p-2 w-max rounded-lg bg-teal-50 text-teal-600">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-secondary">Asset Preservation</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Preventative multi-tier maintenance routines for high-end cooling systems, automation hubs, and infinity structural elements.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-black/[0.03] space-y-2">
                <div className="p-2 w-max rounded-lg bg-indigo-50 text-indigo-600">
                  <PenTool className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-secondary">Optimal Financial Renting</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Rigorous renter screening protocols, leasing administration, and instant quarterly yields settlement.
                </p>
              </div>
            </div>

            {/* Step execution timeline */}
            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm sm:text-base text-secondary uppercase tracking-wider">
                Exemplary Upkeep Protocols
              </h3>
              <div className="space-y-3">
                {[
                  { title: '24/7 Dedicated Estate Partner Allocation', text: 'A single, central manager serves as your absolute communication focal point for all tenant or maintenance matters.' },
                  { title: 'Bespoke Consolidated Ledger Reporting', text: 'Keep tracking utility settlements, service invoices, and lease cycles in one transparent document.' },
                  { title: 'Rigorous Bi-Annual Structural Audits', text: 'Thorough, preventative checks for electrical performance, plumbing systems, and structural finishes.' }
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
          <div className="lg:col-span-4" id="management-form-container">
            <div className="bg-white rounded-3xl border border-black/[0.04] p-6 md:p-8 space-y-6 shadow-xl sticky top-28">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Management Desk Liaison
                </span>
                <h3 className="text-lg font-bold text-secondary">
                  Appoint Crovation
                </h3>
                <p className="text-[11px] text-gray-400 font-sans leading-normal">
                  Provide property details for custom operational oversight and management proposals.
                </p>
              </div>

              {success ? (
                <div className="p-6 bg-emerald-50 rounded-2xl text-emerald-800 border border-emerald-100 text-center space-y-3 animate-fade-in">
                  <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                    ✓
                  </div>
                  <h4 className="font-bold text-xs">Oversight Proposal Confirmed</h4>
                  <p className="text-[11px] text-emerald-600 font-sans leading-relaxed">
                    Thank you! Your property management request has been registered in our central admin system. A Partner Representative will contact you shortly to formulate your hands-off concierge roadmap.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-[11px] text-emerald-800 underline block mx-auto font-mono hover:text-emerald-950"
                  >
                    Submit Another Estate
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
                      placeholder="e.g. Dr. Amara Nwosu"
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
                      placeholder="e.g. amara@gmail.com"
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
                      placeholder="e.g. +234 81 2345 6789"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Type Of Property</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                      >
                        <option value="Residential Duplex">Bespoke Duplex</option>
                        <option value="Apartment Block">Apartment Block</option>
                        <option value="Commercial Space">Commercial Offices</option>
                        <option value="Mixed Estate Portfolio">Mixed Portfolio</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Portfolio Scale</label>
                      <select
                        value={formData.numberOfUnits}
                        onChange={(e) => setFormData({ ...formData, numberOfUnits: e.target.value })}
                        className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                      >
                        {unitsOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Notes & Demands</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. maintenance oversight frequency, leasing target requirements, security standards required"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50 resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary hover:bg-primary text-white hover:text-secondary font-extrabold uppercase tracking-wider text-[10px] py-4 rounded-xl flex items-center justify-center gap-2 duration-300 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Mandate...</span>
                    ) : (
                      <>
                        <span>Appoint Crovation</span>
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
