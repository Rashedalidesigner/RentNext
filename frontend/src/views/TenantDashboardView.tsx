import React, { useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../lib/image';
import {
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Building,
  Heart,
  Star,
  FileText,
  DollarSign,
  Calendar,
  ShieldCheck,
  Download,
  Eye,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Receipt,
  Home,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentModal } from '../components/payment/PaymentModal';
import { ReviewModal } from '../components/properties/ReviewModal';
import { PropertyCard } from '../components/common/PropertyCard';
import { RentalRequest, RequestStatus } from '../types';

export const TenantDashboardView: React.FC = () => {
  const {
    currentUser,
    rentalRequests,
    payments,
    properties,
    savedPropertyIds,
    navigateTo,
    cancelRentalRequest,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'active_leases' | 'payments' | 'saved'>('requests');
  const [selectedRequestForPay, setSelectedRequestForPay] = useState<RentalRequest | null>(null);
  const [selectedRequestForReview, setSelectedRequestForReview] = useState<RentalRequest | null>(null);

  // Filter requests for current tenant
  const tenantId = currentUser?.id || 'user_tenant_1';
  const myRequests = rentalRequests.filter((r) => r.tenantId === tenantId);
  const myPayments = payments.filter((p) => p.tenantId === tenantId);
  const myActiveLeases = myRequests.filter((r) => r.status === 'ACTIVE');
  const mySavedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));

  const totalSpent = myPayments.reduce((acc, p) => acc + p.amount, 0);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>PENDING APPROVAL</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>APPROVED • PAY NOW</span>
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>ACTIVE LEASE</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>REJECTED</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>COMPLETED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const handleDownloadAgreement = (req: RentalRequest) => {
    showToast(`Downloading Lease Agreement PDF for ${req.propertyTitle}...`, 'info', 'Document Downloaded');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={safeImage(currentUser?.avatar, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')}
            alt="Tenant"
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-500"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Welcome back, {currentUser?.name || 'Tenant'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                Verified Tenant
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage your rental applications, lease payments, and active contracts.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo({ path: '/properties' })}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <Building className="w-4 h-4" />
          <span>Browse More Rentals</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Active Leases</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{myActiveLeases.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Submitted Requests</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{myRequests.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Paid</p>
            <p className="text-2xl font-black text-slate-900 mt-1">${totalSpent.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Saved Homes</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{savedPropertyIds.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Rental Requests ({myRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active_leases')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'active_leases'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Active Leases ({myActiveLeases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'payments'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Payment History ({myPayments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({mySavedProperties.length})</span>
        </button>
      </div>

      {/* Tab 1: Rental Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Rental Requests Yet</h3>
              <p className="text-xs text-slate-600">
                Explore our listings and send an application directly to property owners.
              </p>
              <button
                onClick={() => navigateTo({ path: '/properties' })}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
              >
                Browse Listings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Property Info & Thumbnail */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={safeImage(req.propertyImage, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400')}
                      alt={req.propertyTitle}
                      className="w-20 h-20 rounded-lg object-cover shrink-0 cursor-pointer"
                      onClick={() =>
                        navigateTo({ path: '/properties/:id', params: { id: req.propertyId } })
                      }
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(req.status)}
                        <span className="text-xs text-slate-600">
                          Submitted: {new Date(req.createdAt).toLocaleDateString("en-US", { timeZone: "UTC" })}
                        </span>
                      </div>

                      <h3
                        onClick={() =>
                          navigateTo({ path: '/properties/:id', params: { id: req.propertyId } })
                        }
                        className="text-base font-bold text-slate-900 hover:text-blue-700 cursor-pointer transition-colors"
                      >
                        {req.propertyTitle}
                      </h3>

                      <p className="text-xs text-slate-600">
                        {req.propertyLocation} • Landlord: <strong className="text-slate-800">{req.landlordName}</strong>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                        <span>Move-In: <strong className="text-slate-800">{req.moveInDate}</strong></span>
                        <span>•</span>
                        <span>Lease: <strong className="text-slate-800">{req.leaseDurationMonths} Mos</strong></span>
                        <span>•</span>
                        <span>Rent: <strong className="text-slate-800">${req.propertyPrice.toLocaleString()}/mo</strong></span>
                      </div>

                      {req.rejectionReason && (
                        <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg mt-2 border border-rose-200">
                          <strong>Note from Landlord:</strong> {req.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Financial & CTAs Column */}
                  <div className="flex flex-col sm:items-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <p className="text-[11px] uppercase font-bold text-slate-600">{req.status === 'ACTIVE' ? 'Monthly Rent' : 'Total Initial Due'}</p>
                      <p className="text-xl font-extrabold text-slate-900">
                        ${req.totalInitialPayment.toLocaleString()}
                      </p>
                    </div>

                    {/* Action Buttons based on state */}
                    {((req.status === 'APPROVED' || req.status === 'ACTIVE') && req.paymentStatus === 'UNPAID') && (
                      <button
                        id={`btn-pay-${req.id}`}
                        onClick={() => setSelectedRequestForPay(req)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>{req.status === 'APPROVED' ? 'Pay First Month Rent' : `Pay Rent • ${req.nextBillingPeriod || 'This Month'}`}</span>
                      </button>
                    )}

                    {req.status === 'ACTIVE' && req.paymentStatus === 'PAID' && req.nextBillingPeriod && (
                      <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        Rent paid • Next due {req.nextBillingPeriod}
                      </div>
                    )}

                    {req.status === 'ACTIVE' && !req.hasReviewed && (
                      <button
                        onClick={() => setSelectedRequestForReview(req)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Leave Review</span>
                      </button>
                    )}

                    {req.status === 'ACTIVE' && req.hasReviewed && (
                      <span className="text-xs font-semibold text-blue-700 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Review Submitted</span>
                      </span>
                    )}

                    {req.status === 'PENDING' && (
                      <button
                        onClick={() => cancelRentalRequest(req.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Leases */}
      {activeTab === 'active_leases' && (
        <div className="space-y-6">
          {myActiveLeases.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Active Leases</h3>
              <p className="text-xs text-slate-600">
                Once a landlord approves your application and initial payment is complete, your active lease and digital key details will appear here.
              </p>
            </div>
          ) : (
            myActiveLeases.map((lease) => (
              <div
                key={lease.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      Active Verified Lease
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{lease.propertyTitle}</h3>
                    <p className="text-xs text-slate-600">{lease.propertyLocation}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadAgreement(lease)}
                      className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Lease PDF</span>
                    </button>
                    {!lease.hasReviewed && (
                      <button
                        onClick={() => setSelectedRequestForReview(lease)}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        <span>Leave Review</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-slate-600 font-bold uppercase">Move-In Date</p>
                    <p className="text-base font-bold text-slate-900 mt-1">{lease.moveInDate}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-slate-600 font-bold uppercase">Monthly Rent</p>
                    <p className="text-base font-bold text-slate-900 mt-1">${lease.propertyPrice.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-slate-600 font-bold uppercase">Deposit Held in Escrow</p>
                    <p className="text-base font-bold text-slate-900 mt-1">${lease.depositAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Payment History */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Tenant Transaction & Payment Receipts</h3>
            <p className="text-xs text-slate-600">
              Itemized digital invoices with transaction hashes from Stripe and SSLCommerz gateways.
            </p>
          </div>

          {myPayments.length === 0 ? (
            <div className="p-12 text-center text-slate-600 text-xs">
              No completed payment transactions on record.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Property</th>
                    <th className="py-3.5 px-4">Gateway</th>
                    <th className="py-3.5 px-4">Billing Month</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {myPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{pay.transactionId}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{pay.propertyTitle}</td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800">
                          {pay.gateway}
                        </span>
                      </td>
                      <td className="py-3.5 px-4"><div className="font-semibold text-slate-700">{pay.billingPeriod || "—"}</div><div className="text-[11px] text-slate-500">{new Date(pay.date).toLocaleDateString("en-US", { timeZone: "UTC" })}</div></td>
                      <td className="py-3.5 px-4 font-bold text-blue-700">৳{pay.amount.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() =>
                            navigateTo({
                              path: '/payment/success',
                              params: { id: pay.id, session_id: pay.sessionId },
                            })
                          }
                          className="text-blue-700 hover:text-blue-800 font-semibold"
                        >
                          View Receipt →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Saved Properties */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {mySavedProperties.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-600">
                Click the heart icon on any property to save it to your dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySavedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {selectedRequestForPay && (
        <PaymentModal
          request={selectedRequestForPay}
          isOpen={!!selectedRequestForPay}
          onClose={() => setSelectedRequestForPay(null)}
        />
      )}

      {/* Review Modal */}
      {selectedRequestForReview && (
        <ReviewModal
          request={selectedRequestForReview}
          isOpen={!!selectedRequestForReview}
          onClose={() => setSelectedRequestForReview(null)}
        />
      )}
    </div>
  );
};
