import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Dynamically allow requesting origin for credentials support
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root & API status endpoint (prevents 404 on browser navigation)
app.get(['/', '/api'], (req, res) => {
  res.json({
    success: true,
    message: '🥒 Singodhia Foods API Server is Live & Running!',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      coupons: '/api/coupons',
      reviews: '/api/reviews',
      adminSettings: '/api/admin/settings/public',
      shipping: '/api/shipping/status'
    },
    service: 'Singodhia Foods E-commerce API',
    brand: 'Singodhia Foods — Desi Homemade Pickles',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Singodhia Foods E-commerce API',
    brand: 'Singodhia Foods — Desi Homemade Pickles'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/shipping', shippingRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

