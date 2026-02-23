import express from "express";

import { adminOnly } from "../middleware/admin.js";
import {
  createService,
  deleteService,
  deleteUser,
  getAllBookings,
  getAllServices,
  getAllUsers,
  getBookingById,
  getDashboardStats,
  getMonthlyGrowthChart,
  getServiceById,
  getTodayBookings,
  getUserById,
  updateService,
  updateUser,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
// Admin Dashboard Routes
router.get("/dashboard", verifyToken, adminOnly, getDashboardStats);

// chart data for admin dashboard
router.get("/monthly-growth", verifyToken, adminOnly, getMonthlyGrowthChart);

// User Management, CRUD Operations Routes for Admin
router.get("/users", verifyToken, adminOnly, getAllUsers);
router.get("/users/:id", verifyToken, adminOnly, getUserById);
router.put("/users/:id", verifyToken, adminOnly, updateUser);
router.delete("/users/:id", verifyToken, adminOnly, deleteUser);

// service management routes for admin can be added here

router.get("/services", verifyToken, adminOnly, getAllServices);
router.get("/services/:id", verifyToken, adminOnly, getServiceById);
router.post("/create_services", verifyToken, adminOnly, createService);
router.put("/update_service/:id", verifyToken, adminOnly, updateService);
router.delete("/delete_service/:id", verifyToken, adminOnly, deleteService);

// booking management routes for admin can be added here
router.get("/bookings", verifyToken, adminOnly, getAllBookings);
router.get("/bookings/:id", verifyToken, adminOnly, getBookingById);
router.get("/bookings_today", verifyToken, adminOnly, getTodayBookings);
export default router;
