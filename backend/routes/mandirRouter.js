import express from 'express';
import { getMandirList, getMandirDetails } from '../controllers/mandirController.js';

const router = express.Router();

router.get('/all', getMandirList);
router.get('/:id', getMandirDetails);

export default router;