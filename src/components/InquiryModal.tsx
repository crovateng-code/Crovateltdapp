import React, { useState } from 'react';
import { X, CheckCircle, Mail, Phone, Calendar, Send, Landmark } from 'lucide-react';
import { submitSupabaseInquiry, isSupabaseConfigured } from '../lib/supabase.ts';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export default function InquiryModal({ isOpen, onClose, defaultSubject = '' }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: defaultSubject || 'Private Property Inquiry',
    date: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (defaultSubject) {
      setFormData(prev => ({ ...prev, subject: defaultSubject }));
    }
  }, [defaultSubject]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isSupabaseConfigured) {
      try {
        await submitSupabaseInquiry({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Preferred Viewing Date: ${formData.date || 'Anytime'}. Client Comments: ${formData.message}`,
          propertyName: formData.subject,
        });
      } catch (err) {
        console.error('Supabase submission failed:', err);
      }
    }

    // Simulate luxury API call with high fidelity delays for the client transition
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };


  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: defaultSubject || 'Private Property Inquiry',
      date: '',
      message: '',
    });
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="inquiry-modal-overlay">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-secondary/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Content Card */}
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-black/5 shadow-2xl transition-all animate-in zoom-in-95 duration-200"
        id="inquiry-modal-content"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-secondary transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <h3 className="text-2xl font-bold text-secondary tracking-tight mb-2">
              Concierge Notified
            </h3>
            
            <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
              We have received your private inquiry. A dedicated Luxury Portfolio Executive from **Crovation Limited** will reach out to you within the hour.
            </p>

            <button
              onClick={handleReset}
              className="bg-secondary text-white font-semibold text-xs py-3.5 px-8 rounded-xl hover:bg-primary hover:text-secondary transition-colors uppercase tracking-wider"
            >
              Back to Browse
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-secondary text-primary p-1.5 rounded-lg">
                <Landmark className="h-4.5 w-4.5" />
              </div>
              <span className="font-semibold text-xs uppercase tracking-widest text-primary">
                Crovation Private Client Room
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-secondary mb-1">
              Bespoke Advisory Inquiry
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Connect directly with our real estate specialists for curated options or premier sales support.
            </p>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200/80 bg-slate-50/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email / Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200/80 bg-slate-50/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                      placeholder="e.g. name@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Contact
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200/80 bg-slate-50/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                      placeholder="e.g. +1 (555) 012-3456"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subject / Property Interest
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-gray-200/80 bg-slate-50/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                  placeholder="e.g. Purchasing Villa Obsidian"
                />
              </div>

              {/* Preferred Private Viewing Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Preferred Schedule Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-gray-200/80 bg-slate-50/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans text-gray-600"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Special Guidelines & Inquiries
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-gray-200/80 bg-slate-50/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                  placeholder="Tell us about your portfolio space needs, desired amenities, or preferred legal configurations..."
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-primary hover:text-secondary text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Authenticating Details...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Private Request
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-gray-400 text-center mt-2">
                By submitting, you agree to our strictly confidential luxury brokerage compliance guidelines.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
