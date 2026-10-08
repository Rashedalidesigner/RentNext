import React, { useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../lib/image';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Heart,
  Share2,
  CheckCircle,
  MessageCircle,
  Phone,
  AlertCircle,
  Wifi,
  AirVent,
  Car,
  Shirt,
  Waves,
  Dumbbell,
  Utensils,
  Sun,
  Dog,
  ArrowLeft,
  DollarSign,
  Award,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyGallery } from '../components/properties/PropertyGallery';
import { RequestRentModal } from '../components/properties/RequestRentModal';
import { MapView } from '../components/common/MapView';
import { AMENITIES_LIST } from '../data/amenities';

interface PropertyDetailViewProps {
  propertyId: string;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ propertyId }) => {
  const {
    properties,
    reviews,
    isPropertySaved,
    toggleSaveProperty,
    navigateTo,
    currentUser,
    showToast,
  } = useApp();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(12);

  const property = properties.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Property Listing Not Found</h2>
        <p className="text-slate-600 text-sm">
          This rental property may have been removed or leased out.
        </p>
        <button
          onClick={() => navigateTo({ path: '/properties' })}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
        >
          Browse Available Rentals
        </button>
      </div>
    );
  }

  const saved = isPropertySaved(property.id);
  const propReviews = reviews.filter((r) => r.propertyId === property.id);

  const serviceFee = Math.round(property.price * 0.05);
  const totalInitial = property.price + property.deposit + serviceFee;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Listing URL copied to clipboard!', 'info', 'Link Copied');
  };

  const getAmenityIcon = (id: string) => {
    switch (id) {
      case 'wifi':
        return <Wifi className="w-4 h-4 text-blue-600" />;
      case 'ac':
        return <AirVent className="w-4 h-4 text-blue-600" />;
      case 'parking':
        return <Car className="w-4 h-4 text-blue-600" />;
      case 'laundry':
        return <Shirt className="w-4 h-4 text-blue-600" />;
      case 'pool':
        return <Waves className="w-4 h-4 text-blue-600" />;
      case 'gym':
        return <Dumbbell className="w-4 h-4 text-blue-600" />;
      case 'kitchen':
        return <Utensils className="w-4 h-4 text-blue-600" />;
      case 'balcony':
        return <Sun className="w-4 h-4 text-blue-600" />;
      case 'pets':
        return <Dog className="w-4 h-4 text-blue-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo({ path: '/properties' })}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Rentals</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Share listing"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => toggleSaveProperty(property.id)}
            className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {property.isFeatured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white tracking-wide">
              FEATURED EXCLUSIVE
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 capitalize">
            {property.propertyType}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 flex items-center gap-1 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Verified Listing</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {property.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {property.location.address}, {property.location.neighborhood}, {property.location.city},{' '}
              {property.location.state} {property.location.zipCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{property.rating.toFixed(2)}</span>
            </div>
            <span className="text-slate-600 font-medium">
              ({property.reviewsCount} verified reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <PropertyGallery images={property.images} title={property.title} />

      {/* Main Grid: Details (Left 2/3) vs Booking Widget (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start pt-4">
        {/* Left Column: Details, Specs, Amenities, Host, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Specs Bar */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-600">Bedrooms</p>
                <p className="text-sm font-bold text-slate-900">
                  {property.bedrooms === 0 ? 'Studio Suite' : `${property.bedrooms} Bedrooms`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                <Bath className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-600">Bathrooms</p>
                <p className="text-sm font-bold text-slate-900">{property.bathrooms} Baths</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                <Square className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-600">Living Area</p>
                <p className="text-sm font-bold text-slate-900">{property.areaSqFt} Sq Ft</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-600">Min. Lease</p>
                <p className="text-sm font-bold text-slate-900">
                  {property.rules.minLeaseMonths} Months
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">About This Residence</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Included Amenities & Perks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenityId) => {
                const item = AMENITIES_LIST.find((a) => a.id === amenityId);
                return (
                  <div
                    key={amenityId}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs"
                  >
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                      {getAmenityIcon(amenityId)}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {item ? item.label : amenityId}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Building House Rules & Leasing Terms */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leasing Rules & Terms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Pet Policy</span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    property.rules.petsAllowed
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {property.rules.petsAllowed ? 'Pets Allowed' : 'No Pets'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Smoking Policy</span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    property.rules.smokingAllowed
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {property.rules.smokingAllowed ? 'Allowed' : 'Non-Smoking'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Security Deposit</span>
                <span className="text-xs font-bold text-slate-900">
                  ${property.deposit.toLocaleString()} (Refundable)
                </span>
              </div>
            </div>
          </div>

          {/* Host & Landlord Profile Card */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Meet the Landlord</h2>
            <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="flex items-center sm:items-start gap-4 text-center sm:text-left">
                <img
                  src={safeImage(property.landlordAvatar, DEFAULT_AVATAR_IMAGE)}
                  alt={property.landlordName}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-blue-500 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-lg font-bold text-white">{property.landlordName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Superhost
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Host Rating: <strong className="text-amber-400">★ {property.landlordRating}</strong> • Response Time: <strong className="text-white">{property.landlordResponseTime}</strong>
                  </p>
                  <p className="text-xs text-slate-400 pt-1">
                    Direct rental approvals, transparent lease agreements, and fast emergency maintenance.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Apply to Rent
                </button>
              </div>
            </div>
          </div>

          {/* Location & Neighborhood Map */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Neighborhood Location</h2>
              <span className="text-xs font-semibold text-slate-600">
                {property.location.neighborhood}, {property.location.city}
              </span>
            </div>
            <div className="h-72 rounded-2xl overflow-hidden">
              <MapView properties={[property]} selectedProperty={property} />
            </div>
          </div>

          {/* Tenant Reviews Section */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Verified Tenant Reviews</span>
                  <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    ★ {property.rating.toFixed(2)} / 5.0
                  </span>
                </h2>
              </div>
            </div>

            {propReviews.length === 0 ? (
              <p className="text-xs text-slate-600 italic">
                No reviews yet for this listing. Be the first verified tenant to leave a review!
              </p>
            ) : (
              <div className="space-y-4">
                {propReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={safeImage(rev.tenantAvatar, DEFAULT_AVATAR_IMAGE)}
                          alt={rev.tenantName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-300"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{rev.tenantName}</h4>
                          <span className="text-[11px] text-slate-600">{rev.date} • Verified Stay</span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>

                    {rev.landlordReply && (
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border-l-4 border-blue-500 text-xs text-slate-700 space-y-1">
                        <p className="font-bold text-slate-900">Response from {property.landlordName}:</p>
                        <p className="italic">{rev.landlordReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking / Request CTA Card */}
        <div className="lg:col-span-1 lg:sticky lg:top-28">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-lg space-y-6">
            {/* Price Headline */}
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-3xl font-extrabold text-slate-900">
                  ${property.price.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-600"> / month</span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {property.isAvailable ? 'Available Now' : 'Pending Request'}
                </span>
              </div>
            </div>

            {/* Quick Pricing Calculator Preview */}
            <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span>First Month Rent:</span>
                <span className="font-semibold text-slate-900">${property.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit (Refundable):</span>
                <span className="font-semibold text-slate-900">${property.deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Service & Escrow Fee (5%):</span>
                <span className="font-semibold text-slate-900">${serviceFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Initial Amount:</span>
                <span className="text-blue-700 text-base">${totalInitial.toLocaleString()}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              id="cta-request-to-rent"
              onClick={() => setIsRequestModalOpen(true)}
              className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Request to Rent</span>
            </button>

            {/* Guarantees List */}
            <div className="space-y-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>No fee charged until landlord approves application</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>100% Refundable security deposit escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Direct communication with verified owner</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Application Modal */}
      <RequestRentModal
        property={property}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
};
