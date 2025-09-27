import axios from 'axios';
import { mockSessions } from '../mocks/sessionsMocks';

// API base URL from environment variable or default to relative URLs for Vercel
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Local mock DB helpers (fallback when backend is unavailable) ---
const STORAGE_KEYS = {
  attendees: 'attendees',
  sessions: 'sessions',
  registrationData: 'registrationData',
};

// Sample attendees for demo when backend is absent
const sampleAttendeesSeed = [
  {
    id: 1001,
    registration_id: 'VIBE-2025-1001',
    full_name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    mobile: '+15555550101',
    category: 'Professional',
    company: 'SAP Labs',
    designation: 'Product Manager',
    college: '',
    education_level: '',
    year: 0,
    food_choice: 'Vegetarian',
    country: 'USA',
    gender: 'Male',
    blood_group: 'O+',
    emergency_contact: '+15555550999',
    interests: ['ai', 'cloud', 'ux'],
    checked_in: true,
    check_in_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    registered_sessions: [101, 104]
  },
  {
    id: 1002,
    registration_id: 'VIBE-2025-1002',
    full_name: 'Priya Patel',
    email: 'priya.patel@example.com',
    mobile: '+447700900202',
    category: 'Professional',
    company: 'Accenture',
    designation: 'Data Scientist',
    college: '',
    education_level: '',
    year: 0,
    food_choice: 'Vegan',
    country: 'UK',
    gender: 'Female',
    blood_group: 'A+',
    emergency_contact: '+447700900303',
    interests: ['analytics', 'ai/ml', 'innovation'],
    checked_in: false,
    registered_sessions: [106]
  },
  {
    id: 1003,
    registration_id: 'VIBE-2025-1003',
    full_name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    mobile: '+919999000123',
    category: 'Student',
    company: '',
    designation: '',
    college: 'IIT Delhi',
    education_level: 'UG',
    year: 3,
    food_choice: 'Non-vegetarian',
    country: 'India',
    gender: 'Male',
    blood_group: 'B+',
    emergency_contact: '+919999000456',
    interests: ['development', 'cloud', 'sap'],
    checked_in: false,
    registered_sessions: [107]
  }
];

const initMockDB = () => {
  // Seed sessions if missing
  if (!localStorage.getItem(STORAGE_KEYS.sessions)) {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(mockSessions));
  }
  // Ensure attendees array exists
  if (!localStorage.getItem(STORAGE_KEYS.attendees)) {
    localStorage.setItem(STORAGE_KEYS.attendees, JSON.stringify(sampleAttendeesSeed));
  }
};

const getLocalSessions = () => {
  initMockDB();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.sessions)) || [];
  } catch {
    return [];
  }
};

const setLocalSessions = (sessions) => {
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
};

const getLocalAttendees = () => {
  initMockDB();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.attendees)) || [];
  } catch {
    return [];
  }
};

const setLocalAttendees = (attendees) => {
  localStorage.setItem(STORAGE_KEYS.attendees, JSON.stringify(attendees));
};

const getCurrentRegistration = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.registrationData);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const generateRegistrationId = (prefix = 'VIBE-2025') => {
  const attendees = getLocalAttendees();
  const base = 1000 + attendees.length;
  return `${prefix}-${base}`;
};

