// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  LOGOUT: `${API_URL}/auth/logout`,
  
  // User
  USER_PROFILE: `${API_URL}/users/profile`,
  UPDATE_PROFILE: `${API_URL}/users/profile`,
  
  // Events
  EVENTS: `${API_URL}/events`,
  EVENT_DETAILS: (eventId) => `${API_URL}/events/${eventId}`,
  REGISTER_EVENT: (eventId) => `${API_URL}/events/${eventId}/register`,
  
  // Sessions
  SESSIONS: (eventId) => `${API_URL}/events/${eventId}/sessions`,
  SESSION_DETAILS: (eventId, sessionId) => `${API_URL}/events/${eventId}/sessions/${sessionId}`,
  REGISTER_SESSION: (eventId, sessionId) => `${API_URL}/events/${eventId}/sessions/${sessionId}/register`,
  
  // Recommendations
  SESSION_RECOMMENDATIONS: `${API_URL}/recommendations/sessions`,
  
  // Check-in
  CHECK_IN: `${API_URL}/check-in`,
  
  // Networking
  CONNECTIONS: `${API_URL}/networking/connections`,
  CONNECTION_SUGGESTIONS: `${API_URL}/networking/suggestions`,
  CONNECTION_REQUESTS: `${API_URL}/networking/requests`,
  
  // Feedback
  FEEDBACK: `${API_URL}/feedback`
};