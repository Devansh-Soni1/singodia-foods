import express from 'express';
import { 
  getProductReviews, 
  addReview, 
  getAllReviews, 
  updateReviewStatus, 
  deleteReview 
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', addReview);

// Admin routes
router.get('/', protect, adminOnly, getAllReviews);
router.put('/:id/status', protect, adminOnly, updateReviewStatus);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;

