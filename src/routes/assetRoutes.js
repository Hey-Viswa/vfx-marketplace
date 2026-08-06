import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { createAsset, getAllAssets } from '../controllers/assetController.js';
// Add this import:
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAssets);
// Add requireAuth as the FIRST middleware before Multer:
router.post('/', requireAuth, upload.single('file'), createAsset);

export default router;
