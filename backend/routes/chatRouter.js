// routes/chatRoutes.js
import express from "express";
import {
  getAllSessions,
  getSessionById,
  getAvailableAgents,
  getMySessions,
} from "../controllers/chatController.js";
import {verifyToken} from "../middleware/auth.js"; // aapka existing middleware

const router = express.Router();

// User apni sessions dekhe
router.get("/my-sessions", verifyToken, getMySessions);

// Available agents
router.get("/available-agents", verifyToken, getAvailableAgents);

// Sab sessions (customerCare + admin)
router.get("/sessions", verifyToken, getAllSessions);

// Ek session detail
router.get("/sessions/:sessionId", verifyToken, getSessionById);

export default router;