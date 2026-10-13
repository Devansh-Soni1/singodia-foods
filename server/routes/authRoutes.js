import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  addAddress, 
  deleteAddress, 
  toggleWishlist 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/toggle', protect, toggleWishlist);

export default router;

