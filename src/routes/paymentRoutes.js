import express from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/checkout', requireAuth, paymentController);

export default router;