import mongoose from 'mongoose';
import fs from 'fs';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Setting from '../models/Setting.js';
import { v2 as cloudinary } from 'cloudinary';
import { sampleProducts, sampleSettings } from '../utils/seedData.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalProducts = 0;
    let totalCustomers = 0;
    let recentOrders = [];
    let lowStockProducts = [];

    if (mongoose.connection.readyState === 1) {
      totalProducts = await Product.countDocuments();
      totalCustomers = await User.countDocuments({ role: 'customer' });
      totalOrders = await Order.countDocuments();

      const revenueAgg = await Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      totalRevenue = revenueAgg[0]?.total || 0;

      recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);
      lowStockProducts = await Product.find({ 'variants.stockCount': { $lte: 15 } }).limit(5);
    } else {
      totalProducts = sampleProducts.length;
      totalCustomers = 18;
      totalOrders = 34;
      totalRevenue = 28450;
      recentOrders = [
        {
          _id: 'sample-ord-1',
          orderNumber: 'SGF-261009-8421',
          customer: { name: 'Pooja Agarwal', email: 'pooja@example.com', phone: '9876543210' },
          totalAmount: 898,
          paymentMethod: 'razorpay',
          paymentStatus: 'completed',
          orderStatus: 'Processing',
          createdAt: new Date()
        },
        {
          _id: 'sample-ord-2',
          orderNumber: 'SGF-261008-1192',
          customer: { name: 'Rajesh Singhal', email: 'rajesh@example.com', phone: '9822334455' },
          totalAmount: 1199,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          orderStatus: 'Shipped',
          createdAt: new Date(Date.now() - 86400000)
        }
      ];
    }

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    let customers = [];
    if (mongoose.connection.readyState === 1) {
      customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    } else {
      customers = [
        { _id: 'cust-1', name: 'Aarav Sharma', email: 'customer@example.com', phone: '+91 98765 12345', createdAt: new Date() },
        { _id: 'cust-2', name: 'Pooja Agarwal', email: 'pooja@example.com', phone: '+91 98221 54321', createdAt: new Date() }
      ];
    }
    res.json({ success: true, customers });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    let settings = {};
    if (mongoose.connection.readyState === 1) {
      const records = await Setting.find();
      records.forEach(r => { settings[r.key] = r.value; });
    }
    
    // Merge defaults
    sampleSettings.forEach(s => {
      if (settings[s.key] === undefined) {
        settings[s.key] = s.value;
      }
    });

    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;

    // Helper to upload base64 image data URI to Cloudinary if found in settings
    const uploadBase64ToCloudinary = async (dataUri, folder) => {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        try {
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
          });
          const result = await cloudinary.uploader.upload(dataUri, {
            folder: `singodia-foods/${folder}`
          });
          return result.secure_url;
        } catch (e) {
          console.warn(`Cloudinary upload failed for ${folder}:`, e.message);
        }
      }
      return dataUri;
    };

    // Auto-upload Hero Banner image to Cloudinary if it is Base64
    if (updates.heroBannerImage && typeof updates.heroBannerImage === 'string' && updates.heroBannerImage.startsWith('data:image/')) {
      updates.heroBannerImage = await uploadBase64ToCloudinary(updates.heroBannerImage, 'banners');
    }

    // Auto-upload Trial Pack items to Cloudinary if any item has Base64
    if (Array.isArray(updates.trialPackItems)) {
      for (const item of updates.trialPackItems) {
        if (item.image && typeof item.image === 'string' && item.image.startsWith('data:image/')) {
          item.image = await uploadBase64ToCloudinary(item.image, 'trial-pack');
        }
      }
    }

    for (const [key, value] of Object.entries(updates)) {
      if (mongoose.connection.readyState === 1) {
        await Setting.findOneAndUpdate(
          { key },
          { key, value },
          { upsert: true, new: true }
        );
      }
    }
    res.json({ success: true, message: 'Settings updated successfully', settings: updates });
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const requestedFolder = req.body?.folder || req.query?.folder || 'admin';
  const targetFolder = `singodia-foods/${requestedFolder}`;

  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: targetFolder
      });
      return res.json({
        success: true,
        message: 'Image uploaded to Cloudinary successfully',
        url: result.secure_url
      });
    }
  } catch (err) {
    console.warn('Admin Cloudinary upload warning, falling back to local storage:', err.message);
  }

  // Fallback: Return permanent base64 Data URI so Render ephemeral disk wipes never cause 404
  try {
    const fileData = fs.readFileSync(req.file.path);
    const mime = req.file.mimetype || 'image/jpeg';
    const dataUrl = `data:${mime};base64,${fileData.toString('base64')}`;
    return res.json({
      success: true,
      message: 'Image uploaded and encoded permanently',
      url: dataUrl
    });
  } catch {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = process.env.BACKEND_URL || `${protocol}://${host}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl
    });
  }
};

