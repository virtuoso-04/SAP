import { v4 as uuidv4 } from 'uuid';
import {
  getAttendeeById,
  addAttendee,
  updateAttendee,
  toggleBookmark
} from '../../utils/dbUtils.js';
import {
  generateRecommendations,
  generateNetworkingRecommendations
} from '../../services/recommendationService.js';
import {
  generateICSForBookmarks,
} from '../../services/calendarService.js';
import { createSecureQRPayload, generateQRCode } from '../../utils/securityUtils.js';
import { registerValidation } from '../../middleware/validation.js';
import { validationResult } from 'express-validator';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { path } = req.query;

      if (!path || path.length === 0) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      const [attendeeId, ...params] = path;

      // GET /api/attendee/:id - Get attendee by ID
      if (params.length === 0) {
        const attendee = await getAttendeeById(attendeeId);
        if (!attendee) {
          return res.status(404).json({ error: 'Attendee not found' });
        }
        return res.status(200).json(attendee);
      }

      // GET /api/attendee/:id/qr - Regenerate QR code for attendee
      if (params[0] === 'qr') {
        return await handleAttendeeQR(attendeeId, res);
      }

      // GET /api/attendee/:id/recommendations - Get personalized recommendations
      if (params[0] === 'recommendations') {
        return await handleAttendeeRecommendations(attendeeId, req, res);
      }

      // GET /api/attendee/:id/networking - Get networking suggestions
      if (params[0] === 'networking') {
        return await handleAttendeeNetworking(attendeeId, req, res);
      }

      // GET /api/attendee/:id/calendar/ics - Generate ICS for bookmarked sessions
      if (params[0] === 'calendar' && params[1] === 'ics') {
        return await handleAttendeeCalendarICS(attendeeId, res);
      }

      return res.status(404).json({ error: 'Endpoint not found' });

    } else if (method === 'POST') {
      const { path } = req.query;

      if (!path || path.length === 0) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      const [endpoint, ...params] = path;

      // POST /api/attendee/register - Register a new attendee
      if (endpoint === 'register') {
        return await handleAttendeeRegistration(req, res);
      }

      // POST /api/attendee/:id/bookmark - Toggle session bookmark
      if (params[0] === 'bookmark') {
        return await handleAttendeeBookmark(endpoint, req, res);
      }

      return res.status(404).json({ error: 'Endpoint not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleAttendeeRegistration(req, res) {
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
}

async function handleAttendeeQR(attendeeId, res) {
  try {
    const attendee = await getAttendeeById(attendeeId);

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
}

async function handleAttendeeRecommendations(attendeeId, req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const recommendations = await generateRecommendations(attendeeId, limit);
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
}

async function handleAttendeeNetworking(attendeeId, req, res) {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const suggestions = await generateNetworkingRecommendations(attendeeId, limit);
    res.json(suggestions);
  } catch (error) {
    console.error('Error generating networking suggestions:', error);
    res.status(500).json({ error: 'Failed to generate networking suggestions' });
  }
}

async function handleAttendeeBookmark(attendeeId, req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const updatedAttendee = await toggleBookmark(attendeeId, sessionId);

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
}

async function handleAttendeeCalendarICS(attendeeId, res) {
  try {
    const icsContent = await generateICSForBookmarks(attendeeId);

    // Send as file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=my-agenda.ics`);
    res.send(icsContent);
  } catch (error) {
    console.error('Error generating ICS:', error);
    res.status(500).json({ error: 'Failed to generate calendar events' });
  }
}