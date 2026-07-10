import React, { useMemo } from 'react';
import { X, Check, BedDouble, Bath, Maximize2, ShieldCheck, HelpCircle, Sparkles, MessageCircle, Phone } from 'lucide-react';
import { Property } from '../types';

interface PropertyComparisonProps {
  selectedProperties: Property[];
  onRemove: (propertyId: string) => void;
  onClose: () => void;
  onOpenInquiry: (subject?: string) => void;
}

export default function PropertyComparison({
  selectedProperties,
  onRemove,
  onClose,
  onOpenInquiry
}: PropertyComparisonProps) {
  
  const cheapestId = useMemo(() => {
    const validProps = selectedProperties.filter(Boolean);
    if (validProps.length < 2) return null;
    return [...validProps].sort((a, b) => a.price - b.price)[0]?.id;
  }, [selectedProperties]);

  const largestId = useMemo(() => {
    const validProps = selectedProperties.filter(Boolean);
    if (validProps.length < 2) return null;
    return [...validProps].sort((a, b) => b.size - a.size)[0]?.id;
  }, [selectedProperties]);

  const formatPrice = (value: number, currency?: 'USD' | 'NGN') => {
    const isNaira = currency === 'NGN';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: isNaira ? 'NGN' : 'USD',
      maximumFractionDigits: 0
    }).format(value).replace('NGN', '₦');
  };

  const generateWhatsAppLink = (prop: Property) => {
    const isNaira = prop.currency === 'NGN';
    const priceStr = formatPrice(prop.price, prop.currency);
    const text = `Greetings Crovation Limited, I am comparing "${prop.title}" (listed at ${priceStr}) with other selected properties. Please coordinate private advisory details.`;
    const phone = '2348088727277';
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4" id="comparison-modal">
      <div className="bg-white rounded-[32px] w-full max-w-7xl shadow-2xl overflow-hidden border border-black/[0.03] flex flex-col max-h-[95vh]">
        
        {/* Header Block */}
        <div className="p-6 md:p-8 bg-secondary text-white flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Investment Analytics</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Side-by-Side Asset Comparison</h2>
            <p className="text-xs text-gray-400 mt-1">Analyze structural specifications and financial layouts to assist in strategic decisions.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 transition duration-200 cursor-pointer"
            title="Close Comparison"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content table block */}
        <div className="flex-1 overflow-x-auto p-6 md:p-8">
          {selectedProperties.length === 0 ? (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto">
              <span className="text-4xl">📊</span>
              <h4 className="text-base font-extrabold text-secondary">No properties selected for comparison</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Return to the main catalog stream and check the "Compare" button on listings to stack assets here.
              </p>
              <button 
                onClick={onClose}
                className="bg-secondary text-white hover:bg-primary hover:text-secondary px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Back to properties
              </button>
            </div>
          ) : (
            <div className="min-w-[800px] grid grid-cols-12 gap-4 items-stretch divide-x divide-slate-100">
              
              {/* Row Headers Category Column (Span 3) */}
              <div className="col-span-3 flex flex-col justify-between text-left pr-4">
                <div className="h-[210px] flex items-end pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Core Specifications</span>
                </div>
                
                <div className="space-y-6 py-6 flex-1 text-xs">
                  <div className="py-2.5 font-bold text-gray-400 uppercase tracking-wider text-[10px] border-b border-slate-50">Financing Price</div>
                  <div className="py-2.5 font-bold text-gray-405 uppercase tracking-wider text-[10px] border-b border-slate-50">Region Location</div>
                  <div className="py-2.5 font-bold text-gray-405 uppercase tracking-wider text-[10px] border-b border-slate-50">Space Category</div>
                  <div className="py-2.5 font-bold text-gray-450 uppercase tracking-wider text-[10px] border-b border-slate-50">Bedrooms Configuration</div>
                  <div className="py-2.5 font-bold text-gray-450 uppercase tracking-wider text-[10px] border-b border-slate-50">Bathrooms Suite</div>
                  <div className="py-2.5 font-bold text-gray-450 uppercase tracking-wider text-[10px] border-b border-slate-50">Total Area Area</div>
                  <div className="py-2.5 font-bold text-gray-450 uppercase tracking-wider text-[10px] border-b border-slate-50">Deed Integrity</div>
                  <div className="py-2.5 font-bold text-gray-450 uppercase tracking-wider text-[10px]">Property Summary</div>
                </div>
              </div>

              {/* Selected Properties Columns (Span 9 / selected count) */}
              <div className="col-span-9 grid grid-cols-4 gap-4 pl-4 items-stretch text-left">
                {Array.from({ length: 4 }).map((_, idx) => {
                  const prop = selectedProperties[idx];
                  
                  if (!prop) {
                    return (
                      <div key={`empty-${idx}`} className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 mb-3">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Slot Available</span>
                        <p className="text-[11px] text-gray-400 leading-normal mt-1 max-w-[150px]">Select another asset from the list to populate here.</p>
                      </div>
                    );
                  }

                  return (
                    <div key={prop.id} className="flex flex-col justify-between space-y-6 relative border border-slate-100 rounded-3xl p-4 hover:shadow-md transition-shadow">
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemove(prop.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-gray-500 z-10 cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>

                      {/* Header info (Image & Title) */}
                      <div className="h-[210px] flex flex-col justify-between border-b border-slate-100 pb-4">
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 relative">
                          <img 
                            src={prop.image} 
                            alt={prop.title} 
                            className="w-full h-full object-cover"
                          />
                          {prop.id === cheapestId && (
                            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md z-10">
                              Best Price
                            </span>
                          )}
                          {prop.id === largestId && (
                            <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md z-10">
                              Largest Area
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-sm text-secondary tracking-tight line-clamp-2 mt-3">
                          {prop.title}
                        </h3>
                      </div>

                      {/* Specifications rows */}
                      <div className="space-y-6 py-1 flex-1 text-xs">
                        <div className="py-2 border-b border-slate-50 text-secondary font-mono font-extrabold text-sm">
                          {formatPrice(prop.price, prop.currency)}
                        </div>
                        <div className="py-2 border-b border-slate-50 font-medium text-gray-600 truncate" title={prop.location}>
                          {prop.location}
                        </div>
                        <div className="py-2 border-b border-slate-50 font-bold text-secondary">
                          {prop.type}
                        </div>
                        <div className="py-2 border-b border-slate-50 font-semibold text-gray-600 flex items-center gap-1">
                          <BedDouble className="h-3.5 w-3.5 text-gray-400" />
                          <span>{prop.type === 'Commercial' ? 'N/A' : `${prop.bedrooms} Beds`}</span>
                        </div>
                        <div className="py-2 border-b border-slate-50 font-semibold text-gray-600 flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5 text-gray-400" />
                          <span>{prop.bathrooms} Baths</span>
                        </div>
                        <div className="py-2 border-b border-slate-50 font-semibold text-gray-600 flex items-center gap-1">
                          <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                          <span>{prop.size} sqft</span>
                        </div>
                        <div className="py-2 border-b border-slate-50 text-emerald-600 font-extrabold flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Clean Title</span>
                        </div>
                        <div className="py-2 text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
                          {prop.description.replace(/<[^>]*>/g, '')}
                        </div>
                      </div>

                      {/* Column Footer Interactive CTAs */}
                      <div className="pt-4 border-t border-slate-50 space-y-2">
                        <a
                          href={generateWhatsAppLink(prop)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold uppercase tracking-wider text-[10px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 duration-300"
                        >
                          <MessageCircle className="h-3.5 w-3.5 fill-current" />
                          <span>WhatsApp Enquiry</span>
                        </a>

                        <button
                          onClick={() => onOpenInquiry(`Comparison Enquiry: ${prop.title}`)}
                          className="w-full bg-secondary hover:bg-primary hover:text-secondary text-white font-bold uppercase tracking-wider text-[10px] py-2.5 rounded-xl transition duration-300 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Send Inquiry Protocol
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
