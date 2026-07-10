import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, BedDouble, Bath, Maximize2, ShieldCheck, ArrowUpDown, SlidersHorizontal, ArrowUpRight, Grid, Map, Scale, X, Check } from 'lucide-react';
import { Property, PropertyType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import PropertyMapView from './PropertyMapView';
import PropertyComparison from './PropertyComparison';

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

interface PropertiesPageProps {
  onOpenInquiry: (subject?: string) => void;
  onSelectProperty: (property: Property) => void;
  initialFilters?: {
    location: string;
    type: string;
    priceRange: string;
    bedrooms: string;
  };
  properties?: Property[];
  locations?: string[];
  comparePropertyIds?: string[];
  onToggleCompare?: (property: Property) => void;
  onOpenComparison?: () => void;
}

export default function PropertiesPage({ 
  onOpenInquiry, 
  onSelectProperty, 
  initialFilters, 
  properties, 
  locations = ['California', 'New York', 'Dubai', 'Colorado', 'Boston'],
  comparePropertyIds: comparePropertyIdsProp,
  onToggleCompare,
  onOpenComparison
}: PropertiesPageProps) {
  // Local state for full catalog filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState(initialFilters?.location || 'All');
  const [filterType, setFilterType] = useState(initialFilters?.type || 'All');
  const [filterPrice, setFilterPrice] = useState(initialFilters?.priceRange || 'All');
  const [filterBeds, setFilterBeds] = useState(initialFilters?.bedrooms || 'All');
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'sizeDesc'>('default');
  
  // Real database properties state
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Map view & side-by-side comparison states
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Local fallbacks if not lifted globally
  const [localComparePropertyIds, setLocalComparePropertyIds] = useState<string[]>([]);
  const [localIsComparisonOpen, setLocalIsComparisonOpen] = useState(false);

  const comparePropertyIds = comparePropertyIdsProp !== undefined ? comparePropertyIdsProp : localComparePropertyIds;
  const isComparisonOpen = onOpenComparison !== undefined ? false : localIsComparisonOpen;

  useEffect(() => {
    async function fetchProperties() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return; // Silent fallback, no error set
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*');
        if (error) {
          throw error;
        }
        setDbProperties(data || []);
      } catch (err: any) {
        console.error('Error fetching properties from Supabase:', err);
        setFetchError(err?.message || 'Failed to fetch properties.');
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const loadedProperties = useMemo(() => {
    if (isSupabaseConfigured) {
      if (fetchError || (loading && dbProperties.length === 0)) {
        return properties || [];
      }
      return dbProperties;
    }
    return properties || [];
  }, [isSupabaseConfigured, dbProperties, properties, loading, fetchError]);

  // Stats summary counted
  const totalInInventory = loadedProperties.length;

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    let result = [...loadedProperties];

    // Search bar search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) => 
          p.title.toLowerCase().includes(term) || 
          p.location.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // Filter location
    if (filterLocation !== 'All') {
      result = result.filter((p) => p.location.toLowerCase().includes(filterLocation.toLowerCase()));
    }

    // Filter type
    if (filterType !== 'All') {
      result = result.filter((p) => p.type === filterType);
    }

    // Filter price
    if (filterPrice !== 'All') {
      if (filterPrice === 'low') {
        result = result.filter((p) => p.price < 6000000);
      } else if (filterPrice === 'mid') {
        result = result.filter((p) => p.price >= 6000000 && p.price <= 10000000);
      } else if (filterPrice === 'high') {
        result = result.filter((p) => p.price > 10000000);
      }
    }

    // Filter beds
    if (filterBeds !== 'All') {
      const minBeds = parseInt(filterBeds, 10);
      result = result.filter((p) => p.bedrooms >= minBeds);
    }

    // Sort matching properties
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'sizeDesc') {
      result.sort((a, b) => b.size - a.size);
    }

    return result;
  }, [searchTerm, filterLocation, filterType, filterPrice, filterBeds, sortBy, loadedProperties]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterLocation('All');
    setFilterType('All');
    setFilterPrice('All');
    setFilterBeds('All');
    setSortBy('default');
  };

  const handleToggleCompare = (property: Property) => {
    if (onToggleCompare) {
      onToggleCompare(property);
      return;
    }
    setLocalComparePropertyIds(prev => {
      if (prev.includes(property.id)) {
        return prev.filter(id => id !== property.id);
      }
      if (prev.length >= 4) {
        return prev; // Limit comparison list to 4 properties maximum
      }
      return [...prev, property.id];
    });
  };

  const handleRemoveCompare = (propertyId: string) => {
    if (onToggleCompare) {
      const found = loadedProperties.find(p => p.id === propertyId);
      if (found) onToggleCompare(found);
      return;
    }
    setLocalComparePropertyIds(prev => prev.filter(id => id !== propertyId));
  };

  const comparePropertiesList = useMemo(() => {
    return loadedProperties.filter(p => comparePropertyIds.includes(p.id));
  }, [loadedProperties, comparePropertyIds]);

  const formatPrice = (value: number, currency?: 'USD' | 'NGN') => {
    const isNaira = currency === 'NGN';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: isNaira ? 'NGN' : 'USD',
      maximumFractionDigits: 0
    }).format(value).replace('NGN', '₦');
  };

  return (
    <div className="pt-24 min-h-screen bg-brandbg" id="properties-view-page">
      {/* Editorial Header */}
      <div className="bg-secondary text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <span>Confidential Holdings</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            The Property Collection
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mt-3 leading-relaxed">
            Peruse our carefully indexed suite of premier duplex residential buildings, custom villas, high-floor penthouses, and business commercial complexes.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR FILTERS (Col span 3) */}
          <aside className="lg:col-span-3 bg-white rounded-3xl border border-black/[0.03] p-6 shadow-sm space-y-6 text-left" id="filter-sidebar">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.03]">
              <div className="flex items-center gap-2 font-bold text-sm text-secondary">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Search Filters</span>
              </div>
              <button 
                onClick={handleResetFilters}
                className="text-[11px] text-gray-400 hover:text-red-500 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Keyword Input */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Property Keywords
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Pavilion, Penthouse..."
                  className="w-full rounded-xl border border-gray-100 bg-slate-50/50 pl-9 pr-4 py-2.5 text-xs text-secondary placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all"
                />
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>             {/* Destination Location */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Region / State
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-3.5 py-2.5 text-xs text-gray-600 focus:outline-none focus:border-primary transition-all cursor-pointer animate-none"
              >
                <option value="All">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Category */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Building Category
              </label>
              <div className="space-y-1.5">
                {['All', 'Villa', 'Apartment', 'Duplex', 'Commercial', 'Land'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      filterType === type
                        ? 'bg-secondary text-white font-semibold'
                        : 'bg-transparent text-gray-500 hover:text-secondary hover:bg-slate-50'
                    }`}
                  >
                    <span>{type === 'All' ? 'All Spaces' : type}</span>
                    {filterType === type && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget range */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Financing tier
              </label>
              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-slate-50/50 px-3.5 py-2.5 text-xs text-gray-600 focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="All">No Limits</option>
                <option value="low">Under $6,000,000</option>
                <option value="mid">$6,000,000 - $10,000,000</option>
                <option value="high">Above $10,000,000</option>
              </select>
            </div>

            {/* Bedroom numbers */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Bedrooms Requirement
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['All', '3', '4', '5'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFilterBeds(num)}
                    className={`py-2 rounded-lg text-xs font-semibold cursor-pointer text-center ${
                      filterBeds === num
                        ? 'bg-secondary text-white'
                        : 'bg-slate-50 border border-black/[0.02] text-gray-500 hover:text-secondary'
                    }`}
                  >
                    {num === 'All' ? 'Any' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Authenticity Pledge info */}
            <div className="pt-4 border-t border-black/[0.03] space-y-2.5 bg-slate-50/40 p-3.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-secondary">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Verified Clean Deed</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed leading-normal">
                Every listing undergoes complete legal audit, land title checks and structural testing before entering our public registry.
              </p>
            </div>
          </aside>

          {/* MAIN PROPERTIES STREAM (Col span 9) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Control Bar */}
            <div className="bg-white rounded-2xl border border-black/[0.03] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs text-gray-400">
                  Showing <strong className="text-secondary font-semibold">{filteredProperties.length}</strong> of {totalInInventory} Private Assets Listed
                </span>
              </div>

              {/* View Toggle & Sorter */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
                {/* View Mode Toggle */}
                <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200/50 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-secondary shadow-sm'
                        : 'text-gray-400 hover:text-secondary'
                    }`}
                  >
                    <Grid className="h-3.5 w-3.5" />
                    <span>Grid View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-white text-secondary shadow-sm'
                        : 'text-gray-400 hover:text-secondary'
                    }`}
                  >
                    <Map className="h-3.5 w-3.5" />
                    <span>Map View</span>
                  </button>
                </div>

                {/* Sorter Selector */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                  <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                    <ArrowUpDown className="h-3 w-3 text-primary" />
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-xl border border-gray-100 bg-white px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer text-center font-semibold w-full sm:w-auto"
                  >
                    <option value="default">Standard Order</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="sizeDesc">Size: High-low area</option>
                  </select>
                </div>
              </div>
            </div>            {/* Listings Stream */}
            {loading ? (
              <div className="bg-white rounded-3xl border border-black/[0.03] p-16 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading premium holdings...</p>
              </div>
            ) : fetchError ? (
              <div className="bg-white rounded-3xl border border-black/[0.03] p-12 text-center max-w-md mx-auto">
                <span className="text-4xl block mb-3">⚠️</span>
                <h4 className="text-base font-extrabold text-red-600 mb-1">
                  Connection Error
                </h4>
                <p className="text-xs text-gray-400 leading-normal mb-6">
                  {fetchError}
                </p>
              </div>
            ) : loadedProperties.length === 0 ? (
              <div className="bg-white rounded-3xl border border-black/[0.03] p-16 text-center max-w-md mx-auto">
                <span className="text-4xl block mb-3">🏡</span>
                <h4 className="text-base font-extrabold text-secondary mb-1">
                  No properties listed yet
                </h4>
                <p className="text-xs text-gray-400 leading-normal mb-2">
                  Our exclusive private registry is currently empty.
                </p>
                <p className="text-[11px] text-gray-400">
                  Please register assets using the Executive Console.
                </p>
              </div>
            ) : filteredProperties.length > 0 ? (
              viewMode === 'map' ? (
                <PropertyMapView
                  properties={filteredProperties}
                  onSelectProperty={onSelectProperty}
                  selectedPropertiesForCompare={comparePropertyIds}
                  onToggleCompare={handleToggleCompare}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="group bg-white rounded-3xl border border-black/[0.04] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.015)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1"
                    >
                      {/* Img frame */}
                      <div 
                        className="relative aspect-[16/11] bg-slate-100 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          onClick={() => onSelectProperty(prop)}
                        />
                        
                        {/* Floating tags */}
                        <span className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest text-[#000000] uppercase shadow-sm z-10">
                          {prop.type}
                        </span>

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

                        {/* Comparison Toggle Overlay */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompare(prop);
                          }}
                          className={`absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border shadow-md transition-all flex items-center gap-1 cursor-pointer ${
                            comparePropertyIds.includes(prop.id)
                              ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                              : 'bg-white/95 border-slate-200 text-secondary hover:bg-white hover:scale-102'
                          }`}
                          title={comparePropertyIds.includes(prop.id) ? "Remove from comparison" : "Select to compare side-by-side (Max 4)"}
                        >
                          {comparePropertyIds.includes(prop.id) ? (
                            <>
                              <Check className="h-3 w-3 text-white" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <>
                              <Scale className="h-3 w-3 text-slate-500" />
                              <span>Compare</span>
                            </>
                          )}
                        </button>
                        
                        <div className="absolute bottom-4 right-4 bg-[#000000]/90 text-white font-mono text-xs font-semibold px-3 py-1 bg-secondary/80 rounded-lg">
                          {formatPrice(prop.price, prop.currency)}
                        </div>
                      </div>

                      {/* Details block */}
                      <div className="p-6 text-left space-y-3.5">
                        <div className="flex items-center gap-1.5 text-gray-400 font-mono text-xs">
                          <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="truncate">{prop.location}</span>
                        </div>

                        <h3 
                          onClick={() => onSelectProperty(prop)}
                          className="font-extrabold text-base text-secondary group-hover:text-primary transition-colors cursor-pointer"
                        >
                          {prop.title}
                        </h3>

                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                          {stripHtml(prop.description)}
                        </p>

                        {/* Specs section */}
                        <div className="grid grid-cols-3 gap-2 border-t border-black/[0.02] pt-3.5 text-center">
                          {prop.type !== 'Commercial' && (
                            <div>
                              <span className="text-[9px] text-gray-400 block uppercase font-medium">Beds</span>
                              <div className="flex items-center justify-center gap-1 text-secondary font-bold text-xs">
                                <BedDouble className="h-3 w-3 text-slate-500" />
                                <span>{prop.bedrooms}</span>
                              </div>
                            </div>
                          )}
                          <div>
                            <span className="text-[9px] text-gray-400 block uppercase font-medium">Baths</span>
                            <div className="flex items-center justify-center gap-1 text-secondary font-bold text-xs">
                              <Bath className="h-3 w-3 text-slate-500" />
                              <span>{prop.bathrooms}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 block uppercase font-medium">Size</span>
                            <div className="flex items-center justify-center gap-1 text-secondary font-bold text-xs">
                              <Maximize2 className="h-3 w-3 text-slate-500" />
                              <span>{prop.size} <span className="text-[8px] text-slate-400 font-light">sqft</span></span>
                            </div>
                          </div>
                        </div>

                        {/* CTA trigger */}
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="w-full bg-slate-50 border border-slate-200 text-secondary hover:border-primary hover:bg-primary hover:text-secondary py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] duration-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          View Asset Details
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="bg-white rounded-3xl border border-black/[0.03] p-12 text-center max-w-md mx-auto">
                <span className="text-4xl block mb-3">🔍</span>
                <h4 className="text-base font-extrabold text-secondary mb-1">
                  No matching investment properties
                </h4>
                <p className="text-xs text-gray-400 leading-normal mb-6">
                  Adjust your sidebar parameters or clear your current query values to look through our alternative listings.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-secondary text-white hover:bg-primary hover:text-secondary hover:shadow-[0_0_15px_rgba(2,206,237,0.3)] duration-300 transition-colors px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Sticky Bottom Comparison Drawer */}
      {comparePropertyIds.length > 0 && !onOpenComparison && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 animate-fade-in">
          <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 text-white text-left">
            <div className="flex items-center gap-3">
              <div className="bg-primary/25 p-2 rounded-xl border border-primary/45 shrink-0">
                <Scale className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Compare Assets Side-by-Side</h4>
                <span className="text-[10px] text-gray-400 font-medium font-mono">
                  {comparePropertyIds.length} of 4 properties selected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLocalIsComparisonOpen(true)}
                className="bg-primary hover:bg-cyan-400 text-slate-950 font-extrabold uppercase tracking-wider text-[10px] px-3.5 py-2.5 rounded-xl duration-300 transition-all flex items-center gap-1 cursor-pointer shadow-lg"
              >
                Compare ({comparePropertyIds.length}/4)
              </button>
              <button
                onClick={() => handleRemoveCompare('')} // Clear all
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-gray-300 cursor-pointer"
                title="Clear comparison list"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Fullscreen Overlay */}
      {isComparisonOpen && !onOpenComparison && (
        <PropertyComparison
          selectedProperties={comparePropertiesList}
          onRemove={handleRemoveCompare}
          onClose={() => setLocalIsComparisonOpen(false)}
          onOpenInquiry={onOpenInquiry}
        />
      )}
    </div>
  );
}
