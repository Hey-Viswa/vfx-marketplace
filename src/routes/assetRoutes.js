import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import {
  createAsset,
  getAllAssets,
  updateAsset,
} from '../controllers/assetController.js';
// Add this import:
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAssets);

router.post('/', requireAuth, upload.single('file'), createAsset);

router.put('/:id', requireAuth, updateAsset);

export default router;
