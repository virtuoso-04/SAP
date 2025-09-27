/**
 * SIT Concierge chatbot service for EventMate
 * Provides API interaction for the AI-powered chatbot
 */

import api from './api';

// Default suggestions for the chatbot
const DEFAULT_SUGGESTIONS = [
  'What sessions are recommended for me?',
  'Tell me about event schedule',
  'How do I check in?',
  'Wi-Fi information',
  'Find networking matches'
];

/**
 * Send user message to the chatbot API
 * @param {string} message - User's message
 * @param {string} attendeeId - Optional attendee ID for personalized responses
 * @returns {Promise<Object>} - Chatbot response with text and suggestions
 */
export const sendChatbotMessage = async (message, attendeeId = null) => {
  try {
    // First try to use the backend API if it's available
    try {
      const response = await api.post('/chat', { message, attendeeId });
      return response;
    } catch (apiError) {
      console.warn('Backend chatbot API unavailable, falling back to client-side mode:', apiError);
      // Fall back to client-side response generation
      return generateClientSideResponse(message, attendeeId);
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    return {
      text: "I'm having trouble connecting right now. Please try again in a moment.",
      quickReplies: DEFAULT_SUGGESTIONS.slice(0, 3),
      isLLMResponse: false
    };
  }
};

/**
 * Generate response on the client side when backend is unavailable
 * @param {string} message - User's message
 * @param {string} attendeeId - Attendee ID for personalized responses
 * @returns {Promise<Object>} - Generated response
 */
const generateClientSideResponse = async (message, attendeeId) => {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Chatbot response templates
  const RESPONSES = {
    greeting: "Hello! I'm SIT Concierge, your virtual assistant for this event. How can I help you today?",
    help: "I can help you with: event information, session recommendations, venue navigation, food options, or connecting with other attendees. What would you like to know?",
    schedule: "The SAP Vibeathon 2025 runs from January 15-17. Sessions start at 9:00 AM and end at 5:30 PM each day. You can check your personalized schedule on your dashboard.",
    location: "The event is being held at the SAP Innovation Center, 123 Tech Boulevard. You can find directions and a venue map on the 'Venue' page in the app.",
    wifi: "Free Wi-Fi is available throughout the venue.\nNetwork: SAP-Event\nPassword: VIBEATHON2025\nPlease visit the help desk if you have any connection issues.",
    food: "Meals are provided throughout the event. Breakfast is served from 8:00-9:00 AM, lunch from 12:00-1:30 PM, and there are refreshment breaks at 10:30 AM and 3:00 PM.",
    sessions: "I can help you find sessions based on your interests! Check your dashboard for personalized recommendations, or ask me about specific topics like 'AI workshops' or 'cloud computing talks'.",
    networking: "Looking to connect with others? Check out the 'Networking' tab on your dashboard. I can also help find attendees with similar interests - just tell me what you're looking for!",
    registration: "Your registration QR code is available on your dashboard. You'll need to show this at check-in. If you're having trouble accessing it, visit the registration desk with your ID.",
    checkin: "Check-in opens at 8:00 AM each day at the main entrance. Just show your QR code from the dashboard to our staff. Pre-registered attendees can use the express lane."
  };
  
  // Pattern matching for common questions
  let response;
  if (/hi|hello|hey|greetings/i.test(normalizedMessage)) {
    response = RESPONSES.greeting;
  } else if (/help|assist|support|what can you do/i.test(normalizedMessage)) {
    response = RESPONSES.help;
  } else if (/schedule|agenda|program|when|timing/i.test(normalizedMessage)) {
    response = RESPONSES.schedule;
  } else if (/where|location|venue|place|address/i.test(normalizedMessage)) {
    response = RESPONSES.location;
  } else if (/wifi|internet|network|connection/i.test(normalizedMessage)) {
    response = RESPONSES.wifi;
  } else if (/food|meal|eat|lunch|breakfast|dinner|coffee/i.test(normalizedMessage)) {
    response = RESPONSES.food;
  } else if (/session|talk|workshop|presentation|recommend/i.test(normalizedMessage)) {
    response = RESPONSES.sessions;
  } else if (/network|connect|meeting|people|attendees/i.test(normalizedMessage)) {
    response = RESPONSES.networking;
  } else if (/register|registration|signup|sign up/i.test(normalizedMessage)) {
    response = RESPONSES.registration;
  } else if (/check.?in|entry|enter|arrival/i.test(normalizedMessage)) {
    response = RESPONSES.checkin;
  } else {
    // Default fallback response
    response = "I'm not sure I understand. You can ask me about the event schedule, venue, sessions, networking, or check-in procedures.";
  }
  
  // Get contextual suggestions based on the query
  const suggestions = getContextualSuggestions(normalizedMessage);
  
  return {
    text: response,
    quickReplies: suggestions,
    isLLMResponse: false
  };
};

/**
 * Get contextual quick reply suggestions based on the query context
 * @param {string} query - User's query
 * @returns {Array<string>} - Array of relevant suggestions
 */
const getContextualSuggestions = (query) => {
  // Session related suggestions
  if (/session|talk|workshop|presentation/i.test(query)) {
    return [
      'Show my recommended sessions',
      'What sessions are today?',
      'Add sessions to my calendar',
      'Session locations'
    ];
  }
  
  // Venue related suggestions
  if (/where|location|venue|place|address/i.test(query)) {
    return [
      'Where is the main hall?',
      'Restroom locations',
      'Charging stations',
      'Food area location'
    ];
  }
  
  // Networking related suggestions
  if (/network|connect|meeting|people|attendees/i.test(query)) {
    return [
      'Find similar interests',
      'Networking events today',
      'Connect with speakers',
      'Share my contact'
    ];
  }
  
  // Check-in related suggestions
  if (/check.?in|registration|qr|code/i.test(query)) {
    return [
      'Show my QR code',
      'Check-in hours',
      'Lost my QR code',
      'Registration desk location'
    ];
  }
  
  // Default suggestions
  return DEFAULT_SUGGESTIONS;
};

const chatbotService = {
  sendChatbotMessage,
  DEFAULT_SUGGESTIONS
};

export default chatbotService;