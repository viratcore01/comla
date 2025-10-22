import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import applicationRoutes from "./routes/ApplicationRoutes.js";

const app = express();

// CORS configuration
const allowedOrigins = ["http://localhost:3000", "https://comla.vercel.app"];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin like mobile apps, Postman, curl
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight OPTIONS requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Auth rate limiting (disabled for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 auth requests per windowMs for development
  message: "Too many authentication attempts, please try again later."
});
app.use("/api/auth", authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test root route
app.get("/", (req, res) => {
  res.send("Backend is live ✅");
});

app.use("/auth", authRoutes);
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

// Error handling middleware
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
