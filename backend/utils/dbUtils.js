import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the database file
const dbPath = path.join(__dirname, '..', 'db.json');

/**
 * Read the entire database
 * @returns {Promise<Object>} - The parsed database object
 */
export async function readDB() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw error;
  }
}

/**
 * Write data to the database
 * @param {Object} data - The data to write
 * @returns {Promise<void>}
 */
export async function writeDB(data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database:', error);
    throw error;
  }
}

/**
 * Get all sessions from the database
 * @returns {Promise<Array>} - Array of session objects
 */
export async function getSessions() {
  const db = await readDB();
  return db.sessions;
}

/**
 * Get a session by ID
 * @param {string} id - Session ID
 * @returns {Promise<Object|null>} - Session object or null if not found
 */
export async function getSessionById(id) {
  const db = await readDB();
  return db.sessions.find(session => session.id === id) || null;
}

/**
 * Get all attendees
 * @returns {Promise<Array>} - Array of attendee objects
 */
export async function getAttendees() {
  const db = await readDB();
  return db.attendees;
}

/**
 * Get an attendee by ID or registration ID
 * @param {string} id - Attendee ID or registration ID
 * @returns {Promise<Object|null>} - Attendee object or null if not found
 */
export async function getAttendeeById(id) {
  const db = await readDB();
  return db.attendees.find(
    attendee => attendee.id === id || attendee.registration_id === id
  ) || null;
}

/**
 * Add a new attendee to the database
 * @param {Object} attendee - Attendee object to add
 * @returns {Promise<Object>} - The added attendee with ID
 */
export async function addAttendee(attendee) {
  const db = await readDB();
  
  // Add to database
  db.attendees.push(attendee);
  await writeDB(db);
  
  return attendee;
}

/**
 * Update an attendee in the database
 * @param {string} id - Attendee ID
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<Object|null>} - Updated attendee or null if not found
 */
export async function updateAttendee(id, updates) {
  const db = await readDB();
  const index = db.attendees.findIndex(
    attendee => attendee.id === id || attendee.registration_id === id
  );
  
  if (index === -1) return null;
  
  // Update the attendee
  db.attendees[index] = {
    ...db.attendees[index],
    ...updates
  };
  
  await writeDB(db);
  return db.attendees[index];
}

/**
 * Toggle session bookmark for an attendee
 * @param {string} attendeeId - Attendee ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Updated attendee
 */
export async function toggleBookmark(attendeeId, sessionId) {
  const db = await readDB();
  const index = db.attendees.findIndex(
    attendee => attendee.id === attendeeId || attendee.registration_id === attendeeId
  );
  
  if (index === -1) throw new Error('Attendee not found');
  
  // Check if session exists
  const sessionExists = db.sessions.some(session => session.id === sessionId);
  if (!sessionExists) throw new Error('Session not found');
  
  // Get bookmarked sessions array (or create if not exists)
  const bookmarked = db.attendees[index].bookmarked_sessions || [];
  
  // Toggle bookmark
  if (bookmarked.includes(sessionId)) {
    // Remove bookmark
    db.attendees[index].bookmarked_sessions = bookmarked.filter(id => id !== sessionId);
  } else {
    // Add bookmark
    db.attendees[index].bookmarked_sessions = [...bookmarked, sessionId];
  }
  
  await writeDB(db);
  return db.attendees[index];
}

/**
 * Check in an attendee
 * @param {string} id - Attendee ID or registration ID
 * @returns {Promise<Object|null>} - Updated attendee or null if not found
 */
export async function checkInAttendee(id) {
  return updateAttendee(id, { checked_in: true });
}

export default {
  readDB,
  writeDB,
  getSessions,
  getSessionById,
  getAttendees,
  getAttendeeById,
  addAttendee,
  updateAttendee,
  toggleBookmark,
  checkInAttendee
};