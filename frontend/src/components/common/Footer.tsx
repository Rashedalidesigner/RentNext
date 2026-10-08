import React from 'react';
import { Building2, ShieldCheck, HeartHandshake, Zap, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                R
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                RentNest
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Find & list rental properties with ease. Verified listings, automated request workflows, secure digital payments, and landlord management tools.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Landlords
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5 text-blue-400" /> Stripe & SSLCommerz
              </span>
            </div>
          </div>

          {/* Column 2: Marketplace */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigateTo({ path: '/properties' })}
                  className="hover:text-white transition-colors"
                >
                  All Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo({ path: '/properties' })}
                  className="hover:text-white transition-colors"
                >
                  Apartments & Condos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo({ path: '/properties' })}
                  className="hover:text-white transition-colors"
                >
                  Luxury Townhouses
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo({ path: '/properties' })}
                  className="hover:text-white transition-colors"
                >
                  Pet-Friendly Rentals
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: For Landlords */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Landlords
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigateTo({ path: '/dashboard/landlord/properties/new' })}
                  className="hover:text-white transition-colors"
                >
                  List a Rental
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo({ path: '/dashboard/landlord' })}
                  className="hover:text-white transition-colors"
                >
                  Landlord Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo({ path: '/dashboard/landlord' })}
                  className="hover:text-white transition-colors"
                >
                  Screening & Requests
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo({ path: '/dashboard/landlord' })}
                  className="hover:text-white transition-colors"
                >
                  Direct Payouts
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Tenants & Safety */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Tenants & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigateTo({ path: '/dashboard/tenant' })}
                  className="hover:text-white transition-colors"
                >
                  Tenant Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo({ path: '/auth/register' })}
                  className="hover:text-white transition-colors"
                >
                  Create Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo({ path: '/dashboard/admin' })}
                  className="hover:text-white transition-colors"
                >
                  Admin & Moderation
                </button>
              </li>
              <li>
                <span className="text-slate-500">Security Guarantee</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getUTCFullYear()} RentNest Technologies, Inc. Assignment 5 Frontend Implementation.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 hover:text-slate-300 transition-colors">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Instant Request Routing
            </span>
            <span className="flex items-center gap-1 hover:text-slate-300 transition-colors">
              <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
              Zero-Hidden-Fee Guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
