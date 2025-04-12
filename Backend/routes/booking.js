import express from 'express';
import { getSeats, book, reset } from '../controllers/bookingController.js';
import { verifyToken } from './auth.js';

const router = express.Router();

router.get('/seats', getSeats);
router.post('/book', verifyToken, book);
router.post('/reset', reset);

export default router;