const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { authenticateToken } = require("../middleware/auth");
const College = require("../models/College");
const User = require("../models/User");

// POST /api/colleges - Add a new college
router.post("/", [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('courses').isArray({ min: 1 }).withMessage('At least one course is required'),
  body('website').optional().isURL().withMessage('Invalid website URL'),
  body('fees').optional().isNumeric().withMessage('Fees must be a number')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, image, description, location, courses, website, fees } = req.body;
    const newCollege = new College({ name, image, description, location, courses, website, fees });
    await newCollege.save();
    res.json({ message: "College added successfully", college: newCollege });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/colleges - Get all colleges
router.get("/", async (req, res) => {
  try {
    // Try database first
    const colleges = await College.find({}).sort({ ranking: 1 });
    if (colleges && colleges.length > 0) {
      return res.json(colleges);
    }

    // Fallback to demo data if database is empty or unavailable
    console.log('⚠️ Using demo data - database not available or empty');
    const demoColleges = [
      {
        _id: "1",
        name: "Delhi University",
        image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop&crop=center",
        description: "One of India's premier universities with excellent placement records and diverse academic programs.",
        location: "Delhi",
        courses: ["Computer Science", "Business Administration", "Engineering", "Arts", "Commerce"],
        website: "https://www.du.ac.in",
        fees: 50000,
        ranking: 1
      },
      {
        _id: "2",
        name: "IIT Delhi",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=center",
        description: "Premier engineering institute known for cutting-edge research and innovation.",
        location: "Delhi",
        courses: ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
        website: "https://www.iitd.ac.in",
        fees: 200000,
        ranking: 2
      },
      {
        _id: "3",
        name: "Mumbai University",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=center",
        description: "Historic university offering comprehensive education in various disciplines.",
        location: "Mumbai",
        courses: ["Information Technology", "Commerce", "Science", "Management"],
        website: "https://www.mu.ac.in",
        fees: 75000,
        ranking: 3
      }
    ];
    res.json(demoColleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    // Fallback to demo data on any error
    const demoColleges = [
      {
        _id: "1",
        name: "Delhi University",
        image: "https://via.placeholder.com/400x300?text=Delhi+University",
        description: "One of India's premier universities with excellent placement records.",
        location: "Delhi",
        courses: ["Computer Science", "Business Administration"],
        website: "https://www.du.ac.in",
        fees: 50000,
        ranking: 1
      }
    ];
    res.json(demoColleges);
  }
});

// GET /api/colleges/:id - Get college by ID
router.get("/:id", async (req, res) => {
  // Use mock data directly to avoid database casting issues
  console.log('📚 Fetching college with ID:', req.params.id);

  const mockColleges = [
    {
      _id: "1",
      name: "Delhi University",
      image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop&crop=center",
      description: "One of India's premier universities with excellent placement records and diverse academic programs.",
      location: "Delhi",
      courses: ["Computer Science", "Business Administration", "Engineering", "Arts", "Commerce"],
      website: "https://www.du.ac.in",
      fees: 50000,
      ranking: 1
    },
    {
      _id: "2",
      name: "IIT Delhi",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=center",
      description: "Premier engineering institute known for cutting-edge research and innovation.",
      location: "Delhi",
      courses: ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
      website: "https://www.iitd.ac.in",
      fees: 200000,
      ranking: 2
    },
    {
      _id: "3",
      name: "Mumbai University",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=center",
      description: "Historic university offering comprehensive education in various disciplines.",
      location: "Mumbai",
      courses: ["Information Technology", "Commerce", "Science", "Management"],
      website: "https://www.mu.ac.in",
      fees: 75000,
      ranking: 3
    }
  ];

  const mockCollege = mockColleges.find(c => c._id === req.params.id);
  if (mockCollege) {
    console.log('✅ Found college in mock data:', mockCollege.name);
    return res.json(mockCollege);
  }

  // Try database as fallback (but avoid casting errors)
  try {
    const college = await College.findOne({ _id: req.params.id });
    if (college) {
      console.log('✅ Found college in database:', college.name);
      return res.json(college);
    }
  } catch (error) {
    console.log('⚠️ Database query failed, using only mock data');
  }

  console.log('❌ College not found with ID:', req.params.id);
  return res.status(404).json({ error: "College not found" });
});

// Mock search route removed - using real implementation below

// GET /api/colleges/filter/:userId
router.get("/filter/:userId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Build filter query
    let filter = {};

    if (user.location) {
      filter.location = user.location;
    }

    if (user.preferredCourses?.length > 0) {
      filter.courses = { $in: user.preferredCourses };
    }

    if (user.minBudget || user.maxBudget) {
      filter.fees = {};
      if (user.minBudget) filter.fees.$gte = user.minBudget;
      if (user.maxBudget) filter.fees.$lte = user.maxBudget;
    }

    const colleges = await College.find(filter);
    res.json(colleges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/colleges/search - Advanced search with filters and pagination
router.get("/search", async (req, res) => {
  try {
    const { q, location, courses, minFees, maxFees, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 10 } = req.query;

    let filter = {};

    // Text search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Courses filter
    if (courses) {
      const courseArray = courses.split(',').map(c => c.trim());
      filter.courses = { $in: courseArray };
    }

    // Fees filter
    if (minFees || maxFees) {
      filter.fees = {};
      if (minFees) filter.fees.$gte = parseInt(minFees);
      if (maxFees) filter.fees.$lte = parseInt(maxFees);
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const colleges = await College.find(filter).sort(sortOptions).skip(skip).limit(limitNum);
    const total = await College.countDocuments(filter);

    res.json({
      colleges,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalColleges: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({ error: "Failed to search colleges" });
  }
});

// POST /api/colleges/filter - AI-powered filtering based on student profile
router.post("/filter", async (req, res) => {
  try {
    const { subjects, competitiveExams, preferredCourses, location, minBudget, maxBudget } = req.body;

    let filter = {};

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Courses filter
    if (preferredCourses?.length > 0) {
      filter.courses = { $in: preferredCourses };
    }

    // Budget filter
    if (minBudget || maxBudget) {
      filter.fees = {};
      if (minBudget) filter.fees.$gte = minBudget;
      if (maxBudget) filter.fees.$lte = maxBudget;
    }

    const colleges = await College.find(filter);

    // Simple ranking based on matches
    const rankedColleges = colleges.map(college => {
      let score = 0;

      // Course match
      if (preferredCourses?.some(course => college.courses.includes(course))) score += 30;

      // Location match
      if (location && college.location.toLowerCase().includes(location.toLowerCase())) score += 20;

      // Budget match
      if (college.fees >= (minBudget || 0) && college.fees <= (maxBudget || Infinity)) score += 20;

      // Ranking bonus
      if (college.ranking) score += (11 - college.ranking) * 5; // Higher ranking, higher score

      return { ...college.toObject(), matchScore: score };
    });

    // Sort by score descending
    rankedColleges.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ colleges: rankedColleges.slice(0, 10) }); // Top 10
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
