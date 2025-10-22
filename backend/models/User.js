import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'college', 'admin'], default: 'student' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }, // For college role
  subjects: [{
    name: String,
    marks: Number // e.g., 95 (percentage)
  }],
  competitiveExams: [{
    exam: String,
    rank: Number // e.g., 5000
  }],
  preferredCourses: [String], // e.g., ["Computer Science", "Engineering"]
  location: String, // e.g., "Delhi", "Maharashtra"
  minBudget: Number,
  maxBudget: Number,
  documents: [String], // File paths for uploaded documents
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }] // Favorite colleges
});

// Add indexes for performance
userSchema.index({ preferredCourses: 1 }); // For filtering
userSchema.index({ location: 1 }); // For location-based matching

export default mongoose.model("User", userSchema);
