import db from '../config/db.js'
import jwt from 'jsonwebtoken'

let otpStore = {}; // Temporary memory for OTPs

// --- 1. SIGNUP REQUEST ---
export const signupRequest = async (req, res) => {
    try {
        const { name, phone, email, gotra } = req.body;
        if (!phone || !name) return res.status(400).json({ message: "Name and Phone are required" });

        const [existing] = await db.query("SELECT id FROM users WHERE phone = ?", [phone]);
        if (existing.length > 0) return res.status(409).json({ message: "Already registered. Please Login." });

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[phone] = {
            userData: { name, phone, email, gotra },
            otp: otp,
            type: 'SIGNUP',
            expires: Date.now() + 10 * 60 * 1000 
        };

        console.log(`\n--- SIGNUP OTP FOR ${phone}: ${otp} ---\n`);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// --- 2. SIGNUP VERIFY ---
export const signupVerify = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const session = otpStore[phone];

        if (session && session.type === 'SIGNUP' && session.otp.toString() === otp.toString()) {
            if (Date.now() > session.expires) {
                delete otpStore[phone];
                return res.status(400).json({ message: "OTP Expired" });
            }

            const { name, email, gotra } = session.userData;
            const [result] = await db.query(
                "INSERT INTO users (name, phone, email, gotra) VALUES (?, ?, ?, ?)",
                [name, phone, email || null, gotra || null]
            );

            delete otpStore[phone];
            const token = jwt.sign({ id: result.insertId, name, phone ,email}, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            res.status(201).json({ message: "Verified!", token });
        } else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Verification failed" });
    }
};

// --- 3. LOGIN REQUEST ---
export const loginRequest = async (req, res) => {
    try {
        const { phone } = req.body;
        const [rows] = await db.query("SELECT id FROM users WHERE phone = ?", [phone]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found." });

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[phone] = { otp, type: 'LOGIN', expires: Date.now() + 5 * 60 * 1000 };

        console.log(`\n--- LOGIN OTP FOR ${phone}: ${otp} ---\n`);
        res.status(200).json({ message: "OTP sent" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// --- 4. LOGIN VERIFY (verifyOtp) ---
export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const session = otpStore[phone];

        if (session && session.type === 'LOGIN' && session.otp.toString() === otp.toString()) {
            const [rows] = await db.query("SELECT id, name, phone, email FROM users WHERE phone = ?", [phone]);
            delete otpStore[phone];
            const token = jwt.sign({ id: rows[0].id, name: rows[0].name }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            res.status(200).json({ message: "Login success", token });
        } else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed" });
    }
};