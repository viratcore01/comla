// backend/models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  appliedAt: { type: Date, default: Date.now },
  documents: [{ type: String }] // Array of file paths
});

module.exports = mongoose.model("Application", applicationSchema);
