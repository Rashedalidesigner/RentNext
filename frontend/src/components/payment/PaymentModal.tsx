import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  Loader2,
  Zap,
} from 'lucide-react';
import { RentalRequest } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentModalProps {
  request: RentalRequest;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ request, isOpen, onClose }) => {
  const { processPayment, navigateTo } = useApp();

  const [gateway, setGateway] = useState<'stripe' | 'sslcommerz'>('stripe');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(request.tenantName || '');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setIsProcessing(true);
      // Simulate gateway processing delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const payment = await processPayment(request.id, {
        gateway,
        cardLast4: cardNumber.replace(/\D/g, '').slice(-4) || '4242',
        cardBrand: gateway === 'stripe' ? 'Visa' : 'Mastercard',
      });

      setIsProcessing(false);
      onClose();

      // Navigate to dedicated success outcome page as required by assignment
      navigateTo({
        path: '/payment/success',
        params: { id: payment.id, session_id: payment.transactionId },
      });
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Payment processing failed. Please check your payment details.');
    }
  };

  const handleCancelPayment = () => {
    onClose();
    navigateTo({ path: '/payment/cancel', params: { id: request.id } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Gateway Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">{request.status === 'ACTIVE' ? `Monthly Rent${request.nextBillingPeriod ? ` • ${request.nextBillingPeriod}` : ''}` : 'Lease Deposit & First Month Rent'}</h3>
              <p className="text-xs text-slate-300">{request.propertyTitle}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-blue-400">
                ${request.totalInitialPayment.toLocaleString()}
              </span>
              <p className="text-[10px] text-slate-400">{request.status === 'ACTIVE' ? 'Monthly Rent Due' : 'Total Initial Due'}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Gateway Provider Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGateway('stripe')}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 transition-all ${
                  gateway === 'stripe'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-[#635BFF] flex items-center justify-center text-white text-[10px] font-black">
                  S
                </div>
                <div className="text-left">
                  <p className="text-xs leading-none">Stripe Checkout</p>
                  <p className="text-[10px] text-slate-500 font-normal">Cards & Apple Pay</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGateway('sslcommerz')}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 transition-all ${
                  gateway === 'sslcommerz'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                  C
                </div>
                <div className="text-left">
                  <p className="text-xs leading-none">SSLCommerz Gateway</p>
                  <p className="text-[10px] text-slate-500 font-normal">Direct & Mobile Wallets</p>
                </div>
              </button>
            </div>
          </div>

          {/* Virtual Card Preview */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg space-y-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                {gateway === 'stripe' ? 'STRIPE VERIFIED' : 'SSLCOMMERZ SECURED'}
              </span>
              <CreditCard className="w-6 h-6 text-slate-300" />
            </div>

            <div className="font-mono text-lg tracking-wider text-slate-100">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <div>
                <p className="text-[10px] uppercase text-slate-500">Cardholder</p>
                <p className="font-semibold text-white truncate max-w-[160px]">{cardHolder}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500">Expires</p>
                <p className="font-semibold text-white">{expiry}</p>
              </div>
            </div>
          </div>

          {/* Card Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4242 4242 4242 4242"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  CVC / CVV
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="888"
                  maxLength={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Itemized summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>First Month Rent:</span>
              <span className="font-semibold text-slate-900">${request.totalRent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Refundable Security Deposit:</span>
              <span className="font-semibold text-slate-900">${request.depositAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Protection & Escrow Fee:</span>
              <span className="font-semibold text-slate-900">${request.serviceFee}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
              <span>Charged Now:</span>
              <span className="text-blue-700">${request.totalInitialPayment.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelPayment}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Cancel Payment Flow
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ${request.totalInitialPayment.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
