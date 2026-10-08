export type UserRole = 'tenant' | 'landlord' | 'admin' | 'TENANT' | 'LANDLORD' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  bio?: string;
  isBanned?: boolean;
  createdAt: string;
  joinedDate?: string;
  verified?: boolean;
  rating?: number;
  responseRate?: string;
}

export type PropertyType = 'apartment' | 'house' | 'studio' | 'villa' | 'townhouse' | 'condo';

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  lat: number;
  lng: number;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string;
  category: 'essentials' | 'features' | 'safety' | 'location';
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  price: number; // Monthly rent
  deposit: number; // Security deposit
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  location: Location;
  images: string[];
  amenities: string[]; // List of amenity IDs
  rules: {
    petsAllowed: boolean;
    smokingAllowed: boolean;
    partiesAllowed: boolean;
    minLeaseMonths: number;
  };
  isAvailable: boolean;
  isFeatured: boolean;
  isApproved: boolean; // Admin moderation
  landlordId: string;
  landlordName: string;
  landlordAvatar: string;
  landlordRating: number;
  landlordPhone?: string;
  landlordResponseTime: string;
  createdAt: string;
  rating: number;
  reviewsCount: number;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface RentalRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  propertyPrice: number;
  landlordId: string;
  landlordName: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantAvatar: string;
  tenantPhone: string;
  moveInDate: string;
  leaseDurationMonths: number;
  occupantsCount: number;
  occupantsDescription?: string;
  message: string;
  totalRent: number;
  depositAmount: number;
  serviceFee: number;
  totalInitialPayment: number;
  status: RequestStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paidAt?: string;
  nextPaymentDue?: string;
  nextBillingPeriod?: string;
  lastPaidPeriod?: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  hasReviewed?: boolean;
}

export interface PaymentRecord {
  id: string;
  requestId: string;
  rentalRequestId?: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  landlordId: string;
  amount: number;
  breakdown: {
    firstMonthRent: number;
    deposit: number;
    serviceFee: number;
    tax: number;
    total: number;
  };
  gateway: 'stripe' | 'sslcommerz';
  cardLast4?: string;
  cardBrand?: string;
  transactionId: string;
  sessionId?: string;
  status: 'SUCCESS' | 'CANCELLED' | 'REFUNDED';
  date: string;
  billingPeriod?: string;
  receiptUrl?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  requestId: string;
  tenantId: string;
  tenantName: string;
  tenantAvatar: string;
  rating: number;
  cleanlinessRating: number;
  communicationRating: number;
  locationRating: number;
  comment: string;
  date: string;
  landlordReply?: string;
}

export interface FilterState {
  search: string;
  city: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // 'any' | '1' | '2' | '3+'
  bathrooms: string;
  amenities: string[];
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'newest';
  availableOnly: boolean;
  petsAllowedOnly: boolean;
}

export type AppRoute =
  | { path: '/'; params?: Record<string, string | undefined> }
  | { path: '/properties'; params?: Record<string, string | undefined> }
  | { path: '/properties/:id'; params?: { id: string } }
  | { path: '/auth/login'; params?: Record<string, string | undefined> }
  | { path: '/auth/register'; params?: Record<string, string | undefined> }
  | { path: '/dashboard/tenant'; params?: Record<string, string | undefined> }
  | { path: '/dashboard/tenant/requests/:id/pay'; params?: { id: string } }
  | { path: '/payment/success'; params?: { id?: string; session_id?: string } }
  | { path: '/payment/cancel'; params?: { id?: string } }
  | { path: '/dashboard/landlord'; params?: Record<string, string | undefined> }
  | { path: '/dashboard/landlord/properties/new'; params?: Record<string, string | undefined> }
  | { path: '/dashboard/landlord/properties/:id/edit'; params?: { id: string } }
  | { path: '/dashboard/landlord/requests'; params?: Record<string, string | undefined> }
  | { path: '/dashboard/admin'; params?: Record<string, string | undefined> };
