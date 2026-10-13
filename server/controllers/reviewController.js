import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { sampleReviews } from '../utils/seedData.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let reviews = [];

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(productId)) {
      reviews = await Review.find({ product: productId, isApproved: true }).sort({ createdAt: -1 });
    }

    if (!reviews || reviews.length === 0) {
      reviews = sampleReviews;
    }

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { product, reviewerName, rating, title, comment, location } = req.body;

    if (!reviewerName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide name, rating, and review comment' });
    }

    const review = await Review.create({
      product: product || new mongoose.Types.ObjectId(),
      user: req.user ? req.user._id : null,
      reviewerName,
      rating: Number(rating),
      title: title || '',
      comment,
      location: location || 'India',
      isVerifiedBuyer: true,
      isApproved: true
    });

    // Update product rating if possible
    if (mongoose.connection.readyState === 1 && product && mongoose.Types.ObjectId.isValid(product)) {
      const prodReviews = await Review.find({ product, isApproved: true });
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      await Product.findByIdAndUpdate(product, {
        rating: Math.round(avg * 10) / 10,
        numReviews: prodReviews.length
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      review
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    let reviews = [];
    if (mongoose.connection.readyState === 1) {
      reviews = await Review.find().populate('product', 'name slug').sort({ createdAt: -1 });
    } else {
      reviews = sampleReviews;
    }

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(id, { isApproved }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review status updated', review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

