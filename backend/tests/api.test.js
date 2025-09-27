// Unit tests for API endpoints
import supertest from 'supertest';
import app from '../server.js';

const request = supertest(app);

describe('API Endpoints', () => {
  // Test GET /api/sessions
  describe('GET /api/sessions', () => {
    it('should return all sessions', async () => {
      const res = await request.get('/api/sessions');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Check if we have our 8 sample sessions
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // Test POST /api/register
  describe('POST /api/register', () => {
    it('should register a new professional attendee', async () => {
      const newAttendee = {
        full_name: 'Test User',
        email: 'test.user@example.com',
        mobile: '+1234567890',
        category: 'Professional',
        company: 'Test Company',
        designation: 'Test Designation',
        food_choice: 'Vegetarian',
        country: 'Test Country',
        gender: 'Male',
        blood_group: 'O+',
        emergency_contact: '+0987654321',
        interests: ['cloud', 'AI']
      };

      const res = await request.post('/api/register').send(newAttendee);
      expect(res.status).toBe(201);
      expect(res.body.attendee).toHaveProperty('id');
      expect(res.body.attendee).toHaveProperty('registration_id');
      expect(res.body.attendee.full_name).toBe('Test User');
      expect(res.body).toHaveProperty('qr');
    });

    it('should validate required fields', async () => {
      const invalidAttendee = {
        full_name: 'Test User',
        // Missing required fields
        category: 'Professional'
      };

      const res = await request.post('/api/register').send(invalidAttendee);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // Test POST /api/checkin
  describe('POST /api/checkin', () => {
    it('should check in an attendee using registration_id', async () => {
      // Using a registration ID from our sample data
      const res = await request.post('/api/checkin').send({
        registration_id: 'VIBE-2025-1001'
      });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Check-in successful');
      expect(res.body.attendee.checked_in).toBe(true);
    });

    it('should reject invalid registration_id', async () => {
      const res = await request.post('/api/checkin').send({
        registration_id: 'INVALID-ID'
      });
      
      expect(res.status).toBe(404);
    });
  });
});