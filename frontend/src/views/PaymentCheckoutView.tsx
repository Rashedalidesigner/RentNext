"use client";

import React from 'react';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentModal } from '../components/payment/PaymentModal';

export const PaymentCheckoutView: React.FC<{ requestId: string }> = ({ requestId }) => {
  const { rentalRequests, navigateTo } = useApp();
  const request = rentalRequests.find((item) => item.id === requestId);

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-slate-900">Payment request not found</h1>
        <p className="mt-2 text-sm text-slate-600">The rental request may have been removed or is no longer available.</p>
        <button onClick={() => navigateTo({ path: '/dashboard/tenant' })} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigateTo({ path: '/dashboard/tenant' })} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to requests
      </button>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600"><CreditCard className="w-6 h-6" /></div>
            <div><h1 className="text-xl font-black text-slate-900">Complete your rental payment</h1><p className="text-sm text-slate-600">Secure checkout for your approved rental request.</p></div>
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="font-bold text-slate-900">{request.propertyTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{request.propertyLocation}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">First month</span><p className="font-bold">${request.totalRent.toLocaleString()}</p></div>
              <div><span className="text-slate-500">Deposit</span><p className="font-bold">${request.depositAmount.toLocaleString()}</p></div>
              <div><span className="text-slate-500">Service fee</span><p className="font-bold">${request.serviceFee.toLocaleString()}</p></div>
              <div><span className="text-slate-500">Total</span><p className="font-black text-blue-700">${request.totalInitialPayment.toLocaleString()}</p></div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <h2 className="mt-3 font-black text-emerald-950">Secure checkout</h2>
          <p className="mt-2 text-sm leading-6 text-emerald-900">Your payment is processed through the selected gateway. Never share your full card number or password with a landlord.</p>
        </div>
      </div>
      <PaymentModal request={request} isOpen onClose={() => navigateTo({ path: '/dashboard/tenant' })} />
    </div>
  );
};
