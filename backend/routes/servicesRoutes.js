import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { bookPuja, getServicesByType, bookingDetails, getUserBookings, templePuja,templePujaSingle } from "../controllers/servicesController.js";

const router = express.Router();


router.get('/allServices/:type',  getServicesByType)
router.get('/bookPuja/:id', bookPuja)
router.post('/bookingDetails',verifyToken, bookingDetails);
router.get('/my-bookings',verifyToken, getUserBookings);
router.get("/temple-puja", templePuja);
router.get("/temple-puja/:id", templePujaSingle);


export default router;