import express from 'express';
import { 
  createOrder, 
  verifyPayment, 
  discardPendingOrder,
  getOrderById, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { orderRateLimiter } from '../middleware/security.js';

const router = express.Router();

router.post('/', protect, orderRateLimiter, createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/discard-pending', discardPendingOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', optionalAuth, getOrderById);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;

