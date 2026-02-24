import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import servicesRouter from "./routes/servicesRoutes.js";
import partnerRouter from "./routes/partnerRouter.js";
import adminRouter from "./routes/adminRouter.js";
import customerCare from "./routes/customerCareRouter.js";
import mandirRouter from "./routes/mandirRouter.js";
import pool from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares (Sabke peeche semicolon zaroori hai)
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

//get mandir
app.use("/mandir", mandirRouter);

// 3. Routes
app.use("/user", authRouter);
app.use("/puja", servicesRouter);
app.use("/partner", partnerRouter);

// admin routes
app.use("/admin", adminRouter);

// customer care routes
app.use("/customerCare", customerCare);

// 4. 🔥 DATABASE CONNECTION + SERVER START
// Is IIFE (async function) se pehle semicolon lagana best practice hai
const startServer = async () => {
  try {
    // Database connection check
    await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");

    // Server Listen
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
    process.exit(1); // Error hone par process band kar dein
  }
};

// Start the sequence
startServer();
