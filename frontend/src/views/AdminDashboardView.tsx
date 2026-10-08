import React, { useEffect, useState } from 'react';
import { safeImage, DEFAULT_AVATAR_IMAGE } from '../lib/image';
import {
  ShieldAlert,
  Users,
  Building2,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Star,
  Lock,
  Unlock,
  AlertTriangle,
  FileCheck,
  Eye,
  Filter,
  Tags,
  Pencil,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { api } from '../lib/api';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    properties,
    rentalRequests,
    payments,
    adminBanUser,
    adminUnbanUser,
    adminApproveProperty,
    adminRejectProperty,
    adminToggleFeatured,
    deleteProperty,
    navigateTo,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'properties' | 'requests' | 'payments' | 'categories'>('properties');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [propSearch, setPropSearch] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryBusy, setCategoryBusy] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response: any = await api.categories();
      const data = response?.data?.data ?? response?.data ?? response ?? [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast(error?.message || 'Unable to load categories', 'error');
    }
  };

  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryDescription('');
    setEditingCategoryId(null);
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = categoryName.trim();
    const description = categoryDescription.trim();
    if (!name) {
      showToast('Category name is required', 'warning');
      return;
    }

    setCategoryBusy(true);
    try {
      if (editingCategoryId) {
        await api.updateCategory(editingCategoryId, { name, description });
        showToast('Category updated successfully');
      } else {
        await api.createCategory({ name, description });
        showToast('Category created successfully');
      }
      resetCategoryForm();
      await loadCategories();
    } catch (error: any) {
      showToast(error?.message || 'Unable to save category', 'error');
    } finally {
      setCategoryBusy(false);
    }
  };

  const editCategory = (category: any) => {
    setEditingCategoryId(String(category.id));
    setCategoryName(category.name || '');
    setCategoryDescription(category.description || '');
  };

  const removeCategory = async (id: string) => {
    if (!window.confirm('Delete this category? Properties using it may be affected.')) return;
    setCategoryBusy(true);
    try {
      await api.deleteCategory(id);
      showToast('Category deleted successfully');
      if (editingCategoryId === id) resetCategoryForm();
      await loadCategories();
    } catch (error: any) {
      showToast(error?.message || 'Unable to delete category', 'error');
    } finally {
      setCategoryBusy(false);
    }
  };

  // Stats
  const totalVolume = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalTenants = users.filter((u) => u.role.toLowerCase() === 'tenant').length;
  const totalLandlords = users.filter((u) => u.role.toLowerCase() === 'landlord').length;
  const pendingApprovals = properties.filter((p) => !p.isApproved).length;

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role.toLowerCase() === userRoleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // Filtered properties
  const filteredProps = properties.filter((p) => {
    return (
      p.title.toLowerCase().includes(propSearch.toLowerCase()) ||
      p.location.city.toLowerCase().includes(propSearch.toLowerCase()) ||
      p.landlordName.toLowerCase().includes(propSearch.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">Admin Platform Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Oversee marketplace safety, approve property submissions, and audit financial transactions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Platform Active (99.9% Uptime)</span>
          </span>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {totalTenants} Tenants • {totalLandlords} Landlords
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Properties</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{properties.length}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {properties.filter((p) => p.isAvailable).length} Available Units
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pending Approvals</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingApprovals}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Requires Content Review</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Escrow Volume</p>
            <p className="text-2xl font-black text-slate-900 mt-1">${totalVolume.toLocaleString()}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">{payments.length} Processed Transactions</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-100 text-slate-700">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('properties')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'properties'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Listing Moderation ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory & Bans ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Rental Request Audit ({rentalRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'payments'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financial Ledger ({payments.length})</span>
        </button>
      </div>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tags className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

      {/* Admin-only Category Management */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Tags className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {editingCategoryId ? 'Edit Category' : 'Add Category'}
                </h3>
                <p className="text-xs text-slate-500">Admin-only category management</p>
              </div>
            </div>

            <form onSubmit={saveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category Name</label>
                <input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Apartment"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={80}
                  disabled={categoryBusy}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Short category description"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={250}
                  disabled={categoryBusy}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={categoryBusy}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold"
                >
                  {categoryBusy ? 'Saving...' : editingCategoryId ? 'Update Category' : 'Add Category'}
                </button>
                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    disabled={categoryBusy}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Property Categories</h3>
              <p className="text-xs text-slate-500 mt-1">
                Only administrators can create, edit, or delete categories.
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {categories.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">No categories found.</div>
              ) : (
                categories.map((category: any) => (
                  <div key={category.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{category.name}</p>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {category.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => editCategory(category)}
                        disabled={categoryBusy}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                        title="Edit category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCategory(String(category.id))}
                        disabled={categoryBusy}
                        className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Property Moderation */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Rental Listings Moderation</h3>
              <p className="text-xs text-slate-600">
                Review and approve new landlord submissions before public marketplace indexing.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search listings..."
                value={propSearch}
                onChange={(e) => setPropSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Property Details</th>
                  <th className="py-3 px-4">Landlord</th>
                  <th className="py-3 px-4">Rent</th>
                  <th className="py-3 px-4">Approval</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProps.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={safeImage(prop.images?.[0])}
                          alt={prop.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{prop.title}</p>
                          <p className="text-[11px] text-slate-600">
                            {prop.location.neighborhood}, {prop.location.city}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">{prop.landlordName}</td>

                    <td className="py-3 px-4 font-bold text-blue-700">
                      ${prop.price.toLocaleString()}
                      <span className="text-[10px] text-slate-600 font-normal">/mo</span>
                    </td>

                    <td className="py-3 px-4">
                      {prop.isApproved ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                          Pending Review
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => adminToggleFeatured(prop.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          prop.isFeatured
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${prop.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() =>
                            navigateTo({ path: '/properties/:id', params: { id: prop.id } })
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                          title="Preview Property"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {!prop.isApproved ? (
                          <button
                            onClick={() => adminApproveProperty(prop.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => adminRejectProperty(prop.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200"
                          >
                            Revoke
                          </button>
                        )}

                        <button
                          onClick={() => deleteProperty(prop.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: User Directory & Bans */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">User Moderation Directory</h3>
              <p className="text-xs text-slate-600">
                Manage tenant and landlord accounts, view activity, and enforce security bans.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="TENANT">Tenants</option>
                <option value="LANDLORD">Landlords</option>
                <option value="ADMIN">Admins</option>
              </select>

              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={safeImage(user.avatar, DEFAULT_AVATAR_IMAGE)}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-600">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.role.toLowerCase() === 'admin'
                            ? 'bg-rose-100 text-rose-900'
                            : user.role.toLowerCase() === 'landlord'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {user.isBanned ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white flex items-center gap-1 w-max">
                          <Lock className="w-3 h-3" />
                          <span>BANNED</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1 w-max">
                          <Unlock className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600">{user.joinedDate || user.createdAt}</td>

                    <td className="py-3 px-4 text-right">
                      {user.role.toLowerCase() !== 'admin' && (
                        <div>
                          {user.isBanned ? (
                            <button
                              onClick={() => adminUnbanUser(user.id)}
                              className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-[11px]"
                            >
                              Unban User
                            </button>
                          ) : (
                            <button
                              onClick={() => adminBanUser(user.id)}
                              className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px]"
                            >
                              Ban Account
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Request Audit */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Platform-Wide Rental Requests Audit</h3>
            <p className="text-xs text-slate-600">
              Audit all tenant-landlord requests, approved statuses, and move-in timeline records.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Tenant</th>
                  <th className="py-3 px-4">Landlord</th>
                  <th className="py-3 px-4">Move-In</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {rentalRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{req.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{req.propertyTitle}</td>
                    <td className="py-3 px-4">{req.tenantName}</td>
                    <td className="py-3 px-4">{req.landlordName}</td>
                    <td className="py-3 px-4">{req.moveInDate}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Financial Ledger */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Platform Financial Ledger</h3>
            <p className="text-xs text-slate-600">
              Complete escrow transaction audit with payment gateway metadata.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.transactionId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.propertyTitle}</td>
                    <td className="py-3 px-4 capitalize font-bold text-slate-800">{p.gateway}</td>
                    <td className="py-3 px-4 font-bold text-blue-700">${p.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600">{new Date(p.date).toLocaleString("en-US", { timeZone: "UTC" })}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
