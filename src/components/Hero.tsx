import React, { useState } from 'react';
import { Search, MapPin, Building, DollarSign, BedDouble, ChevronRight, ArrowUpRight } from 'lucide-react';
import { PropertyType } from '../types';

interface HeroProps {
  onSearch: (filters: {
    location: string;
    type: string;
    priceRange: string;
    bedrooms: string;
  }) => void;
  onOpenInquiry: (subject?: string) => void;
  onExploreClick: () => void;
  locations?: string[];
  onNavigateAbout?: () => void;
}

export default function Hero({ onSearch, onOpenInquiry, onExploreClick, locations = ['California', 'New York', 'Dubai', 'Colorado', 'Boston'], onNavigateAbout }: HeroProps) {
  const [location, setLocation] = useState('All');
  const [type, setType] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, type, priceRange, bedrooms });
    
    // Smooth scroll down to properties
    setTimeout(() => {
      const element = document.getElementById('properties-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden" id="hero-section">
      {/* Decorative Radial Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-primary/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 animate-fade-in text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-secondary" id="badge-hero">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Premium Real Estate Solutions
              </span>
            </div>

            {/* Large Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-secondary leading-[1.1]" id="headline-hero">
              Discover Exceptional Properties Designed For Modern Living
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed" id="subheadline-hero">
              Browse premium residential and commercial properties carefully curated by Crovation Limited.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="bg-secondary text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl hover:bg-primary hover:text-secondary hover:shadow-[0_0_20px_rgba(2,206,237,0.3)] duration-300 transition-all flex items-center gap-2 group cursor-pointer"
                id="btn-explore-hero"
              >
                Explore Properties
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onOpenInquiry('General Advisory Inquiry')}
                className="bg-transparent border border-gray-200 hover:border-secondary text-secondary font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl duration-300 transition-all active:scale-95 cursor-pointer"
                id="btn-contact-hero"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Right Column Layout (Luxury Frame & Floating Shape) */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            {/* Ambient Background Grid and Shape */}
            <div className="absolute -inset-4 bg-primary/10 rounded-[32px] blur-2xl transform scale-95 opacity-80 -z-10 animate-pulse duration-[8000ms]" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-xl pointer-events-none" />

            {/* Immersive Photo Frame */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[24px] overflow-hidden border-8 border-white shadow-2xl group cursor-crosshair">
              {/* Luxury Estate Photo */}
              <img
                src="/img/CROVATION%20WALL%20DISPLAY.jpg"
                alt="Architectural Masterpiece Mansion"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-60" />
              
              {/* Text overlay linking to the About page to learn about Crovation */}
              <button
                onClick={onNavigateAbout}
                className="absolute bottom-6 left-6 right-6 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-white text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group/overlay shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="hero-about-link-overlay"
              >
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest block mb-1.5 flex items-center gap-1">
                  Discover Crovation Limited
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/overlay:translate-x-0.5 group-hover/overlay:-translate-y-0.5" />
                </span>
                <h4 className="font-semibold text-xs leading-relaxed text-gray-200">
                  Crovation is a high-performing real estate firm specializing in luxury properties, sustainable architecture, and premium investment assets.
                </h4>
                <span className="inline-block mt-2 text-xs text-primary font-bold hover:underline">
                  Learn more about us &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ----------------- PROPERTY SEARCH BAR SECTION ----------------- */}
        <div className="mt-16 md:mt-24" id="search-section">
          <div className="bg-white rounded-[24px] border border-black/[0.04] p-6 md:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.02)] relative z-20">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">
                Luxury Agent Registry
              </span>
              <h3 className="text-lg font-bold text-secondary">
                Tailor Your Property Search
              </h3>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* Location Input */}
              <div className="lg:col-span-3">
                <label className="text-xs font-bold text-gray-600 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Location
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3.5 text-xs text-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans cursor-pointer appearance-none animate-none"
                  >
                    <option value="All">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Property Type Input */}
              <div className="lg:col-span-3">
                <label className="text-xs font-bold text-gray-600 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-primary" />
                  Property Type
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3.5 text-xs text-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans cursor-pointer appearance-none animate-none"
                  >
                    <option value="All">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Price Range Input */}
              <div className="lg:col-span-2">
                <label className="text-xs font-bold text-gray-600 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  Price Range
                </label>
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3.5 text-xs text-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans cursor-pointer appearance-none"
                  >
                    <option value="All">Any Price</option>
                    <option value="low">Under $6,000,000</option>
                    <option value="mid">$6,000,000 - $10,000,000</option>
                    <option value="high">Above $10,000,000</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Bedrooms Input */}
              <div className="lg:col-span-2">
                <label className="text-xs font-bold text-gray-600 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <BedDouble className="h-3.5 w-3.5 text-primary" />
                  Bedrooms
                </label>
                <div className="relative">
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-4 py-3.5 text-xs text-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans cursor-pointer appearance-none"
                  >
                    <option value="All">Any Bed</option>
                    <option value="3">3+ Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Search button */}
              <div className="lg:col-span-2 w-full">
                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-primary text-white hover:text-secondary font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 duration-300 transition-all active:scale-98 shadow-md cursor-pointer h-12"
                  id="btn-search-query"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
