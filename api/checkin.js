import { verifySignature } from '../../utils/securityUtils.js';
import { checkInAttendee, getAttendeeById } from '../../utils/dbUtils.js';
import { checkInValidation } from '../../middleware/validation.js';
import { validationResult } from 'express-validator';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'POST') {
      const { path } = req.query;

      // POST /api/checkin - Check in an attendee with QR or registration ID
      if (!path || path.length === 0) {
        return await handleCheckIn(req, res);
      }

      return res.status(404).json({ error: 'Endpoint not found' });

    } else if (method === 'GET') {
      const { path } = req.query;

      if (!path || path.length === 0) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      const [endpoint, ...params] = path;

      // GET /api/checkin/status/:id - Check if an attendee is checked in
      if (endpoint === 'status' && params.length > 0) {
        return await handleCheckInStatus(params[0], res);
      }

      return res.status(404).json({ error: 'Endpoint not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCheckIn(req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { qrString, registration_id } = req.body;

    if (!qrString && !registration_id) {
      return res.status(400).json({ error: 'QR data or registration ID required' });
    }

    let attendeeId;

    // Verify using QR code payload
    if (qrString) {
      try {
        const qrData = JSON.parse(qrString);
        const { registration_id, id, ts, signature } = qrData;

        // Create payload without signature for verification
        const payload = { registration_id, id, ts };

        // Verify signature
        const isValid = verifySignature(payload, signature);
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid QR code signature' });
        }

        // Check if the QR code is too old (e.g., more than 7 days)
        const now = Date.now();
        const qrTimestamp = parseInt(ts, 10);
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

        if (now - qrTimestamp > sevenDaysMs) {
          return res.status(401).json({ error: 'QR code has expired' });
        }

        attendeeId = id;
      } catch (error) {
        console.error('QR parse error:', error);
        return res.status(400).json({ error: 'Invalid QR code format' });
      }
    } else {
      // Using registration ID directly
      attendeeId = registration_id;
    }

    // Get current attendee state
    const attendee = await getAttendeeById(attendeeId);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    // Check if already checked in
    if (attendee.checked_in) {
      return res.json({
        message: 'Attendee already checked in',
        attendee,
        alreadyCheckedIn: true
      });
    }

    // Update check-in status
    const updatedAttendee = await checkInAttendee(attendeeId);
    if (!updatedAttendee) {
      return res.status(404).json({ error: 'Failed to update check-in status' });
    }

    res.json({
      message: 'Check-in successful',
      attendee: updatedAttendee,
      alreadyCheckedIn: false
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Failed to process check-in' });
  }
}

async function handleCheckInStatus(attendeeId, res) {
  try {
    const attendee = await getAttendeeById(attendeeId);

    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    res.json({
      checked_in: attendee.checked_in,
      registration_id: attendee.registration_id,
      full_name: attendee.full_name
    });
  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({ error: 'Failed to check attendee status' });
  }
}