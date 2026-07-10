import React, { useState, useMemo } from 'react';
import { MapPin, ZoomIn, ZoomOut, Maximize2, ShieldCheck, ArrowUpRight, Info, Check, Eye } from 'lucide-react';
import { Property } from '../types';

interface PropertyMapViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  selectedPropertiesForCompare: string[];
  onToggleCompare: (property: Property) => void;
}

export default function PropertyMapView({ 
  properties, 
  onSelectProperty,
  selectedPropertiesForCompare,
  onToggleCompare
}: PropertyMapViewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map coordinates (relative percentage coordinates) for various regions
  const getCoordinates = (locationStr: string): { x: number; y: number; region: string } => {
    const loc = locationStr.toLowerCase();
    if (loc.includes('malibu') || loc.includes('california') || loc.includes('beverly hills') || loc.includes('trousdale')) {
      // California
      const isBeverly = loc.includes('beverly') || loc.includes('trousdale');
      return { x: 22 + (isBeverly ? 1.5 : 0), y: 44 + (isBeverly ? 1.5 : 0), region: 'West Coast, US' };
    }
    if (loc.includes('manhattan') || loc.includes('new york') || loc.includes('park avenue')) {
      // New York
      return { x: 38, y: 38, region: 'East Coast, US' };
    }
    if (loc.includes('boston') || loc.includes('massachusetts')) {
      // Boston
      return { x: 40, y: 35, region: 'New England, US' };
    }
    if (loc.includes('dubai') || loc.includes('jumeirah') || loc.includes('palm')) {
      // Dubai
      return { x: 68, y: 48, region: 'Middle East' };
    }
    if (loc.includes('aspen') || loc.includes('colorado') || loc.includes('ridge')) {
      // Colorado
      return { x: 28, y: 40, region: 'Rocky Mountains, US' };
    }
    if (loc.includes('lagos')) {
      // Lagos, Nigeria
      return { x: 50, y: 58, region: 'West Africa (Lagos)' };
    }
    if (loc.includes('abuja')) {
      // Abuja, Nigeria
      return { x: 52, y: 55, region: 'West Africa (Abuja)' };
    }
    // Fallback: pseudo-random coordinates based on ID string
    return { x: 45, y: 45, region: 'Global Portfolio' };
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const nextZoom = Math.max(prev - 0.25, 1);
      if (nextZoom === 1) {
        setPanOffset({ x: 0, y: 0 }); // reset pan on full zoom-out
      }
      return nextZoom;
    });
  };

  // Mouse drag panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const formatPrice = (value: number, currency?: 'USD' | 'NGN') => {
    const isNaira = currency === 'NGN';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: isNaira ? 'NGN' : 'USD',
      maximumFractionDigits: 0
    }).format(value).replace('NGN', '₦');
  };

  const activeProperty = useMemo(() => {
    return properties.find(p => p.id === activePropertyId) || null;
  }, [properties, activePropertyId]);

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[550px] flex flex-col md:flex-row text-white">
      
      {/* Map Sidebar: Active Property Detail / Instructions */}
      <div className="w-full md:w-80 bg-slate-950/80 backdrop-blur-md p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between text-left shrink-0 z-25 relative">
        <div>
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-2">
            Tactical Survey Deck
          </span>
          <h3 className="text-lg font-extrabold text-white tracking-tight mb-4">
            Interactive Global Portfolio Map
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Explore premium land acquisitions, commercial high-rises, and private villas positioned across primary sovereign locations.
          </p>

          {activeProperty ? (
            <div className="space-y-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 animate-fade-in">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img 
                  src={activeProperty.image} 
                  alt={activeProperty.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-slate-950/90 text-primary text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-850">
                  {activeProperty.type}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-mono block">
                  {activeProperty.location}
                </span>
                <h4 className="font-extrabold text-sm text-white">
                  {activeProperty.title}
                </h4>
                <div className="text-base font-extrabold text-primary font-mono">
                  {formatPrice(activeProperty.price, activeProperty.currency)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] text-gray-400">
                <div>
                  <span className="text-[9px] block uppercase text-gray-500">Size</span>
                  <span className="font-bold text-white">{activeProperty.size} sqft</span>
                </div>
                <div>
                  <span className="text-[9px] block uppercase text-gray-500">Beds / Baths</span>
                  <span className="font-bold text-white">
                    {activeProperty.type === 'Commercial' ? 'Commercial' : `${activeProperty.bedrooms}B / ${activeProperty.bathrooms}B`}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onSelectProperty(activeProperty)}
                  className="w-full bg-primary hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider text-[10px] py-2.5 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Full Asset Details
                </button>
                
                <button
                  onClick={() => onToggleCompare(activeProperty)}
                  className={`w-full font-bold uppercase tracking-wider text-[10px] py-2 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedPropertiesForCompare.includes(activeProperty.id)
                      ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-slate-750 text-white'
                  }`}
                >
                  {selectedPropertiesForCompare.includes(activeProperty.id) ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      In Comparison
                    </>
                  ) : (
                    <>
                      <span>+ Compare side-by-side</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/30 p-5 rounded-2xl border border-dashed border-slate-800 text-center py-12">
              <div className="h-8 w-8 rounded-full bg-slate-850 flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Select a map pin to display exclusive real estate metrics.</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-850 flex items-center gap-2 text-[10px] text-gray-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Real-time GPS synchronization.</span>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div 
        className={`flex-1 relative bg-slate-950 overflow-hidden select-none cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        id="interactive-vector-map-frame"
      >
        {/* Background Coordinates Grid Overlay */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none opacity-20">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-slate-800 text-[8px] font-mono p-1 text-slate-700 select-none">
              {i % 12}:{Math.floor(i / 12)}
            </div>
          ))}
        </div>

        {/* Map Canvas with zoom and panning offsets */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center'
          }}
        >
          {/* Abstract SVG Outlines of Continents/Regions to make it look highly stylized */}
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 800 500" fill="none">
            {/* North America outline block */}
            <path d="M100 120 L280 100 L320 200 L280 280 L220 310 L150 250 L120 180 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
            <text x="180" y="160" className="fill-slate-500 font-bold text-[10px] tracking-widest uppercase">North America</text>
            
            {/* Europe & Middle East outline block */}
            <path d="M420 120 L580 110 L640 220 L580 320 L480 300 L440 200 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
            <text x="510" y="150" className="fill-slate-500 font-bold text-[10px] tracking-widest uppercase">Europe & ME</text>
            
            {/* Africa outline block */}
            <path d="M410 240 L500 240 L540 320 L480 430 L420 380 L380 300 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
            <text x="440" y="320" className="fill-slate-500 font-bold text-[10px] tracking-widest uppercase">Africa</text>
          </svg>

          {/* Coordinate Circles representing general boundaries */}
          <div className="absolute top-[42%] left-[23%] h-48 w-48 rounded-full border border-primary/10 bg-primary/2 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-[48%] left-[68%] h-40 w-40 rounded-full border border-primary/10 bg-primary/2 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-[58%] left-[51%] h-40 w-40 rounded-full border border-primary/10 bg-primary/2 pointer-events-none -translate-x-1/2 -translate-y-1/2" />

          {/* Coordinate grid lines label */}
          <span className="absolute bottom-4 left-6 text-[9px] font-mono text-slate-500">LAT RANGE: 4.8612° N - 51.5074° N</span>
          <span className="absolute bottom-4 right-6 text-[9px] font-mono text-slate-500">LON RANGE: 118.2437° W - 55.2708° E</span>

          {/* Plotting coordinate pins for each filtered property */}
          {properties.map((prop) => {
            const coords = getCoordinates(prop.location);
            const isActive = prop.id === activePropertyId;
            const inCompare = selectedPropertiesForCompare.includes(prop.id);

            return (
              <div
                key={prop.id}
                className="absolute transition-all duration-300 z-20 cursor-pointer"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePropertyId(prop.id);
                }}
              >
                {/* Visual coordinate pin */}
                <div className="relative group/pin">
                  {/* Decorative pulse ring around active or hovered pin */}
                  <div className={`absolute inset-0 rounded-full bg-primary/40 -m-3 animate-ping duration-1000 ${
                    isActive ? 'scale-150 opacity-100' : 'opacity-0 group-hover/pin:opacity-50'
                  }`} />

                  {/* The main core marker */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary border-slate-900 text-slate-900 scale-110' 
                      : inCompare
                        ? 'bg-emerald-600 border-white text-white'
                        : 'bg-slate-900 border-primary text-primary hover:bg-primary hover:text-slate-900'
                  }`}>
                    {inCompare ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4.5 w-4.5" />
                    )}
                  </div>

                  {/* Mini price tag above/beside marker */}
                  <div className={`absolute left-9 top-1 bg-slate-950/95 border border-slate-800 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded shadow-xl pointer-events-none whitespace-nowrap transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-60 group-hover/pin:opacity-100'
                  }`}>
                    {formatPrice(prop.price, prop.currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map In-Screen HUD Controls */}
        <div className="absolute bottom-6 right-6 z-25 flex items-center gap-2 bg-slate-950/90 border border-slate-800 p-2 rounded-2xl shadow-lg backdrop-blur-md">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel === 1}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white disabled:opacity-40 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-[10px] font-mono text-gray-300 w-12 text-center select-none">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.5}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white disabled:opacity-40 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Floating guide badge when zoomed */}
        {zoomLevel > 1 && (
          <div className="absolute top-6 left-6 z-25 bg-primary/10 border border-primary/25 backdrop-blur-md text-primary text-[10px] font-bold px-3 py-1.5 rounded-full animate-pulse flex items-center gap-1.5 shadow-md">
            <Info className="h-3.5 w-3.5" />
            <span>Map Zoomed: Drag to Pan Geographic Deck</span>
          </div>
        )}
      </div>

    </div>
  );
}
