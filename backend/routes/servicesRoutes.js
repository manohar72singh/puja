import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { bookPuja, getServicesByType,bookingDetails,getUserBookings, templePuja } from "../controllers/servicesController.js";

const router = express.Router();


router.get('/allServices/:type',verifyToken,getServicesByType)
router.get('/bookPuja/:id', verifyToken, bookPuja)
router.post('/bookingDetails', verifyToken, bookingDetails);
router.get('/my-bookings', verifyToken, getUserBookings);
router.get("/temple-puja", templePuja);


export default router;