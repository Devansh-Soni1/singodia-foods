import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Setting from '../models/Setting.js';
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

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    url: fileUrl
  });
};

