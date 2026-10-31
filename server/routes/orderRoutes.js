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
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/discard-pending', discardPendingOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', getOrderById);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;

