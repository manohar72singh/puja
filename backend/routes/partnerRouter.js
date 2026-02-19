// routes/partnerRoutes.js
import express from "express";
import { verifyToken } from "../middleware/auth.js"; // Pandit ka token check karne ke liye
import { getMyAssignedPujas, getPanditProfile, updatePanditProfile } from "../controllers/partnerController.js";

const router = express.Router();

router.get("/my-pujas", verifyToken, getMyAssignedPujas);

router.get("/profile", verifyToken, getPanditProfile);

// ✅ Add this PUT route
router.put("/update-profile", verifyToken, updatePanditProfile);

export default router;
