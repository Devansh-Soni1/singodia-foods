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
import { 
  apiRateLimiter, 
  securityHeaders, 
  botScraperProtection 
} from './middleware/security.js';

const app = express();

// Allowed Storefront Origins Whitelist
const ALLOWED_ORIGINS = [
  'https://singodiafoodstore.in',
  'https://www.singodiafoodstore.in',
  'https://singodia-foods.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

// 1. Strict CORS Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or whitelisted storefront origins
    if (
      !origin || 
      ALLOWED_ORIGINS.includes(origin) || 
      /^https:\/\/singodia-foods.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS security policy: Origin not allowed.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Client-Signature']
}));

// 2. HTTP Security Headers & Bot Protection
app.use(securityHeaders);
app.use(botScraperProtection);

// 3. API Rate Limiting (150 requests / min / IP)
app.use('/api', apiRateLimiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded and static product files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/products', express.static(path.join(process.cwd(), 'uploads')));

// Minimal Root & API Status Endpoint (does not leak internal endpoints)
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'online',
    service: 'Singodia Foods API',
    brand: 'Singodia Foods — Desi Homemade Pickles',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Singodia Foods E-commerce API'
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
