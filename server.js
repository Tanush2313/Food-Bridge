import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import foodItemsRouter from './routes/foodItems.js';
import ngosRouter from './routes/ngos.js';
import './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/fooditems', foodItemsRouter);
app.use('/api/ngos', ngosRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Food Bridge API' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});