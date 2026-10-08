import React, { useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../../lib/image';
import {
  Building2,
  Heart,
  Menu,
  PlusCircle,
  Shield,
  User,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Home,
  CheckCircle,
  Bell,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRoute,
    navigateTo,
    logout,
    savedPropertyIds,
    rentalRequests,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Counts for badges
  const tenantActionCount = rentalRequests.filter(
    (r) => r.tenantId === currentUser?.id && r.status === 'APPROVED' && r.paymentStatus === 'UNPAID'
  ).length;

  const landlordPendingCount = rentalRequests.filter(
    (r) => r.landlordId === currentUser?.id && r.status === 'PENDING'
  ).length;

  const handleNav = (path: string, params?: Record<string, string>) => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);

    if (path === '/') navigateTo({ path: '/' });
    else if (path === '/properties') navigateTo({ path: '/properties' });
    else if (path === '/dashboard/tenant') navigateTo({ path: '/dashboard/tenant' });
    else if (path === '/dashboard/landlord') navigateTo({ path: '/dashboard/landlord' });
    else if (path === '/dashboard/landlord/properties/new')
      navigateTo({ path: '/dashboard/landlord/properties/new' });
    else if (path === '/dashboard/admin') navigateTo({ path: '/dashboard/admin' });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                R
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  RentNest
                </span>
                <span className="hidden sm:inline-block ml-2.5 text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase tracking-wider border border-slate-200/60">
                  {currentUser?.role === 'landlord'
                    ? 'Landlord Portal'
                    : currentUser?.role === 'admin'
                    ? 'Admin Console'
                    : currentUser?.role === 'tenant'
                    ? 'Tenant Portal'
                    : 'Property Market'}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => handleNav('/')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentRoute.path === '/'
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNav('/properties')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentRoute.path === '/properties'
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse Properties
              </button>

              {currentUser?.role === 'tenant' && (
                <button
                  onClick={() => handleNav('/dashboard/tenant')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentRoute.path.startsWith('/dashboard/tenant')
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>Tenant Dashboard</span>
                  {tenantActionCount > 0 && (
                    <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {tenantActionCount}
                    </span>
                  )}
                </button>
              )}

              {currentUser?.role === 'landlord' && (
                <button
                  onClick={() => handleNav('/dashboard/landlord')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentRoute.path.startsWith('/dashboard/landlord')
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>Landlord Hub</span>
                  {landlordPendingCount > 0 && (
                    <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                      {landlordPendingCount}
                    </span>
                  )}
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => handleNav('/dashboard/admin')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentRoute.path.startsWith('/dashboard/admin')
                      ? 'text-rose-600 bg-rose-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-rose-500" />
                  <span>Admin Panel</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right CTAs and User Profile */}
          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (currentUser?.role === 'tenant') {
                  navigateTo({ path: '/dashboard/tenant' });
                } else {
                  navigateTo({ path: '/properties' });
                }
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedPropertyIds.length}
                </span>
              )}
            </button>

            {/* Post Property CTA (Landlord or guest prompt) */}
            <button
              onClick={() => {
                if (currentUser?.role === 'landlord') {
                  navigateTo({ path: '/dashboard/landlord/properties/new' });
                } else {
                  navigateTo({ path: '/dashboard/landlord' });
                }
              }}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200/80"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>List Property</span>
            </button>

            {/* Auth / Profile Area */}
            {!currentUser && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileDropdownOpen(false);
                    navigateTo({ path: '/auth/login' });
                  }}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileDropdownOpen(false);
                    navigateTo({ path: '/auth/register' });
                  }}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all bg-white"
                >
                  <img
                    src={safeImage(currentUser.avatar, DEFAULT_AVATAR_IMAGE)}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize bg-blue-50 text-blue-700 border border-blue-100">
                          <CheckCircle className="w-3 h-3 text-blue-600" />
                          <span>{currentUser.role} Account</span>
                        </div>
                      </div>

                      <div className="py-1">
                        {currentUser.role === 'tenant' && (
                          <button
                            onClick={() => handleNav('/dashboard/tenant')}
                            className="w-full px-4 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-500" />
                            <span>My Tenant Dashboard</span>
                          </button>
                        )}

                        {currentUser.role === 'landlord' && (
                          <>
                            <button
                              onClick={() => handleNav('/dashboard/landlord')}
                              className="w-full px-4 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-500" />
                              <span>Landlord Overview</span>
                            </button>
                            <button
                              onClick={() => handleNav('/dashboard/landlord/properties/new')}
                              className="w-full px-4 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                            >
                              <PlusCircle className="w-4 h-4 text-blue-600" />
                              <span>Add New Rental</span>
                            </button>
                          </>
                        )}

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleNav('/dashboard/admin')}
                            className="w-full px-4 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <Shield className="w-4 h-4 text-rose-600" />
                            <span>Moderation Console</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleNav('/properties')}
                          className="w-full px-4 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                        >
                          <Home className="w-4 h-4 text-slate-500" />
                          <span>Browse Market</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full px-4 py-2 text-left text-xs sm:text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/properties')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700"
          >
            Browse Properties
          </button>
          {currentUser?.role === 'tenant' && (
            <button
              onClick={() => handleNav('/dashboard/tenant')}
              className="w-full text-left py-2 text-sm font-medium text-blue-600 font-semibold"
            >
              Tenant Dashboard
            </button>
          )}
          {currentUser?.role === 'landlord' && (
            <button
              onClick={() => handleNav('/dashboard/landlord')}
              className="w-full text-left py-2 text-sm font-medium text-blue-600 font-semibold"
            >
              Landlord Dashboard
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNav('/dashboard/admin')}
              className="w-full text-left py-2 text-sm font-medium text-rose-600 font-semibold"
            >
              Admin Moderation
            </button>
          )}
          <button
            onClick={() => handleNav('/dashboard/landlord/properties/new')}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 text-center block"
          >
            + Post a Rental Listing
          </button>
        </div>
      )}
    </header>
  );
};
