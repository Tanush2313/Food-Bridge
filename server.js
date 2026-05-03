import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import foodItemsRouter from './routes/foodItems.js';
import './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/fooditems', foodItemsRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Food Bridge API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});