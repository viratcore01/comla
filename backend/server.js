const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeSentry, sentryErrorHandler } = require('./utils/sentry');
const authRoutes = require('./routes/authRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const applicationRoutes = require('./routes/ApplicationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Sentry (must be first)
initializeSentry();

// Environment variable validation
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('📝 Please check your .env file and ensure all required variables are set.');
  console.error('🔧 For production, set MONGO_URI to your MongoDB Atlas connection string');
  process.exit(1);
}

// Validate MongoDB URI format
const mongoUri = process.env.MONGO_URI;
if (!mongoUri.includes('mongodb') && !mongoUri.includes('mongodb+srv')) {
  console.error('❌ Invalid MONGO_URI format. Must start with mongodb:// or mongodb+srv://');
  console.error('🔧 For production: mongodb+srv://username:password@cluster.mongodb.net/comla?retryWrites=true&w=majority');
  process.exit(1);
}

console.log('✅ Environment variables validated');
console.log(`🔗 Database: ${mongoUri.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'}`);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

app.use('/api/auth/', authLimiter);

app.use(express.json({ limit: '10mb' })); // Increase limit for file uploads

// CORS configuration - allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://comla.vercel.app'
].filter(Boolean);

app.use(require('cors')({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Sentry error handler (must be last)
app.use(sentryErrorHandler);

// MongoDB connection with retry logic and graceful fallback
const connectDB = async (retries = 5) => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/comla';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error(`❌ MongoDB connection attempt failed:`, error.message);

    if (retries > 0) {
      console.log(`🔄 Retrying connection in 3 seconds... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 3000);
    } else {
      console.error('💥 All MongoDB connection attempts failed. Running in offline mode with mock data.');
      console.log('📝 To fix: Set up MongoDB Atlas or start local MongoDB instance');
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS Origins: ${allowedOrigins.join(', ')}`);

  // Attempt database connection
  await connectDB();
});
