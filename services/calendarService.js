import ics from 'ics';
import { promisify } from 'util';
import { getSessionById, getAttendeeById } from '../utils/dbUtils.js';

// Promisify the ics.createEvent function
const createEventAsync = promisify((event, callback) => {
  ics.createEvent(event, callback);
});

/**
 * Generate an ICS file content for a session
 * @param {string} sessionId - The ID of the session
 * @returns {Promise<string>} - The ICS file content
 */
export async function generateICSForSession(sessionId) {
  // Get session details
  const session = await getSessionById(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Parse start and end times
  const startDate = new Date(session.start_time);
  const endDate = new Date(session.end_time);
  
  // Format dates for ics library
  // ics expects [year, month, day, hour, minute]
  const start = [
    startDate.getFullYear(),
    startDate.getMonth() + 1, // Month is 0-indexed in JS Date
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes()
  ];
  
  const end = [
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes()
  ];
  
  // Create the event object
  const event = {
    start,
    end,
    title: session.title,
    description: `${session.description}\n\nSpeaker: ${session.speaker}`,
    location: session.location,
    url: `https://eventmate.app/session/${session.id}`,
    categories: session.tags,
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { name: 'EventMate', email: 'info@eventmate.app' }
  };
  
  try {
    // Create ICS content
    const icsContent = await createEventAsync(event);
    return icsContent;
  } catch (error) {
    console.error('Error generating ICS:', error);
    throw new Error('Failed to generate calendar event');
  }
}

/**
 * Generate an ICS file with all bookmarked sessions for an attendee
 * @param {string} attendeeId - The ID of the attendee
 * @returns {Promise<string>} - The ICS file content
 */
export async function generateICSForBookmarks(attendeeId) {
  // Get attendee details
  const attendee = await getAttendeeById(attendeeId);
  if (!attendee || !attendee.bookmarked_sessions) {
    throw new Error('Attendee not found or has no bookmarked sessions');
  }
  
  // If no bookmarks, throw error
  if (attendee.bookmarked_sessions.length === 0) {
    throw new Error('No bookmarked sessions found');
  }
  
  // Generate an array of event objects for all bookmarked sessions
  const eventPromises = attendee.bookmarked_sessions.map(async (sessionId) => {
    const session = await getSessionById(sessionId);
    if (!session) return null;
    
    // Parse start and end times
    const startDate = new Date(session.start_time);
    const endDate = new Date(session.end_time);
    
    // Format for ics
    return {
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes()
      ],
      end: [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes()
      ],
      title: session.title,
      description: `${session.description}\n\nSpeaker: ${session.speaker}`,
      location: session.location,
      url: `https://eventmate.app/session/${session.id}`,
      categories: session.tags,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'EventMate', email: 'info@eventmate.app' }
    };
  });
  
  // Wait for all promises to resolve
  const events = (await Promise.all(eventPromises)).filter(Boolean);
  
  // Create calendar with all events
  return new Promise((resolve, reject) => {
    ics.createEvents(events, (error, icsContent) => {
      if (error) {
        console.error('Error generating ICS:', error);
        reject(new Error('Failed to generate calendar events'));
      } else {
        resolve(icsContent);
      }
    });
  });
}

/**
 * Generate Google Calendar add URL for a session
 * @param {string} sessionId - The ID of the session
 * @returns {Promise<string>} - The Google Calendar URL
 */
export async function generateGoogleCalendarURL(sessionId) {
  // Get session details
  const session = await getSessionById(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Parse dates
  const startDate = new Date(session.start_time);
  const endDate = new Date(session.end_time);
  
  // Format dates for Google Calendar
  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  // Create Google Calendar URL
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const title = encodeURIComponent(session.title);
  const dates = `${formatDate(startDate)}/${formatDate(endDate)}`;
  const location = encodeURIComponent(session.location);
  const details = encodeURIComponent(`${session.description}\n\nSpeaker: ${session.speaker}`);
  
  return `${baseUrl}&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
}

export default {
  generateICSForSession,
  generateICSForBookmarks,
  generateGoogleCalendarURL
};