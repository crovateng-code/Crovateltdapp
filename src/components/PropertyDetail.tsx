import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, MapPin, BedDouble, Bath, Maximize2, ShieldCheck, Check, Sparkles, Compass, Landmark, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
}

export default function PropertyDetail({ property, onBack }: PropertyDetailProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Touch Swipe handlers for main inline gallery with horizontal swipe detection
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  // Touch Swipe handlers for Lightbox with horizontal swipe detection
  const [lightboxStartX, setLightboxStartX] = useState<number | null>(null);
  const [lightboxStartY, setLightboxStartY] = useState<number | null>(null);
  const [lightboxEndX, setLightboxEndX] = useState<number | null>(null);
  const [lightboxEndY, setLightboxEndY] = useState<number | null>(null);

  // Fallback if images array doesn't exist on Property
  const galleryImages = property.images && property.images.length > 0
    ? property.images
    : [property.image];

  const handlePrevLightbox = () => {
    setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextLightbox = () => {
    setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setTouchEndX(null);
    setTouchEndY(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null || touchStartY === null || touchEndY === null) return;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    
    // Ensure the swipe is primarily horizontal and exceeds the threshold
    if (absDiffX > 40 && absDiffX > absDiffY) {
      if (diffX > 0) {
        // Swiped left -> Next image
        setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
      } else {
        // Swiped right -> Previous image
        setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setTouchStartY(null);
    setTouchEndY(null);
  };

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    setLightboxStartX(e.targetTouches[0].clientX);
    setLightboxStartY(e.targetTouches[0].clientY);
    setLightboxEndX(null);
    setLightboxEndY(null);
  };

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    setLightboxEndX(e.targetTouches[0].clientX);
    setLightboxEndY(e.targetTouches[0].clientY);
  };

  const handleLightboxTouchEnd = () => {
    if (lightboxStartX === null || lightboxEndX === null || lightboxStartY === null || lightboxEndY === null) return;
    const diffX = lightboxStartX - lightboxEndX;
    const diffY = lightboxStartY - lightboxEndY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    
    // Ensure the swipe is primarily horizontal and exceeds the threshold
    if (absDiffX > 40 && absDiffX > absDiffY) {
      if (diffX > 0) {
        // Swiped left -> Next image
        handleNextLightbox();
      } else {
        // Swiped right -> Previous image
        handlePrevLightbox();
      }
    }
    setLightboxStartX(null);
    setLightboxEndX(null);
    setLightboxStartY(null);
    setLightboxEndY(null);
  };

  // Listen for escape and arrow key navigation when lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNextLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, lightboxIndex, galleryImages.length]);

  const formatPrice = (value: any) => {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    const isNaira = property.currency === 'NGN';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: isNaira ? 'NGN' : 'USD',
        maximumFractionDigits: 0
      }).format(num).replace('NGN', '₦');
    } catch (e) {
      return (isNaira ? '₦' : '$') + num.toLocaleString();
    }
  };

  // Generate customized WhatsApp query link or use configured link
  const generateWhatsAppLink = () => {
    if (property.whatsappLink) {
      if (property.whatsappLink.startsWith('http://') || property.whatsappLink.startsWith('https://')) {
        return property.whatsappLink;
      }
      // If it's just a number, clean it and construct link
      const cleanPhone = property.whatsappLink.replace(/[^0-9]/g, '');
      const text = `Greetings Crovation Limited, I am interested in exploring "${property.title}" located in ${property.location} (Listed at ${formatPrice(property.price)}). Please provide private access credentials and organize a schedule.`;
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    }
    const phone = '2348088727277'; // Crovation official line
    const text = `Greetings Crovation Limited, I am interested in exploring "${property.title}" located in ${property.location} (Listed at ${formatPrice(property.price)}). Please provide private access credentials and organize a schedule.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Amenities can be overridden by property.amenities
  // If property.amenities is explicitly provided, we use it. If it is empty, we hide the section.
  // If property.amenities is undefined (not set at all), we can fallback to default.
  const hasAmenities = property.amenities !== undefined ? property.amenities.filter(Boolean).length > 0 : true;
  const amenities = property.amenities !== undefined ? property.amenities.filter(Boolean) : (
    property.type === 'Commercial' ? [
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
    ]
  );

  // Diligence summary highlights
  const hasDiligence = property.diligenceSummary !== undefined 
    ? property.diligenceSummary.filter(item => item.label && item.value).length > 0 
    : true;
  const highlights = property.diligenceSummary !== undefined 
    ? property.diligenceSummary.filter(item => item.label && item.value) 
    : [
      { label: 'Asset ID', value: `CRV-${String(property.id || '').toUpperCase()}-2025` },
      { label: 'Financing Grade', value: Number(property.price) > 10000000 ? 'Sovereign Institutional' : 'Generational Private' },
      { label: 'Deed Category', value: 'Clean Title / Handover Ready' },
      { label: 'Taxation Level', value: 'Special LLC Structured Exemptions Ready' }
    ];

  return (
    <div className="pt-24 min-h-screen bg-brandbg text-[#000000] pb-16 text-left" id="property-detail-container">
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
            <span className="inline-flex items-center gap-1 bg-[#000000] text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span>{property.type} Space</span>
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full border shadow-sm ${
              (property.status || 'Available') === 'Available'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-rose-100 border-rose-300 text-rose-800'
            }`}>
              {(property.status || 'Available') === 'Available' ? 'Available' : 'Sold Out'}
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
            <div className="text-2xl md:text-3.5xl font-extrabold text-[#000000]">
              {formatPrice(property.price)}
            </div>
            <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1 md:justify-end">
              <ShieldCheck className="h-3.5 w-3.5" />
              Clean Deed Verified
            </span>
          </div>
        </div>

        {/* Interactive Luxury Photo Gallery Stage */}
        <div className="mb-12 space-y-4">
          <div 
            onClick={() => {
              setLightboxIndex(activeImageIndex);
              setIsLightboxOpen(true);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="group relative aspect-[16/9] bg-slate-100 rounded-3xl overflow-hidden border border-black/[0.04] shadow-md cursor-pointer touch-pan-y"
            title="Click to zoom / view full-screen lightbox (Swipe left/right on mobile)"
          >
            <img
              src={galleryImages[activeImageIndex]}
              alt={`${property.title} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
            
            {/* Ambient Dark Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Left: Quick Details Overlaid */}
            <div className="absolute bottom-5 left-5 z-10 hidden sm:block text-left">
              <span className="text-[9px] font-mono tracking-widest text-[#00e1ff] uppercase bg-black/40 px-2.5 py-1 rounded backdrop-blur-sm border border-white/5 font-semibold">
                Interactive Exhibition Frame
              </span>
              <h3 className="text-white text-lg font-bold drop-shadow-md mt-1">
                {property.title}
              </h3>
            </div>

            {/* On-screen visual hint for swipe on mobile */}
            <div className="absolute top-4 left-4 z-10 bg-[#000000]/85 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-md md:hidden animate-pulse">
              <span>← Swipe to Explore →</span>
            </div>

            {/* Floating Live counter badge */}
            <div className="absolute top-4 right-4 z-10 bg-[#000000]/85 backdrop-blur-md text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-md">
              <ZoomIn className="h-3.5 w-3.5 text-primary" />
              <span>{activeImageIndex + 1} / {galleryImages.length} Photos</span>
            </div>

            {/* Premium click Zoom action overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-[#000000]/90 text-white backdrop-blur-md text-xs font-extrabold uppercase tracking-widest px-5 py-3 rounded-2xl flex items-center gap-2 border border-white/10 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ZoomIn className="h-4 w-4 text-primary" />
                <span>Open Immersive Gallery Lightbox</span>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Angle Gallery Thumbnails Grid */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto pt-1">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-primary ring-4 ring-primary/25 scale-[1.03]' 
                      : 'border-transparent hover:border-black/20 brightness-75 hover:brightness-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${property.title} thumbnail preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {activeImageIndex === idx && (
                    <div className="absolute inset-0 bg-primary/15 flex items-center justify-center">
                      <div className="bg-primary text-secondary p-0.5 rounded-full">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
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
                  <span>{(Number(property.size) || 0).toLocaleString()} <span className="text-[10px] text-gray-400 font-light">sqft</span></span>
                </div>
              </div>
            </div>

            {/* Narrative Description Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-secondary border-b border-black/[0.03] pb-2">
                The Estate Overview
              </h3>
              <div 
                className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans description-rich-text space-y-3"
                dangerouslySetInnerHTML={{ __html: property.description || '' }}
              />
              <p className="text-xs md:text-sm text-gray-400 italic leading-relaxed font-sans border-t border-black/[0.02] pt-3">
                This unique legacy asset boasts custom exterior layouts specifically arranged with sun angles in mind. Seamless structural integrity coordinates directly with upscale materials to manifest timeless luxury. Extensive spatial tests have been executed under global standards to promise complete alignment.
              </p>
            </div>

            {/* Cinematic Tour Walkthrough Segment */}
            {property.videoLink && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-extrabold text-secondary border-b border-black/[0.03] pb-2">
                  Cinematic Private Tour & Walkthrough
                </h3>
                <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#000000] border border-black/[0.05] shadow-lg">
                  {(() => {
                    const embed = (() => {
                      const url = property.videoLink || '';
                      
                      // YouTube match
                      const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                      const ytMatch = url.match(ytRegex);
                      if (ytMatch && ytMatch[1]) {
                        return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0` };
                      }

                      // Vimeo match
                      const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
                      const vimeoMatch = url.match(vimeoRegex);
                      if (vimeoMatch && vimeoMatch[1]) {
                        return { type: 'vimeo', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
                      }

                      // Check if it's direct mp4, webm or ogg
                      if (url.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url.includes('/mp4') || url.includes('video/mp4')) {
                        return { type: 'direct', src: url };
                      }

                      return { type: 'generic', src: url };
                    })();

                    if (embed.type === 'youtube' || embed.type === 'vimeo') {
                      return (
                        <iframe
                          src={embed.src}
                          title={`${property.title} video cinematic tour`}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      );
                    } else if (embed.type === 'direct') {
                      return (
                        <video
                          src={embed.src}
                          controls
                          className="w-full h-full object-cover absolute inset-0"
                          poster={property.image}
                        />
                      );
                    } else {
                      // Fallback for general website/generic link - render a premium play link card
                      return (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#000000] to-slate-900 text-white">
                          <span className="text-[10px] font-mono tracking-widest text-[#00e1ff] uppercase font-bold mb-2">Private Stream Channel</span>
                          <h4 className="text-base font-bold mb-2">{property.title} Walkthrough Cinematic</h4>
                          <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">An exclusive, protected asset tour is hosted externally. Please launch the full video walkthrough stream to examine structural configurations.</p>
                          <a
                            href={property.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 bg-primary hover:bg-[#00e1ff] text-secondary text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <span>Launch Cinematic Virtual Tour</span>
                          </a>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}

            {/* Elite Premium Amenities list */}
            {hasAmenities && (
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
                      <div className="p-1 rounded bg-[#000000] text-primary mt-0.5 flex-shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investor Highlights Table */}
            {hasDiligence && (
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
            )}

            {/* Associate Representative / Property Lister details */}
            {property.listerName && (
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-secondary border-b border-black/[0.03] pb-2">
                  Associate Representative
                </h3>
                <div className="bg-slate-50 border border-black/[0.02] hover:border-black/[0.05] p-5 rounded-2xl transition duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#000000] text-primary h-11 w-11 rounded-xl flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                      {property.listerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1 text-left flex-1">
                      <h4 className="font-extrabold text-sm text-secondary tracking-tight">
                        {property.listerName}
                      </h4>
                      <p className="text-[10px] font-mono uppercase text-primary font-bold">
                        Property Lister & Advisor
                      </p>
                      {property.listerBio && (
                        <p className="text-xs text-slate-600 font-sans leading-relaxed pt-2.5 mt-2 border-t border-black/[0.03]">
                          {property.listerBio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT HUB: Sticky Contact Concierge Form (Col span 5/12) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            
            {/* The Private Concierge Officer Card */}
            <div className="bg-[#000000] text-white rounded-3xl p-6 border border-white/5 space-y-6 shadow-xl relative overflow-hidden">
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
                    href={property.phoneNumber ? `tel:${property.phoneNumber.replace(/[^0-9+]/g, '')}` : "tel:08088727277"}
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

      {/* IMMERSIVE FULL SCREEN LIGHTBOX ARCHITECTURAL EXHIBIT */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/98 text-white backdrop-blur-xl p-4 md:p-8 animate-fade-in focus:outline-none"
          tabIndex={0}
          id="lightbox-immersive-modal"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between py-3 border-b border-white/10 relative z-20">
            <div className="text-left">
              <span className="text-[9px] font-mono tracking-widest text-[#00e1ff] uppercase block font-semibold">
                High-Fidelity Virtual Tour
              </span>
              <h4 className="text-sm md:text-base font-extrabold text-white mt-0.5 uppercase tracking-wide">
                {property.title}
              </h4>
            </div>
            
            <div className="flex items-center gap-5">
              <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
                Photo {lightboxIndex + 1} of {galleryImages.length}
              </span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 ml-1 rounded-full bg-white/5 hover:bg-white/15 text-white cursor-pointer transition-all duration-200 hover:scale-105"
                title="Close Lightbox (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Central Spatial Stage */}
          <div className="relative flex-1 flex items-center justify-center my-6">
            
            {/* Prev Image Click Trigger Zone */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevLightbox();
              }}
              className="absolute left-2 md:left-6 p-4 rounded-full bg-black/40 hover:bg-[#000000] text-white border border-white/10 hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer z-35 backdrop-blur-sm"
              title="Previous Photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main Stage Image wrapper */}
            <div 
              onTouchStart={handleLightboxTouchStart}
              onTouchMove={handleLightboxTouchMove}
              onTouchEnd={handleLightboxTouchEnd}
              className="relative max-w-5xl max-h-[64vh] w-full h-full flex items-center justify-center select-none overflow-hidden rounded-2xl p-2 touch-pan-y"
            >
              <img
                src={galleryImages[lightboxIndex]}
                alt={`${property.title} view ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-500 ease-in-out"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next Image Click Trigger Zone */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextLightbox();
              }}
              className="absolute right-2 md:right-6 p-4 rounded-full bg-black/40 hover:bg-[#000000] text-white border border-white/10 hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer z-35 backdrop-blur-sm"
              title="Next Photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Row: Controls Guide & Inner Slides Carousel */}
          <div className="space-y-4 relative z-20">
            
            {/* Quick-Jump Mini Thumbnail Track */}
            {galleryImages.length > 1 && (
              <div className="flex justify-center items-center gap-2.5 overflow-x-auto py-2 px-4 max-w-xl mx-auto scrollbar-thin">
                {galleryImages.map((imgUrl, idx) => (
                   <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative w-16 md:w-20 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 cursor-pointer border ${
                      lightboxIndex === idx 
                        ? 'border-primary ring-2 ring-primary/40 scale-105 brightness-100' 
                        : 'border-white/10 brightness-50 hover:brightness-100 hover:scale-[1.02]'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Jump to photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Navigational Tooltip Guidance */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-[10px] text-gray-400 font-mono tracking-wider text-center">
              <span>Use desktop keyboard <kbd className="bg-white/10 border border-white/5 px-1 rounded text-gray-300 font-sans font-semibold">←</kbd> and <kbd className="bg-white/10 border border-white/5 px-1 rounded text-gray-300 font-sans font-semibold">→</kbd> keys</span>
              <span className="hidden sm:inline text-white/15">|</span>
              <span className="text-primary font-bold">Swipe left/right on mobile</span>
              <span className="hidden sm:inline text-white/15">|</span>
              <span>Press <kbd className="bg-white/10 border border-white/5 px-1.5 py-0.5 rounded text-gray-300 font-sans font-semibold">Esc</kbd> or X to close</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
