import React, { useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../lib/image';
import {
  Building2,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  TrendingUp,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Property, RentalRequest } from '../types';

export const LandlordDashboardView: React.FC = () => {
  const {
    currentUser,
    properties,
    rentalRequests,
    payments,
    approveRentalRequest,
    rejectRentalRequest,
    togglePropertyAvailability,
    deleteProperty,
    navigateTo,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'properties' | 'tenants' | 'revenue'>('requests');
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filter properties & requests for landlord
  const landlordId = currentUser?.id || 'user_landlord_1';
  const myProperties = properties.filter((p) => p.landlordId === landlordId || p.landlordId === 'user_landlord_1');
  const myRequests = rentalRequests.filter((r) => r.landlordId === landlordId || r.landlordId === 'user_landlord_1');
  const pendingRequests = myRequests.filter((r) => r.status === 'PENDING');
  const approvedRequests = myRequests.filter((r) => r.status === 'APPROVED');
  const activeLeases = myRequests.filter((r) => r.status === 'ACTIVE');

  // Revenue estimation
  const monthlyRevenue = activeLeases.reduce((acc, l) => acc + l.propertyPrice, 0);
  const totalGrossCollected = payments
    .filter((p) => p.landlordId === landlordId || p.landlordId === 'user_landlord_1')
    .reduce((acc, p) => acc + p.amount, 0);

  const handleApprove = async (reqId: string) => {
    await approveRentalRequest(reqId);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReqId) return;
    await rejectRentalRequest(rejectingReqId, rejectReason);
    setRejectingReqId(null);
    setRejectReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Landlord Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={safeImage(currentUser?.avatar, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150')}
            alt="Landlord"
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-blue-500 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">
                {currentUser?.name || 'Sarah Jenkins'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Superhost Landlord
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage incoming tenant applications, property availability, and direct rental payouts.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo({ path: '/dashboard/landlord/properties/new' })}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Listing</span>
        </button>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Active Listings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{myProperties.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pending Requests</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingRequests.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Occupied Leases</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{activeLeases.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Monthly Rent Yield</p>
            <p className="text-2xl font-black text-slate-900 mt-1">${monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-100 text-slate-700">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
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
          <span>Incoming Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'properties'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Listings ({myProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'tenants'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Tenants ({activeLeases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('revenue')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'revenue'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Earnings & Payouts</span>
        </button>
      </div>

      {/* Tab 1: Incoming Rental Requests (With Approve / Reject) */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Rental Requests</h3>
              <p className="text-xs text-slate-600">
                New tenant applications for your listings will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all space-y-5"
                >
                  {/* Top Bar: Property title + Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3
                        onClick={() =>
                          navigateTo({ path: '/properties/:id', params: { id: req.propertyId } })
                        }
                        className="text-base font-bold text-slate-900 hover:text-blue-700 cursor-pointer"
                      >
                        {req.propertyTitle}
                      </h3>
                      <p className="text-xs text-slate-600">{req.propertyLocation}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-900'
                            : req.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-900'
                            : req.status === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-xs text-slate-600">
                        {new Date(req.createdAt).toLocaleDateString("en-US", { timeZone: "UTC" })}
                      </span>
                    </div>
                  </div>

                  {/* Tenant Profile & Application Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tenant Profile */}
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <img
                        src={safeImage(req.tenantAvatar, DEFAULT_AVATAR_IMAGE)}
                        alt={req.tenantName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-300"
                      />
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">{req.tenantName}</p>
                        <p className="text-xs text-slate-600">{req.tenantEmail}</p>
                        <p className="text-xs text-slate-600">{req.tenantPhone}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Verified Tenant
                        </span>
                      </div>
                    </div>

                    {/* Lease Terms */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                      <p className="font-bold text-slate-900 uppercase text-[11px] mb-1">
                        Application Terms
                      </p>
                      <div className="flex justify-between">
                        <span>Requested Move-In:</span>
                        <strong className="text-slate-900">{req.moveInDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Lease Length:</span>
                        <strong className="text-slate-900">{req.leaseDurationMonths} Months</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Occupants:</span>
                        <strong className="text-slate-900">{req.occupantsCount} occupant(s)</strong>
                      </div>
                      <div className="flex justify-between font-bold text-blue-700 pt-1 border-t border-slate-200">
                        <span>Monthly Rent:</span>
                        <span>${req.propertyPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Tenant Intro Note & Actions */}
                    <div className="flex flex-col justify-between space-y-3">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                        <p className="font-semibold text-slate-800 not-italic text-[11px] mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>Tenant Introduction:</span>
                        </p>
                        "{req.message}"
                      </div>

                      {/* Action Buttons */}
                      {req.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button
                            id={`btn-approve-${req.id}`}
                            onClick={() => handleApprove(req.id)}
                            className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve Request</span>
                          </button>
                          <button
                            id={`btn-reject-${req.id}`}
                            onClick={() => setRejectingReqId(req.id)}
                            className="py-2 px-4 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {req.status === 'APPROVED' && req.paymentStatus === 'UNPAID' && (
                        <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs text-center font-medium">
                          Approved • Waiting for tenant to complete initial payment checkout.
                        </div>
                      )}

                      {req.status === 'ACTIVE' && (
                        <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs text-center font-semibold flex items-center justify-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <span>Lease Active & Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Properties Management */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Listed Rental Units</h3>
            <button
              onClick={() => navigateTo({ path: '/dashboard/landlord/properties/new' })}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10]">
                  <img src={safeImage(prop.images?.[0])} alt={prop.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => togglePropertyAvailability(prop.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all ${
                        prop.isAvailable
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-200'
                      }`}
                    >
                      {prop.isAvailable ? '● Available' : 'Off-Market'}
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-bold text-slate-900">
                        ${prop.price.toLocaleString()}
                        <span className="text-xs font-normal text-slate-600">/mo</span>
                      </span>
                      <span className="text-xs font-semibold capitalize text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {prop.propertyType}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 line-clamp-1 mt-1">{prop.title}</h4>
                    <p className="text-xs text-slate-600">{prop.location.neighborhood}, {prop.location.city}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() =>
                        navigateTo({ path: '/properties/:id', params: { id: prop.id } })
                      }
                      className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Live</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigateTo({
                            path: '/dashboard/landlord/properties/:id/edit',
                            params: { id: prop.id },
                          })
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                        title="Edit Listing"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProperty(prop.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Active Tenants */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900">Current Occupants & Active Leases</h3>
          {activeLeases.length === 0 ? (
            <p className="text-xs text-slate-600 italic">No currently active tenant leases.</p>
          ) : (
            <div className="space-y-3">
              {activeLeases.map((lease) => (
                <div
                  key={lease.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={safeImage(lease.tenantAvatar, DEFAULT_AVATAR_IMAGE)}
                      alt={lease.tenantName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{lease.tenantName}</p>
                      <p className="text-xs text-slate-600">{lease.propertyTitle}</p>
                      <p className="text-[11px] text-slate-600">{lease.tenantEmail} • {lease.tenantPhone}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <p className="font-bold text-blue-700">${lease.propertyPrice.toLocaleString()}/mo</p>
                    <p className="text-slate-600">Lease Start: {lease.moveInDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Revenue & Payouts */}
      {activeTab === 'revenue' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">Landlord Earnings & Direct Payouts</h3>
            <p className="text-xs text-slate-600">
              Escrow funds and monthly rental disbursements directly to your linked bank account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-xs font-bold uppercase text-blue-800">Total Rent Collected</p>
              <p className="text-3xl font-black text-blue-950 mt-1">${totalGrossCollected.toLocaleString()}</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold uppercase text-slate-600">Next Scheduled Payout</p>
              <p className="text-xl font-bold text-slate-900 mt-2">1st of Next Month</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold uppercase text-slate-600">Disbursement Account</p>
              <p className="text-sm font-bold text-slate-900 mt-2">Chase Bank (•••• 4821)</p>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal dialog */}
      {rejectingReqId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Decline Rental Request</h3>
            <p className="text-xs text-slate-600">
              Provide a brief note explaining the reason (e.g. term length mismatch, income requirements).
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for declining application..."
                className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectingReqId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
