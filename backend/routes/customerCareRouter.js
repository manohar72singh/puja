import express from "express";
import { customerCareOnly } from "../middleware/customerCare.js";
import { verifyToken } from "../middleware/auth.js";
import { getAllPujaRequests, getFilterPujaRequests, updatePujaStatus } from "../controllers/customerCareController.js";

const router = express.Router();

router.get("/dashboard", verifyToken, customerCareOnly, getAllPujaRequests);
router.get("/filterData", verifyToken,customerCareOnly, getFilterPujaRequests);
router.put("/update-status/:id", verifyToken, customerCareOnly, updatePujaStatus);

export default router;