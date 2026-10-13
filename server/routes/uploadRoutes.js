import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../middleware/upload.js';
import axios from 'axios';
import fs from 'fs';

const router = express.Router();

router.post('/', (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // 1. Try Cloudinary Signed Upload
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const uploadPromises = req.files.map(file => {
          return cloudinary.uploader.upload(file.path, {
            folder: 'singodia-foods/products'
          });
        });
        const results = await Promise.all(uploadPromises);
        const urls = results.map(r => r.secure_url);
        return res.json({
          success: true,
          message: 'Image uploaded to Cloudinary CDN successfully',
          url: urls[0],
          urls
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning:', cloudErr.message);
      }
    }

    // 2. Try Cloudinary Unsigned Upload (if preset configured)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
      try {
        const uploadPromises = req.files.map(async file => {
          const base64 = fs.readFileSync(file.path, { encoding: 'base64' });
          const mime = file.mimetype;
          const dataUri = `data:${mime};base64,${base64}`;
          const r = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
            file: dataUri,
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
          });
          return r.data.secure_url;
        });
        const urls = await Promise.all(uploadPromises);
        return res.json({
          success: true,
          message: 'Image uploaded to Cloudinary CDN successfully',
          url: urls[0],
          urls
        });
      } catch (presetErr) {
        console.warn('Cloudinary preset upload warning:', presetErr.message);
      }
    }

    // 3. Local file fallback so uploading NEVER breaks
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
