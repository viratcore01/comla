const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME &&
         process.env.CLOUDINARY_API_KEY &&
         process.env.CLOUDINARY_API_SECRET;
};

// Local storage configuration (for development)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Cloudinary storage configuration (for production)
const cloudinaryStorage = multer.memoryStorage(); // Store in memory for Cloudinary upload

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.'));
  }
};

// Create multer upload middleware
const upload = multer({
  storage: isCloudinaryConfigured() ? cloudinaryStorage : localStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Helper function to get file URL
const getFileUrl = (file) => {
  if (isCloudinaryConfigured()) {
    // Cloudinary URL - file.path contains the Cloudinary URL after upload
    return file.path || file.url;
  } else {
    // Local URL
    return `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${file.filename}`;
  }
};

// Upload file to Cloudinary
const uploadToCloudinary = async (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'comla-applications',
        public_id: `application-${Date.now()}-${filename.split('.')[0]}`,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Delete file from storage
const deleteFile = async (filePath) => {
  if (isCloudinaryConfigured()) {
    // Delete from Cloudinary
    try {
      // Extract public_id from Cloudinary URL
      const urlParts = filePath.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `comla-applications/${publicIdWithExtension.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.warn('Failed to delete from Cloudinary:', error.message);
    }
  } else {
    // Delete from local filesystem
    const localPath = path.join('uploads', filePath);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }
};

module.exports = {
  upload,
  getFileUrl,
  deleteFile,
  uploadToCloudinary,
  isCloudinaryConfigured
};