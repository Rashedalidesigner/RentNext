"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  AppRoute,
  FilterState,
  PaymentRecord,
  Property,
  RentalRequest,
  Review,
  User,
  UserRole,
} from "../types";
import { safeImage, safeImageList, DEFAULT_AVATAR_IMAGE } from "../lib/image";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
}
interface AppContextType {
  currentUser: User | null;
  users: User[];
  loginAsPreset: (role: UserRole) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  toggleBanUser: (id: string) => Promise<void>;
  updateUserRole: (id: string, role: UserRole) => Promise<void>;
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute) => void;
  properties: Property[];
  createProperty: (data: any) => Promise<Property>;
  addProperty: (data: any) => Promise<Property>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  togglePropertyAvailability: (id: string) => Promise<void>;
  moderateProperty: (id: string, approved: boolean) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  adminBanUser: (id: string) => Promise<void>;
  adminUnbanUser: (id: string) => Promise<void>;
  adminApproveProperty: (id: string) => Promise<void>;
  adminRejectProperty: (id: string) => Promise<void>;
  adminToggleFeatured: (id: string) => Promise<void>;
  switchRoleQuick: (role: UserRole) => void;
  rentalRequests: RentalRequest[];
  createRentalRequest: (data: any) => Promise<RentalRequest>;
  approveRentalRequest: (id: string) => Promise<void>;
  rejectRentalRequest: (id: string, reason?: string) => Promise<void>;
  cancelRentalRequest: (id: string) => Promise<void>;
  payments: PaymentRecord[];
  processPayment: (id: string, details: any) => Promise<any>;
  confirmPayment: (sessionId: string) => Promise<any>;
  reviews: Review[];
  addReview: (data: any) => Promise<Review>;
  replyToReview: (id: string, reply: string) => Promise<void>;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => void;
  isPropertySaved: (id: string) => boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toasts: ToastMessage[];
  showToast: (
    message: string,
    type?: ToastMessage["type"],
    title?: string,
  ) => void;
  removeToast: (id: string) => void;
  resetToDefaults: () => void;
}
const DEFAULT_FILTERS: FilterState = {
  search: "",
  city: "All",
  propertyType: "all",
  minPrice: 0,
  maxPrice: 100000,
  bedrooms: "any",
  bathrooms: "any",
  amenities: [],
  sortBy: "recommended",
  availableOnly: false,
  petsAllowedOnly: false,
};
const AppContext = createContext<AppContextType | null>(null);
const unwrap = (x: any): any => x?.data?.data ?? x?.data ?? x;
const roleLower = (r: any) => String(r || "").toLowerCase() as UserRole;
const toUser = (u: any): User => ({
  id: String(u.id),
  name: u.name,
  email: u.email,
  role: roleLower(u.role),
  phone: u.phone || "",
  avatar: safeImage(
    u.avatar,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "User")}&background=2563eb&color=fff`,
  ),
  isBanned: Boolean(u.is_Banned),
  createdAt: u.createdAt || u.cretedAt || new Date().toISOString(),
});
const toProperty = (p: any): Property => {
  const type = String(
    p.category?.name || p.category?.title || "property",
  ).toLowerCase() as any;
  const fallbackImages: Record<string, string> = {
    apartment:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
    condo:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
    townhouse:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    villa:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80",
    studio:
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop&q=80",
    house:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80",
  };
  return {
    id: String(p.id),
    title: p.title || "",
    description: p.description || "",
    propertyType: type,
    price: Number(p.price || 0),
    deposit: 0,
    bedrooms: Number(p.bedroom || 0),
    bathrooms: Number(p.bathroom || 0),
    areaSqFt: 0,
    location: {
      address: p.location || "",
      city: p.location || "",
      state: "",
      zipCode: "",
      neighborhood: p.location || "",
      lat: 0,
      lng: 0,
    },
    images: safeImageList(
      p.images,
      fallbackImages[type] || fallbackImages.apartment,
    ),
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    rules: {
      petsAllowed: false,
      smokingAllowed: false,
      partiesAllowed: false,
      minLeaseMonths: 1,
    },
    isAvailable: String(p.status || "AVALABLE").toUpperCase() === "AVALABLE",
    isFeatured: false,
    isApproved: true,
    landlordId: String(p.landlord_id || p.lnadlord?.id || ""),
    landlordName: p.lnadlord?.name || "",
    landlordAvatar: "",
    landlordRating: 0,
    landlordPhone: p.lnadlord?.phone || "",
    landlordResponseTime: "",
    createdAt: p.createdAt || new Date().toISOString(),
    rating: Array.isArray(p.review)
      ? p.review.reduce((s: number, r: any) => s + Number(r.rating || 0), 0) /
        (p.review.length || 1)
      : 0,
    reviewsCount: Array.isArray(p.review) ? p.review.length : 0,
  };
};
const periodFromDate = (value: any) => {
  const d = new Date(value);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};
const currentPeriod = () => periodFromDate(new Date());
const nextPeriod = (period: string) => {
  const [y, m] = period.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, 1));
  d.setUTCMonth(d.getUTCMonth() + 1);
  return periodFromDate(d);
};
const monthLabel = (period?: string) => {
  if (!period) return "";
  const [y, m] = period.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};
const toRental = (r: any): RentalRequest => {
  const rawPayments = Array.isArray(r.payment)
    ? r.payment
    : r.payment
      ? [r.payment]
      : [];
  const completed = rawPayments
    .filter((p: any) => p?.status === "COMPLETED")
    .sort((a: any, b: any) =>
      String(b.billingPeriod || "").localeCompare(
        String(a.billingPeriod || ""),
      ),
    );
  const latest = completed[0];
  const latestPeriod = latest?.billingPeriod as string | undefined;
  const duePeriod = latestPeriod ? nextPeriod(latestPeriod) : currentPeriod();
  const now = currentPeriod();
  const isDue = duePeriod <= now;
  return {
    id: String(r.id),
    propertyId: String(r.property_id || r.property?.id || ""),
    propertyTitle: r.property?.title || "Rental Property",
    propertyImage: "",
    propertyLocation: r.property?.location || "",
    propertyPrice: Number(r.property?.price || 0),
    landlordId: String(r.property?.landlord_id || ""),
    landlordName: r.property?.lnadlord?.name || "",
    tenantId: String(r.tenant_id || ""),
    tenantName: r.tanent?.name || "",
    tenantEmail: r.tanent?.email || "",
    tenantAvatar: "",
    tenantPhone: r.tanent?.phone || "",
    moveInDate: r.moveInDate,
    totalRent: Number(r.property?.price || 0),
    depositAmount: 0,
    serviceFee: 0,
    totalInitialPayment: Number(r.property?.price || 0),
    status: String(r.status || "PENDING").toUpperCase() as any,
    paymentStatus: isDue ? "UNPAID" : "PAID",
    paymentId: latest?.id,
    paidAt: latest?.paidAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    rejectionReason: "",
    hasReviewed: false,
    leaseDurationMonths: 1,
    occupantsCount: 1,
    message: "",
    nextPaymentDue: duePeriod,
    nextBillingPeriod: duePeriod,
    lastPaidPeriod: latestPeriod,
  };
};
const toPayment = (p: any): PaymentRecord => ({
  id: String(p.id),
  requestId: String(p.rentalRequest_id || ""),
  rentalRequestId: String(p.rentalRequest_id || ""),
  propertyId: "",
  propertyTitle: "Rental Payment",
  tenantId: String(p.tenantId || ""),
  tenantName: "",
  landlordId: "",
  amount: Number(p.amount || 0),
  breakdown: {
    firstMonthRent: Number(p.amount || 0),
    deposit: 0,
    serviceFee: 0,
    tax: 0,
    total: Number(p.amount || 0),
  },
  gateway: "stripe",
  transactionId: p.transaction_id || p.sessionId || "",
  sessionId: p.sessionId,
  status: p.status === "COMPLETED" ? "SUCCESS" : "CANCELLED",
  date: p.paidAt || p.createdAt || new Date().toISOString(),
  billingPeriod: p.billingPeriod,
});

const routeFromLocation = (): AppRoute => {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  const q = new URLSearchParams(window.location.search);
  if (pathname.startsWith("/properties/") && parts[1])
    return { path: "/properties/:id", params: { id: parts[1] } };
  if (
    pathname.startsWith("/dashboard/landlord/properties/") &&
    parts[3] === "edit"
  )
    return {
      path: "/dashboard/landlord/properties/:id/edit",
      params: { id: parts[2] },
    };
  if (pathname.startsWith("/dashboard/tenant/requests/") && parts[3] === "pay")
    return {
      path: "/dashboard/tenant/requests/:id/pay",
      params: { id: parts[2] },
    };
  if (pathname === "/dashboard/landlord/requests")
    return { path: "/dashboard/landlord/requests" };
  if (pathname === "/payment/success")
    return {
      path: "/payment/success",
      params: {
        id: q.get("id") || undefined,
        session_id: q.get("session_id") || undefined,
      },
    };
  if (pathname === "/payment/cancel")
    return {
      path: "/payment/cancel",
      params: { id: q.get("id") || undefined },
    };
  const known = [
    "/",
    "/properties",
    "/auth/login",
    "/auth/register",
    "/dashboard/tenant",
    "/dashboard/landlord",
    "/dashboard/landlord/properties/new",
    "/dashboard/landlord/requests",
    "/dashboard/admin",
  ];
  return { path: (known.includes(pathname) ? pathname : "/") as any };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null),
    [users, setUsers] = useState<User[]>([]),
    [properties, setProperties] = useState<Property[]>([]),
    [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]),
    [payments, setPayments] = useState<PaymentRecord[]>([]),
    [reviews, setReviews] = useState<Review[]>([]),
    [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]),
    [currentRoute, setCurrentRoute] = useState<AppRoute>({ path: "/" }),
    [filters, setFilters] = useState(DEFAULT_FILTERS),
    [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (
    message: string,
    type: ToastMessage["type"] = "success",
    title?: string,
  ) => {
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((p) => [...p, { id, message, type, title }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4500);
  };
  const removeToast = (id: string) =>
    setToasts((p) => p.filter((x) => x.id !== id));
  const load = async (u = currentUser) => {
    try {
      const p = await api.properties();
      const props = (Array.isArray(unwrap(p)) ? unwrap(p) : []).map(toProperty);
      setProperties(props);
      if (!u) {
        setRentalRequests([]);
        setPayments([]);
        return;
      }
      const role = roleLower(u.role);
      if (role === "tenant") {
        const r = await api.rentals();
        setRentalRequests(
          (Array.isArray(unwrap(r)) ? unwrap(r) : []).map(toRental),
        );
        const pay = await api.payments();
        setPayments(
          (Array.isArray(unwrap(pay)) ? unwrap(pay) : []).map(toPayment),
        );
      } else if (role === "landlord") {
        const r = await api.landlordRequests();
        const landlordProps = Array.isArray(unwrap(r)) ? unwrap(r) : [];
        const flattened = landlordProps.flatMap((prop: any) =>
          (prop.rentalRequest || []).map((req: any) => ({
            ...req,
            property: prop,
          })),
        );
        setRentalRequests(flattened.map(toRental));
        setPayments([]);
      } else if (role === "admin") {
        const us = await api.users();
        setUsers((Array.isArray(unwrap(us)) ? unwrap(us) : []).map(toUser));
        setRentalRequests([]);
        setPayments([]);
      }
    } catch (e: any) {
      showToast(
        e.message || "Unable to load backend data",
        "error",
        "API Error",
      );
    }
  };
  useEffect(() => {
    load(null);
    const saved = localStorage.getItem("rentnest_user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("rentnest_user");
      }
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("rentnest_user", JSON.stringify(currentUser));
      document.cookie = `rentnest_role=${String(currentUser.role).toUpperCase()}; path=/; max-age=86400`;
      load(currentUser);
    } else {
      localStorage.removeItem("rentnest_user");
      setRentalRequests([]);
      setPayments([]);
    }
  }, [currentUser]);
  useEffect(() => {
    setCurrentRoute(routeFromLocation());
    const h = () => setCurrentRoute(routeFromLocation());
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);
  const navigateTo = (route: AppRoute) => {
    let p = route.path as string;
    if (route.path === "/properties/:id") p = `/properties/${route.params?.id}`;
    else if (route.path === "/dashboard/tenant/requests/:id/pay")
      p = `/dashboard/tenant/requests/${route.params?.id}/pay`;
    else if (route.path === "/dashboard/landlord/properties/:id/edit")
      p = `/dashboard/landlord/properties/${route.params?.id}/edit`;
    else if (route.path === "/payment/success")
      p = `/payment/success${route.params?.session_id ? `?session_id=${encodeURIComponent(route.params.session_id)}` : ""}`;
    window.history.pushState({}, "", p);
    setCurrentRoute(route);
  };
  const login = async (email: string, password?: string) => {
    try {
      const r = unwrap(await api.login(email, password || ""));
      const u = toUser(r?.user || r);
      setCurrentUser(u);
      showToast("Login successful");
      return true;
    } catch (e: any) {
      showToast(e.message || "Login failed", "error");
      return false;
    }
  };
  const register = async (data: any) => {
    const r = unwrap(
      await api.register({ ...data, role: String(data.role).toUpperCase() }),
    );
    const u = toUser(r?.user || r);
    await login(data.email, data.password);
    return u;
  };
  const logout = async () => {
    document.cookie = "rentnest_role=; path=/; max-age=0";
    setCurrentUser(null);
    setUsers([]);
    setRentalRequests([]);
    setPayments([]);
    showToast("Signed out", "info");
  };
  const createProperty = async (data: any) => {
    if (!currentUser) throw new Error("Please log in");
    const payload = {
      landlord_id: currentUser.id,
      category_id: data.category_id || data.categoryId || data.category || "",
      title: data.title,
      description: data.description,
      bathroom: Number(data.bathroom ?? data.bathrooms ?? 0),
      bedroom: Number(data.bedroom ?? data.bedrooms ?? 0),
      location:
        typeof data.location === "string"
          ? data.location
          : data.location?.city || data.location?.address || "",
      price: Number(data.price),
    };
    const r = await api.createLandlordProperty(payload);
    const p = toProperty(unwrap(r));
    setProperties((x) => [p, ...x]);
    showToast("Property created");
    return p;
  };
  const updateProperty = async (id: string, data: any) => {
    const payload = {
      landlord_id: currentUser?.id,
      category_id: data.category_id || data.categoryId || "",
      title: data.title,
      description: data.description,
      bathroom: Number(data.bathroom ?? data.bathrooms ?? 0),
      bedroom: Number(data.bedroom ?? data.bedrooms ?? 0),
      location:
        typeof data.location === "string"
          ? data.location
          : data.location?.city || data.location?.address || "",
      price: Number(data.price),
    };
    const r = await api.updateLandlordProperty(id, payload);
    const p = toProperty(unwrap(r));
    setProperties((x) => x.map((v) => (v.id === id ? p : { ...v })));
    showToast("Property updated");
  };
  const deleteProperty = async (id: string) => {
    await api.deleteLandlordProperty(id);
    setProperties((x) => x.filter((v) => v.id !== id));
    showToast("Property deleted", "info");
  };
  const togglePropertyAvailability = async (_id: string) =>
    showToast(
      "Availability is controlled by the backend property status",
      "info",
    );
  const moderateProperty = async (_id: string, _approved: boolean) =>
    showToast(
      "Admin property moderation is not implemented by the supplied backend",
      "warning",
    );
  const toggleFeatured = async (_id: string) =>
    showToast(
      "Featured property is not implemented by the supplied backend",
      "warning",
    );
  const createRentalRequest = async (data: any) => {
    const r = await api.createRentalRequest({
      property_id: data.property_id || data.propertyId,
      moveInDate: data.moveInDate,
    });
    const out = toRental(unwrap(r));
    setRentalRequests((x) => [out, ...x]);
    showToast("Rental request submitted");
    return out;
  };
  const approveRentalRequest = async (id: string) => {
    await api.updateLandlordRequest(id, "APPROVED");
    await load();
    showToast("Request approved");
  };
  const rejectRentalRequest = async (id: string) => {
    await api.updateLandlordRequest(id, "REJECTED");
    await load();
    showToast("Request rejected", "info");
  };
  const cancelRentalRequest = async () =>
    showToast(
      "Cancellation is not implemented by the supplied backend",
      "warning",
    );
  const processPayment = async (id: string) => {
    const r = unwrap(await api.createPayment(id));
    if (r?.checkoutUrl) {
      window.location.href = r.checkoutUrl;
      return r;
    }
    throw new Error("Backend did not return a checkout URL");
  };
  const confirmPayment = async (sessionId: string) => {
    const result = unwrap(await api.confirmPayment(sessionId));
    await load(currentUser);
    return result;
  };
  const addReview = async (data: any) => {
    const r = await api.createReview({
      tenant_id: currentUser?.id,
      properties_id: data.properties_id || data.propertyId,
      rating: Number(data.rating),
      description: data.description || data.comment || "",
    });
    const out = unwrap(r);
    setReviews((x) => [out, ...x]);
    return out;
  };
  const replyToReview = async () =>
    showToast(
      "Review replies are not implemented by the supplied backend",
      "warning",
    );
  const setUserBanState = async (id: string, banned: boolean) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    await api.updateUser(id, { is_Banned: banned });
    const us = await api.users();
    setUsers((Array.isArray(unwrap(us)) ? unwrap(us) : []).map(toUser));
    showToast(
      banned ? "User banned" : "User unbanned",
      banned ? "warning" : "success",
    );
  };
  const toggleBanUser = async (id: string) => {
    const u = users.find((x) => x.id === id);
    if (u) await setUserBanState(id, !u.isBanned);
  };
  const updateUserRole = async (id: string, role: UserRole) => {
    await api.updateUser(id, { role: String(role).toUpperCase() });
    const us = await api.users();
    setUsers((Array.isArray(unwrap(us)) ? unwrap(us) : []).map(toUser));
  };
  const toggleSaveProperty = (id: string) =>
    setSavedPropertyIds((x) =>
      x.includes(id) ? x.filter((v) => v !== id) : [...x, id],
    );
  const isPropertySaved = (id: string) => savedPropertyIds.includes(id);
  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const loginAsPreset = () => {};
  const switchRoleQuick = () => {};
  const resetToDefaults = () => {
    setProperties([]);
    setRentalRequests([]);
    setPayments([]);
    setReviews([]);
    setUsers([]);
    setCurrentUser(null);
    setSavedPropertyIds([]);
  };
  const value = {
    currentUser,
    users,
    loginAsPreset,
    login,
    register,
    logout,
    updateUserProfile: async () => {},
    toggleBanUser,
    updateUserRole,
    currentRoute,
    navigateTo,
    properties,
    createProperty,
    addProperty: createProperty,
    updateProperty,
    deleteProperty,
    togglePropertyAvailability,
    moderateProperty,
    toggleFeatured,
    adminBanUser: (id: string) => setUserBanState(id, true),
    adminUnbanUser: (id: string) => setUserBanState(id, false),
    adminApproveProperty: (id: string) => moderateProperty(id, true),
    adminRejectProperty: (id: string) => moderateProperty(id, false),
    adminToggleFeatured: toggleFeatured,
    switchRoleQuick,
    rentalRequests,
    createRentalRequest,
    approveRentalRequest,
    rejectRentalRequest,
    cancelRentalRequest,
    payments,
    processPayment,
    confirmPayment,
    reviews,
    addReview,
    replyToReview,
    savedPropertyIds,
    toggleSaveProperty,
    isPropertySaved,
    filters,
    setFilters,
    resetFilters,
    toasts,
    showToast,
    removeToast,
    resetToDefaults,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useApp = () => {
  const c = useContext(AppContext);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
};
