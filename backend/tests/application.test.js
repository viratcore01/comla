const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const College = require('../models/College');
const Application = require('../models/Application');
const applicationRoutes = require('../routes/ApplicationRoutes');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/applications', applicationRoutes);

describe('Application Routes', () => {
  let studentToken, collegeToken, student, college;

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await College.deleteMany({});
    await Application.deleteMany({});

    // Create test student
    student = await User.create({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'hashedpassword',
      role: 'student'
    });

    // Create test college admin
    const collegeUser = await User.create({
      name: 'College Admin',
      email: 'college@test.com',
      password: 'hashedpassword',
      role: 'college'
    });

    // Create test college
    college = await College.create({
      name: 'Test College',
      location: 'Delhi',
      courses: ['CSE', 'BBA'],
      fees: 100000
    });

    // Update college user with collegeId
    collegeUser.collegeId = college._id;
    await collegeUser.save();

    // Generate tokens
    studentToken = jwt.sign({ id: student._id, email: student.email }, process.env.JWT_SECRET);
    collegeToken = jwt.sign({ id: collegeUser._id, email: collegeUser.email }, process.env.JWT_SECRET);
  });

  describe('POST /api/applications/apply', () => {
    it('should create application successfully', async () => {
      const response = await request(app)
        .post('/api/applications/apply')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ collegeId: college._id })
        .expect(200);

      expect(response.body.message).toBe('Application submitted');
      expect(response.body.application).toBeTruthy();

      // Verify application was created
      const application = await Application.findOne({ student: student._id, college: college._id });
      expect(application).toBeTruthy();
      expect(application.status).toBe('pending');
    });

    it('should prevent duplicate applications', async () => {
      // Create first application
      await Application.create({
        student: student._id,
        college: college._id,
        status: 'pending'
      });

      // Try to apply again
      const response = await request(app)
        .post('/api/applications/apply')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ collegeId: college._id })
        .expect(400);

      expect(response.body.error).toBe('Application already exists');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/applications/apply')
        .send({ collegeId: college._id })
        .expect(403);

      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('GET /api/applications/:studentId', () => {
    beforeEach(async () => {
      // Create test application
      await Application.create({
        student: student._id,
        college: college._id,
        status: 'pending'
      });
    });

    it('should return student applications', async () => {
      const response = await request(app)
        .get(`/api/applications/${student._id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].college.name).toBe('Test College');
    });

    it('should prevent access to other students applications', async () => {
      const otherStudent = await User.create({
        name: 'Other Student',
        email: 'other@test.com',
        password: 'hashedpassword',
        role: 'student'
      });

      const response = await request(app)
        .get(`/api/applications/${otherStudent._id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);

      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/applications/:applicationId', () => {
    let application;

    beforeEach(async () => {
      // Create test application
      application = await Application.create({
        student: student._id,
        college: college._id,
        status: 'pending'
      });
    });

    it('should withdraw application successfully', async () => {
      const response = await request(app)
        .delete(`/api/applications/${application._id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.message).toBe('Application withdrawn');

      // Verify application was deleted
      const deletedApp = await Application.findById(application._id);
      expect(deletedApp).toBeNull();
    });

    it('should prevent withdrawing others applications', async () => {
      const otherStudent = await User.create({
        name: 'Other Student',
        email: 'other@test.com',
        password: 'hashedpassword',
        role: 'student'
      });

      const response = await request(app)
        .delete(`/api/applications/${application._id}`)
        .set('Authorization', jwt.sign({ id: otherStudent._id, email: otherStudent.email }, process.env.JWT_SECRET))
        .expect(403);

      expect(response.body.error).toBe('Unauthorized');
    });
  });
});