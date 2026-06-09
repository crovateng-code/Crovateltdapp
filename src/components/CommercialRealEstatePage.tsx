import React, { useState } from 'react';
import { Building2, ArrowLeft, ShieldCheck, Zap, Laptop, Sparkles, Send } from 'lucide-react';

interface CommercialRealEstatePageProps {
  onBack: () => void;
  onOpenInquiry: (subject?: string) => void;
}

export default function CommercialRealEstatePage({ onBack, onOpenInquiry }: CommercialRealEstatePageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commercialType: 'Premium Corporate Offices',
    sizeRequirement: 'Medium (500 - 1500 sqm)',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const sizes = [
    'Bespoke Workspace (< 500 sqm)',
    'Medium Corporate Space (500 - 1,500 sqm)',
    'Enterprise Headquarter Space (1,500 - 5,000 sqm)',
    'Industrial Landmark/Tech Center (> 5,000 sqm)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newInquiry = {
      id: `lead-commercial-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Commercial Class: ${formData.commercialType}. Scale: ${formData.sizeRequirement}. Message: ${formData.message}`,
      propertyName: `Service Liaison: Commercial Real Estate (Type: ${formData.commercialType})`,
      createdAt: new Date().toISOString()
    };

    try {
      const savedInquiries = localStorage.getItem('crovation_local_inquiries');
      const currentList = savedInquiries ? JSON.parse(savedInquiries) : [];
      currentList.unshift(newInquiry);
      localStorage.setItem('crovation_local_inquiries', JSON.stringify(currentList));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('LocalStorage commercial lead backup failed:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        commercialType: 'Premium Corporate Offices',
        sizeRequirement: 'Medium (500 - 1500 sqm)',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="commercial-real-estate-page">
      {/* Upper navigation header */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-6 pb-2">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
          id="btn-back-from-commercial"
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
            <Building2 className="h-7 w-7" />
          </div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase block">
            High-Throughput Business Hubs
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Commercial Real Estate
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
            Premium strategic offices, tech landmarks, and retail real estates configured for high business throughput.
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
                High-Performance Corporate Assets
              </h2>
              <div className="h-0.5 w-12 bg-primary rounded-full animate-pulse" />
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                Corporate physical operations require reliable power, fast digital networks, and layout configuration flexibility. Our commercial spaces combine structural perfection with custom power backup redundancy layers and optimized zoning coordinates.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                Our commercial real estate division arranges long-term inflationary-indexed leasing structures and direct acquisitions of corporate towers, executive workspaces, and prime business parks in Lagos.
              </p>
            </div>

            {/* Strategic Value Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-black/[0.03] space-y-2">
                <div className="p-2 w-max rounded-lg bg-teal-50 text-teal-600">
                  <Zap className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-secondary">Power & Utility Redundancy</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Guaranteed 24/7 power layouts with backup grid networks and green energy configurations.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-black/[0.03] space-y-2">
                <div className="p-2 w-max rounded-lg bg-indigo-50 text-indigo-600">
                  <Laptop className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-secondary">High-Density Connectivity</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Fiber optic arrays pre-configured to handle intensive server bandwidth, corporate VPN, and live broadcasting pipelines.
                </p>
              </div>
            </div>

            {/* Step execution timeline */}
            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm sm:text-base text-secondary uppercase tracking-wider">
                Our Commercial Delivery Phases
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Tech & Spatial Parameter Alignment', text: 'We map floor load metrics, backup generator grids, and fiber layouts matching your exact enterprise requirements.' },
                  { title: 'LEED Clean Compliance Audit', text: 'Evaluating thermal envelope structures and wastewater recycling setups to secure green operational metrics.' },
                  { title: 'Corporate Lease & Contract Advisory', text: 'Direct drafting of multi-year inflation-indexed lease agreements providing secure corporate terms.' }
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
          <div className="lg:col-span-4" id="commercial-form-container">
            <div className="bg-white rounded-3xl border border-black/[0.04] p-6 md:p-8 space-y-6 shadow-xl sticky top-28">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Commercial Desk Liaison
                </span>
                <h3 className="text-lg font-bold text-secondary">
                  Acquire Commercial Space
                </h3>
                <p className="text-[11px] text-gray-400 font-sans leading-normal">
                  Send details of your corporate space or retail land demands. Our lead partners will contact you to draft options.
                </p>
              </div>

              {success ? (
                <div className="p-6 bg-emerald-50 rounded-2xl text-emerald-800 border border-emerald-100 text-center space-y-3 animate-fade-in">
                  <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                    ✓
                  </div>
                  <h4 className="font-bold text-xs">Demands Received</h4>
                  <p className="text-[11px] text-emerald-600 font-sans leading-relaxed">
                    Splendid! Your commercial real estate workspace request has been logged successfully. A Senior Broker from our specialized commercial division will review the specifications and follow up within one business day.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-[11px] text-emerald-800 underline block mx-auto font-mono hover:text-emerald-950"
                  >
                    Submit High-Scale Workspace
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Corporate Representative Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Engr. Babajide Olatunji"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Corporate Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. b.olatunji@olatunjidevelopments.com"
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
                      placeholder="e.g. +234 80 8872 7277"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Asset Category</label>
                      <select
                        value={formData.commercialType}
                        onChange={(e) => setFormData({ ...formData, commercialType: e.target.value })}
                        className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                      >
                        <option value="Premium Corporate Offices">Corporate Offices</option>
                        <option value="Tech Landmarks / Data Hub">Tech Landmark / Hub</option>
                        <option value="High-Yield Retail Front">Luxury Retail Front</option>
                        <option value="Commercial Warehousing">High-Throughput Facility</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Floor Area Demand</label>
                      <select
                        value={formData.sizeRequirement}
                        onChange={(e) => setFormData({ ...formData, sizeRequirement: e.target.value })}
                        className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50"
                      >
                        {sizes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Layout Details / Special Demands</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. redundancy limits, transport corridor demands, corporate branding flexibility"
                      className="w-full text-xs p-3.5 rounded-xl border border-black/[0.08] focus:outline-none focus:border-primary bg-slate-50/50 resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary hover:bg-primary text-white hover:text-secondary font-extrabold uppercase tracking-wider text-[10px] py-4 rounded-xl flex items-center justify-center gap-2 duration-300 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Specifications...</span>
                    ) : (
                      <>
                        <span>Submit Corporate Request</span>
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
