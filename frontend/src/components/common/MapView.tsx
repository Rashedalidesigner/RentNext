import React, { useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../../lib/image';
import { MapPin, Navigation, Plus, Minus, Home, Star, X } from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onSelectProperty?: (property: Property | null) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
}) => {
  const { navigateTo } = useApp();
  const [activeProperty, setActiveProperty] = useState<Property | null>(selectedProperty || null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handlePinClick = (p: Property) => {
    setActiveProperty(p);
    if (onSelectProperty) onSelectProperty(p);
  };

  // Generate pseudo coordinates grid
  const getCoordinatesPosition = (prop: Property, index: number) => {
    // Map latitude / longitude or distributed grid
    const total = properties.length || 1;
    const col = (index % 4);
    const row = Math.floor(index / 4);

    const x = 18 + col * 22 + ((index * 7) % 8);
    const y = 22 + row * 28 + ((index * 11) % 10);

    return { top: `${Math.min(82, Math.max(12, y))}%`, left: `${Math.min(84, Math.max(10, x))}%` };
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex flex-col items-center justify-center select-none">
      {/* Visual map background styling */}
      <div
        className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      />

      {/* Decorative city blocks & water vectors */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,100 Q200,80 400,160 T800,120 T1200,240 L1200,600 L0,600 Z"
            fill="#0284c7"
            opacity="0.35"
          />
          <path
            d="M100,0 L350,600 M600,0 L750,600 M950,0 L1100,600"
            stroke="#475569"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            d="M0,220 L1200,180 M0,420 L1200,380"
            stroke="#475569"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200">
        <Navigation className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold">{properties.length} Properties in View</span>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Property Pins */}
      <div className="absolute inset-0 z-10">
        {properties.map((prop, idx) => {
          const isSelected = activeProperty?.id === prop.id;
          const pos = getCoordinatesPosition(prop, idx);

          return (
            <div
              key={prop.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
            >
              <button
                onClick={() => handlePinClick(prop)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-400/40 z-30'
                    : 'bg-slate-900/95 text-white hover:bg-blue-600 hover:scale-105 border border-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>${(prop.price / 1000).toFixed(1)}k</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Pin Preview Popover Card */}
      {activeProperty && (
        <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-80 z-30 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="relative">
            <button
              onClick={() => setActiveProperty(null)}
              className="absolute -top-1 -right-1 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white z-10"
              aria-label="Close preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex gap-3">
              <img
                src={safeImage(activeProperty.images?.[0])}
                alt={activeProperty.title}
                className="w-24 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      ${activeProperty.price.toLocaleString()}
                      <span className="text-[10px] font-normal text-slate-500">/mo</span>
                    </span>
                    <div className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{activeProperty.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                    {activeProperty.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {activeProperty.location.neighborhood}, {activeProperty.location.city}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigateTo({
                      path: '/properties/:id',
                      params: { id: activeProperty.id },
                    })
                  }
                  className="mt-1 w-full py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors border border-blue-100"
                >
                  View Details & Rent →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
