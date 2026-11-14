import express from 'express';
import { 
  getDashboardStats, 
  getCustomers, 
  deleteCustomer,
  getPublicSettings,
  getSettings, 
  updateSettings,
  uploadImage,
  testTelegramAlert 
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Publicly read settings (filtered safe storefront keys only)
router.get('/settings/public', getPublicSettings);

// Protected admin routes
router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);
router.get('/customers', protect, adminOnly, getCustomers);
router.delete('/customers/:id', protect, adminOnly, deleteCustomer);
router.get('/settings', protect, adminOnly, getSettings);
router.put('/settings', protect, adminOnly, updateSettings);
router.post('/upload', protect, adminOnly, upload.single('image'), uploadImage);
router.post('/test-telegram', protect, adminOnly, testTelegramAlert);

export default router;

