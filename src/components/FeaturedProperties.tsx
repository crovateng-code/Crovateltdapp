import React, { useState, useMemo } from 'react';
import { BedDouble, Bath, Maximize2, MapPin, Undo2, ArrowUpRight } from 'lucide-react';
import { Property, PropertyType } from '../types';

function stripHtml(html: string): string {
  if (!html) return '';
  // Replace HTML tags with spaces to avoid joining adjacent words together
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

interface FeaturedPropertiesProps {
  filters: {
    location: string;
    type: string;
    priceRange: string;
    bedrooms: string;
  };
  onResetFilters: () => void;
  onOpenInquiry: (propertyName: string) => void;
  onSelectProperty: (property: Property) => void;
  properties?: Property[];
  locations?: string[];
}

export default function FeaturedProperties({ filters, onResetFilters, onOpenInquiry, onSelectProperty, properties, locations }: FeaturedPropertiesProps) {
  const [selectedTypeTab, setSelectedTypeTab] = useState<string>('All');

  const loadedProperties = properties || [];

  const filteredProperties = useMemo(() => {
    return loadedProperties.filter((prop) => {
      // Filter by Type Tab + Search Box Type
      const tabTypeMatch = selectedTypeTab === 'All' || prop.type === selectedTypeTab;
      const typeMatch = filters.type === 'All' || prop.type === filters.type;
      
      // Filter by Location
      let locationMatch = true;
      if (filters.location !== 'All') {
        locationMatch = prop.location.toLowerCase().includes(filters.location.toLowerCase());
      }

      // Filter by Price Range
      let priceMatch = true;
      if (filters.priceRange === 'low') {
        priceMatch = prop.price < 6000000;
      } else if (filters.priceRange === 'mid') {
        priceMatch = prop.price >= 6000000 && prop.price <= 10000000;
      } else if (filters.priceRange === 'high') {
        priceMatch = prop.price > 10000000;
      }

      // Filter by Bedrooms
      let bedMatch = true;
      if (filters.bedrooms !== 'All') {
        const minBed = parseInt(filters.bedrooms, 10);
        bedMatch = prop.bedrooms >= minBed;
      }

      return tabTypeMatch && typeMatch && locationMatch && priceMatch && bedMatch;
    });
  }, [selectedTypeTab, filters, loadedProperties]);

  // Format currency helper
  const formatPrice = (value: number, currency?: 'USD' | 'NGN') => {
    const isNaira = currency === 'NGN';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: isNaira ? 'NGN' : 'USD',
      maximumFractionDigits: 0
    }).format(value).replace('NGN', '₦');
  };

  const isFilteredActive = useMemo(() => {
    return (
      filters.location !== 'All' ||
      filters.type !== 'All' ||
      filters.priceRange !== 'All' ||
      filters.bedrooms !== 'All' ||
      selectedTypeTab !== 'All'
    );
  }, [filters, selectedTypeTab]);

  const handleClearEverything = () => {
    setSelectedTypeTab('All');
    onResetFilters();
  };

  return (
    <section className="py-20 bg-brandbg" id="properties-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block animate-pulse">
              Exclusive Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-secondary">
              Featured Properties
            </h2>
            <p className="text-sm text-gray-500 max-w-lg">
              Handpicked opportunities for discerning buyers.
            </p>
          </div>

          {/* Quick Filter Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Villa', 'Apartment', 'Duplex', 'Commercial', 'Land'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedTypeTab(category)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer ${
                  selectedTypeTab === category
                    ? 'bg-secondary text-white shadow-lg'
                    : 'bg-white text-gray-500 hover:text-secondary border border-black/[0.03]'
                }`}
              >
                {category === 'All' ? 'All' : category === 'Land' ? 'Land' : `${category}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Summary if active */}
        {isFilteredActive && (
          <div className="flex flex-wrap items-center gap-3 bg-white border border-black/[0.02] p-4 rounded-2xl mb-8 justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-secondary">Active Filters:</span>
              {filters.location !== 'All' && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">📍 {filters.location}</span>}
              {filters.type !== 'All' && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">🏢 {filters.type}</span>}
              {filters.priceRange !== 'All' && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">💰 {filters.priceRange === 'low' ? '< 6M' : filters.priceRange === 'mid' ? '6-10M' : '10M+'}</span>}
              {filters.bedrooms !== 'All' && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">🛏️ {filters.bedrooms}+ Beds</span>}
              {selectedTypeTab !== 'All' && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Category: {selectedTypeTab}</span>}
              <span className="text-primary font-mono ml-2 font-semibold">({filteredProperties.length} results matching)</span>
            </div>
            
            <button
              onClick={handleClearEverything}
              className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Reset All Filters
            </button>
          </div>
        )}

        {/* Grid Block */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="group bg-white rounded-3xl border border-black/[0.04] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 flex flex-col h-full"
                id={`property-card-${prop.id}`}
              >
                {/* Image & Badge Area */}
                <div 
                  onClick={() => onSelectProperty(prop)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover duration-500 transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle top overlayer gradient */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

                  {/* Property Type Badge Left */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/[0.05] shadow-sm z-10">
                    <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">
                      {prop.type}
                    </span>
                  </div>

                  {/* Absolute Availability Status Badge Right */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`inline-block px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border shadow-md ${
                      (prop.status || 'Available') === 'Available'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-red-600 border-red-500 text-white'
                    }`}>
                      {(prop.status || 'Available') === 'Available' ? 'Available' : 'Sold Out'}
                    </span>
                  </div>

                  {/* Pricing Badge Right */}
                  <div className="absolute bottom-4 right-4 bg-secondary/90 text-white backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10 shadow-lg">
                    <span className="text-xs font-mono font-medium tracking-tight">
                      {formatPrice(prop.price, prop.currency)}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-7 flex flex-col flex-grow text-left">
                  {/* Location Title */}
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2 font-mono">
                    <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectProperty(prop)}
                    className="font-extrabold text-lg text-secondary mb-2 group-hover:text-primary transition-colors cursor-pointer capitalize"
                  >
                    {prop.title}
                  </h3>

                  {/* Custom Description */}
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed line-clamp-2">
                    {stripHtml(prop.description)}
                  </p>

                  <div className="mt-auto">
                    {/* Size and Bed Details */}
                    <div className="grid grid-cols-3 gap-2 border-t border-black/[0.03] pt-4 mb-6">
                      {prop.type !== 'Commercial' && (
                        <div className="text-center">
                          <span className="text-[10px] text-gray-400 uppercase block tracking-wider mb-1">Beds</span>
                          <div className="flex items-center justify-center gap-1 text-secondary font-semibold text-xs">
                            <BedDouble className="h-3.5 w-3.5 text-gray-600" />
                            <span>{prop.bedrooms}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <span className="text-[10px] text-gray-400 uppercase block tracking-wider mb-1">
                          {prop.type === 'Commercial' ? 'Baths' : 'Baths'}
                        </span>
                        <div className="flex items-center justify-center gap-1 text-secondary font-semibold text-xs">
                          <Bath className="h-3.5 w-3.5 text-gray-600" />
                          <span>{prop.bathrooms}</span>
                        </div>
                      </div>

                      <div className="text-center col-span-1">
                        <span className="text-[10px] text-gray-400 uppercase block tracking-wider mb-1">Area size</span>
                        <div className="flex items-center justify-center gap-1 text-secondary font-semibold text-xs">
                          <Maximize2 className="h-3.5 w-3.5 text-gray-600" />
                          <span>{prop.size} <span className="text-[10px] text-gray-400 font-light">sqft</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Button inquiry trigger */}
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary hover:text-secondary text-secondary font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 duration-300 transition-all cursor-pointer"
                    >
                      View Property Details
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search Fallback */
          <div className="bg-white border border-black/[0.03] rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <span className="text-4xl block mb-4">🔮</span>
            <h4 className="text-lg font-bold text-secondary mb-1">
              No matching luxury portfolio matches
            </h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              We currently do not hold a listing matching that exact criteria in our private inventory suite.
            </p>
            <button
              onClick={handleClearEverything}
              className="bg-secondary text-white hover:bg-primary hover:text-secondary font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl duration-300 transition-colors cursor-pointer"
            >
              Reset Search Parameters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
