import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js';
import { sampleCoupons } from '../utils/seedData.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide coupon code' });
    }

    const upperCode = code.trim().toUpperCase();
    let coupon = null;

    if (mongoose.connection.readyState === 1) {
      coupon = await Coupon.findOne({ code: upperCode, isActive: true });
    }

    if (!coupon) {
      coupon = sampleCoupons.find(c => c.code === upperCode && c.isActive);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (coupon.validTill && new Date() > new Date(coupon.validTill)) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    const orderAmount = Number(subtotal) || 0;
    if (coupon.minOrderValue && orderAmount < coupon.minOrderValue) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue}. Add items worth ₹${coupon.minOrderValue - orderAmount} more!` 
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, orderAmount);

    res.json({
      success: true,
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discount)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    let coupons = [];
    if (mongoose.connection.readyState === 1) {
      coupons = await Coupon.find().sort({ createdAt: -1 });
    }
    if (!coupons || coupons.length === 0) {
      coupons = sampleCoupons;
    }
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created', coupon });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon updated', coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
};

