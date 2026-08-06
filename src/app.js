import express from 'express';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);

export default app;
