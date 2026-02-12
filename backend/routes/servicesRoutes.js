import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { allServices, bookPuja } from "../controllers/servicesController.js";

const router = express.Router();


router.get('/allServices',verifyToken,allServices)
router.get('/bookPuja/:id', verifyToken, bookPuja)



export default router;