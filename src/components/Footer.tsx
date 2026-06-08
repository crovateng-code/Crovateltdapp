import React from 'react';
import { Landmark, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenInquiry: (subject?: string) => void;
  onChangePage: (page: 'home' | 'properties' | 'about' | 'services' | 'contact') => void;
}

export default function Footer({ onOpenInquiry, onChangePage }: FooterProps) {
  
  const handleNavigate = (page: 'home' | 'properties' | 'about' | 'services' | 'contact') => {
    onChangePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#00090a] text-white pt-20 pb-12 border-t border-white/5 relative" id="contact-footer">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Top footer section: details columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-16">
          
          {/* Company Brief Column (Col span 5/12) */}
          <div className="md:col-span-4 space-y-6 text-left">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white cursor-pointer hover:opacity-90 text-left"
            >
              <div className="p-1.5 rounded-lg bg-primary text-secondary flex items-center justify-center">
                <Landmark className="h-5 w-5" />
              </div>
              <span className="font-semibold text-white">
                Crovation <span className="font-light text-primary">Limited</span>
              </span>
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
                  onClick={() => handleNavigate('services')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Property Sales
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('services')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Property Management
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('services')}
                  className="hover:text-primary transition-colors cursor-pointer text-left font-sans"
                >
                  Investment Advisory
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
                  <a href="mailto:concierge@crovation.com" className="hover:text-primary transition-colors font-mono">
                    concierge@crovation.com
                  </a>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Bespoke Relations</span>
                  <a href="tel:+18005552768" className="hover:text-primary transition-colors font-mono font-medium">
                    +1 (800) 555-CROV
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-sans">Flagship Residence</span>
                  <span className="leading-relaxed">
                    Suite 850, Olympic Tower, Fifth Avenue, Midtown Manhattan, NY
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
            <a href="#" className="text-[11px] text-gray-500 hover:text-white transition-colors font-sans">Confidentiality Agreement</a>
            <a href="#" className="text-[11px] text-gray-500 hover:text-white transition-colors font-sans">Privacy Policy</a>
            
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
    </footer>
  );
}
