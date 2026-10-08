const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      `Cannot connect to RentNest API at ${API_URL}. Start the backend and verify NEXT_PUBLIC_API_URL.`,
      0,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const payload =
    response.status === 204
      ? null
      : contentType.includes("application/json")
        ? await response.json()
        : await response.text();
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String(payload.message)
        : "Request failed";
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

export const api = {
  login: (email: string, password: string) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  refreshToken: () =>
    apiFetch("/auth/refresh-token", { credentials: "include" }),
  register: (data: Record<string, unknown>) =>
    apiFetch("/user/register", { method: "POST", body: JSON.stringify(data) }),
  users: () => apiFetch("/user"),
  updateUser: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/user/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  properties: (params?: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== "") q.set(k, String(v));
    });
    return apiFetch(`/properties${q.toString() ? `?${q}` : ""}`);
  },
  property: (id: string) => apiFetch(`/properties/${id}`),
  categories: () => apiFetch("/categories"),
  createCategory: (data: { name: string; description?: string }) =>
    apiFetch("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: string, data: { name: string; description?: string }) =>
    apiFetch(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    }),
  deleteCategory: (id: string) =>
    apiFetch(`/categories/${id}`, { method: "DELETE" }),
  rentals: () => apiFetch("/rentals"),
  rental: (id: string) => apiFetch(`/rentals/${id}`),
  
  createRentalRequest: (data: Record<string, unknown>) =>
    apiFetch("/rentals", { method: "POST", body: JSON.stringify(data) }),

  landlordRequests: () => apiFetch("/landlord/requests"),
  updateLandlordRequest: (id: string, status: string) =>
    apiFetch(`/landlord/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  createLandlordProperty: (data: Record<string, unknown>) =>
    apiFetch("/landlord/properties", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateLandlordProperty: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/landlord/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteLandlordProperty: (id: string) =>
    apiFetch(`/landlord/properties/${id}`, { method: "DELETE" }),
  createPayment: (rental_id: string) =>
    apiFetch("/payments/create", {
      method: "POST",
      body: JSON.stringify({ rental_id }),
    }),
  confirmPayment: (sessionId: string) =>
    apiFetch("/payments/confirm", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }),
  payments: () => apiFetch("/payments"),
  payment: (id: string) => apiFetch(`/payments/${id}`),
  createReview: (data: Record<string, unknown>) =>
    apiFetch("/reviews", { method: "POST", body: JSON.stringify(data) }),
};
