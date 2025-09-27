// API Configuration
// Use relative URLs for Vercel deployment, fallback to localhost for development
export const API_URL = process.env.REACT_APP_API_URL || '/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Sessions
  SESSIONS: `${API_URL}/sessions`,
  SESSION_DETAILS: (id) => `${API_URL}/sessions/${id}`,
  SESSION_CALENDAR_ICS: (id) => `${API_URL}/sessions/${id}/calendar/ics`,
  SESSION_CALENDAR_GOOGLE: (id) => `${API_URL}/sessions/${id}/calendar/google`,
  SESSION_SEARCH: `${API_URL}/sessions/search/query`,
  SESSIONS_TODAY: `${API_URL}/sessions/filter/today`,
  SESSIONS_POPULAR: `${API_URL}/sessions/filter/popular`,

  // Attendees
  ATTENDEE_REGISTER: `${API_URL}/attendee/register`,
  ATTENDEE_DETAILS: (id) => `${API_URL}/attendee/${id}`,
  ATTENDEE_QR: (id) => `${API_URL}/attendee/${id}/qr`,
  ATTENDEE_RECOMMENDATIONS: (id) => `${API_URL}/attendee/${id}/recommendations`,
  ATTENDEE_NETWORKING: (id) => `${API_URL}/attendee/${id}/networking`,
  ATTENDEE_BOOKMARK: (id) => `${API_URL}/attendee/${id}/bookmark`,
  ATTENDEE_CALENDAR_ICS: (id) => `${API_URL}/attendee/${id}/calendar/ics`,

  // Check-in
  CHECK_IN: `${API_URL}/checkin`,
  CHECK_IN_STATUS: (id) => `${API_URL}/checkin/status/${id}`
};