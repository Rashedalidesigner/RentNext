import React, { useState, useMemo } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../lib/image';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Building,
  Grid,
  Map as MapIcon,
  List,
  RotateCcw,
  Sparkles,
  Bed,
  Bath,
  Check,
  X,
  ChevronDown,
  DollarSign,
  Dog,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/common/PropertyCard';
import { PropertySkeleton } from '../components/common/PropertySkeleton';
import { MapView } from '../components/common/MapView';
import { AMENITIES_LIST } from '../data/amenities';
import { Property } from '../types';

export const PropertiesView: React.FC = () => {
  const { properties, filters, setFilters, resetFilters, navigateTo } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'split_map' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);

  // Trigger brief realistic filter transition
  const handleFilterChange = (updates: Partial<typeof filters>) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, ...updates }));
    setTimeout(() => {
      setIsLoading(false);
    }, 150);
  };

  // Multi-select amenity toggle
  const toggleAmenity = (amenityId: string) => {
    const exists = filters.amenities.includes(amenityId);
    const updated = exists
      ? filters.amenities.filter((id) => id !== amenityId)
      : [...filters.amenities, amenityId];
    handleFilterChange({ amenities: updated });
  };

  // Filter and Sort properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Must be approved by admin
      if (!prop.isApproved) return false;

      // Available only filter
      if (filters.availableOnly && !prop.isAvailable) return false;

      // Pet friendly
      if (filters.petsAllowedOnly && !prop.rules.petsAllowed) return false;

      // Search keyword (title, description, location)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(query);
        const matchDesc = prop.description.toLowerCase().includes(query);
        const matchCity = prop.location.city.toLowerCase().includes(query);
        const matchNeigh = prop.location.neighborhood.toLowerCase().includes(query);
        const matchAddress = prop.location.address.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCity && !matchNeigh && !matchAddress) {
          return false;
        }
      }

      // City filter
      if (filters.city !== 'All' && filters.city !== '') {
        if (!prop.location.city.toLowerCase().includes(filters.city.toLowerCase())) {
          return false;
        }
      }

      // Property type filter
      if (filters.propertyType !== 'all') {
        if (prop.propertyType !== filters.propertyType) {
          return false;
        }
      }

      // Price range
      if (prop.price < filters.minPrice || prop.price > filters.maxPrice) {
        return false;
      }

      // Bedrooms
      if (filters.bedrooms !== 'any') {
        if (filters.bedrooms === '0' && prop.bedrooms !== 0) return false;
        if (filters.bedrooms === '1' && prop.bedrooms !== 1) return false;
        if (filters.bedrooms === '2' && prop.bedrooms !== 2) return false;
        if (filters.bedrooms === '3+' && prop.bedrooms < 3) return false;
      }

      // Bathrooms
      if (filters.bathrooms !== 'any') {
        if (filters.bathrooms === '1' && prop.bathrooms < 1) return false;
        if (filters.bathrooms === '2' && prop.bathrooms < 2) return false;
        if (filters.bathrooms === '3+' && prop.bathrooms < 3) return false;
      }

      // Amenities (must have all selected amenities)
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((aId) =>
          prop.amenities.includes(aId)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.price - b.price;
      if (filters.sortBy === 'price_high') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0); // Recommended
    });
  }, [properties, filters]);

  const activeFiltersCount =
    (filters.city !== 'All' ? 1 : 0) +
    (filters.propertyType !== 'all' ? 1 : 0) +
    (filters.maxPrice < 10000 ? 1 : 0) +
    (filters.bedrooms !== 'any' ? 1 : 0) +
    (filters.bathrooms !== 'any' ? 1 : 0) +
    filters.amenities.length +
    (filters.petsAllowedOnly ? 1 : 0) +
    (filters.availableOnly ? 1 : 0);

  const FilterSidebarContent = (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* City Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Location</span>
        </label>
        <select
          value={filters.city}
          onChange={(e) => handleFilterChange({ city: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="All">All Locations & Cities</option>
          <option value="New York">New York (Tribeca & Manhattan)</option>
          <option value="Brooklyn">Brooklyn, NY</option>
          <option value="San Francisco">San Francisco, CA</option>
          <option value="Austin">Austin, TX</option>
          <option value="Miami">Miami, FL</option>
          <option value="Chicago">Chicago, IL</option>
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>Property Category</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['all', 'apartment', 'condo', 'townhouse', 'villa', 'studio', 'house'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleFilterChange({ propertyType: type })}
              className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize text-center transition-all ${
                filters.propertyType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>Monthly Budget</span>
          </label>
          <span className="text-xs font-bold text-blue-700">
            Up to ${filters.maxPrice.toLocaleString()} / mo
          </span>
        </div>
        <input
          type="range"
          min={1000}
          max={10000}
          step={250}
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[11px] text-slate-600 mt-1">
          <span>$1,000</span>
          <span>$5,000</span>
          <span>$10,000+</span>
        </div>
      </div>

      {/* Bedrooms Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Bed className="w-3.5 h-3.5 text-blue-600" />
          <span>Bedrooms</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Any', val: 'any' },
            { label: 'Studio', val: '0' },
            { label: '1 Bed', val: '1' },
            { label: '2 Beds', val: '2' },
            { label: '3+ Beds', val: '3+' },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => handleFilterChange({ bedrooms: item.val })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                filters.bedrooms === item.val
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Bath className="w-3.5 h-3.5 text-blue-600" />
          <span>Bathrooms</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Any', val: 'any' },
            { label: '1+ Bath', val: '1' },
            { label: '2+ Baths', val: '2' },
            { label: '3+ Baths', val: '3+' },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => handleFilterChange({ bathrooms: item.val })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                filters.bathrooms === item.val
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-800 transition-colors">
          <span className="flex items-center gap-2">
            <Dog className="w-4 h-4 text-blue-600" />
            <span>Pet-Friendly Units Only</span>
          </span>
          <input
            type="checkbox"
            checked={filters.petsAllowedOnly}
            onChange={(e) => handleFilterChange({ petsAllowedOnly: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-800 transition-colors">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Available Immediately</span>
          </span>
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) => handleFilterChange({ availableOnly: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
      </div>

      {/* Amenities Multi-Checkboxes */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Must-Have Amenities
        </label>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {AMENITIES_LIST.map((amenity) => {
            const isChecked = filters.amenities.includes(amenity.id);
            return (
              <label
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer select-none transition-all ${
                  isChecked
                    ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{amenity.label}</span>
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                    isChecked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Search by neighborhood, street, or keywords..."
            className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center & Right Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="recommended">Featured & Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Listed</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('split_map')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'split_map'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Map & List Split View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs sticky top-28">
          {FilterSidebarContent}
        </aside>

        {/* Results Column */}
        <main className="lg:col-span-3 space-y-6">
          {/* Results Summary Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              Showing <strong className="text-blue-700">{filteredProperties.length}</strong>{' '}
              verified rental {filteredProperties.length === 1 ? 'property' : 'properties'}
            </p>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <PropertySkeleton key={i} />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            /* Empty State Fallback */
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto my-12">
              <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No properties match your filters</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Try widening your price range, choosing a different location, or clearing specific amenities.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'split_map' ? (
            /* Split Map & Cards View */
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2">
                {filteredProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} compact={true} />
                ))}
              </div>
              <div className="h-[450px] xl:h-[750px] sticky top-28">
                <MapView
                  properties={filteredProperties}
                  selectedProperty={selectedMapProperty}
                  onSelectProperty={setSelectedMapProperty}
                />
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* Compact List View */
            <div className="space-y-4">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => navigateTo({ path: '/properties/:id', params: { id: prop.id } })}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 cursor-pointer group"
                >
                  <img
                    src={safeImage(prop.images?.[0])}
                    alt={prop.title}
                    className="w-full sm:w-48 h-36 rounded-xl object-cover group-hover:scale-102 transition-transform"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold text-slate-900">
                          ${prop.price.toLocaleString()}
                          <span className="text-xs text-slate-500 font-normal"> / mo</span>
                        </span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                          ★ {prop.rating.toFixed(1)}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {prop.location.neighborhood}, {prop.location.city} • Hosted by {prop.landlordName}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{prop.bedrooms === 0 ? 'Studio' : `${prop.bedrooms} Beds`} • {prop.bathrooms} Baths • {prop.areaSqFt} sqft</span>
                      <span className="text-blue-700 font-semibold">View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Standard Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white min-h-screen p-6 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-base font-bold text-slate-900">Refine Search Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {FilterSidebarContent}
            <div className="sticky bottom-0 bg-white pt-4 border-t border-slate-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors"
              >
                Apply Filters ({filteredProperties.length} Homes)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
