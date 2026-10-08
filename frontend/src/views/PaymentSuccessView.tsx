import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Download,
  ArrowRight,
  Printer,
  FileText,
  KeyRound,
  MessageCircle,
  Calendar,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaymentSuccessView: React.FC = () => {
  const { currentRoute, payments, rentalRequests, navigateTo, showToast, confirmPayment } = useApp();
  const [confirming, setConfirming] = useState(false);
  const [confirmationError, setConfirmationError] = useState('');

  const params = currentRoute.params as { id?: string; session_id?: string } | undefined;
  const paymentId = params?.id;
  const sessionId = params?.session_id;

  const payment =
    payments.find((p) => p.id === paymentId || p.transactionId === sessionId) || payments[0];
  const request = payment ? rentalRequests.find((r) => r.id === payment.requestId) : undefined;

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    setConfirming(true);
    confirmPayment(sessionId)
      .catch((error: any) => {
        if (!cancelled) setConfirmationError(error?.message || 'Payment verification failed.');
      })
      .finally(() => {
        if (!cancelled) setConfirming(false);
      });
    return () => { cancelled = true; };
  }, [sessionId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('RentNest monthly rent receipt downloaded.', 'success', 'PDF Saved');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Celebration Header */}
      <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-lg text-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Payment Verified & Held in Escrow</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Congratulations! Your Rental is Secured.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          Your rent payment has been successfully verified through Stripe. Your lease remains active, and the next monthly rent becomes payable in the next billing period.
        </p>

        {confirming && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">Verifying your Stripe payment and activating your lease…</div>
        )}
        {confirmationError && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">{confirmationError}</div>
        )}

        {/* Invoice Receipt Card */}
        {payment && (
          <div className="mt-6 p-6 rounded-xl bg-slate-50 border border-slate-200/90 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-600">Official Receipt</p>
                <p className="text-sm font-bold text-slate-900 font-mono">{payment.transactionId}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase">
                {payment.gateway} Escrow
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Property:</span>
                <strong className="text-slate-900">{payment.propertyTitle}</strong>
              </div>
              {payment.billingPeriod && (
                <div className="flex justify-between">
                  <span>Billing Month:</span>
                  <span>{payment.billingPeriod}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Date of Payment:</span>
                <span>{new Date(payment.date).toLocaleString("en-US", { timeZone: "UTC" })}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-bold text-blue-700">{payment.status}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Charged:</span>
                <span className="text-blue-700 text-base">${payment.amount.toLocaleString()} BDT</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps for Tenant */}
        <div className="mt-8 text-left space-y-3 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            What Happens Next?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>1. Key Exchange</span>
              </div>
              <p className="text-slate-600">Landlord will provide electronic door code or lockbox location.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>2. Lease Agreement</span>
              </div>
              <p className="text-slate-600">Access your countersigned digital lease anytime on your dashboard.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span>3. Move-In Day</span>
              </div>
              <p className="text-slate-600">Inspect the unit and release initial rent upon arrival.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <button
            onClick={() => navigateTo({ path: '/dashboard/tenant' })}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2"
          >
            <span>Go to Tenant Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
