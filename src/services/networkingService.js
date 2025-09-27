import { API_URL } from '../config';
import { mockConnections } from '../mocks/networkingMocks';

/**
 * Get suggested connections for a user based on the specified mode
 * 
 * @param {string} mode - The suggestion mode ('interests', 'sessions', 'company')
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - A promise that resolves to an array of connection suggestions
 */
export const getSuggestedConnections = async (mode = 'interests', userId) => {
  // In a production environment, this would call the actual API endpoint
  // For the prototype, we'll use mock data
  
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll filter the mock connections differently based on mode
    let filteredConnections = [...mockConnections];
    
    // Filter based on the selected mode (in a real app, this would be done by the backend)
    switch (mode) {
      case 'interests':
        // For interests mode, we'd prioritize connections with similar interests
        filteredConnections.sort((a, b) => b.interests.length - a.interests.length);
        break;
      case 'sessions':
        // For sessions mode, we'd prioritize connections who attended similar sessions
        filteredConnections.sort((a, b) => b.sessionMatchScore - a.sessionMatchScore);
        break;
      case 'company':
        // For company mode, we'd prioritize connections from similar companies
        filteredConnections.sort((a, b) => {
          if (a.industry === b.industry) {
            return a.companySize - b.companySize;
          }
          return a.industry.localeCompare(b.industry);
        });
        break;
      default:
        break;
    }
    
    return filteredConnections;
  } catch (error) {
    console.error('Error fetching suggested connections:', error);
    throw error;
  }
};

/**
 * Send a connection request from one user to another
 * 
 * @param {string} fromUserId - The ID of the user sending the request
 * @param {string} toUserId - The ID of the user receiving the request
 * @returns {Promise<Object>} - A promise that resolves to the connection request object
 */
export const sendConnectionRequest = async (fromUserId, toUserId) => {
  // In a production environment, this would call the actual API endpoint
  
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate a successful API response
    return {
      id: `request-${Date.now()}`,
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending connection request:', error);
    throw error;
  }
};

/**
 * Get all pending connection requests for a user
 * 
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - A promise that resolves to an array of connection requests
 */
export const getPendingConnectionRequests = async (userId) => {
  // In a production environment, this would call the actual API endpoint
  
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock pending requests (would come from API in real app)
    return [
      {
        id: 'request-1',
        fromUser: {
          id: 'user-123',
          firstName: 'Alex',
          lastName: 'Johnson',
          jobTitle: 'Product Manager',
          company: 'SAP Labs',
          avatar: null
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'request-2',
        fromUser: {
          id: 'user-456',
          firstName: 'Maria',
          lastName: 'Garcia',
          jobTitle: 'UX Designer',
          company: 'SAP Design',
          avatar: null
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching pending connection requests:', error);
    throw error;
  }
};

/**
 * Accept or reject a connection request
 * 
 * @param {string} requestId - The ID of the connection request
 * @param {boolean} accept - Whether to accept or reject the request
 * @returns {Promise<Object>} - A promise that resolves to the updated connection request
 */
export const respondToConnectionRequest = async (requestId, accept) => {
  // In a production environment, this would call the actual API endpoint
  
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Simulate a successful API response
    return {
      id: requestId,
      status: accept ? 'accepted' : 'rejected',
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error responding to connection request:', error);
    throw error;
  }
};

/**
 * Get LinkedIn OAuth authorization URL from backend.
 */
export const getLinkedInAuthUrl = async (attendeeId) => {
  try {
    const res = await fetch(`${API_URL}/auth/linkedin/url?attendeeId=${encodeURIComponent(attendeeId || '')}`);
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      const error = new Error(msg.error || 'Failed to get LinkedIn URL');
      error.status = res.status;
      throw error;
    }
    const data = await res.json();
    return data.url;
  } catch (error) {
    console.error('getLinkedInAuthUrl error:', error);
    throw error;
  }
};

/**
 * Get X (Twitter) OAuth authorization URL from backend.
 */
export const getXAuthUrl = async (attendeeId) => {
  try {
    const res = await fetch(`${API_URL}/auth/x/url?attendeeId=${encodeURIComponent(attendeeId || '')}`);
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      const error = new Error(msg.error || 'Failed to get X URL');
      error.status = res.status;
      throw error;
    }
    const data = await res.json();
    return data.url;
  } catch (error) {
    console.error('getXAuthUrl error:', error);
    throw error;
  }
};

/**
 * Connect the current user to LinkedIn (mock)
 * Returns a mock connection object; in real life this would be an OAuth flow.
 */
export const connectLinkedIn = async () => {
  try {
    await new Promise((r) => setTimeout(r, 600));
    return { provider: 'linkedin', connected: true, connectedAt: new Date().toISOString() };
  } catch (error) {
    console.error('Error connecting LinkedIn:', error);
    throw error;
  }
};

/**
 * Connect the current user to X (Twitter) (mock)
 * Returns a mock connection object; in real life this would be an OAuth flow.
 */
export const connectX = async () => {
  try {
    await new Promise((r) => setTimeout(r, 600));
    return { provider: 'x', connected: true, connectedAt: new Date().toISOString() };
  } catch (error) {
    console.error('Error connecting X:', error);
    throw error;
  }
};

/**
 * Disconnect the current user from LinkedIn (mock)
 * Returns a mock disconnection object.
 */
export const disconnectLinkedIn = async () => {
  try {
    await new Promise((r) => setTimeout(r, 400));
    return { provider: 'linkedin', disconnected: true, disconnectedAt: new Date().toISOString() };
  } catch (error) {
    console.error('Error disconnecting LinkedIn:', error);
    throw error;
  }
};

/**
 * Disconnect the current user from X (Twitter) (mock)
 * Returns a mock disconnection object.
 */
export const disconnectX = async () => {
  try {
    await new Promise((r) => setTimeout(r, 400));
    return { provider: 'x', disconnected: true, disconnectedAt: new Date().toISOString() };
  } catch (error) {
    console.error('Error disconnecting X:', error);
    throw error;
  }
};