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
import { debugSweph, generateKundli } from './controllers/kundliController.js';
import nameCorrectionRouter from "./controllers/nameCorrectionController.js";
import chatRouter from "./routes/chatRouter.js";
import initChatSocket from "./socket/chatSocket.js";
import contribution from "./routes/contributionRouter.js";
import pool from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { Groq } from "groq-sdk";
import fetch from "node-fetch";
import { generatePDF } from './controllers/pdfReport.js';

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// API Key initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAIResponse = async (prompt) => {
    try {
        // 🔱 PAID KEY ke liye 1.5-flash sabse best hai (Fast & Accurate)
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) return text;
        throw new Error("Gemini returned empty text");

    } catch (err) {
        console.error("🔱 Gemini Primary Error:", err.message);

        // Backup 1: Gemini 1.5 Pro (Agar Flash mein koi dikkat aaye)
        try {
            console.log("⚠️ Switching to Gemini 1.5 Pro...");
            const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const proResult = await proModel.generateContent(prompt);
            const proResponse = await proResult.response;
            return proResponse.text();
        } catch (proErr) {
            console.error("❌ All Gemini Models Failed:", proErr.message);
            throw proErr; // Yeh seedha aapke Groq backup (Socket logic) ko trigger karega
        }
    }
};

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => { cb(null, file.originalname); },
});
export const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["polling", "websocket"],
});

const userStates = new Map();
const PANDIT_PROMPT = `Aap 'Sri Vedic Puja Kendra' ke mukhya Pandit Ji hain. 
1. Har jawab "🙏 Om Namah Shivay" se shuru karein.
2. Agar user general gyaan puche, toh seedha jawab dein.
3. Agar user koi samasya (Job, Health, Marriage) bataye, toh reply mein 'TRIGGER_KUNDLI' keyword zaroor likhein. 
DO NOT ask for details yourself, just say 'TRIGGER_KUNDLI'.`;

// =============================================
// 🔱 AI PANDIT JI — SOCKET LOGIC
// =============================================

const setupAIPandit = (io) => {
    const panditNS = io.of("/pandit");

    panditNS.on("connection", (socket) => {
        console.log("🔱 Smart Pandit Connected:", socket.id);

        socket.on("ai_query", async ({ text }) => {
            try {
                let state = userStates.get(socket.id) || { step: 'chat', data: {}, history: [] };

                if (state.step === 'collecting') {
                    const reply = await handleCollection(socket, text, state);
                    userStates.set(socket.id, state);
                    return socket.emit("ai_response", { text: reply, sender: "bot", timestamp: new Date() });
                }

                let reply = "";
                try {
                    const prompt = `${PANDIT_PROMPT}\n\nChat History: ${JSON.stringify(state.history)}\nUser: ${text}`;
                    reply = await getAIResponse(prompt);
                    console.log("✅ Response from Gemini (Main)");
                } catch (geminiError) {
                    console.error("⚠️ Switching to Groq Backup...");
                    const completion = await groq.chat.completions.create({
                        messages: [
                            { role: "system", content: PANDIT_PROMPT },
                            ...state.history,
                            { role: "user", content: text }
                        ],
                        model: "llama-3.3-70b-versatile",
                    });
                    reply = completion.choices[0]?.message?.content || "";
                    console.log("✅ Response from Groq (Backup)");
                }

                if (reply.includes("TRIGGER_KUNDLI")) {
                    state.step = 'collecting';
                    state.subStep = 'name';
                    userStates.set(socket.id, state);
                    return socket.emit("ai_response", {
                        text: "🙏 Om Namah Shivay! Is samasya ke vishleshan ke liye mujhe aapke grahon ki sthiti dekhni hogi. Kripya apna **Pura Naam (Full Name)** batayein.",
                        sender: "bot",
                        timestamp: new Date(),
                    });
                }

                socket.emit("ai_response", { text: reply, sender: "bot", timestamp: new Date() });
                state.history.push({ role: "user", content: text }, { role: "assistant", content: reply });
                if (state.history.length > 6) state.history.shift();
                userStates.set(socket.id, state);

            } catch (error) {
                console.error("Critical Pandit Error:", error);
                socket.emit("ai_response", { text: "🙏 Om Namah Shivay! Kripya thodi der baad koshish karein.", sender: "bot" });
            }
        });

        socket.on("disconnect", () => userStates.delete(socket.id));
    });
};

async function handleCollection(socket, text, state) {
    const steps = {
        name: { next: 'dob', msg: "Dhanyawad. Ab apni **Janm Tithi** batayein (DD-MM-YYYY)." },
        dob: { next: 'tob', msg: "Uttam. Aapka **Janm Samay** kya hai? (HH:MM AM/PM)" },
        tob: { next: 'city', msg: "Aapka **Janm Sthan** (City) kaunsa hai?" },
        city: { next: 'gender', msg: "Aapka **Gender** (Male/Female)?" },
        gender: { next: 'complete', msg: "🙏 Prateeksha karein, grahon ki ganana ho rahi hai..." }
    };

    const current = state.subStep;
    state.data[current] = text;

    if (steps[current].next !== 'complete') {
        state.subStep = steps[current].next;
        return steps[current].msg;
    } else {
        try {
            const { name, dob, tob, city, gender } = state.data;
            const rawData = await generateKundli(name, dob, tob, city, gender);
            const analysisPrompt = `Aap ek vidvaan Pandit hain. Is Kundli data ka vishleshan karein: ${JSON.stringify(rawData)}`;

            let finalReport = "";
            try {
                finalReport = await getAIResponse(analysisPrompt);
            } catch (e) {
                const interpret = await groq.chat.completions.create({
                    messages: [{ role: "user", content: analysisPrompt }],
                    model: "llama-3.3-70b-versatile"
                });
                finalReport = interpret.choices[0].message.content;
            }

            state.step = 'chat';
            state.data = {};
            return finalReport;
        } catch (err) {
            state.step = 'chat';
            return "🙏 Ganana mein truti hui. Kripya punah koshish karein.";
        }
    }
}

// REST OF ROUTES
setupAIPandit(io);
initChatSocket(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("Server running ✅"));

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
            debugSweph();
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();