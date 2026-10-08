import React, { useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../../lib/image';
import { Bed, Bath, Square, MapPin, Heart, Star, ShieldCheck, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { navigateTo, isPropertySaved, toggleSaveProperty } = useApp();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const saved = isPropertySaved(property.id);

  const handleCardClick = () => {
    navigateTo({ path: '/properties/:id', params: { id: property.id } });
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveProperty(property.id);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {property.images.length > 0 ? (
          <img src={safeImage(property.images?.[currentImgIndex])} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400"><Building2 className="w-14 h-14" /></div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {property.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-sm tracking-wide">
                FEATURED
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-white capitalize shadow-sm">
              {property.propertyType}
            </span>
          </div>

          <button
            onClick={handleFavoriteClick}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
              saved
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-900/60 hover:bg-slate-900/80 text-white hover:scale-110'
            }`}
            title={saved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Next / Prev Image Chevrons (visible on hover) */}
        {property.images.length > 1 && isHovered && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between z-10 pointer-events-none">
            <button
              onClick={handlePrevImage}
              className="pointer-events-auto p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md hover:scale-105 transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="pointer-events-auto p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md hover:scale-105 transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Carousel indicator dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {property.images.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImgIndex
                    ? 'w-4 bg-white shadow-sm'
                    : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Availability tag */}
        {!property.isAvailable && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-600 text-white shadow-lg">
              Currently Off-Market
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Price & Rating Header */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                ${property.price.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">/ month</span>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{property.rating.toFixed(1)}</span>
              <span className="text-slate-500 text-[11px]">({property.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-1 text-base">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {property.location.neighborhood}, {property.location.city}, {property.location.state}
            </span>
          </div>
        </div>

        {/* Specs Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1" title={`${property.bedrooms} Bedrooms`}>
            <Bed className="w-4 h-4 text-slate-400" />
            <span>{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Beds`}</span>
          </div>
          <div className="flex items-center gap-1" title={`${property.bathrooms} Bathrooms`}>
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1" title={`${property.areaSqFt} Sq Ft`}>
            <Square className="w-4 h-4 text-slate-400" />
            <span>{property.areaSqFt} sqft</span>
          </div>
        </div>

        {/* Landlord Preview footer (if not compact) */}
        {!compact && (
          <div className="pt-2.5 flex items-center justify-between text-xs border-t border-slate-50">
            <div className="flex items-center gap-2">
              <img
                src={safeImage(property.landlordAvatar, DEFAULT_AVATAR_IMAGE)}
                alt={property.landlordName}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="text-slate-600 truncate max-w-[120px] font-medium text-xs">
                {property.landlordName}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-blue-700 font-medium bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Verified Host</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
