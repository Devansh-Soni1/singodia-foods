import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../middleware/upload.js';

const router = express.Router();

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

router.post('/', (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        // Upload to Cloudinary cloud CDN
        const uploadPromises = req.files.map(file => {
          return cloudinary.uploader.upload(file.path, {
            folder: 'singodia-foods/products'
          });
        });
        const results = await Promise.all(uploadPromises);
        const urls = results.map(r => r.secure_url);
        return res.json({
          success: true,
          message: 'Image uploaded to Cloudinary successfully',
          url: urls[0],
          urls
        });
      }
    } catch (cloudErr) {
      console.warn('Cloudinary upload warning, falling back to local file:', cloudErr.message);
    }

    // Local file fallback
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: urls[0],
      urls
    });
  });
});

export default router;
