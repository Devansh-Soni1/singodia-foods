import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'singodhia_super_secret_jwt_key_2026_rajasthan');
      
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@singodhiafoods.com').toLowerCase();
      const adminEmails = [
        adminEmail,
        'singodia.bajranglal9@gmail.com',
        'premsingodiya861@gmail.com'
      ];
      const isMasterAdminId = decoded.id === 'admin-master' || decoded.id === 'admin-dev' || decoded.id === 'admin-fallback' || decoded.id === '6ace6cc495d90d554ead66ed';
      const isConfiguredAdmin = adminEmails.includes(decoded.email?.toLowerCase());

      if (isMasterAdminId || isConfiguredAdmin || decoded.role === 'admin') {
        if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(decoded.id)) {
          const dbAdmin = await User.findById(decoded.id).select('-password');
          if (dbAdmin) {
            req.user = dbAdmin;
            req.user.role = 'admin';
            return next();
          }
        }
        req.user = {
          _id: decoded.id && mongoose.isValidObjectId(decoded.id) ? decoded.id : '6ace6cc495d90d554ead66ed',
          role: 'admin',
          name: decoded.name || 'Singodhia Admin',
          email: decoded.email || adminEmail
        };
        return next();
      }

      if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(decoded.id)) {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        req.user = {
          _id: decoded.id && mongoose.isValidObjectId(decoded.id) ? decoded.id : '6ace6cc495d90d554ead66f1',
          role: decoded.role || 'customer',
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
  const adminEmails = [
    (process.env.ADMIN_EMAIL || 'admin@singodhiafoods.com').toLowerCase(),
    'singodia.bajranglal9@gmail.com',
    'premsingodiya861@gmail.com'
  ];
  if (req.user && (req.user.role === 'admin' || adminEmails.includes(req.user.email?.toLowerCase()))) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
  }
};

