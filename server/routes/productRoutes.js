import express from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  getFeaturedAndBestsellers,
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedAndBestsellers);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;

