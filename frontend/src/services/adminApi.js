import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getDashboardData = () => API.get("/dashboard");
export const getMonthlyGrowth = () => API.get("/monthly-growth");
export const getTodayBookings = () => API.get("/bookings_today");
