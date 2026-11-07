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

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/request-otp', adminRequestOtp);
router.post('/admin/verify-otp', adminVerifyOtp);
router.post('/google', googleLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.put('/address/:addressId/default', protect, setDefaultAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/toggle', protect, toggleWishlist);

export default router;
