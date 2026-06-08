import React, { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, MapPin, BedDouble, Bath, Maximize2, ShieldCheck, Check, Sparkles, Compass, Landmark } from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
}

export default function PropertyDetail({ property, onBack }: PropertyDetailProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Generate customized WhatsApp query link
  const generateWhatsAppLink = () => {
    const phone = '18005552768'; // Crovation official line
    const text = `Greetings Crovation Limited, I am interested in exploring "${property.title}" located in ${property.location} (Listed at ${formatPrice(property.price)}). Please provide private access credentials and organize a schedule.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Mock luxury sub-features that are dynamically populated based on category
  const amenities = property.type === 'Commercial' ? [
    'LEED Platinum Smart Microgrid Energy Systems',
    'Executive Boardroom with Panoramic Glazing',
    'Ultra-Secure Fiber Optics & High-Density Node Hub',
    'Biometric Turnstiles & 24/7 Security Operations',
    'Triple-Insulated Thermal Acoustic Noise Mitigation',
    'Private Helicopter Deck Routing Approvals'
  ] : [
    'Integrated Crestron Smart Home System & Ambient Lighting',
    'Custom Invisible Cantilever Dual-Helix Staircases',
    'Premium Calacatta Marble Kitchen with Wolf Sub-Zero Suite',
    'Under-Floor Thermal Zoning & Air Filtration Filtration',
    'Professional High-Lumen Home Cinema & Media Vault',
    'Private Yacht Slip with Smart Water Recirculation'
  ];

  // Specific highlight bullet points based on unique property data
  const highlights = [
    { label: 'Asset ID', value: `CRV-${property.id.toUpperCase()}-2025` },
    { label: 'Financing Grade', value: property.price > 10000000 ? 'Sovereign Institutional' : 'Generational Private' },
    { label: 'Deed Category', value: 'Clean Title / Handover Ready' },
    { label: 'Taxation Level', value: 'Special LLC Structured Exemptions Ready' }
  ];

  return (
    <div className="pt-24 min-h-screen bg-brandbg text-[#00090a] pb-16 text-left" id="property-detail-container">
      {/* Upper Navigation Row */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Collection</span>
        </button>
      </div>

      {/* Main Core Layout */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Title & Core Location Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-[#00090a] text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span>{property.type} Space</span>
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-secondary">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-gray-400 font-mono text-xs md:text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.03] p-4 text-left md:text-right min-w-[200px]">
            <span className="text-[10px] font-bold text-gray-405 uppercase tracking-wider block">
              Investment Pricing
            </span>
            <div className="text-2xl md:text-3.5xl font-extrabold text-[#00090a]">
              {formatPrice(property.price)}
            </div>
            <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1 md:justify-end">
              <ShieldCheck className="h-3.5 w-3.5" />
              Clean Deed Verified
            </span>
          </div>
        </div>

        {/* Big Visual Feature Frame */}
        <div className="relative aspect-[16/9] bg-slate-100 rounded-3xl overflow-hidden border border-black/[0.04] mb-12 shadow-md">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Specs Highlights & Information Hub Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT HUB: Specifications & Narrative (Col span 7/12) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Multi Stats row */}
            <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl border border-black/[0.03] p-5 text-center">
              {property.type !== 'Commercial' && (
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 block uppercase font-medium">Bedrooms</span>
                  <div className="flex items-center justify-center gap-2 text-secondary font-bold text-sm md:text-base">
                    <BedDouble className="h-4 w-4 text-primary" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 block uppercase font-medium">Bathrooms</span>
                <div className="flex items-center justify-center gap-2 text-secondary font-bold text-sm md:text-base">
                  <Bath className="h-4 w-4 text-primary" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 block uppercase font-medium">Total Area</span>
                <div className="flex items-center justify-center gap-2 text-secondary font-bold text-sm md:text-base">
                  <Maximize2 className="h-4 w-4 text-primary" />
                  <span>{property.size.toLocaleString()} <span className="text-[10px] text-gray-400 font-light">sqft</span></span>
                </div>
              </div>
            </div>

            {/* Narrative Description Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-secondary border-b border-black/[0.03] pb-2">
                The Estate Overview
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans">
                {property.description} This unique legacy asset boasts custom exterior layouts specifically arranged with sun angles in mind. Seamless structural integrity coordinates directly with upscale materials to manifest timeless luxury of structural execution.
              </p>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans">
                Each room features tailored space configurations suited for family office advisory operations, high-end private corporate entertaining, or isolated wellness sequences. Extensive spatial tests have been executed under global standards to promise complete alignment.
              </p>
            </div>

            {/* Elite Premium Amenities list */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-secondary border-b border-black/[0.03] pb-2">
                Structural Amenities & Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-slate-50 border border-black/[0.02] p-3.5 rounded-xl text-xs font-sans text-secondary"
                  >
                    <div className="p-1 rounded bg-[#00090a] text-primary mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Investor Highlights Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-secondary border-b border-black/[0.03] pb-2">
                Diligence Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2.5 px-3 bg-white border border-black/[0.03] rounded-xl text-xs"
                  >
                    <span className="text-gray-450 font-sans font-medium">{item.label}</span>
                    <span className="font-mono font-bold text-secondary text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT HUB: Sticky Contact Concierge Form (Col span 5/12) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            
            {/* The Private Concierge Officer Card */}
            <div className="bg-[#00090a] text-white rounded-3xl p-6 border border-white/5 space-y-6 shadow-xl relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute right-0 bottom-0 text-white/5 select-none pointer-events-none translate-y-6 translate-x-3">
                <Landmark className="h-44 w-44" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-primary text-[10px] font-mono tracking-widest uppercase">
                  <span>Assigned Portfolio Officer</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full border-2 border-primary/45 overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80"
                      alt="Portfolio Officer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-white">Elizabeth Crovath, JD</h4>
                    <span className="text-[10px] text-primary font-mono block uppercase">Client Advisory Managing Partner</span>
                  </div>
                </div>

                <div className="h-[1px] bg-white/10 w-full" />

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-300">Representation Directive</h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    By requesting direct tour representation with Elizabeth, your security protocol, title-deed search histories and identity parameters undergo private escrow confidentiality rules.
                  </p>
                </div>

                {/* TWO CORE REPLACEMENT ACTION CALL CTAs */}
                <div className="space-y-3 pt-4">
                  {/* Whatsapp CTA button */}
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold uppercase tracking-wider text-xs py-4 rounded-2xl flex items-center justify-center gap-2.5 duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    id="btn-whatsapp-chat"
                  >
                    <MessageCircle className="h-4 w-4 fill-current" />
                    <span>WhatsApp Luxury Chat</span>
                  </a>

                  {/* Phone Call CTA button */}
                  <a
                    href="tel:+18005552768"
                    className="w-full bg-primary hover:bg-[#00e1ff] text-secondary font-extrabold uppercase tracking-wider text-xs py-4 rounded-2xl flex items-center justify-center gap-2.5 duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    id="btn-phone-call"
                  >
                    <Phone className="h-4 w-4 fill-none" />
                    <span>Call Concierge Officer</span>
                  </a>
                </div>

                <p className="text-[9px] text-center text-gray-500 font-sans tracking-wide">
                  Calls strictly recorded for compliance security. Instant WhatsApp replies expected inside 4 minutes.
                </p>
              </div>
            </div>

            {/* Copyable share banner */}
            <div className="bg-white rounded-2xl border border-black/[0.03] p-4 flex items-center justify-between text-xs">
              <span className="text-gray-405 font-sans">Share Private Holdings URL:</span>
              <button
                onClick={handleShare}
                className="text-primary hover:underline font-bold text-[10px] uppercase tracking-wider cursor-pointer"
              >
                {copiedLink ? 'Copied to Clipboard' : 'Copy Share Link'}
              </button>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
