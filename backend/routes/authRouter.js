import express from 'express';
import { signupRequest, signupVerify, loginRequest, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup-request', signupRequest);
router.post('/signup-verify', signupVerify);
router.post('/login-request', loginRequest);
router.post('/verify-otp', verifyOtp);

export default router;