const svgQRDataUrl = (text) => {
  // Minimal inline SVG "QR-like" placeholder
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
      <rect width='256' height='256' fill='white'/>
      <rect x='16' y='16' width='48' height='48' fill='black'/>
      <rect x='192' y='16' width='48' height='48' fill='black'/>
      <rect x='16' y='192' width='48' height='48' fill='black'/>
      <rect x='192' y='192' width='48' height='48' fill='black'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='black'>${text}</text>
    </svg>`
  );
  return `data:image/svg+xml;utf8,${svg}`;
};

// API service object with methods for each endpoint (with robust fallbacks)
const apiService = {
  // Get all sessions
  getSessions: async () => {
    try {
      const response = await api.get('/sessions');
      // If backend returns sessions, also cache locally
      const sessions = Array.isArray(response.data) ? response.data : (response.data.sessions || []);
      if (sessions.length) setLocalSessions(sessions);
      return sessions;
    } catch (error) {
      // Fallback to local mock sessions
      console.warn('Backend unavailable for getSessions, using mock data. Reason:', error?.message || error);
      return getLocalSessions();
    }
  },

  // Get single session by ID
  getSession: async (id) => {
    try {
      const response = await api.get(`/sessions/${id}`);
      return response.data;
    } catch (error) {
      const list = getLocalSessions();
      const found = list.find((s) => String(s.id) === String(id));
      if (!found) {
        throw new Error('Session not found');
      }
      return found;
    }
  },

  // Register a new attendee
  registerAttendee: async (attendeeData) => {
    try {
      const response = await api.post('/register', attendeeData);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable for registerAttendee, using local fallback. Reason:', error?.message || error);
      // Local fallback: create attendee, generate QR, persist in attendees list and return object similar to backend
      initMockDB();
      const attendees = getLocalAttendees();
      const id = Date.now();
      const registration_id = generateRegistrationId();
      const attendee = {
        id,
        registration_id,
        full_name: attendeeData.full_name,
        email: attendeeData.email,
        mobile: attendeeData.mobile,
        category: attendeeData.category,
        company: attendeeData.company || '',
        designation: attendeeData.designation || '',
        college: attendeeData.college || '',
        education_level: attendeeData.education_level || '',
        year: attendeeData.year || 0,
        food_choice: attendeeData.food_choice,
        country: attendeeData.country,
        gender: attendeeData.gender,
        blood_group: attendeeData.blood_group,
        emergency_contact: attendeeData.emergency_contact,
        interests: attendeeData.interests || [],
        checked_in: false,
        registered_sessions: [],
      };
      const qr = svgQRDataUrl(registration_id);
      const next = [...attendees, attendee];
      setLocalAttendees(next);
      return { attendee, qr };
    }
  },

  // Get attendee by ID or registration ID
  getAttendee: async (id) => {
    try {
      const response = await api.get(`/attendee/${id}`);
      return response.data;
    } catch (error) {
      // Fallback search in local attendees and current registration
      const reg = getCurrentRegistration();
      if (reg?.attendee && (String(reg.attendee.id) === String(id) || reg.attendee.registration_id === id)) {
        return reg.attendee;
      }
      const attendees = getLocalAttendees();
      const found = attendees.find((a) => String(a.id) === String(id) || a.registration_id === id);
      if (!found) throw error;
      return found;
    }
  },

  // Get recommendations for an attendee
  getRecommendations: async (id) => {
    try {
      const response = await api.get(`/attendee/${id}/recommendations`);
      return response.data;
    } catch (error) {
      // Fallback: select sessions whose tags match attendee interests
      console.warn('Backend unavailable for recommendations, using local derivation.', error?.message || error);
      const attendee = await apiService.getAttendee(id).catch(() => null);
      const interests = (attendee?.interests || []).map((x) => x.toLowerCase());
      const sessions = getLocalSessions();
      const scored = sessions.map((s) => {
        const tags = (s.tags || []).map((t) => t.toLowerCase());
        const overlap = interests.filter((i) => tags.includes(i));
        return { ...s, reason: overlap.length ? `Matches your interest in ${overlap.join(', ')}` : 'Popular at VIBE 2025' };
      });
      // Prefer sessions with any overlap
      scored.sort((a, b) => {
        const aScore = (a.reason || '').startsWith('Matches') ? 1 : 0;
        const bScore = (b.reason || '').startsWith('Matches') ? 1 : 0;
        return bScore - aScore;
      });
      return scored.slice(0, 10);
    }
  },

  // Check in an attendee using QR code or registration ID
  checkIn: async (data) => {
    try {
      const response = await api.post('/checkin', data);
      return response.data;
    } catch (error) {
      // Fallback: mark attendee as checked_in in local storage
      console.warn('Backend unavailable for checkIn, using local fallback.', error?.message || error);
      let registration_id = data.registration_id;
      if (!registration_id && data.qrString) {
        try {
          const parsed = JSON.parse(data.qrString);
          registration_id = parsed.registration_id || parsed.id || null;
        } catch {
          // QR parse failed
        }
      }
      if (!registration_id) {
        const err = new Error('Invalid check-in data');
        err.response = { status: 401 };
        throw err;
      }
      const attendees = getLocalAttendees();
      const idx = attendees.findIndex((a) => a.registration_id === registration_id);
      if (idx === -1) {
        const err = new Error('Attendee not found');
        err.response = { status: 404 };
        throw err;
      }
      const updated = { ...attendees[idx], checked_in: true, check_in_time: new Date().toISOString() };
      attendees[idx] = updated;
      setLocalAttendees(attendees);
      // Also update current registrationData cache if matches
      const reg = getCurrentRegistration();
      if (reg?.attendee?.registration_id === registration_id) {
        reg.attendee = updated;
        localStorage.setItem(STORAGE_KEYS.registrationData, JSON.stringify(reg));
      }
      return { attendee: updated };
    }
  },

  // Admin: Get all attendees
  getAttendees: async () => {
    try {
      const response = await api.get('/admin/attendees', { params: { format: 'json' } });
      return response.data;
    } catch (error) {
      // Fallback to local attendees
      return getLocalAttendees();
    }
  },

  // Get attendees list for admin (kept for compatibility)
  getAttendeesList: async (category, format = 'json') => {
    try {
      const params = { format };
      if (category) params.category = category;
      const response = await api.get('/admin/attendees', { params });
      return response.data;
    } catch (error) {
      // Fallback builds from local data
      const attendees = getLocalAttendees();
      return attendees;
    }
  },

  // Download attendees CSV (with local fallback)
  downloadAttendeesCSV: async (category) => {
    try {
      // Using axios with responseType blob to handle file download
      const params = { format: 'csv' };
      if (category) params.category = category;
      const response = await api.get('/admin/attendees', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendees${category ? '_' + category.toLowerCase() : ''}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (error) {
      // Local fallback
      const attendees = getLocalAttendees();
      const filtered = category ? attendees.filter((a) => a.category === category) : attendees;
      let csv = 'Registration ID,Full Name,Email,Category,Food Choice,Checked In\n';
      filtered.forEach((a) => {
        csv += `${a.registration_id},${a.full_name},${a.email},${a.category},${a.food_choice},${a.checked_in ? 'Yes' : 'No'}\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendees${category ? '_' + category.toLowerCase() : ''}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    }
  },

  // Register for a session (attendeeId, sessionId)
  registerForSession: async (attendeeId, sessionId) => {
    try {
      const response = await api.post(`/attendee/${attendeeId}/sessions`, { sessionId });
      return response.data;
    } catch (error) {
      // Local fallback: update attendee.registered_sessions
      const attendees = getLocalAttendees();
      const idx = attendees.findIndex((a) => String(a.id) === String(attendeeId));
      if (idx === -1) throw error;
      const set = new Set(attendees[idx].registered_sessions || []);
      set.add(Number(sessionId));
      attendees[idx] = { ...attendees[idx], registered_sessions: Array.from(set) };
      setLocalAttendees(attendees);
      // Also update in registrationData cache
      const reg = getCurrentRegistration();
      if (reg?.attendee?.id === attendees[idx].id) {
        reg.attendee = attendees[idx];
        localStorage.setItem(STORAGE_KEYS.registrationData, JSON.stringify(reg));
      }
      return { ok: true };
    }
  },

  // Unregister from a session
  unregisterFromSession: async (attendeeId, sessionId) => {
    try {
      const response = await api.delete(`/attendee/${attendeeId}/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      const attendees = getLocalAttendees();
      const idx = attendees.findIndex((a) => String(a.id) === String(attendeeId));
      if (idx === -1) throw error;
      const list = (attendees[idx].registered_sessions || []).filter((id) => Number(id) !== Number(sessionId));
      attendees[idx] = { ...attendees[idx], registered_sessions: list };
      setLocalAttendees(attendees);
      const reg = getCurrentRegistration();
      if (reg?.attendee?.id === attendees[idx].id) {
        reg.attendee = attendees[idx];
        localStorage.setItem(STORAGE_KEYS.registrationData, JSON.stringify(reg));
      }
      return { ok: true };
    }
  },
  
  // Send message to the SIT Concierge chatbot
  post: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error with API POST to ${endpoint}:`, error);
      throw error;
    }
  }
};

export default apiService;