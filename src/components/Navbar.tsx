import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Home, Building2, Info, Compass, Phone } from 'lucide-react';
import CrovationLogo from './CrovationLogo';

interface NavbarProps {
  onOpenInquiry: (subject?: string) => void;
  activePage: 'home' | 'properties' | 'about' | 'services' | 'contact';
  onChangePage: (page: 'home' | 'properties' | 'about' | 'services' | 'contact') => void;
  loggedInAdmin?: any;
  onBackToAdmin?: () => void;
}

export default function Navbar({ onOpenInquiry, activePage, onChangePage, loggedInAdmin, onBackToAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavigate = (page: 'home' | 'properties' | 'about' | 'services' | 'contact') => {
    setMobileMenuOpen(false);
    onChangePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLinkStyles = (page: 'home' | 'properties' | 'about' | 'services' | 'contact') => {
    const isActive = activePage === page;
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
            <button
              onClick={() => onOpenInquiry('Investor Partnership / Listing with Crovation')}
              className={`px-4.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                isScrolled
                  ? 'bg-primary text-secondary hover:bg-[#00e1ff] hover:shadow-[0_0_15px_rgba(2,206,237,0.3)]'
                  : 'bg-secondary text-white hover:bg-primary hover:text-secondary'
              }`}
              id="btn-list-with-us"
            >
              <span>List With Us</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {loggedInAdmin && onBackToAdmin && (
              <button
                onClick={onBackToAdmin}
                className="relative group flex items-center gap-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all text-left cursor-pointer"
                title="Back to Admin Dashboard"
                id="header-admin-avatar"
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
                  <span className={`text-xs font-bold leading-none ${isScrolled ? 'text-white font-medium' : 'text-secondary font-bold'}`}>Admin Panel</span>
                </div>
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center gap-2">
            {loggedInAdmin && onBackToAdmin && (
              <button
                onClick={onBackToAdmin}
                className="relative h-8.5 w-8.5 rounded-full ring-2 ring-primary overflow-hidden flex items-center justify-center active:scale-95 transition-transform"
                title="Admin Dashboard"
                id="mobile-admin-avatar"
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                  alt="Admin Avatar"
                  className="h-full w-full object-cover"
                />
              </button>
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="absolute top-20 left-4 right-4 z-40 md:hidden bg-[#00090a]/95 backdrop-blur-lg text-white rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200"
          id="mobile-drawer"
        >
          <div className="border-b border-white/5 pb-2.5 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#02ceed] uppercase font-bold">Navigation Bureau</span>
            <span className="text-[9px] font-mono text-gray-500">CROVATION LIMITED</span>
          </div>

          <button
            onClick={() => handleNavigate('home')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activePage === 'home' ? 'bg-primary/10 text-[#02ceed] border-l-4 border-primary' : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home Showcase</span>
          </button>

          <button
            onClick={() => handleNavigate('properties')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activePage === 'properties' ? 'bg-primary/10 text-[#02ceed] border-l-4 border-primary' : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Properties Catalog</span>
          </button>

          <button
            onClick={() => handleNavigate('about')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activePage === 'about' ? 'bg-primary/10 text-[#02ceed] border-l-4 border-primary' : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            <Info className="h-4 w-4" />
            <span>About Lineage</span>
          </button>

          <button
            onClick={() => handleNavigate('services')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activePage === 'services' ? 'bg-primary/10 text-[#02ceed] border-l-4 border-primary' : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Premium Services</span>
          </button>

          <button
            onClick={() => handleNavigate('contact')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activePage === 'contact' ? 'bg-primary/10 text-[#02ceed] border-l-4 border-primary' : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>Contact Bureau</span>
          </button>

          <div className="pt-3 border-t border-white/5 mt-1.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry('Listing with Crovation Limited');
              }}
              className="w-full bg-primary hover:bg-[#00e1ff] text-secondary text-center font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>List With Us Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
