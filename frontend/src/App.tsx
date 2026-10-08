"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';

// Views
import { HomeView } from './views/HomeView';
import { PropertiesView } from './views/PropertiesView';
import { PropertyDetailView } from './views/PropertyDetailView';
import { TenantDashboardView } from './views/TenantDashboardView';
import { LandlordDashboardView } from './views/LandlordDashboardView';
import { CreatePropertyView } from './views/CreatePropertyView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { PaymentSuccessView } from './views/PaymentSuccessView';
import { PaymentCancelView } from './views/PaymentCancelView';
import { PaymentCheckoutView } from './views/PaymentCheckoutView';
import { AuthView } from './views/AuthView';

const MainRouter: React.FC = () => {
  const { currentRoute, currentUser, navigateTo } = useApp();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  // Route Dispatcher
  const renderCurrentView = () => {
    const path = currentRoute.path;
    const params = currentRoute.params || {};

    if (path === '/') {
      return <HomeView />;
    }

    if (path === '/properties') {
      return <PropertiesView />;
    }

    if (path === '/properties/:id' || path.startsWith('/properties/')) {
      const id = params.id || path.replace('/properties/', '');
      return <PropertyDetailView propertyId={id} />;
    }

    if (path === '/dashboard/tenant') {
      return <TenantDashboardView />;
    }

    if (path === '/dashboard/tenant/requests/:id/pay') {
      return <PaymentCheckoutView requestId={params.id || ''} />;
    }

    if (path === '/dashboard/landlord' || path === '/dashboard/landlord/requests') {
      return <LandlordDashboardView />;
    }

    if (path === '/dashboard/landlord/properties/new') {
      return <CreatePropertyView />;
    }

    if (path === '/dashboard/landlord/properties/:id/edit') {
      return <CreatePropertyView editPropertyId={params.id} />;
    }

    if (path === '/dashboard/admin') {
      if (!currentUser || String(currentUser.role).toLowerCase() !== 'admin') {
        return <HomeView />;
      }
      return <AdminDashboardView />;
    }

    if (path === '/payment/success') {
      return <PaymentSuccessView />;
    }

    if (path === '/payment/cancel') {
      return <PaymentCancelView />;
    }

    if (path === '/auth/login') {
      return <AuthView initialMode="login" />;
    }

    if (path === '/auth/register') {
      return <AuthView initialMode="register" />;
    }

    // Default Fallback
    return <HomeView />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Site Footer */}
      <Footer />

      {/* Global Toast Notification System */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
