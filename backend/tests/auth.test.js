const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authRoutes = require('../routes/authRoutes');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Routes', () => {
  beforeEach(async () => {
    // Clear users collection
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(200);

      expect(response.body.message).toBe('Signup successful');

      // Verify user was created
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
      expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10)
      });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(400);

      expect(response.body.error).toBe('Email already exists');
    });

    it('should validate password requirements', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak'
        })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeTruthy();
      expect(response.body.user).toBeTruthy();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/profile/:userId', () => {
    let user;
    let token;

    beforeEach(async () => {
      // Create test user
      user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10)
      });

      // Generate token
      token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    });

    it('should return user profile for authenticated user', async () => {
      const response = await request(app)
        .get(`/api/auth/profile/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject unauthorized access', async () => {
      const response = await request(app)
        .get(`/api/auth/profile/${user._id}`)
        .expect(403);

      expect(response.body.error).toBe('Unauthorized');
    });
  });
});