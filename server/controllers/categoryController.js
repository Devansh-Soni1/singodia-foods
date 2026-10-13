import mongoose from 'mongoose';
import Category from '../models/Category.js';
import { sampleCategories } from '../utils/seedData.js';

export const getCategories = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
      return res.json({
        success: true,
        categories
      });
    }
    res.json({
      success: true,
      categories: sampleCategories
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, hindiName, slug, description, image, displayOrder } = req.body;
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await Category.create({
      name,
      hindiName,
      slug: catSlug,
      description,
      image,
      displayOrder: displayOrder || 0
    });
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

