import express from "express";
import { getContributionsByService } from "../controllers/contribution.js";

const router = express.Router();
router.get("/:serviceId", getContributionsByService);
export default router;
