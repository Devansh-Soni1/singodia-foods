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

    // 3. Permanent Data URI Fallback:
    // Render and similar platforms have ephemeral disks that wipe /uploads/ on reboot.
    // By returning base64 Data URIs when Cloudinary isn't available, images are saved
    // directly inside MongoDB Atlas and will NEVER disappear or 404!
    try {
      const urls = req.files.map(f => {
        try {
          const fileData = fs.readFileSync(f.path);
          const mime = f.mimetype || 'image/jpeg';
          return `data:${mime};base64,${fileData.toString('base64')}`;
        } catch {
          const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
          const host = req.headers['x-forwarded-host'] || req.get('host');
          const baseUrl = process.env.BACKEND_URL || `${protocol}://${host}`;
          return `${baseUrl}/uploads/${f.filename}`;
        }
      });

      return res.json({
        success: true,
        message: 'Image uploaded and encoded permanently',
        url: urls[0],
        urls
      });
    } catch (fallbackErr) {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = req.headers['x-forwarded-host'] || req.get('host');
      const baseUrl = process.env.BACKEND_URL || `${protocol}://${host}`;
      const urls = req.files.map(f => `${baseUrl}/uploads/${f.filename}`);
      return res.json({
        success: true,
        message: 'Image uploaded successfully',
        url: urls[0],
        urls
      });
    }
  });
});

export default router;
