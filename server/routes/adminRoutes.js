import express from 'express';
import { 
  getDashboardStats, 
  getCustomers, 
  deleteCustomer,
  getSettings, 
  updateSettings,
  uploadImage,
  testTelegramAlert 
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Publicly read settings (for announcements, shipping threshold, whatsapp)
router.get('/settings/public', getSettings);

// Protected admin routes
router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);
router.get('/customers', protect, adminOnly, getCustomers);
router.delete('/customers/:id', protect, adminOnly, deleteCustomer);
router.get('/settings', protect, adminOnly, getSettings);
router.put('/settings', protect, adminOnly, updateSettings);
router.post('/upload', protect, adminOnly, upload.single('image'), uploadImage);
router.post('/test-telegram', protect, adminOnly, testTelegramAlert);

export default router;

