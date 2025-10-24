require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

const authRoutes = require("./routes/authRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const applicationRoutes = require("./routes/ApplicationRoutes");

const app = express();

// Safety net: Prevent path-to-regexp error on Render by removing DEBUG_URL
if (process.env.DEBUG_URL) {
  delete process.env.DEBUG_URL;
}

// Initialize Sentry (only if DSN is provided and valid)
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'https://your-sentry-dsn-here@sentry.io/project-id') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      // Add profiling integration
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in production, 100% in development
    // Release Health
    enableTracing: true,
    // Set profiling sample rate
    profilesSampleRate: 1.0,
  });

  console.log('✅ Sentry error monitoring initialized');
} else {
  console.log('⚠️ Sentry DSN not configured or invalid - error monitoring disabled');
}

// Sentry request handler removed - using only error monitoring

// CORS configuration - Allow all origins for now to debug
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));

// Handle preflight OPTIONS requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 auth requests per windowMs for development
  message: "Too many authentication attempts, please try again later."
});
app.use("/api/auth", authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is live ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/applications", applicationRoutes);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    // Don't exit process in production, let it retry
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  });

// Sentry error handler removed - using only basic error monitoring

// Custom error handler (fallback after Sentry)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
