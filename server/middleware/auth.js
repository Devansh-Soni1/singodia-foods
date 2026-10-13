import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'singodhia_super_secret_jwt_key_2026_rajasthan');
      
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          req.user = {
            _id: decoded.id || 'admin-fallback',
            role: decoded.role || (decoded.email === 'admin@singodhiafoods.com' ? 'admin' : 'customer'),
            name: decoded.name || 'User',
            email: decoded.email || 'user@singodhiafoods.com'
          };
        }
      } else {
        req.user = {
          _id: decoded.id || 'admin-fallback',
          role: decoded.role || (decoded.email === 'admin@singodhiafoods.com' ? 'admin' : 'customer'),
          name: decoded.name || 'User',
          email: decoded.email || 'user@singodhiafoods.com'
        };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided. Please log in.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
  }
};

