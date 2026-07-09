import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, Facebook, Instagram, Linkedin, MessageCircle, Calendar, Send, Sparkles } from 'lucide-react';

interface ContactPageProps {
  onOpenInquiry: (subject?: string) => void;
  onAddInquiry?: (inquiry: any) => void;
}

export default function ContactPage({ onOpenInquiry, onAddInquiry }: ContactPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tier: 'General Advisory',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Interactive calendar simulation slot
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const availableSlots = [
    'Tomorrow, 09:00 AM EST',
    'Tomorrow, 02:30 PM EST',
    'Wednesday, 11:00 AM EST',
    'Wednesday, 04:00 PM EST',
    'Thursday, 10:00 AM EST'
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newInquiry = {
      id: `lead-contact-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      message: `Desired Tier: ${formData.tier}. ${selectedSlot ? `Instant Call Slot requested: ${selectedSlot}. ` : ''}Client message: ${formData.message}`,
      propertyName: `Liaison: ${formData.tier}`,
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
        console.warn('LocalStorage contact lead backup failed:', err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        tier: 'General Advisory',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="contact-view-page">
      {/* Page header */}
      <div className="bg-[#000000] text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-x-0 h-[250px] top-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10 text-left space-y-3">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block animate-pulse">
            Bespoke Liaison
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Connect With Crovation Limited
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-xl">
            Our luxury advisory team operates with strict client confidentiality. Connect directly for immediate representation or listing partnerships.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Contact particulars and location cards (Col span 5/12) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2">
                Office Flagships
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-secondary">
                Our Global Residences
              </h2>
              <div className="h-0.5 w-12 bg-primary rounded-full mt-2" />
            </div>

            {/* Location Cards */}
            <div className="space-y-4">
              {/* HQ */}
              <div className="bg-white rounded-2xl border border-black/[0.03] p-5 flex items-start gap-4 hover:shadow-md duration-300 transition-shadow">
                <div className="p-3 rounded-xl bg-slate-50 text-secondary border border-black/[0.02]">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-secondary">Crovation Headquarters (HQ)</h4>
                  <p className="text-[11px] text-gray-400 leading-normal mt-1 leading-relaxed font-sans">
                    No 4 Lanre Awolokun Street, Gbagada Phase 2
                  </p>
                  <a href="tel:08088727277" className="text-[10px] text-primary hover:underline font-mono font-medium block mt-1">
                    08088727277
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-black/[0.02] space-y-4">
              <h4 className="font-extrabold text-sm text-secondary">Real-Time Channels</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="mailto:Support@crovationlimited.com" className="p-4 rounded-xl bg-white border border-black/[0.02] hover:border-primary duration-300 transition-all flex flex-col items-start gap-1">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Liaison</span>
                  <span className="text-[11px] font-mono text-secondary truncate w-full font-medium">Support@crovationlimited.com</span>
                </a>

                <a href="tel:08088727277" className="p-4 rounded-xl bg-white border border-black/[0.02] hover:border-primary duration-300 transition-all flex flex-col items-start gap-1">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Telephone</span>
                  <span className="text-[11px] font-mono text-secondary truncate w-full font-medium">08088727277</span>
                </a>
              </div>

              <div className="flex items-center gap-3 justify-center pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Join Channels:</span>
                <a href="https://facebook.com" className="text-gray-400 hover:text-primary transition-colors"><Facebook className="h-4 w-4" /></a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-primary transition-colors"><Instagram className="h-4 w-4" /></a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-primary transition-colors"><Linkedin className="h-4 w-4" /></a>
                <a href="https://wa.me" className="text-gray-400 hover:text-primary transition-colors"><MessageCircle className="h-4 w-4" /></a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact message form and scheduling slots (Col span 7/12) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-black/[0.03] p-6 md:p-8 shadow-sm space-y-8" id="contact-forms-container">
            <div>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">
                Liaison Portal
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold text-secondary text-left">
                Confidential Inquiry Form
              </h3>
              <p className="text-xs text-gray-400 mt-1 text-left leading-normal">
                Complete our priority liaison docket below. A client relations director will be assigned immediately.
              </p>
            </div>

            {success ? (
              <div className="p-8 text-center flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-black/[0.02]">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 animate-bounce">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-lg text-secondary">
                  Diligence Request Received
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mt-2">
                  Thank you for connecting with us. Your docket has been assigned to a Senior Managing Partner. Expect a secure telephone update within 30 minutes.
                </p>
                {selectedSlot && (
                  <div className="mt-4 p-3.5 bg-secondary text-white rounded-xl text-xs font-medium inline-block animate-pulse">
                    Appointment scheduled: <strong className="text-primary">{selectedSlot}</strong>
                  </div>
                )}
                <button
                  onClick={() => { setSuccess(false); setSelectedSlot(null); }}
                  className="mt-6 bg-secondary text-white hover:bg-primary hover:text-secondary px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider duration-300 transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Richard"
                      className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3 text-xs text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    />
                  </div>

                  {/* Last name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Hendricks"
                      className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3 text-xs text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. richard@hooli.xyz"
                      className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3 text-xs text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    />
                  </div>

                  {/* phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Direct Telephone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +1 (310) 555-0100"
                      className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3 text-xs text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    />
                  </div>
                </div>

                {/* Level of Service dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Desired Tier of Representation
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full rounded-xl border border-gray-100 bg-slate-50 px-3.5 py-3 text-xs text-secondary focus:outline-none focus:border-primary transition-all cursor-pointer font-sans"
                  >
                    <option value="General Advisory">General Modern Residence Search</option>
                    <option value="Private Portfolios">Ultra-HNW Legacy Listing ($10M+)</option>
                    <option value="Land Commercial">Commercial / Tech Business Park Leasing</option>
                    <option value="Co-Investment">Sole Developer Pre-Phase Advisory</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Special Directives / Portfolio Guidelines
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide coordinate regions, budget scopes, desired tax frameworks, or parameters of listings to review..."
                    className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3 text-xs text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-sans"
                  />
                </div>

                {/* Private Calendar Appointment Booking Blocks (Optional) */}
                <div className="pt-4 border-t border-black/[0.03] space-y-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Select An Instant Call Slot (Optional)</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Secure an immediate high-bandwidth phone slot with Elizabeth Crovath during regular market sessions.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(isSelected ? null : slot)}
                          className={`px-3 py-2 rounded-lg text-[10px] font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-secondary shadow-md scale-98'
                              : 'bg-slate-50 border border-black/[0.01] text-gray-500 hover:text-secondary hover:bg-slate-100'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary hover:bg-primary hover:text-secondary text-white font-extrabold text-[10px] uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 duration-300 transition-all select-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Validating Liaison Credentials...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        File Confidential Liaison Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
