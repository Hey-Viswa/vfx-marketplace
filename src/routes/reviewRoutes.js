import express from 'express';
import {
  createReview,
  getAssetReviews,
} from '../controllers/reviewController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/asset/:assetId', getAssetReviews);
router.post('/', verifyToken, createReview);

export default router;
