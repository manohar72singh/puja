import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  bookPuja,
  getServicesByType,
  bookingDetails,
  getUserBookings,
  templePuja,
  templePujaSingle,
  pindDan,
  PindDanSingle,
  homeORKathaPujaBookingDetails,
  cancelBooking
} from "../controllers/servicesController.js";

const router = express.Router();

router.get("/allServices/:type", getServicesByType);
router.get("/bookPuja/:id", verifyToken, bookPuja);

//jo user puja book kar rha hai vo sabhi booking puja requests mai ja rahi hai
router.post("/bookingDetails", verifyToken, bookingDetails);
router.delete("/cancel-booking/:id", verifyToken, cancelBooking);

// home puja booking details
router.post(
  "/home_KathaPujaBookingDetails",
  verifyToken,
  homeORKathaPujaBookingDetails,
);
//user ko uski sare bookings dikh rahi hai..
router.get("/my-bookings", verifyToken, getUserBookings);

router.get("/temple-puja", templePuja);
router.get("/temple-puja/:id", templePujaSingle);

router.get("/pind-dan", pindDan);
router.get("/pind-dan/:id", PindDanSingle);

export default router;
