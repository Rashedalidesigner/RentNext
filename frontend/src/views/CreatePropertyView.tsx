import React, { useState, useEffect } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../lib/image';
import {
  ArrowLeft,
  Building2,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Square,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AMENITIES_LIST } from '../data/amenities';
import { Property, PropertyType } from '../types';
import { api } from '../lib/api';

interface CreatePropertyViewProps {
  editPropertyId?: string;
}



export const CreatePropertyView: React.FC<CreatePropertyViewProps> = ({ editPropertyId }) => {
  const { properties, addProperty, updateProperty, navigateTo, currentUser } = useApp();

  const isEdit = Boolean(editPropertyId);
  const existingProp = isEdit ? properties.find((p) => p.id === editPropertyId) : undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [areaSqFt, setAreaSqFt] = useState(0);
  const [minLeaseMonths, setMinLeaseMonths] = useState(12);
  const [petsAllowed, setPetsAllowed] = useState(true);
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    api.categories().then((r:any) => setCategories(Array.isArray(r?.data?.data) ? r.data.data : Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : [])).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (existingProp) {
      setTitle(existingProp.title);
      setDescription(existingProp.description);
      setPropertyType(existingProp.propertyType);
      setCategoryId((existingProp as any).categoryId || '');
      setPrice(existingProp.price.toString());
      setDeposit(existingProp.deposit.toString());
      setAddress(existingProp.location.address);
      setCity(existingProp.location.city);
      setState(existingProp.location.state);
      setZipCode(existingProp.location.zipCode);
      setNeighborhood(existingProp.location.neighborhood);
      setBedrooms(existingProp.bedrooms);
      setBathrooms(existingProp.bathrooms);
      setAreaSqFt(existingProp.areaSqFt);
      setMinLeaseMonths(existingProp.rules.minLeaseMonths);
      setPetsAllowed(existingProp.rules.petsAllowed);
      setSmokingAllowed(existingProp.rules.smokingAllowed);
      setSelectedAmenities(existingProp.amenities);
      setImages(existingProp.images);
      setIsAvailable(existingProp.isAvailable);
    }
  }, [existingProp]);

  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImages = images;

    if (isEdit && existingProp) {
      updateProperty(existingProp.id, {
        category_id: categoryId,
        title,
        description,
        propertyType,
        price: Number(price),
        deposit: Number(deposit),
        location: {
          ...existingProp.location,
          address,
          city,
          state,
          zipCode,
          neighborhood,
        },
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        areaSqFt: Number(areaSqFt),
        rules: {
          minLeaseMonths: Number(minLeaseMonths),
          petsAllowed,
          smokingAllowed,
          partiesAllowed: false,
        },
        amenities: selectedAmenities,
        images: finalImages,
        isAvailable,
      });
      navigateTo({ path: '/dashboard/landlord' });
    } else {
      addProperty({
        category_id: categoryId,
        title,
        description,
        propertyType,
        price: Number(price),
        deposit: Number(deposit),
        location: {
          address,
          city,
          state,
          zipCode,
          neighborhood,
          lat: 40.7128 + (Math.random() - 0.5) * 0.05,
          lng: -74.006 + (Math.random() - 0.5) * 0.05,
        },
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        areaSqFt: Number(areaSqFt),
        rules: {
          minLeaseMonths: Number(minLeaseMonths),
          petsAllowed,
          smokingAllowed,
          partiesAllowed: false,
        },
        amenities: selectedAmenities,
        images: finalImages,
        isAvailable: true,
        isFeatured: false,
      });
      navigateTo({ path: '/dashboard/landlord' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo({ path: '/dashboard/landlord' })}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landlord Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEdit ? 'Edit Rental Listing' : 'Create New Rental Listing'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Provide accurate details, terms, high-resolution photos, and amenities for tenant review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>1. Basic Property Details</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Listing Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Sunlit Loft in Tribeca"
                className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Property Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  required
                >
                  <option value="">Select a backend category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Living Space (Sq Ft) *
                </label>
                <input
                  type="number"
                  min={150}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Property Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key features, architectural highlights, natural lighting, and transit proximity..."
                className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
            </div>
          </div>

          {/* Section 2: Pricing & Terms */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span>2. Financial & Lease Terms</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Monthly Rent ($ USD) *
                </label>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Refundable Security Deposit ($ USD) *
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Minimum Lease Duration (Months)
                </label>
                <select
                  value={minLeaseMonths}
                  onChange={(e) => setMinLeaseMonths(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value={1}>1 Month (Flexible)</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months (Annual)</option>
                  <option value={24}>24 Months (Multi-Year)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>3. Location & Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Neighborhood / District
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Zip Code *
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Specs & Layout */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Bed className="w-4 h-4 text-blue-600" />
              <span>4. Bed & Bath Specs</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value={0}>0 (Studio)</option>
                  <option value={1}>1 Bedroom</option>
                  <option value={2}>2 Bedrooms</option>
                  <option value={3}>3 Bedrooms</option>
                  <option value={4}>4 Bedrooms</option>
                  <option value={5}>5+ Bedrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bathrooms
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value={1}>1 Bathroom</option>
                  <option value={1.5}>1.5 Bathrooms</option>
                  <option value={2}>2 Bathrooms</option>
                  <option value={2.5}>2.5 Bathrooms</option>
                  <option value={3}>3+ Bathrooms</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Amenities */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>5. Amenities & Features</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES_LIST.map((amenity) => {
                const checked = selectedAmenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center justify-between p-3 rounded-lg text-xs font-semibold border transition-all ${
                      checked
                        ? 'bg-blue-50 text-blue-900 border-blue-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{amenity.label}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center ${
                        checked ? 'bg-blue-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Photo Gallery */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>6. High-Resolution Photos</span>
            </h2>

            {/* Existing images list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group">
                  <img src={safeImage(img)} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white">
                      Cover Photo
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Image URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Image URL (https://...)"
                className="flex-1 p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Add Image
              </button>
            </div>

          </div>

          {/* Section 7: House Rules */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span>7. House Rules & Availability</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">Pets Allowed</p>
                  <p className="text-[11px] text-slate-600">Permits dogs, cats, or small pets</p>
                </div>
                <input
                  type="checkbox"
                  checked={petsAllowed}
                  onChange={(e) => setPetsAllowed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                >
                </input>
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">Smoking Allowed</p>
                  <p className="text-[11px] text-slate-600">Designated outdoor smoking</p>
                </div>
                <input
                  type="checkbox"
                  checked={smokingAllowed}
                  onChange={(e) => setSmokingAllowed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                >
                </input>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigateTo({ path: '/dashboard/landlord' })}
              className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              {isEdit ? 'Save Changes' : 'Publish Rental Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
