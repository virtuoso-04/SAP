// Main Express server file for EventMate backend
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';

// Import validation middleware
import { registerValidation } from './middlewares/validation.js';

// Initialize environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;
const HMAC_SECRET = process.env.HMAC_SECRET || 'default_secret_for_development';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Database helper functions
const dbPath = path.join(__dirname, 'db.json');

async function readDB() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw error;
  }
}

async function writeDB(data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database:', error);
    throw error;
  }
}

// Generate HMAC signature for QR code
function generateSignature(payload) {
  const hmac = crypto.createHmac('sha256', HMAC_SECRET);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

// Verify HMAC signature
function verifySignature(payload, signature) {
  const expectedSignature = generateSignature(payload);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Generate QR code as data URL
async function generateQRCode(data) {
  try {
    return await QRCode.toDataURL(JSON.stringify(data));
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

// =========== API Routes ===========

// GET /api/sessions - Get all sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// POST /api/register - Register a new attendee
app.post('/api/register', registerValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const db = await readDB();
    
    // Check if email already exists
    const existingAttendee = db.attendees.find(a => a.email === req.body.email);
    if (existingAttendee) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate new attendee ID and registration ID
    const id = uuidv4();
    const registrationIdNumber = 1000 + db.attendees.length + 1;
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
    
    // Generate QR code payload with HMAC signature
    const ts = Date.now();
    const qrPayload = { registration_id, id, ts };
    const signature = generateSignature(qrPayload);
    qrPayload.signature = signature;
    
    // Generate QR code data URL
    const qrDataUrl = await generateQRCode(qrPayload);
    
    // Add attendee to database
    db.attendees.push(newAttendee);
    await writeDB(db);
    
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
app.get('/api/attendee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDB();
    
    // Find attendee by ID or registration_id
    const attendee = db.attendees.find(
      a => a.id === id || a.registration_id === id
    );
    
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendee' });
  }
});

// GET /api/attendee/:id/recommendations - Get recommendations for an attendee
app.get('/api/attendee/:id/recommendations', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDB();
    
    // Find attendee
    const attendee = db.attendees.find(
      a => a.id === id || a.registration_id === id
    );
    
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    // Calculate scores for each session based on interests and popularity
    const scoredSessions = db.sessions.map(session => {
      // Count matching tags
      const tagMatches = session.tags.filter(tag => 
        attendee.interests.includes(tag.toLowerCase())
      ).length;
      
      // Calculate score
      const score = (tagMatches * 10) + session.popularity;
      
      return {
        ...session,
        score,
        reason: generateRecommendationReason(session, attendee)
      };
    });
    
    // Sort by score
    scoredSessions.sort((a, b) => b.score - a.score);
    
    // Group by timeslot to avoid overlapping
    const timeslotGroups = {};
    scoredSessions.forEach(session => {
      const timeslot = `${session.start_time}-${session.end_time}`;
      if (!timeslotGroups[timeslot] || timeslotGroups[timeslot].score < session.score) {
        timeslotGroups[timeslot] = session;
      }
    });
    
    // Get top 5 non-overlapping recommendations
    const recommendations = Object.values(timeslotGroups)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Generate a human-friendly recommendation reason
function generateRecommendationReason(session, attendee) {
  const reasons = [];
  
  // Check for matching interests/tags
  const matchingTags = session.tags.filter(tag => 
    attendee.interests.includes(tag.toLowerCase())
  );
  
  if (matchingTags.length > 0) {
    reasons.push(`matches your interest in ${matchingTags.join(', ')}`);
  }
  
  // Add popularity factor
  if (session.popularity > 75) {
    reasons.push('is very popular among attendees');
  } else if (session.bookmarks > 40) {
    reasons.push('has been bookmarked by many participants');
  }
  
  // Add speaker expertise
  reasons.push(`features ${session.speaker}, an expert in the field`);
  
  // Select 1-2 random reasons for diversity
  const selectedReasons = reasons.sort(() => 0.5 - Math.random()).slice(0, 2);
  
  return `Recommended because this session ${selectedReasons.join(' and ')}`;
}

// POST /api/checkin - Check in an attendee with QR or registration ID
app.post('/api/checkin', async (req, res) => {
  try {
    const { qrString, registration_id } = req.body;
    
    if (!qrString && !registration_id) {
      return res.status(400).json({ error: 'QR data or registration ID required' });
    }
    
    const db = await readDB();
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
        
        attendeeId = id;
      } catch (error) {
        return res.status(400).json({ error: 'Invalid QR code format' });
      }
    } else {
      // Using registration ID directly
      attendeeId = registration_id;
    }
    
    // Find attendee
    const attendeeIndex = db.attendees.findIndex(
      a => a.id === attendeeId || a.registration_id === attendeeId
    );
    
    if (attendeeIndex === -1) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    // Update check-in status
    db.attendees[attendeeIndex].checked_in = true;
    await writeDB(db);
    
    res.json({ 
      message: 'Check-in successful',
      attendee: db.attendees[attendeeIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process check-in' });
  }
});

// GET /api/admin/attendees - Get filtered attendees list (admin only)
app.get('/api/admin/attendees', async (req, res) => {
  try {
    const { category, format } = req.query;
    const db = await readDB();
    
    // Filter by category if specified
    let attendees = db.attendees;
    if (category) {
      attendees = attendees.filter(a => a.category === category);
    }
    
    // Handle CSV export format
    if (format === 'csv') {
      const csvHeader = 'Registration ID,Full Name,Email,Category,Check-In Status\n';
      const csvRows = attendees.map(a => 
        `${a.registration_id},${a.full_name},${a.email},${a.category},${a.checked_in ? 'Yes' : 'No'}`
      );
      const csvContent = csvHeader + csvRows.join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=attendees.csv');
      return res.send(csvContent);
    }
    
    // Default JSON response
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendees' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;