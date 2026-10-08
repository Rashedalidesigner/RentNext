import React, { useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../../lib/image';
import { ChevronLeft, ChevronRight, Grid, Maximize2, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const mainImages = Array.isArray(images) && images.some((img) => typeof img === 'string' && img.trim())
    ? images.filter((img) => typeof img === 'string' && img.trim())
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200'];

  const nextLightbox = () => {
    setActiveIdx((prev) => (prev + 1) % mainImages.length);
  };

  const prevLightbox = () => {
    setActiveIdx((prev) => (prev - 1 + mainImages.length) % mainImages.length);
  };

  return (
    <div className="space-y-3">
      {/* Modern 5-photo bento grid (Desktop) & Responsive Slider (Mobile) */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[460px] rounded-3xl overflow-hidden relative">
        {/* Main large photo */}
        <div
          onClick={() => {
            setActiveIdx(0);
            setIsLightboxOpen(true);
          }}
          className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden bg-slate-100"
        >
          <img
            src={safeImage(mainImages[0])}
            alt={`${title} - Main View`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
        </div>

        {/* 4 side photos */}
        {mainImages.slice(1, 5).map((img, idx) => (
          <div
            key={idx + 1}
            onClick={() => {
              setActiveIdx(idx + 1);
              setIsLightboxOpen(true);
            }}
            className="relative group cursor-pointer overflow-hidden bg-slate-100"
          >
            <img
              src={safeImage(img)}
              alt={`${title} - View ${idx + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
          </div>
        ))}

        {/* View All Photos Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 font-semibold text-xs shadow-lg hover:bg-white hover:scale-105 transition-all border border-slate-200/60"
        >
          <Grid className="w-4 h-4 text-blue-600" />
          <span>Show All {mainImages.length} Photos</span>
        </button>
      </div>

      {/* Mobile single image with carousel */}
      <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
        <img
          src={safeImage(mainImages[activeIdx])}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {mainImages.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              onClick={() => setActiveIdx((prev) => (prev - 1 + mainImages.length) % mainImages.length)}
              className="pointer-events-auto p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-900 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveIdx((prev) => (prev + 1) % mainImages.length)}
              className="pointer-events-auto p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-900 shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {activeIdx + 1} / {mainImages.length}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
            <div>
              <h4 className="text-sm sm:text-base font-bold">{title}</h4>
              <p className="text-xs text-slate-400">
                Photo {activeIdx + 1} of {mainImages.length}
              </p>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close photo gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Large Photo View */}
          <div className="relative flex-1 flex items-center justify-center my-4 max-w-5xl mx-auto w-full">
            <img
              src={safeImage(mainImages[activeIdx])}
              alt={`${title} - Lightbox ${activeIdx + 1}`}
              className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {mainImages.length > 1 && (
              <>
                <button
                  onClick={prevLightbox}
                  className="absolute left-2 p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-xl hover:scale-110 transition-all"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextLightbox}
                  className="absolute right-2 p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-xl hover:scale-110 transition-all"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="max-w-4xl mx-auto w-full flex items-center justify-center gap-2 overflow-x-auto py-2">
            {mainImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === activeIdx ? 'border-blue-500 scale-105 ring-2 ring-blue-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={safeImage(img)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
