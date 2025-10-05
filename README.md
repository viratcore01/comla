# Comla - College Finder & Application Platform

A full-stack MERN application for students to discover, compare, and apply to colleges with personalized recommendations and secure document management.

## 🚀 Features

- **Smart College Discovery**: AI-powered recommendations based on student profiles
- **Advanced Search & Filtering**: Location, courses, fees, rankings
- **Secure Authentication**: JWT with refresh tokens
- **Application Management**: Complete application lifecycle tracking
- **File Upload**: Secure document storage (AWS S3/Local)
- **Role-Based Access**: Student, College Admin, and System Admin roles
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Error Monitoring**: Sentry integration for production monitoring

## 🛠️ Tech Stack

### Frontend
- React 19 with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer for file uploads
- AWS SDK for S3 integration
- Sentry for error monitoring

### DevOps
- Jest for testing
- Cypress for E2E testing
- Docker support
- CI/CD ready

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- AWS Account (for S3, optional)
- Sentry Account (for error monitoring, optional)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd comla

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Setup

#### Backend (.env)
```bash
# Database
MONGO_URI=mongodb://localhost:27017/comla

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here_minimum_32_characters

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=comla-documents

# Email (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Error Monitoring (optional)
SENTRY_DSN=https://your-sentry-dsn-here@sentry.io/project-id
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
```

### 3. Database Setup
```bash
cd backend
npm run seed
```

### 4. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm start
```

Visit `http://localhost:3000` to access the application.

## 🧪 Testing

### Unit & Integration Tests
```bash
cd backend
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚀 Production Deployment

### 1. MongoDB Atlas Setup
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update `MONGO_URI` in production environment

### 2. AWS S3 Setup (Optional)
1. Create S3 bucket
2. Configure IAM user with S3 permissions
3. Update AWS credentials in environment

### 3. Sentry Setup (Optional)
1. Create Sentry project
2. Get DSN
3. Update `SENTRY_DSN` in environment

### 4. Backend Deployment (Render)
```bash
# Build and deploy backend
cd backend
npm run build  # if needed
# Deploy to Render with environment variables
```

### 5. Frontend Deployment (Vercel)
```bash
# Deploy frontend
npm run build
# Deploy to Vercel with REACT_APP_API_URL environment variable
```

## 🔧 API Documentation

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile/:userId` - Get user profile
- `PUT /api/auth/profile/:userId` - Update user profile

### Colleges
- `GET /api/colleges` - Get all colleges
- `GET /api/colleges/:id` - Get college by ID
- `GET /api/colleges/search` - Search colleges with filters
- `POST /api/colleges/filter` - Smart filtering
- `POST /api/colleges` - Add new college (admin)

### Applications
- `POST /api/applications/apply` - Apply to college
- `GET /api/applications/:studentId` - Get student applications
- `DELETE /api/applications/:applicationId` - Withdraw application
- `GET /api/applications/college/:collegeId` - Get college applications
- `PUT /api/applications/:applicationId/status` - Update application status

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- File upload validation
- Error monitoring with Sentry

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@comla.com or create an issue in the repository.

## 📊 Roadmap

- [ ] Advanced ML-based recommendations
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] College reviews and ratings
- [ ] Admin analytics dashboard
- [ ] Mobile app (React Native)

---

**Built with ❤️ for students worldwide**
