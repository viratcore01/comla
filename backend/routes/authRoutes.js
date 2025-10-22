import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Login
router.post("/login", [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create access token (short-lived)
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // 15 minutes
    );

    // Create refresh token (long-lived)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // 7 days
    );

    console.log(`[AUTH] JWT tokens generated for user ${user.email}`);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Refresh token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      // Get user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create new access token
      const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      console.log(`[AUTH] Access token refreshed for user ${user.email}`);

      res.json({
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user profile
router.get("/profile/:userId", authenticateToken, async (req, res) => {
  try {
    // Ensure user can only view their own profile
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized to view this profile" });
    }

    // Mock user profile
    const user = { _id: req.params.userId, name: "Mock User", email: "mock@example.com", role: "student", subjects: ["Math"], competitiveExams: ["JEE"], ranks: [], preferredCourses: ["CSE"], location: "Delhi", minBudget: 10000, maxBudget: 50000 };
    res.json({ user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
router.put("/profile/:userId", authenticateToken, [
  body('subjects').optional().isArray().withMessage('Subjects must be an array'),
  body('competitiveExams').optional().isArray().withMessage('Competitive exams must be an array'),
  body('preferredCourses').optional().isArray().withMessage('Preferred courses must be an array'),
  body('ranks').optional().isArray().withMessage('Ranks must be an array'),
  body('location').optional().isString().trim(),
  body('minBudget').optional().custom((value) => {
    if (value === '' || value === undefined) return true;
    return !isNaN(value);
  }).withMessage('Min budget must be a number'),
  body('maxBudget').optional().custom((value) => {
    if (value === '' || value === undefined) return true;
    return !isNaN(value);
  }).withMessage('Max budget must be a number')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;

    // Ensure user can only update their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this profile" });
    }

    const updates = req.body;

    // Mock update
    const user = { _id: userId, name: "Mock User", email: "mock@example.com", role: "student", ...updates };
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
