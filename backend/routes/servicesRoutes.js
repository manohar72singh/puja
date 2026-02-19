import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { bookPuja, getServicesByType, bookingDetails, getUserBookings, templePuja,templePujaSingle } from "../controllers/servicesController.js";

const router = express.Router();


router.get('/allServices/:type',  getServicesByType)
router.get('/bookPuja/:id', bookPuja)

//jo user puja book kar rha hai vo sabhi booking puja requests mai ja rahi hai
router.post('/bookingDetails',verifyToken, bookingDetails);

//user ko uski sare bookings dikh rahi hai..
router.get('/my-bookings',verifyToken, getUserBookings);


router.get("/temple-puja", templePuja);
router.get("/temple-puja/:id", templePujaSingle);


export default router;