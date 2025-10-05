const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const User = require("../models/User");
const College = require("../models/College");
const Application = require("../models/Application");
const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Get all users
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update user role
router.put("/users/:id/role", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all colleges
router.get("/colleges", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const colleges = await College.find({});
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update college
router.put("/colleges/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(college);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete college
router.delete("/colleges/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    res.json({ message: "College deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all applications
router.get("/applications", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const applications = await Application.find({}).populate('student college');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update application status
router.put("/applications/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;