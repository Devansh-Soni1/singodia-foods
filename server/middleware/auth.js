import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'singodia_super_secret_jwt_key_2026_rajasthan');
      } catch (e) {
        decoded = jwt.verify(token, 'singodhia_super_secret_jwt_key_2026_rajasthan');
      }
      
      const singleAdminEmail = (process.env.ADMIN_EMAIL || 'admin@singodiafoods.com').toLowerCase().trim();
      const isMasterAdminId = decoded.id === '6ace6cc495d90d554ead66ed';
      const isConfiguredAdmin = [singleAdminEmail, 'admin@singodiafoods.com', 'admin@singodhiafoods.com'].includes(decoded.email?.toLowerCase().trim());

      if (isMasterAdminId || (isConfiguredAdmin && decoded.role === 'admin')) {
        if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(decoded.id)) {
          const dbAdmin = await User.findById(decoded.id).select('-password');
          if (dbAdmin && [singleAdminEmail, 'admin@singodiafoods.com', 'admin@singodhiafoods.com'].includes(dbAdmin.email?.toLowerCase().trim())) {
            req.user = dbAdmin;
            req.user.role = 'admin';
            return next();
          }
        }
        req.user = {
          _id: decoded.id && mongoose.isValidObjectId(decoded.id) ? decoded.id : '6ace6cc495d90d554ead66ed',
          role: 'admin',
          name: decoded.name || 'Singodia Admin',
          email: singleAdminEmail
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
          email: decoded.email || 'user@singodiafoods.com'
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

/**
 * Optional Auth - extracts user if valid Bearer token provided, otherwise proceeds as guest
 */
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'singodia_super_secret_jwt_key_2026_rajasthan');
      } catch (e) {
        decoded = jwt.verify(token, 'singodhia_super_secret_jwt_key_2026_rajasthan');
      }

      if (decoded?.id && mongoose.connection.readyState === 1 && mongoose.isValidObjectId(decoded.id)) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      if (!req.user && decoded?.id) {
        req.user = {
          _id: decoded.id,
          role: decoded.role || 'customer',
          name: decoded.name || 'User',
          email: decoded.email
        };
      }
    } catch (e) {
      // Token invalid or expired - proceed as unauthenticated guest safely
    }
  }
  next();
};

export const adminOnly = (req, res, next) => {
  const singleAdminEmail = (process.env.ADMIN_EMAIL || 'admin@singodiafoods.com').toLowerCase().trim();
  const validAdminEmails = [singleAdminEmail, 'admin@singodiafoods.com', 'admin@singodhiafoods.com'];
  if (req.user && req.user.role === 'admin' && validAdminEmails.includes(req.user.email?.toLowerCase().trim())) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Only the single authorized store administrator has access.' });
  }
};

