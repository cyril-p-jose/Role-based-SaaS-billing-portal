import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.patch("/auth/profile", data),
};

export const billingAPI = {
  getPlans: () => api.get("/billing/plans"),
  getSubscription: () => api.get("/billing/subscription"),
  getInvoices: () => api.get("/billing/invoices"),
  createCheckout: (data) => api.post("/billing/checkout", data),
  createPortal: () => api.post("/billing/portal"),
};

export const teamAPI = {
  getTeam: () => api.get("/team"),
  invite: (data) => api.post("/team/invite", data),
  updateRole: (id, data) => api.patch(`/team/${id}`, data),
  remove: (id) => api.delete(`/team/${id}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get("/analytics/dashboard"),
  getAdminOverview: () => api.get("/analytics/admin"),
};

export default api;
