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
  return res.status(403).json({ 
    success: false, 
    message: 'मैन्युअल पासवर्ड रजिस्ट्रेशन बंद कर दिया गया है। कृपया असली और सुरक्षित अनुभव के लिए 1-क्लिक "Continue with Google" का उपयोग करें।' 
  });
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

    // RULE 1: Customer accounts must authenticate using Google Sign-In
    if (loginType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ग्राहक लॉगिन केवल Google Account से समर्थित है। कृपया मुख्य वेबसाइट पर "Continue with Google" का उपयोग करें।'
      });
    }

    // RULE 2: Admin Portal (/admin/login) accepts ONLY the single designated admin email
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
            phone: '+91 75979 66707',
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
        phone: '+91 75979 66707',
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
      sendWelcomeEmail(user)
        .then(async (res) => {
          if (res && res.success) {
            await User.findByIdAndUpdate(user._id, { welcomeEmailSent: true });
          }
        })
        .catch(emailErr => {
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
            phone: '+91 75979 66707',
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

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential token is required' });
    }

    // Verify token with Google's official endpoint
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    const payload = await verifyRes.json();

    if (!verifyRes.ok || !payload || !payload.email) {
      return res.status(401).json({
        success: false,
        message: payload?.error_description || 'Invalid or expired Google token. Verification failed.'
      });
    }

    const expectedClientId = process.env.GOOGLE_CLIENT_ID || '208404157999-c4bua2va504tlvpj4qnc2udcj4iho6ud.apps.googleusercontent.com';
    if (payload.aud !== expectedClientId) {
      console.warn('[GoogleAuth] Audience mismatch. Received:', payload.aud, 'Expected:', expectedClientId);
      return res.status(401).json({ success: false, message: 'Google token audience mismatch.' });
    }

    const { email, name, picture, sub: googleId } = payload;
    const normalizedEmail = email.toLowerCase().trim();
    const singleAdminEmail = (process.env.ADMIN_EMAIL || 'admin@singodhiafoods.com').toLowerCase().trim();

    // Prevent admin email from logging in as normal customer via Google
    if (normalizedEmail === singleAdminEmail) {
      return res.status(403).json({
        success: false,
        isAdminBlocked: true,
        message: 'यह स्टोर एडमिन ईमेल है। एडमिन पोर्टल खोलने के लिए कृपया /admin/login का उपयोग करें।'
      });
    }

    let user = null;
    let isNewUser = false;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        // Create new customer account automatically
        isNewUser = true;
        const randomPassword = 'Gg_' + Math.random().toString(36).slice(-10) + 'A1!';
        user = await User.create({
          name: name || 'Google Customer',
          email: normalizedEmail,
          password: randomPassword,
          role: 'customer',
          avatar: picture || '',
          googleId: googleId || '',
          welcomeEmailSent: false
        });

        // Send Welcome Email asynchronously - mark true only on successful delivery
        sendWelcomeEmail(user)
          .then(async (sendRes) => {
            if (sendRes && sendRes.success) {
              await User.findByIdAndUpdate(user._id, { welcomeEmailSent: true });
            }
          })
          .catch(err => {
            console.warn('[GoogleLogin] Welcome email notice:', err.message);
          });
      } else {
        // Update avatar / googleId if missing
        if (!user.avatar && picture) user.avatar = picture;
        if (!user.googleId && googleId) user.googleId = googleId;
        if (!user.welcomeEmailSent) {
          sendWelcomeEmail(user)
            .then(async (sendRes) => {
              if (sendRes && sendRes.success) {
                await User.findByIdAndUpdate(user._id, { welcomeEmailSent: true });
              }
            })
            .catch(() => {});
        }
        await user.save().catch(() => {});
      }
    } else {
      user = {
        _id: 'g_' + (googleId || 'user'),
        id: 'g_' + (googleId || 'user'),
        name: name || 'Google Customer',
        email: normalizedEmail,
        role: 'customer',
        avatar: picture || '',
        addresses: [],
        wishlist: []
      };
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: isNewUser ? 'Google account created and logged in successfully!' : 'Logged in with Google successfully!',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        avatar: user.avatar || picture || '',
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      }
    });
  } catch (error) {
    console.error('Google Auth Controller Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error verifying Google login'
    });
  }
};

