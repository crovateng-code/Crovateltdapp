import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle, ArrowUp } from 'lucide-react';
import CrovationLogo from './CrovationLogo';

interface FooterProps {
  onOpenInquiry: (subject?: string) => void;
  onChangePage: (page: 'home' | 'properties' | 'about' | 'services' | 'contact' | 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial') => void;
  onAdminAccess?: () => void;
}

export default function Footer({ onOpenInquiry, onChangePage, onAdminAccess }: FooterProps) {
  
  const [emailInput, setEmailInput] = React.useState('');
  const [showThankYou, setShowThankYou] = React.useState(false);

  const handleNavigate = (page: 'home' | 'properties' | 'about' | 'services' | 'contact' | 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial') => {
    onChangePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const savedSubs = localStorage.getItem('crovation_local_subs');
    let subsArray = [];
    if (savedSubs) {
      try {
        subsArray = JSON.parse(savedSubs);
      } catch (err) {
        console.error(err);
      }
    }
    
    const newSub = {
      id: `sub-${Date.now()}`,
      email: emailInput.trim(),
      createdAt: new Date().toISOString()
    };
    
    subsArray.push(newSub);
    localStorage.setItem('crovation_local_subs', JSON.stringify(subsArray));

    setEmailInput('');
    setShowThankYou(true);
  };

  const handleCloseThankYou = () => {
    setShowThankYou(false);
    handleNavigate('contact');
  };

  return (
    <footer className="bg-[#00090a] text-white pt-20 pb-12 border-t border-white/5 relative" id="contact-footer">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Join our Newsletter Section */}
        <div className="border-b border-white/5 pb-12 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block font-mono">Join our Newsletter</span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Stay Updated on Prime Assets</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-lg">
              Subscribe to receive exclusive off-market listings, direct developer releases, and high-yield real estate insights in real-time.
            </p>
          </div>
          
          <div className="lg:col-span-6">
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your professional or private email address"
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-sans"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-white text-secondary hover:text-black font-extrabold uppercase tracking-widest text-[10.5px] px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Subscribe Protocol</span>
              </button>
            </form>
          </div>
        </div>

        {/* Top footer section: details columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-16">
          
          {/* Company Brief Column (Col span 5/12) */}
          <div className="md:col-span-4 space-y-6 text-left">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center text-white cursor-pointer hover:opacity-90 text-left focus:outline-none"
            >
              <CrovationLogo isDarkTheme={true} height={42} />
            </button>
            
            <p className="text-xs text-gray-400 leading-relaxed font-sans pr-4">
              Crovation Limited delivers premium real estate solutions with professionalism and integrity. Aligning buyers and institutional developers with high-value residential and core commercial hotspots.
            </p>

            {/* Social Links block */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://facebook.com"
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://wa.me" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Spacer Column */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Column 1: Company Links */}
          <div className="md:col-span-2 lg:col-span-2 space-y-5 text-left">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-400">
              <li>
                <button 
                  onClick={() => handleNavigate('home')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Home / Featured
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('properties')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Properties Collection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('about')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  About Lineage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('contact')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Contact Bureau
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Services Links */}
          <div className="md:col-span-3 lg:col-span-2 space-y-5 text-left">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Services
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-400">
              <li>
                <button 
                  onClick={() => handleNavigate('services/sales')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Property Sales
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('services/management')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Property Management
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('services/advisory')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Investment Advisory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('services/commercial')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Commercial Real Estate
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="md:col-span-3 lg:col-span-3 space-y-5 text-left">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Contact
            </h4>
             <ul className="space-y-4 text-xs text-gray-400 font-sans">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Private Client Desk</span>
                  <a href="mailto:Support@crovationlimited.com" className="hover:text-primary transition-colors font-mono">
                    Support@crovationlimited.com
                  </a>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Bespoke Relations</span>
                  <a href="tel:08088727277" className="hover:text-primary transition-colors font-mono font-medium">
                    08088727277
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-sans">Flagship Residence</span>
                  <span className="leading-relaxed">
                    No 4 Lanre Awolokun Street, Gbagada Phase 2
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom border & Area (Copyright) */}
        <div className="border-t border-white/5 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright description */}
          <p className="text-[11px] text-gray-500 font-sans">
            © 2025 Crovation Limited. All rights reserved. Registered under luxury brokerage compliance rules.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] text-gray-500 hover:text-white transition-colors font-sans font-medium">Confidentiality Agreement</a>
            <a href="#" className="text-[11px] text-gray-500 hover:text-white transition-colors font-sans font-medium">Privacy Policy</a>
            
            {onAdminAccess && (
              <button 
                onClick={onAdminAccess}
                className="text-[11px] text-gray-500 hover:text-primary transition-colors font-sans font-semibold cursor-pointer border-b border-dashed border-gray-600 hover:border-primary pb-0.5"
                title="Admin Security Operations Console"
              >
                Executive Console
              </button>
            )}
            
            {/* Scroll back to Top Button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-primary hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {showThankYou && (
        <div className="fixed inset-0 z-50 bg-[#00090a]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#030d0f] border border-primary/20 rounded-3xl p-8 max-w-sm w-full text-center relative space-y-6 shadow-2xl animate-fade-in">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-extrabold tracking-widest text-white uppercase font-mono">
                Registry Secure
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Thank you for subscribing to our private portfolio updates. Yo have been successfully registered to the <strong>Email Subs</strong> database of Crovation Limited.
              </p>
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleCloseThankYou}
                className="w-full bg-primary text-secondary hover:bg-white hover:text-black font-extrabold uppercase tracking-widest text-[9.5px] py-3.5 rounded-xl transition duration-300 block cursor-pointer"
              >
                Proceed to Contact Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
