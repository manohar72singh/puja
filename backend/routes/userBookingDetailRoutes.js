import express from 'express';
import {userBookingDetailController, bookings,getAllBookingDetails, getPartnerBookingDetails, updateBookingStatusController} from '../controllers/userBookingDetailController.js';
import { verifyToken } from '../middleware/auth.js';


// get deatils for booking
const router = express.Router();

router.get('/details', verifyToken, userBookingDetailController);
router.post('/bookings',verifyToken, bookings)
router.get('/allBookings',verifyToken,getAllBookingDetails)
router.get('/partnerBookings', verifyToken, getPartnerBookingDetails);
//accept / decline booking
router.put('/updateBooking/:bookingId',verifyToken, updateBookingStatusController)
export default router;
