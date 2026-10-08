import React, { useEffect, useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../../lib/image';
import { X, Calendar, Users, MessageSquare, ShieldCheck, CheckCircle2, Clock, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';

interface RequestRentModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestRentModal: React.FC<RequestRentModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const { currentUser, createRentalRequest, navigateTo } = useApp();

  // Form State
  const [moveInDate, setMoveInDate] = useState('');
  const [minMoveInDate, setMinMoveInDate] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const today = new Date();
    const min = today.toISOString().split('T')[0];
    const preferred = new Date(today);
    preferred.setDate(preferred.getDate() + 14);
    setMinMoveInDate(min);
    setMoveInDate(preferred.toISOString().split('T')[0]);
  }, [isOpen]);
  const [leaseDurationMonths, setLeaseDurationMonths] = useState(
    property.rules.minLeaseMonths || 12
  );
  const [occupantsCount, setOccupantsCount] = useState(1);
  const [occupantsDescription, setOccupantsDescription] = useState('Single professional tenant');
  const [message, setMessage] = useState(
    `Hello ${property.landlordName}, I would love to submit my rental application for ${property.title}. I have steady employment, excellent references, and can provide proof of income upon request.`
  );
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const serviceFee = Math.round(property.price * 0.05);
  const totalInitial = property.price + property.deposit + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setErrorMsg('Please sign in to submit a rental application.');
      return;
    }

    if (!agreeToTerms) {
      setErrorMsg('Please agree to the tenant lease verification terms.');
      return;
    }

    if (!moveInDate) {
      setErrorMsg('Please select your preferred move-in date.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 750));

      const newRequest = await createRentalRequest({
        propertyId: property.id,
        moveInDate,
        leaseDurationMonths,
        occupantsCount,
        occupantsDescription,
        message,
      });

      setIsSubmitting(false);
      onClose();

      // Navigate to tenant dashboard request section
      navigateTo({ path: '/dashboard/tenant' });
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to submit rental request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Property Summary */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Direct Rental Application</span>
          </div>

          <div className="flex items-start gap-4">
            <img
              src={safeImage(property.images?.[0])}
              alt={property.title}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-700 shrink-0"
            />
            <div>
              <h3 className="text-lg font-bold text-white line-clamp-1">{property.title}</h3>
              <p className="text-xs text-slate-300">
                {property.location.neighborhood}, {property.location.city} • Hosted by{' '}
                <strong className="text-white">{property.landlordName}</strong>
              </p>
              <div className="flex items-baseline gap-1 mt-1 text-blue-400 font-bold">
                <span className="text-xl">${property.price.toLocaleString()}</span>
                <span className="text-xs font-normal text-slate-300">/ month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <div>
                <p className="font-semibold">Submission Requirement</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* User Profile banner if signed in */}
          {currentUser ? (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={safeImage(currentUser.avatar, DEFAULT_AVATAR_IMAGE)}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Verified Tenant Profile
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
              <span>You are submitting as guest. We will set up your tenant account automatically.</span>
            </div>
          )}

          {/* Row 1: Move In Date & Lease Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Move-In Date</span>
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={minMoveInDate || undefined}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Lease Duration</span>
              </label>
              <select
                value={leaseDurationMonths}
                onChange={(e) => setLeaseDurationMonths(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value={3}>3 Months (Short Term)</option>
                <option value={6}>6 Months (Flexible)</option>
                <option value={12}>12 Months (Standard Annual)</option>
                <option value={24}>24 Months (Extended Stay)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Occupants count & brief background */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Occupants</span>
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={occupantsCount}
                onChange={(e) => setOccupantsCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Occupant Note
              </label>
              <input
                type="text"
                value={occupantsDescription}
                onChange={(e) => setOccupantsDescription(e.target.value)}
                placeholder="e.g. 2 adults, tech workers, no pets"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Message to Landlord */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Introduction Message to Landlord</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, mention your profession, rental history, or any specific questions..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />
          </div>

          {/* Price & Deposit Breakdown Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>First Month Rent:</span>
              <span className="font-semibold text-slate-900">${property.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Refundable Security Deposit:</span>
              <span className="font-semibold text-slate-900">${property.deposit.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Platform Service & Verification Fee (5%):</span>
              <span className="font-semibold text-slate-900">${serviceFee}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900">
              <span>Total Initial Due Upon Landlord Approval:</span>
              <span className="text-blue-700 text-lg">${totalInitial.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              * Note: You will NOT be charged now. Payment is only initiated after the landlord approves your application.
            </p>
          </div>

          {/* Checkbox agreement */}
          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>
              I certify that all information is accurate, agree to the building house rules, and authorize RentNest to share my applicant profile with {property.landlordName}.
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Send Request to Landlord</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
