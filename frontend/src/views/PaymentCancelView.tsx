import React from 'react';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaymentCancelView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Payment Process Cancelled
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          You have cancelled the checkout transaction. No funds have been deducted from your card or mobile wallet.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 text-left">
        <p className="font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Your application remains APPROVED:</span>
        </p>
        <p>
          You can return to your Tenant Dashboard at any time to complete the initial escrow deposit and lock in your move-in date.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => navigateTo({ path: '/dashboard/tenant' })}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Tenant Dashboard</span>
        </button>

        <button
          onClick={() => navigateTo({ path: '/properties' })}
          className="px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm"
        >
          Browse Other Listings
        </button>
      </div>
    </div>
  );
};
