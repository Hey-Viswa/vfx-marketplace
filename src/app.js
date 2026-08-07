import express from 'express';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { stripeWebhook } from './controllers/webhookController.js';

const app = express();

app.post(
  '/api/webhook/stripe',
  express.raw({
    type: 'application/json',
  }),
  stripeWebhook,
);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/payments', paymentRoutes);

export default app;
