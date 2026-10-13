import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';
import Product from './models/Product.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const isConnected = await connectDB();

  if (isConnected && mongoose.connection.readyState === 1) {
    try {
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log('Database is empty. Automatically initializing seed data...');
        await seedDatabase();
      }
    } catch (err) {
      console.warn('Auto-seed check error:', err.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🥒 Singodhia Foods API Server is running on port ${PORT}`);
    console.log(`🌶️ Health check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
};

startServer();

