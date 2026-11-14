import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `pickle-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg|mp4|webm|mov|mkv|ogg/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp, svg) and video files (mp4, webm, mov, mkv) are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60 MB limit for images & videos
  fileFilter
});

