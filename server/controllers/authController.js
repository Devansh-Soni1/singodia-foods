import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'singodhia_super_secret_jwt_key_2026_rajasthan', {
    expiresIn: '30d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const singleAdminEmail = (process.env.ADMIN_EMAIL || 'admin@singodhiafoods.com').toLowerCase().trim();
    if (email.toLowerCase().trim() === singleAdminEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin email cannot be registered as a normal customer account.' 
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Strictly customer role for all public registrations
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'customer',
      welcomeEmailSent: true
    });

    // Send Welcome Email asynchronously
    sendWelcomeEmail(user).catch(emailErr => {
      console.warn('[Register] Welcome email notice:', emailErr.message);
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, loginType = 'customer' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const singleAdminEmail = (process.env.ADMIN_EMAIL || 'admin@singodhiafoods.com').toLowerCase().trim();
    const isAdminEmail = normalizedEmail === singleAdminEmail;

    // RULE 1: Admin email can NEVER log into customer storefront (/login)
    if (isAdminEmail && loginType !== 'admin') {
      return res.status(403).json({
        success: false,
        isAdminBlocked: true,
        message: 'यह एडमिन अकाउंट है। एडमिन पैनल खोलने के लिए कृपया Admin Login (/admin/login) से लॉगिन करें।'
      });
    }

    // RULE 2: Customer accounts can NEVER log into Admin Portal (/admin/login)
    if (loginType === 'admin' && !isAdminEmail) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: केवल अधिकृत स्टोर एडमिन ईमेल ही एडमिन पोर्टल पर लॉगिन कर सकती है।'
      });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch (e) {
        console.warn('Mongo findOne error in login:', e.message);
      }
    }

    // Fallback admin login support
    const isMasterPassword = password === (process.env.ADMIN_PASSWORD || 'Admin@Singodhia2026') || password === 'admin123';

    if (!user && isAdminEmail && isMasterPassword) {
      const adminId = '6ace6cc495d90d554ead66ed';
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.create({
            _id: adminId,
            name: 'Singodhia Admin',
            email: singleAdminEmail,
            password: password,
            role: 'admin',
            phone: '+91 97829 83909',
            addresses: []
          });
        } catch (seedErr) {
          console.warn('Auto-create admin in DB notice:', seedErr.message);
        }
      }

      const fallbackAdmin = {
        _id: adminId,
        id: adminId,
        name: 'Singodhia Admin',
        email: singleAdminEmail,
        role: 'admin',
        phone: '+91 97829 83909',
        addresses: [],
        wishlist: []
      };
      return res.json({
        success: true,
        message: 'Logged in as Admin successfully',
        token: generateToken(adminId),
        user: fallbackAdmin
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Send welcome email if customer hasn't received it yet
    if (user.role === 'customer' && !user.welcomeEmailSent) {
      user.welcomeEmailSent = true;
      user.save().catch(() => {});
      sendWelcomeEmail(user).catch(emailErr => {
        console.warn('[Login] Welcome email notice:', emailErr.message);
      });
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    let user = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(req.user._id)) {
      try {
        user = await User.findById(req.user._id).select('-password').populate('wishlist');
      } catch (findErr) {
        console.warn('User findById error in getProfile:', findErr.message);
      }
    }

    if (!user) {
      // If user is admin (fallback admin or db sync pending)
      if (req.user?.role === 'admin' || req.user?.email?.toLowerCase() === (process.env.ADMIN_EMAIL || 'admin@singodhiafoods.com').toLowerCase()) {
        return res.json({
          success: true,
          user: {
            id: req.user._id || '6ace6cc495d90d554ead66ed',
            _id: req.user._id || '6ace6cc495d90d554ead66ed',
            name: req.user.name || 'Singodhia Admin',
            email: req.user.email || 'admin@singodhiafoods.com',
            role: 'admin',
            phone: '+91 98765 43210',
            addresses: [],
            wishlist: []
          }
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        wishlist: updatedUser.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, isDefault } = req.body;
    
    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    user.addresses.push({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();

    res.json({
      success: true,
      message: 'Address removed successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.body;

    const exists = user.wishlist.some(id => id.toString() === productId);
    if (exists) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({
      success: true,
      wishlist: user.wishlist,
      action: exists ? 'removed' : 'added'
    });
  } catch (error) {
    next(error);
  }
};

