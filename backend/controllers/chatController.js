// controllers/chatController.js
import pool from "../config/db.js";

// Sessions memory mein (production mein Redis use karo)
export const sessions = {};

// GET /api/chat/sessions — sirf customerCare + admin
export const getAllSessions = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "customerCare" && role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const sessionList = Object.values(sessions);

    const enrichedSessions = await Promise.all(
      sessionList.map(async (session) => {
        try {
          const [rows] = await pool.query(
            "SELECT id, name, email, role FROM users WHERE id = ?",
            [session.userId]
          );
          return { ...session, userInfo: rows[0] || null };
        } catch {
          return session;
        }
      })
    );

    res.json({
      success: true,
      sessions: enrichedSessions,
      total: enrichedSessions.length,
      active: enrichedSessions.filter((s) => s.status === "active").length,
      waiting: enrichedSessions.filter((s) => s.status === "waiting").length,
    });
  } catch (error) {
    console.error("getAllSessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/chat/sessions/:sessionId
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { role, id: requesterId } = req.user;

    const session = sessions[sessionId];
    if (!session) return res.status(404).json({ message: "Session nahi mili" });

    if (role === "user" && session.userId !== requesterId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/chat/available-agents
export const getAvailableAgents = async (req, res) => {
  try {
    const [agents] = await pool.query(
      "SELECT id, name, email FROM users WHERE role = ?",
      ["customerCare"]
    );
    res.json({ success: true, agents, total: agents.length });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/chat/my-sessions
export const getMySessions = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const userSessions = Object.values(sessions).filter((s) => s.userId === userId);
    res.json({ success: true, sessions: userSessions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};