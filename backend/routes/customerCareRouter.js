import express from "express";
import { customerCareOnly } from "../middleware/customerCare.js";
import { verifyToken } from "../middleware/auth.js";
import {
  getAllPujaRequests,
  getFilterPujaRequests,
  updatePujaStatus,
  customerSignupRequest,
  customerSignupVerify,
  CusomterLoginRequest,
  customerVerifyOtp,
  getAllPandits,
  getAllUsers,
  assignPandit,
  getAllSupportQueries,
  updateQueryStatus,
} from "../controllers/customerCareController.js";

const router = express.Router();

// -------- AUTH --------
router.post("/signup-request", customerSignupRequest);
router.post("/signup-verify", customerSignupVerify);
router.post("/login-request", CusomterLoginRequest);
router.post("/verify-otp", customerVerifyOtp);

router.get("/dashboard", verifyToken, customerCareOnly, getAllPujaRequests);
router.get("/filterData", verifyToken, customerCareOnly, getFilterPujaRequests);

router.put(
  "/update-status/:id",
  verifyToken,
  customerCareOnly,
  updatePujaStatus,
);
router.patch(
  "/assign-pandit/:bookingId",
  verifyToken,
  customerCareOnly,
  assignPandit,
);

router.get("/allPandits", verifyToken, customerCareOnly, getAllPandits);

router.get("/allUsers", verifyToken, customerCareOnly, getAllUsers);

// customercare routes with query
router.get(
  "/support-queries",
  verifyToken,
  customerCareOnly,
  getAllSupportQueries,
);
router.put(
  "/support-queries/:id/status",
  verifyToken,
  customerCareOnly,
  updateQueryStatus,
);

export default router;
