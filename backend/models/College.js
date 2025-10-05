// backend/models/College.js
const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: String,
  images: [String],       // Array of image URLs
  description: String,
  location: String,       // e.g., Delhi, Mumbai
  courses: [String],      // e.g., ["CSE", "BBA"]
  website: String,
  fees: Number,           // Average fee (used for budget filter)
  placementStats: {
    averageSalary: Number, // e.g., 500000
    highestSalary: Number, // e.g., 2000000
    placementRate: Number  // e.g., 85 (percentage)
  },
  reviews: [{
    user: String,         // User name
    rating: Number,       // 1-5
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  ranking: Number         // e.g., 1 (national ranking)
});

// Pre-save hook to set default image if not provided
collegeSchema.pre('save', function(next) {
  if (!this.image || this.image.trim() === '') {
    this.image = "https://res.cloudinary.com/dytimzerg/image/upload/v1698765432/colleges/default-college.jpg";
  }
  next();
});

// Add indexes for performance
collegeSchema.index({ name: 'text', location: 'text', description: 'text' }); // Text search index
collegeSchema.index({ location: 1 }); // Location filter index
collegeSchema.index({ courses: 1 }); // Courses filter index
collegeSchema.index({ fees: 1 }); // Fees sorting/filtering index
collegeSchema.index({ name: 1 }); // Name sorting index

module.exports = mongoose.model('College', collegeSchema);
