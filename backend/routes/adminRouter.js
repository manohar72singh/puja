import express from "express";

import { adminOnly } from "../middleware/admin.js";
import { deleteUser, getAllUsers, getDashboardStats, getMonthlyGrowthChart, getUserById, updateUser} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
// Admin Dashboard Routes
router.get("/dashboard",verifyToken, adminOnly, getDashboardStats);

// chart data for admin dashboard
router.get("/monthly-growth", verifyToken, adminOnly, getMonthlyGrowthChart);

// User Management, CRUD Operations Routes for Admin
router.get("/users", verifyToken, adminOnly, getAllUsers);
router.get("/users/:id", verifyToken, adminOnly, getUserById);
router.put("/users/:id", verifyToken, adminOnly, updateUser);
router.delete("/users/:id", verifyToken, adminOnly, deleteUser);

export default router;