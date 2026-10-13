import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Setting from './models/Setting.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const isConnected = await connectDB();

  if (isConnected && mongoose.connection.readyState === 1) {
    try {
      const settingCount = await Setting.countDocuments();
      // Only seed once on initial creation, never resurrect deleted products on reboot
      if (settingCount === 0) {
        console.log('Fresh database detected. Initializing first-time seed data...');
        await seedDatabase();
      } else {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@singodhiafoods.com').toLowerCase();
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
          console.log(`Admin user missing in DB, creating default admin account (${adminEmail})...`);
          await User.create({
            name: 'Singodhia Admin',
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD || 'Admin@Singodhia2026',
            role: 'admin',
            phone: '+91 98765 43210',
            addresses: []
          });
        }
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

