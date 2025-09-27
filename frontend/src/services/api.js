import axios from 'axios';

// API base URL from environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service object with methods for each endpoint
const apiService = {
  // Get all sessions
  getSessions: async () => {
    try {
      const response = await api.get('/sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  // Register a new attendee
  registerAttendee: async (attendeeData) => {
    try {
      const response = await api.post('/register', attendeeData);
      return response.data;
    } catch (error) {
      console.error('Error registering attendee:', error);
      throw error;
    }
  },

  // Get attendee by ID or registration ID
  getAttendee: async (id) => {
    try {
      const response = await api.get(`/attendee/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendee:', error);
      throw error;
    }
  },

  // Get recommendations for an attendee
  getRecommendations: async (id) => {
    try {
      const response = await api.get(`/attendee/${id}/recommendations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  // Check in an attendee using QR code or registration ID
  checkIn: async (data) => {
    try {
      const response = await api.post('/checkin', data);
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  },

  // Get attendees list for admin (with optional category filter)
  getAttendeesList: async (category, format = 'json') => {
    try {
      const params = { format };
      if (category) {
        params.category = category;
      }
      
      const response = await api.get('/admin/attendees', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendees list:', error);
      throw error;
    }
  },

  // Download attendees CSV
  downloadAttendeesCSV: async (category) => {
    try {
      // Using axios with responseType blob to handle file download
      const params = { format: 'csv' };
      if (category) {
        params.category = category;
      }
      
      const response = await api.get('/admin/attendees', {
        params,
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendees${category ? '_' + category.toLowerCase() : ''}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error downloading CSV:', error);
      throw error;
    }
  }
};

export default apiService;