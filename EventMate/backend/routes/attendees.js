import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { 
  getAttendeeById, 
  addAttendee, 
  updateAttendee, 
  toggleBookmark 
} from '../utils/dbUtils.js';
import { 
  generateRecommendations,
  generateNetworkingRecommendations 
} from '../services/recommendationService.js';
import { 
  generateICSForBookmarks, 
} from '../services/calendarService.js';
import { createSecureQRPayload, generateQRCode } from '../utils/securityUtils.js';
import { registerValidation } from '../middleware/validation.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// POST /api/attendee - Register a new attendee
router.post('/register', registerValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Check if email already exists
    const existingAttendee = await getAttendeeById(req.body.email);
    if (existingAttendee) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Generate new attendee ID and registration ID
    const id = uuidv4();
    const registrationIdNumber = Math.floor(1000 + Math.random() * 9000);
    const registration_id = `VIBE-2025-${registrationIdNumber}`;
    
    // Create new attendee object
    const newAttendee = {
      id,
      registration_id,
      ...req.body,
      created_at: new Date().toISOString(),
      checked_in: false,
      bookmarked_sessions: []
    };
    
    // Add to database
    await addAttendee(newAttendee);
    
    // Generate QR code payload with HMAC signature
    const qrPayload = createSecureQRPayload({ 
      registration_id, 
      id 
    });
    
    // Generate QR code data URL
    const qrDataUrl = await generateQRCode(qrPayload);
    
    // Return success response with attendee data and QR code
    res.status(201).json({
      attendee: newAttendee,
      qr: qrDataUrl
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register attendee' });
  }
});

// GET /api/attendee/:id - Get attendee by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const attendee = await getAttendeeById(id);
    
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    res.json(attendee);
  } catch (error) {
    console.error('Error fetching attendee:', error);
    res.status(500).json({ error: 'Failed to fetch attendee' });
  }
});

// GET /api/attendee/:id/qr - Regenerate QR code for attendee
router.get('/:id/qr', async (req, res) => {
  try {
    const { id } = req.params;
    const attendee = await getAttendeeById(id);
    
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    // Generate QR code payload with HMAC signature
    const qrPayload = createSecureQRPayload({ 
      registration_id: attendee.registration_id, 
      id: attendee.id 
    });
    
    // Generate QR code data URL
    const qrDataUrl = await generateQRCode(qrPayload);
    
    res.json({ qr: qrDataUrl });
  } catch (error) {
    console.error('Error generating QR:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// GET /api/attendee/:id/recommendations - Get personalized recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    
    const recommendations = await generateRecommendations(id, limit);
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// GET /api/attendee/:id/networking - Get networking suggestions
router.get('/:id/networking', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 3;
    
    const suggestions = await generateNetworkingRecommendations(id, limit);
    res.json(suggestions);
  } catch (error) {
    console.error('Error generating networking suggestions:', error);
    res.status(500).json({ error: 'Failed to generate networking suggestions' });
  }
});

// POST /api/attendee/:id/bookmark - Toggle session bookmark
router.post('/:id/bookmark', async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const updatedAttendee = await toggleBookmark(id, sessionId);
    
    if (!updatedAttendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    res.json({
      message: 'Bookmark updated',
      bookmarked: updatedAttendee.bookmarked_sessions.includes(sessionId),
      bookmarks: updatedAttendee.bookmarked_sessions
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ error: error.message || 'Failed to update bookmark' });
  }
});

// GET /api/attendee/:id/calendar/ics - Generate ICS for bookmarked sessions
router.get('/:id/calendar/ics', async (req, res) => {
  try {
    const { id } = req.params;
    const icsContent = await generateICSForBookmarks(id);
    
    // Send as file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=my-agenda.ics`);
    res.send(icsContent);
  } catch (error) {
    console.error('Error generating ICS:', error);
    res.status(500).json({ error: 'Failed to generate calendar events' });
  }
});

export default router;