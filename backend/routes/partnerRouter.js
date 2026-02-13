// routes/partnerRoutes.js
import express from "express";
import { verifyToken } from "../middleware/auth.js"; // Pandit ka token check karne ke liye
import { getAvailableHomePujas, updateBookingStatus, getMyAcceptedPujas } from "../controllers/partnerController.js";

const router = express.Router();

router.get("/available-pujas", verifyToken, getAvailableHomePujas);
router.post("/update-status", verifyToken, updateBookingStatus);
router.get("/my-accepted-pujas", verifyToken, getMyAcceptedPujas);

export default router;