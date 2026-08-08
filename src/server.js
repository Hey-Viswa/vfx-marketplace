import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Health Check Route
app.get('/api/health', (req, res) => {
  res
    .status(200)
    .json({ message: 'VFX Marketplace API is running with ES6 Modules!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is locked and loaded on port ${PORT}`);
});
