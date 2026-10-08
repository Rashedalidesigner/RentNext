import React, { useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../lib/image';
import {
  Search,
  MapPin,
  Home,
  Building,
  Sparkles,
  ShieldCheck,
  CreditCard,
  KeyRound,
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  Filter,
  Flame,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/common/PropertyCard';
import { PropertyType } from '../types';

export const HomeView: React.FC = () => {
  const { properties, navigateTo, setFilters } = useApp();

  const [searchCity, setSearchCity] = useState('All');
  const [searchType, setSearchType] = useState('all');
  const [searchMaxPrice, setSearchMaxPrice] = useState('10000');

  const featuredProperties = properties.filter((p) => p.isFeatured && p.isAvailable).slice(0, 6);
  const recentProperties = properties.slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      city: searchCity,
      propertyType: searchType,
      maxPrice: Number(searchMaxPrice),
    }));
    navigateTo({ path: '/properties' });
  };

  const handleCategoryClick = (type: PropertyType) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: type,
    }));
    navigateTo({ path: '/properties' });
  };

  const PROPERTY_CATEGORIES = [
    { type: 'apartment', label: 'Apartments', count: properties.filter((p) => p.propertyType === 'apartment').length, icon: Building, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop&q=80' },
    { type: 'condo', label: 'Condos', count: properties.filter((p) => p.propertyType === 'condo').length, icon: Home, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=80' },
    { type: 'townhouse', label: 'Townhouses', count: properties.filter((p) => p.propertyType === 'townhouse').length, icon: Building, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80' },
    { type: 'villa', label: 'Villas', count: properties.filter((p) => p.propertyType === 'villa').length, icon: Sparkles, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=80' },
    { type: 'studio', label: 'Studios', count: properties.filter((p) => p.propertyType === 'studio').length, icon: KeyRound, image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=500&auto=format&fit=crop&q=80' },
    { type: 'house', label: 'Houses', count: properties.filter((p) => p.propertyType === 'house').length, icon: Home, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
        {/* Background gradient blur */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-300/60 text-blue-800 text-xs font-bold tracking-wide uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen Rental Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Find & List Rental Properties with <span className="text-blue-600">Ease</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover verified apartments, lofts, and villas with direct tenant applications, landlord approval workflows, and secure digital payment protection.
            </p>
          </div>

          {/* Quick Search Bar Card */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200/90 relative z-10">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* City */}
              <div className="p-2 sm:border-r border-slate-200">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>City / Location</span>
                </label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Major Cities</option>
                  <option value="New York">New York, NY</option>
                  <option value="San Francisco">San Francisco, CA</option>
                  <option value="Brooklyn">Brooklyn, NY</option>
                  <option value="Austin">Austin, TX</option>
                  <option value="Miami">Miami, FL</option>
                  <option value="Chicago">Chicago, IL</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="p-2 sm:border-r border-slate-200">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Property Type</span>
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">Any Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="house">House</option>
                </select>
              </div>

              {/* Max Monthly Price */}
              <div className="p-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  <span>Budget (Max Rent)</span>
                </label>
                <select
                  value={searchMaxPrice}
                  onChange={(e) => setSearchMaxPrice(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="10000">Any Budget</option>
                  <option value="3000">Up to $3,000 / mo</option>
                  <option value="4000">Up to $4,000 / mo</option>
                  <option value="5000">Up to $5,000 / mo</option>
                  <option value="7500">Up to $7,500 / mo</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center sm:pl-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[48px] py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Rentals</span>
                </button>
              </div>
            </form>
          </div>

          {/* Value props badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              100% Verified Landlord Identities
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-sky-600" />
              Stripe & SSLCommerz Escrow
            </span>
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-500" />
              Fast Direct Lease Approvals
            </span>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Browse By Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Property Types
            </h2>
          </div>
          <button
            onClick={() => navigateTo({ path: '/properties' })}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PROPERTY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.type}
                onClick={() => handleCategoryClick(cat.type as PropertyType)}
                className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 p-3 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                  <img
                    src={safeImage(cat.image, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600')}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700">
                    {cat.label}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {cat.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Top Rated Listings
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Verified Rentals
            </h2>
          </div>
          <button
            onClick={() => navigateTo({ path: '/properties' })}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>Explore All ({properties.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* How RentNest Works (Dual Journey: Tenant & Landlord) */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative overflow-hidden shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Intuitive & Seamless
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How RentNest Simplifies Renting
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            A frictionless platform built for modern tenants, property owners, and community moderators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Tenant Flow Box */}
          <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-lg font-bold text-white">For Tenants</h3>
              </div>
              <span className="text-xs font-semibold text-blue-400 bg-blue-950/70 border border-blue-500/30 px-2.5 py-1 rounded-full">
                Zero Surprise Fees
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">1. Browse & Filter</strong>: Discover verified homes with photo galleries, amenities checklists, and upfront price breakdowns.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">2. Submit Rental Request</strong>: Pick your move-in date, lease term, and send your profile directly to the landlord.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">3. Pay & Move In</strong>: Once approved, pay securely via Stripe or SSLCommerz, receive key exchange details, and leave reviews.
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo({ path: '/properties' })}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white transition-colors"
            >
              Browse Available Rentals →
            </button>
          </div>

          {/* Landlord Flow Box */}
          <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-lg font-bold text-white">For Landlords</h3>
              </div>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/70 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                Full Management Hub
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">1. List in Minutes</strong>: Upload photo sets, set deposit and monthly rent terms, and toggle availability whenever occupied.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">2. Screen & Approve</strong>: Review tenant employment notes, credit indicators, and approve or reject with 1-click.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">3. Direct Payouts</strong>: Receive automated rental deposit releases into your bank account with complete transparency.
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo({ path: '/dashboard/landlord/properties/new' })}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-bold text-sm text-white transition-colors"
            >
              List Your Property Now →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials & Platform Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Community Trust
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Loved by Tenants and Landlords Alike
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "Finding our loft in Tribeca through RentNest was effortless. Sarah approved our request within 20 minutes, and paying the initial deposit through Stripe gave us total peace of mind."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="Verified tenant"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Verified tenant</p>
                <p className="text-[11px] text-slate-600">Verified Tenant (New York)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "As a property owner managing 4 units across Manhattan, the landlord dashboard saves me hours every week. The request approvals and instant notification system are top tier."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
                alt="Sarah Jenkins"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-[11px] text-slate-600">Superhost Landlord</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "The photo galleries and specs are 100% accurate. We relocated from Chicago to Austin and rented our villa sight unseen. The experience exceeded all expectations."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
                alt="Elena Rostova"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Elena Rostova</p>
                <p className="text-[11px] text-slate-600">Verified Tenant (Austin)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-blue-600 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to find your dream rental?
            </h3>
            <p className="text-sm sm:text-base text-blue-100 max-w-lg">
              Join thousands of verified renters and landlords on RentNest today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo({ path: '/properties' })}
              className="px-6 py-3 rounded-lg bg-white text-blue-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-sm hover:scale-105"
            >
              Browse Rentals
            </button>
            <button
              onClick={() => navigateTo({ path: '/auth/register' })}
              className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/40 transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
