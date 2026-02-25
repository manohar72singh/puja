import express from "express";

import { adminOnly } from "../middleware/admin.js";
import {
  AdminLoginRequest,
  AdminVerifyOtp,
  createPandit,
  createService,
  createUser,
  deletePandit,
  deleteService,
  deleteUser,
  getAllBookings,
  getAllPandits,
  getAllServices,
  getAllUsers,
  getBookingById,
  getDashboardStats,
  getMonthlyGrowthChart,
  getServiceById,
  getSinglePandit,
  getTodayBookings,
  getUserById,
  togglePanditBlock,
  updatePandit,
  updateService,
  updateUser,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = express.Router();

// Admin Authentication Routes can be added here (e.g., login, logout)
router.post("/login", AdminLoginRequest);
router.post("/verify-otp", AdminVerifyOtp);

// Admin Dashboard Routes
router.get("/dashboard", verifyToken, adminOnly, getDashboardStats);

// chart data for admin dashboard
router.get("/monthly-growth", verifyToken, adminOnly, getMonthlyGrowthChart);

// User Management, CRUD Operations Routes for Admin
router.get("/users", verifyToken, adminOnly, getAllUsers);
router.post("/createUser", verifyToken, adminOnly, createUser);
router.get("/users/:id", verifyToken, adminOnly, getUserById);
router.put("/users/:id", verifyToken, adminOnly, updateUser);
router.delete("/users/:id", verifyToken, adminOnly, deleteUser);

// service management routes for admin can be added here

router.get("/services", verifyToken, adminOnly, getAllServices);
router.get("/services/:id", verifyToken, adminOnly, getServiceById);
router.post(
  "/services",
  verifyToken,
  adminOnly,
  upload.single("image"),
  createService,
);
router.put(
  "/services/:id",
  verifyToken,
  adminOnly,
  upload.single("image"),
  updateService,
);
router.delete("/services/:id", verifyToken, adminOnly, deleteService);

// booking management routes for admin can be added here
router.get("/bookings", verifyToken, adminOnly, getAllBookings);
router.get("/bookings/:id", verifyToken, adminOnly, getBookingById);
router.get("/bookings_today", verifyToken, adminOnly, getTodayBookings);

// pandit management routes for admin can be added here
// router.get("/pandits", verifyToken, adminOnly, getAllPandits);
router.post("/pandits", verifyToken, adminOnly, createPandit);
router.get("/pandits", verifyToken, adminOnly, getAllPandits);
router.get("/pandits/:id", verifyToken, adminOnly, getSinglePandit);
router.put("/pandits/:id", verifyToken, adminOnly, updatePandit);
router.delete("/pandits/:id", verifyToken, adminOnly, deletePandit);
router.put("/pandits/block/:id", verifyToken, adminOnly, togglePanditBlock);
// router.put("/pandits/assign/:bookingId", assignPanditToBooking);
export default router;
