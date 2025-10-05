// server/routes/collegeRoutes.js
const express = require("express");
const router = express.Router();
const College = require("../models/College");
const User = require("../models/User");

// Get matching colleges for a user
router.get("/match/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Simple filter example: match location and budget
    const query = {};
    if (user.collegeLocation) {
      query.location = user.collegeLocation;
    }
    if (user.minBudget && user.maxBudget) {
      query.fees = { $gte: user.minBudget, $lte: user.maxBudget };
    }

    const colleges = await College.find(query);
    res.json(colleges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
