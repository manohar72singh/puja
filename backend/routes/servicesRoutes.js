import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { allServices } from "../controllers/servicesController.js";

const router = express.Router();


router.get('/allServices',verifyToken,allServices)



export default router;