import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRouter from "./routes/authRouter.js";
import servicesRouter from "./routes/servicesRoutes.js";
import partnerRouter from "./routes/partnerRouter.js";
import adminRouter from "./routes/adminRouter.js";
import customerCare from "./routes/customerCareRouter.js";
import mandirRouter from "./routes/mandirRouter.js";
import kundliRouter from './routes/kundliRouter.js';
import { debugSweph } from './controllers/kundliController.js';
import chatRouter from "./routes/chatRouter.js"
import initChatSocket from "./socket/chatSocket.js";
import contribution from "./routes/contributionRouter.js";
import pool from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server + Socket.io ke liye
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Chat Socket initialize
initChatSocket(io);

// 1. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 2. Health check
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

app.use('/api/kundli', kundliRouter);

// get mandir
app.use("/mandir", mandirRouter);

// 3. Routes
app.use("/user", authRouter);
app.use("/puja", servicesRouter);
app.use("/partner", partnerRouter);

// admin routes
app.use("/admin", adminRouter);

// customer care routes
app.use("/customerCare", customerCare);

// chat routes
app.use("/api/chat", chatRouter);

// contribution
app.use("/contributions", contribution);

// 4. DATABASE CONNECTION + SERVER START
const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");

    // app.listen ki jagah server.listen — Socket.io ke liye zaroori hai
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡  Kundli endpoint: POST http://localhost:${PORT}/api/kundli/generate\n`);
      console.log(`💬  Chat Socket ready on port ${PORT}`);
      debugSweph();
    });
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();