import React, { useState, useEffect } from 'react';
import { Menu, X, Landmark, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenInquiry: (subject?: string) => void;
  activePage: 'home' | 'properties' | 'about' | 'services' | 'contact';
  onChangePage: (page: 'home' | 'properties' | 'about' | 'services' | 'contact') => void;
}

export default function Navbar({ onOpenInquiry, activePage, onChangePage }: NavbarProps) {
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

  const getActiveStyles = (page: 'home' | 'properties' | 'about' | 'services' | 'contact') => {
    const isActive = activePage === page;
    if (isScrolled) {
      return isActive 
        ? 'text-primary font-bold' 
        : 'text-gray-300 hover:text-primary transition-colors';
    } else {
      return isActive 
        ? 'text-secondary font-bold underline decoration-primary decoration-2 underline-offset-4' 
        : 'text-gray-600 hover:text-secondary hover:underline hover:decoration-primary/55 hover:decoration-2 hover:underline-offset-4 transition-all';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 transition-all duration-300">
      <div
        id="navbar-container"
        className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? 'border-white/15 bg-secondary/85 backdrop-blur-md shadow-2xl py-3 px-6 text-white'
            : 'border-black/5 bg-white/70 backdrop-blur-md shadow-sm py-4 px-6 text-secondary'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 font-bold text-lg md:text-xl tracking-tight transition-transform active:scale-98 cursor-pointer text-left"
            id="nav-logo"
          >
            <div className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
              isScrolled ? 'bg-primary text-secondary' : 'bg-secondary text-primary'
            }`}>
              <Landmark className="h-5 w-5" />
            </div>
            <span className="font-semibold text-secondary">
              Crovation <span className="font-light text-primary">Limited</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button
              onClick={() => handleNavigate('home')}
              className={`cursor-pointer ${getActiveStyles('home')}`}
              id="link-home"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigate('properties')}
              className={`cursor-pointer ${getActiveStyles('properties')}`}
              id="link-properties"
            >
              Properties
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className={`cursor-pointer ${getActiveStyles('about')}`}
              id="link-about"
            >
              About
            </button>
            <button
              onClick={() => handleNavigate('services')}
              className={`cursor-pointer ${getActiveStyles('services')}`}
              id="link-services"
            >
              Services
            </button>
            <button
              onClick={() => handleNavigate('contact')}
              className={`cursor-pointer ${getActiveStyles('contact')}`}
              id="link-contact"
            >
              Contact
            </button>
          </nav>

          {/* Header Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onOpenInquiry('Investor Partnership / Listing with Crovation')}
              className="bg-primary hover:bg-[#00e1ff] text-secondary px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(2,206,237,0.4)] transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              id="btn-list-with-us"
            >
              List With Us
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isScrolled ? 'border-white/10 text-white' : 'border-black/5 text-secondary'
              }`}
              id="btn-mobile-menu"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="absolute top-20 left-4 right-4 z-40 md:hidden bg-[#00090a] text-white rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200"
          id="mobile-drawer"
        >
          <button
            onClick={() => handleNavigate('home')}
            className={`flex items-center justify-between py-2.5 text-left font-medium border-b border-white/5 cursor-pointer ${
              activePage === 'home' ? 'text-primary' : 'hover:text-primary text-gray-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate('properties')}
            className={`flex items-center justify-between py-2.5 text-left font-medium border-b border-white/5 cursor-pointer ${
              activePage === 'properties' ? 'text-primary' : 'hover:text-primary text-gray-300'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => handleNavigate('about')}
            className={`flex items-center justify-between py-2.5 text-left font-medium border-b border-white/5 cursor-pointer ${
              activePage === 'about' ? 'text-primary' : 'hover:text-primary text-gray-300'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavigate('services')}
            className={`flex items-center justify-between py-2.5 text-left font-medium border-b border-white/5 cursor-pointer ${
              activePage === 'services' ? 'text-primary' : 'hover:text-primary text-gray-300'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => handleNavigate('contact')}
            className={`flex items-center justify-between py-2.5 text-left font-medium border-b border-white/5 cursor-pointer relative ${
              activePage === 'contact' ? 'text-primary' : 'hover:text-primary text-gray-300'
            }`}
          >
            Contact
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry('Listing with Crovation Limited');
              }}
              className="w-full bg-primary text-secondary text-center font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              List With Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
