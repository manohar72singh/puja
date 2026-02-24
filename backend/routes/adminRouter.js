import express from "express";

import { adminOnly } from "../middleware/admin.js";
import {
  AdminLoginRequest,
  AdminVerifyOtp,
  createService,
  createUser,
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
import path from "path";

import multer from "multer";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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

// router.get("/services", verifyToken, adminOnly, getAllServices);
// router.get("/services/:id", verifyToken, adminOnly, getServiceById);
// router.post("/create_services", verifyToken, adminOnly, createService);
// router.put("/update_service/:id", verifyToken, adminOnly, updateService);
// router.delete("/delete_service/:id", verifyToken, adminOnly, deleteService);

router.get("/services", verifyToken, adminOnly, getAllServices);
router.get("/services/:id", verifyToken, adminOnly, getServiceById);
router.post("/services", verifyToken, adminOnly, createService);
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
export default router;
