import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { bookPuja, getServicesByType,bookingDetails } from "../controllers/servicesController.js";

const router = express.Router();


router.get('/allServices/:type',verifyToken,getServicesByType)
router.get('/bookPuja/:id', verifyToken, bookPuja)
router.post('/bookingDetail',verifyToken,bookingDetails)



export default router;