import { createEvents } from 'ics';

/**
 * Formats date to YYYY-MM-DD format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Formats time to HH:MM AM/PM format
 * @param {Date} date - The date containing time to format
 * @returns {string} Formatted time string
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Creates ICS file data for a session
 * @param {Object} session - The session object
 * @returns {Promise} Promise resolving to ICS file data URL
 */
export const createICSFile = (session) => {
  return new Promise((resolve, reject) => {
    // Parse start and end times
    const start = new Date(session.start_time);
    const end = new Date(session.end_time);
    
    // Format for ICS (year, month[0-11], day, hour, minute)
    const startArray = [
      start.getFullYear(),
      start.getMonth() + 1, // Month is 0-indexed in JS
      start.getDate(),
      start.getHours(),
      start.getMinutes()
    ];
    
    const endArray = [
      end.getFullYear(),
      end.getMonth() + 1,
      end.getDate(),
      end.getHours(),
      end.getMinutes()
    ];
    
    const event = {
      start: startArray,
      end: endArray,
      title: session.title,
      description: session.description,
      location: session.location,
      organizer: { name: 'EventMate', email: 'info@eventmate.example.com' },
    };
    
    createEvents([event], (error, value) => {
      if (error) {
        reject(error);
        return;
      }
      
      // Create data URL for download
      const blob = new Blob([value], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
  });
};

/**
 * Downloads an ICS file for a calendar event
 * @param {Object} session - The session to create an event for
 */
export const downloadICSFile = async (session) => {
  try {
    const url = await createICSFile(session);
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${session.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error creating ICS file:', error);
    throw error;
  }
};

/**
 * Creates Google Calendar event URL
 * @param {Object} session - The session object
 * @returns {string} Google Calendar URL
 */
export const createGoogleCalendarUrl = (session) => {
  const start = new Date(session.start_time);
  const end = new Date(session.end_time);
  
  // Format dates for Google Calendar
  const startISO = start.toISOString().replace(/-|:|\.\d+/g, '');
  const endISO = end.toISOString().replace(/-|:|\.\d+/g, '');
  
  const url = new URL('https://www.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', session.title);
  url.searchParams.append('dates', `${startISO}/${endISO}`);
  url.searchParams.append('details', session.description);
  url.searchParams.append('location', session.location);
  
  return url.toString();
};

/**
 * Creates Outlook Calendar event URL
 * @param {Object} session - The session object
 * @returns {string} Outlook Calendar URL
 */
export const createOutlookCalendarUrl = (session) => {
  const start = new Date(session.start_time);
  const end = new Date(session.end_time);
  
  // Format dates for Outlook Calendar
  const startISO = start.toISOString().replace(/-|:|\.\d+/g, '');
  const endISO = end.toISOString().replace(/-|:|\.\d+/g, '');
  
  const url = new URL('https://outlook.office.com/calendar/0/deeplink/compose');
  url.searchParams.append('subject', session.title);
  url.searchParams.append('startdt', start.toISOString());
  url.searchParams.append('enddt', end.toISOString());
  url.searchParams.append('body', session.description);
  url.searchParams.append('location', session.location);
  
  return url.toString();
};