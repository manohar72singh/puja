import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/admin",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getDashboardData = () => API.get("/dashboard");
export const getMonthlyGrowth = () => API.get("/monthly-growth");
export const getTodayBookings = () => API.get("/bookings_today");
