import express from 'express';
import { 
  register, 
  login, 
  adminRequestOtp,
  adminVerifyOtp,
  googleLogin, 
  getProfile, 
  updateProfile, 
  addAddress, 
  deleteAddress,
  setDefaultAddress, 
  toggleWishlist 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';

const router = express.Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/admin/request-otp', authRateLimiter, adminRequestOtp);
router.post('/admin/verify-otp', authRateLimiter, adminVerifyOtp);
router.post('/google', googleLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.put('/address/:addressId/default', protect, setDefaultAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/toggle', protect, toggleWishlist);

export default router;
