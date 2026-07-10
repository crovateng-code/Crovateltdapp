import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle, Sparkles } from 'lucide-react';

interface ContactPageProps {
  onOpenInquiry?: (subject?: string) => void;
  onAddInquiry?: (inquiry: any) => void;
}

export default function ContactPage({ onOpenInquiry, onAddInquiry }: ContactPageProps) {
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

          {/* RIGHT COLUMN: Customer Feedback Invitation (Col span 7/12) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-black/[0.03] p-6 md:p-10 shadow-sm flex flex-col justify-between space-y-8" id="contact-forms-container">
            <div className="space-y-4 text-left">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">
                Feedback Portal
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-secondary leading-tight">
                Your Feedback Shapes Our Future
              </h3>
              <div className="h-0.5 w-12 bg-primary rounded-full mt-2" />
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans pt-2">
                At Crovation Limited, we are committed to delivering unmatched real estate advisory and development services. We value your thoughts, experiences, and suggestions as we continue to elevate our standards.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                Please take a moment to share your valuable thoughts by completing our official Customer Feedback Form. Your insights directly influence our service quality, new development planning, and client experience suites.
              </p>
            </div>

            <div className="bg-slate-50 border border-black/[0.02] p-5 rounded-2xl space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-secondary uppercase tracking-wider">Crovation Quality Guarantee</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                    Feedback submission takes less than 3 minutes. All responses are securely processed to help us perfect our tailored client liaison programs.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 text-left">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdU0AgHGdUUbOneQnzX1VlBw9L850GaGsTKWnM8Whugt1Yhvw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-secondary hover:bg-primary hover:text-secondary text-white font-extrabold text-xs uppercase tracking-widest py-4.5 rounded-xl flex items-center justify-center gap-2.5 duration-300 transition-all shadow-md hover:shadow-lg cursor-pointer text-center"
              >
                <Sparkles className="h-4 w-4" />
                <span>Fill Customer Feedback Form</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
