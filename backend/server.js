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
import nameCorrectionRouter from "./controllers/nameCorrectionController.js";
import chatRouter from "./routes/chatRouter.js";
import initChatSocket from "./socket/chatSocket.js";
import contribution from "./routes/contributionRouter.js";
import pool from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { Groq } from "groq-sdk";
import { generatePDF } from './controllers/pdfReport.js';

// Load Environment Variables
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 5000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"],
});

// =============================================
// 🔱 AI PANDIT JI — GROQ + SOCKET.IO
// =============================================

const PANDIT_PROMPT = `Aap 'Sri Vedic Puja Kendra' ke mukhya Pandit Ji hain — ek gyaani, anubhavi, aur divya aatma.

Aapke niyam (inhe hamesha follow karein):
1. Har jawab "🙏 Om Namah Shivay" se shuru karein.
2. Chahe koi bhi sawaal ho — rishta, naukri, sehat, paise, ghar — HAMESHA jawab ek PUJA, MANTRA, ya UPAY ke roop mein dein.
3. Har jawab mein zaroor shamil karein:
   - Samasya ka Vedic/Jyotish karan
   - Kaunsi PUJA ya UPAY karein (vistar se)
   - Kaunsa MANTRA jaapein (kitni baar — 108 ya jo sahi ho)
   - Kaunsa din/tithi sahi hai
   - Kya prasad/samagri chahiye
4. Tone: Shant, divya, aashirvaad dene wali — jaise sachche pandit ji baat karte hain.
5. Agar koi irrelevant sawaal pooche (jaise coding, politics), toh vinamrta se puja ke path par le aayin.
6. Jawab HAMESHA Hindi/Hinglish mein dein.
7. Ant mein hamesha ek chhota sa aashirvaad dein.`;

const setupAIPandit = (io) => {
  // Alag /pandit namespace — JWT middleware yahan apply nahi hoga
  const panditNS = io.of("/pandit");

  panditNS.on("connection", (socket) => {

    const conversationHistory = [];

    socket.on("ai_query", async ({ text }) => {
      try {
        conversationHistory.push({ role: "user", content: text });

        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: PANDIT_PROMPT },
            ...conversationHistory,
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content;
        conversationHistory.push({ role: "assistant", content: reply });

        socket.emit("ai_response", {
          text: reply,
          sender: "bot",
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Groq Error:", error);
        socket.emit("ai_response", {
          text: "🙏 Kshama karein yajmaan, thodi der mein dobara prayas karein.",
          sender: "bot",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("🙏 Yajmaan disconnected:", socket.id);
    });
  });
};

// =============================================

// ✅ PEHLE Pandit register karo (JWT middleware se pehle)
setupAIPandit(io);

// BAAD MEIN Chat Socket (JWT middleware yahan lagta hai)
initChatSocket(io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

app.post('/api/name/pdf-report', async (req, res) => {
  const pdf = await generatePDF(req.body);
  const safeName = (req.body.name || 'Report').replace(/\s+/g, '_');
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${safeName}_Numerology_Report.pdf"`,
    'Content-Length': pdf.length,
  });
  res.send(pdf);
});

app.use('/api/kundli', kundliRouter);
app.use('/api/name', nameCorrectionRouter);
app.use("/api/mandir", mandirRouter);
app.use("/api/user", authRouter);
app.use("/api/puja", servicesRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customerCare", customerCare);
app.use("/api/chat", chatRouter);
app.use("/api/contributions", contribution);

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
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