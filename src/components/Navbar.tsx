import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Home, Building2, Info, Compass, Phone, TrendingUp, Layers, MapPin, MessageCircle, Mail, ChevronDown } from 'lucide-react';
import CrovationLogo from './CrovationLogo';

interface NavbarProps {
  onOpenInquiry: (subject?: string) => void;
  activePage: 'home' | 'properties' | 'about' | 'services' | 'contact' | 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial';
  onChangePage: (page: 'home' | 'properties' | 'about' | 'services' | 'contact' | 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial') => void;
  loggedInAdmin?: any;
  onBackToAdmin?: (tab?: 'analytics' | 'listings' | 'locations' | 'leads' | 'subs') => void;
}

export default function Navbar({ onOpenInquiry, activePage, onChangePage, loggedInAdmin, onBackToAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: 'home' | 'properties' | 'about' | 'services' | 'contact' | 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial') => {
    setMobileMenuOpen(false);
    onChangePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLinkStyles = (page: 'home' | 'properties' | 'about' | 'services' | 'contact') => {
    const isActive = activePage === page || (page === 'services' && activePage.startsWith('services/'));
    if (isScrolled) {
      return isActive 
        ? 'text-primary bg-white/5 border border-white/10 px-4 py-1.5 rounded-full font-semibold shadow-inner' 
        : 'text-gray-300 hover:text-primary hover:bg-white/5 border border-transparent hover:border-white/5 px-4 py-1.5 rounded-full transition-all duration-300';
    } else {
      return isActive 
        ? 'text-secondary bg-slate-900/5 border border-slate-950/5 px-4 py-1.5 rounded-full font-bold shadow-sm' 
        : 'text-slate-600 hover:text-secondary hover:bg-slate-50 border border-transparent hover:border-slate-200/50 px-4 py-1.5 rounded-full transition-all duration-300';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 lg:px-8 transition-all duration-300">
      <div
        id="navbar-container"
        className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? 'border-white/10 bg-secondary/90 backdrop-blur-md shadow-2xl py-2.5 px-6 text-white'
            : 'border-slate-200/40 bg-white/80 backdrop-blur-md shadow-sm py-3 px-6 text-secondary'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center transition-transform active:scale-98 cursor-pointer focus:outline-none"
            id="nav-logo"
          >
            <CrovationLogo isDarkTheme={isScrolled} height={35} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 font-medium text-xs lg:text-sm">
            <button
              onClick={() => handleNavigate('home')}
              className={`cursor-pointer ${getLinkStyles('home')}`}
              id="link-home"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigate('properties')}
              className={`cursor-pointer ${getLinkStyles('properties')}`}
              id="link-properties"
            >
              Properties
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className={`cursor-pointer ${getLinkStyles('about')}`}
              id="link-about"
            >
              About
            </button>
            <button
              onClick={() => handleNavigate('services')}
              className={`cursor-pointer ${getLinkStyles('services')}`}
              id="link-services"
            >
              Services
            </button>
            <button
              onClick={() => handleNavigate('contact')}
              className={`cursor-pointer ${getLinkStyles('contact')}`}
              id="link-contact"
            >
              Contact
            </button>
          </nav>

          {/* Header Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/2348088727277?text=Hello%20Crovation%20Limited,%20I'd%20like%20to%20make%20a%20quick%20enquiry."
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer decoration-transparent ${
                isScrolled
                  ? 'bg-primary text-secondary hover:bg-[#00e1ff] hover:shadow-[0_0_15px_rgba(2,206,237,0.3)]'
                  : 'bg-secondary text-white hover:bg-primary hover:text-secondary'
              }`}
              id="btn-quick-enquiry"
            >
              <span>Quick Enquiry</span>
              <MessageCircle className="h-3.5 w-3.5" />
            </a>

            {loggedInAdmin && onBackToAdmin && (
              <div className="relative" id="header-admin-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="group flex items-center gap-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all text-left cursor-pointer focus:outline-none"
                  title="Open Admin Menu"
                  id="header-admin-avatar-btn"
                >
                  <div className="relative h-9 w-9 rounded-full ring-2 ring-primary bg-secondary overflow-hidden flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                      alt="Admin Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden lg:block pr-1">
                    <div className="text-[9px] font-bold tracking-tight text-primary uppercase font-mono block leading-none">SYSTEM ACTIVE</div>
                    <span className={`text-xs font-bold leading-none flex items-center gap-1 ${isScrolled ? 'text-white font-medium' : 'text-secondary font-bold'}`}>
                      <span>Admin Panel</span>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                    </span>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}

                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-2.5 w-60 rounded-2xl border p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isScrolled 
                      ? 'border-white/10 bg-[#00090a]/95 text-white backdrop-blur-lg' 
                      : 'border-slate-200/60 bg-white text-secondary'
                  }`}>
                    <div className="px-3.5 py-2 border-b border-black/[0.03] dark:border-white/[0.05] mb-1">
                      <span className="text-[9px] font-mono tracking-widest text-[#00e1ff] uppercase font-bold block">
                        Control Room Bureau
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block mt-0.5">
                        {loggedInAdmin?.name || 'Administrator'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onBackToAdmin('analytics');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary text-slate-650 dark:text-gray-300 cursor-pointer"
                      >
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                        <span>Performance Index</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onBackToAdmin('listings');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary text-slate-650 dark:text-gray-300 cursor-pointer"
                      >
                        <Layers className="h-4 w-4 text-slate-400" />
                        <span>Listings Manager</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onBackToAdmin('locations');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary text-slate-650 dark:text-gray-300 cursor-pointer"
                      >
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>Region Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onBackToAdmin('leads');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary text-slate-650 dark:text-gray-300 cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4 text-slate-400" />
                        <span>Client Leads</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onBackToAdmin('subs');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary text-slate-650 dark:text-gray-300 cursor-pointer"
                      >
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>Email Subs</span>
                      </button>
                    </div>

                    <div className="border-t border-black/[0.03] dark:border-white/[0.05] mt-1.5 pt-1.5">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onBackToAdmin('analytics');
                        }}
                        className="w-full text-center py-2 rounded-xl text-xxs font-mono tracking-widest uppercase font-bold text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Enter Core Workspace
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center gap-2">
            {loggedInAdmin && onBackToAdmin && (
              <div className="relative z-50">
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className="relative h-8.5 w-8.5 rounded-full ring-2 ring-primary overflow-hidden flex items-center justify-center active:scale-95 transition-all focus:outline-none cursor-pointer"
                  title="Admin Dashboard"
                  id="mobile-admin-avatar-btn"
                >
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                    alt="Admin Avatar"
                    className="h-full w-full object-cover"
                  />
                </button>

                {isMobileDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-45 bg-transparent" 
                    onClick={() => setIsMobileDropdownOpen(false)}
                  />
                )}

                {isMobileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 rounded-2xl border p-2 shadow-xl z-50 bg-[#00090a]/95 text-white backdrop-blur-lg border-white/10 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 border-b border-white/5 mb-1 text-[9px] font-mono tracking-widest text-[#00e1ff] uppercase font-bold text-center">
                      Control Room
                    </div>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setIsMobileDropdownOpen(false);
                          setMobileMenuOpen(false);
                          onBackToAdmin('analytics');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 hover:bg-white/5 hover:text-primary text-gray-300 cursor-pointer"
                      >
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                        <span>Performance Index</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileDropdownOpen(false);
                          setMobileMenuOpen(false);
                          onBackToAdmin('listings');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 hover:bg-white/5 hover:text-primary text-gray-300 cursor-pointer"
                      >
                        <Layers className="h-4 w-4 text-slate-400" />
                        <span>Listings Manager</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileDropdownOpen(false);
                          setMobileMenuOpen(false);
                          onBackToAdmin('locations');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 hover:bg-white/5 hover:text-primary text-gray-300 cursor-pointer"
                      >
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>Region Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileDropdownOpen(false);
                          setMobileMenuOpen(false);
                          onBackToAdmin('leads');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 hover:bg-white/5 hover:text-primary text-gray-300 cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4 text-slate-400" />
                        <span>Client Leads</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileDropdownOpen(false);
                          setMobileMenuOpen(false);
                          onBackToAdmin('subs');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 hover:bg-white/5 hover:text-primary text-gray-300 cursor-pointer"
                      >
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>Email Subs</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isScrolled 
                  ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' 
                  : 'border-slate-200 text-secondary bg-slate-50 hover:bg-slate-100'
              }`}
              id="btn-mobile-menu"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Slide-in Navigation Menu */}
      <div
        className={`fixed inset-0 w-screen h-screen bg-slate-950/98 backdrop-blur-2xl z-50 flex flex-col p-6 sm:p-10 md:hidden overflow-y-auto transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : 'translate-y-full opacity-0 scale-95 pointer-events-none'
        }`}
        id="mobile-fullscreen-menu"
      >
        {/* Full-Screen Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-8" id="mobile-menu-header">
          <CrovationLogo isDarkTheme={true} height={32} />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Minimalist Subheader */}
        <div className="mb-8" id="mobile-menu-bureau">
          <span className="text-[10px] font-mono tracking-widest text-[#02ceed] uppercase font-bold block">
            Navigation Bureau
          </span>
          <p className="text-[9px] font-mono text-gray-400">CROVATION LIMITED • LUXURY PROPERTY CATALOG</p>
        </div>

        {/* Elegant Display Links */}
        <div className="flex flex-col gap-6 md:gap-8 my-auto py-4" id="mobile-menu-links">
          {[
            { number: '01', label: 'Home Showcase', page: 'home' },
            { number: '02', label: 'Properties Catalog', page: 'properties' },
            { number: '03', label: 'About Lineage', page: 'about' },
            { number: '04', label: 'Premium Services', page: 'services' },
            { number: '05', label: 'Contact Bureau', page: 'contact' },
          ].map((item) => {
            const isActive = activePage === item.page || (item.page === 'services' && activePage.startsWith('services/'));
            return (
              <button
                key={item.page}
                onClick={() => handleNavigate(item.page as any)}
                className="group flex items-baseline gap-4 text-left cursor-pointer focus:outline-none"
              >
                <span className="text-[11px] font-mono text-[#02ceed]/80 tracking-wider font-semibold">
                  {item.number} /
                </span>
                <span className={`text-3xl sm:text-4xl font-light tracking-tight transition-all duration-300 ${
                  isActive
                    ? 'text-primary font-medium tracking-wide translate-x-2'
                    : 'text-gray-300 group-hover:text-white group-hover:translate-x-1'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Control Room Deck (If Logged In Admin) */}
        {loggedInAdmin && (
          <div className="mt-8 mb-6 bg-white/[0.02] border border-white/5 rounded-2xl p-4" id="mobile-menu-admin-deck">
            <span className="text-[10px] font-mono tracking-widest text-[#00e1ff] uppercase font-bold block mb-3 px-1">
              Control Room Deck
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToAdmin?.('analytics');
                }}
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-primary text-left cursor-pointer"
              >
                <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                <span>Performance</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToAdmin?.('listings');
                }}
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-primary text-left cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <span>Listings</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToAdmin?.('locations');
                }}
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-primary text-left cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Regions</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToAdmin?.('leads');
                }}
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-primary text-left cursor-pointer"
              >
                <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                <span>Leads</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToAdmin?.('subs');
                }}
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-primary text-left col-span-2 cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Email Subscribers</span>
              </button>
            </div>
          </div>
        )}

        {/* Brand Details & Quick Enquiry Footer */}
        <div className="pt-6 border-t border-white/5 mt-auto" id="mobile-menu-footer">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#02ceed] uppercase font-bold block mb-1">HQ Address</span>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Victoria Island, Lagos, Nigeria <br />
                Midtown, Manhattan, NY, USA
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#02ceed] uppercase font-bold block mb-1">Concierge Office</span>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                <a href="tel:+2348088727277" className="hover:text-[#02ceed] transition-colors">+234 (0) 808 872 7277</a> <br />
                <a href="mailto:info@crovationlimited.com" className="hover:text-[#02ceed] transition-colors">info@crovationlimited.com</a>
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/2348088727277?text=Hello%20Crovation%20Limited,%20I'd%20like%20to%20make%20a%20quick%20enquiry."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full bg-primary hover:bg-[#00e1ff] text-secondary text-center font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer decoration-transparent focus:ring-2 focus:ring-primary/40 active:scale-98"
          >
            <span>Quick Enquiry</span>
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
