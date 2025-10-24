const request = require('supertest');
const express = require('express');
const College = require('../models/College');
const collegeRoutes = require('../routes/collegeRoutes');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/colleges', collegeRoutes);

describe('College Routes', () => {
  beforeEach(async () => {
    // Clear colleges collection
    await College.deleteMany({});
  });

  describe('POST /api/colleges', () => {
    it('should create a new college successfully', async () => {
      const collegeData = {
        name: 'Test College',
        location: 'Delhi',
        courses: ['CSE', 'BBA'],
        fees: 100000,
        description: 'A great college',
        website: 'https://testcollege.edu',
        image: 'https://example.com/image.jpg'
      };

      const response = await request(app)
        .post('/api/colleges')
        .send(collegeData)
        .expect(200);

      expect(response.body.message).toBe('College added successfully');
      expect(response.body.college.name).toBe(collegeData.name);
      expect(response.body.college.location).toBe(collegeData.location);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/colleges')
        .send({ name: 'Test College' }) // Missing required fields
        .expect(400);

      expect(response.body.errors).toBeTruthy();
    });
  });

  describe('GET /api/colleges', () => {
    beforeEach(async () => {
      // Create test colleges
      await College.create([
        {
          name: 'College A',
          location: 'Delhi',
          courses: ['CSE'],
          fees: 100000
        },
        {
          name: 'College B',
          location: 'Mumbai',
          courses: ['BBA'],
          fees: 80000
        }
      ]);
    });

    it('should return all colleges', async () => {
      const response = await request(app)
        .get('/api/colleges')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5); // Includes demo data + 2 created
      expect(response.body.some(college => college.name === 'College A')).toBe(true);
    });
  });

  describe('GET /api/colleges/search', () => {
    beforeEach(async () => {
      // Create test colleges
      await College.create([
        {
          name: 'Delhi University',
          location: 'Delhi',
          courses: ['CSE', 'BBA'],
          fees: 50000,
          description: 'Top university in Delhi'
        },
        {
          name: 'Mumbai Institute',
          location: 'Mumbai',
          courses: ['CSE'],
          fees: 100000,
          description: 'Engineering institute'
        }
      ]);
    });

    it('should search colleges by name', async () => {
      const response = await request(app)
        .get('/api/colleges/search?q=Delhi')
        .expect(200);

      expect(response.body.colleges.length).toBe(1);
      expect(response.body.colleges[0].name).toBe('Delhi University');
    });

    it('should filter by location', async () => {
      const response = await request(app)
        .get('/api/colleges/search?location=Mumbai')
        .expect(200);

      expect(response.body.colleges.length).toBe(1);
      expect(response.body.colleges[0].location).toBe('Mumbai');
    });

    it('should filter by courses', async () => {
      const response = await request(app)
        .get('/api/colleges/search?courses=CSE')
        .expect(200);

      expect(response.body.colleges.length).toBe(2);
    });

    it('should filter by fees range', async () => {
      const response = await request(app)
        .get('/api/colleges/search?minFees=60000&maxFees=120000')
        .expect(200);

      expect(response.body.colleges.length).toBe(1);
      expect(response.body.colleges[0].name).toBe('Mumbai Institute');
    });

    it('should sort results', async () => {
      const response = await request(app)
        .get('/api/colleges/search?sortBy=name&sortOrder=asc')
        .expect(200);

      expect(response.body.colleges[0].name).toBe('Delhi University');
      expect(response.body.colleges[1].name).toBe('Mumbai Institute');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/colleges/search?page=1&limit=1')
        .expect(200);

      expect(response.body.colleges.length).toBe(1);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalColleges).toBe(2);
      expect(response.body.pagination.hasNext).toBe(true);
    });
  });
});