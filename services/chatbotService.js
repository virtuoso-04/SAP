import dotenv from 'dotenv';
import { getSessions, getAttendeeById } from '../utils/dbUtils.js';

// Load environment variables
dotenv.config();

// Check if GEMINI_API_KEY is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HAS_LLM = !!GEMINI_API_KEY;

// Common quick replies for the chatbot
const QUICK_REPLIES = [
  { text: "Show my bookmarks", action: "show_bookmarks" },
  { text: "Today's sessions", action: "show_today" },
  { text: "Find networking matches", action: "show_networking" },
  { text: "Event venue details", action: "venue_info" },
  { text: "How to check in?", action: "checkin_info" }
];

/**
 * Generate a response using LLM if available, or fall back to rule-based responses
 * @param {string} message - The user's message
 * @param {string} attendeeId - The ID of the attendee
 * @returns {Promise<Object>} - The response with text, suggested replies, etc.
 */
export async function generateChatResponse(message, attendeeId) {
  try {
    // Normalize the message for easier pattern matching
    const normalizedMessage = message.toLowerCase().trim();
    
    // Get attendee information if ID is provided
    let attendee = null;
    if (attendeeId) {
      attendee = await getAttendeeById(attendeeId);
    }
    
    // If LLM API is available, use it
    if (HAS_LLM) {
      try {
        const response = await callGeminiAPI(normalizedMessage, attendee);
        return {
          text: response.text,
          quickReplies: getContextualQuickReplies(normalizedMessage, attendee),
          isLLMResponse: true
        };
      } catch (error) {
        console.error("LLM API error:", error);
        // Fall back to rule-based responses on error
      }
    }
    
    // If no LLM or LLM failed, use rule-based responses
    return generateFallbackResponse(normalizedMessage, attendee);
    
  } catch (error) {
    console.error("Chat service error:", error);
    return {
      text: "I'm having trouble processing your request right now. Please try again in a moment.",
      quickReplies: QUICK_REPLIES.slice(0, 3),
      isLLMResponse: false
    };
  }
}

/**
 * Call the Gemini API with the user's message
 * @param {string} message - The user's message
 * @param {Object} attendee - The attendee object (for personalized responses)
 * @returns {Promise<Object>} - The API response
 */
async function callGeminiAPI(message, attendee) {
  // Get sessions for context
  const sessions = await getSessions();
  
  // Build prompt with context
  const contextPrompt = buildContextPrompt(sessions, attendee);
  const userPrompt = message;
  
  // Call Gemini API (implementation depends on which client library is used)
  try {
    // This is a placeholder - actual implementation would depend on the Gemini API client
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: contextPrompt },
              { text: userPrompt }
            ]
          }
        ]
      })
    });
    
    const data = await response.json();
    
    // Parse the response
    if (data.candidates && data.candidates[0]?.content?.parts) {
      return { 
        text: data.candidates[0].content.parts[0].text,
        isLLMResponse: true
      };
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

/**
 * Build a context prompt for the LLM that includes relevant session and attendee data
 * @param {Array} sessions - All sessions data
 * @param {Object} attendee - The attendee object
 * @returns {string} - The constructed prompt with context
 */
function buildContextPrompt(sessions, attendee) {
  // Base system prompt
  let prompt = `You are SIT Concierge, a helpful assistant for the SAP Intelligent Technologies (SIT) conference. 
Your purpose is to help attendees find information about sessions, speakers, venues, and answer frequently asked questions.
Keep your answers concise but friendly and helpful.

Here is the schedule of sessions:
`;

  // Add session information
  sessions.forEach(session => {
    const startTime = new Date(session.start_time).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    const endTime = new Date(session.end_time).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    prompt += `
- ${session.title} (${session.id})
  Speaker: ${session.speaker}
  Time: ${startTime} - ${endTime}
  Location: ${session.location}
  Tags: ${session.tags.join(', ')}
  `;
  });

  // Add attendee context if available
  if (attendee) {
    prompt += `\nThe attendee I'm talking to is ${attendee.full_name}, who is a ${attendee.category}.`;
    prompt += `\nTheir interests include: ${attendee.interests.join(', ')}.`;
    
    if (attendee.bookmarked_sessions && attendee.bookmarked_sessions.length > 0) {
      const bookmarkedSessions = sessions
        .filter(s => attendee.bookmarked_sessions.includes(s.id))
        .map(s => s.title);
        
      prompt += `\nThey have bookmarked these sessions: ${bookmarkedSessions.join(', ')}.`;
    }
  }

  // Add instructions for response format
  prompt += `\n\nWhen asked about sessions, provide relevant details including time, location, and speaker.
If asked about a speaker, provide their bio and sessions.
When asked about the venue, explain it's at the SAP Campus, Building 1, with registration at the main entrance.
Be concise but friendly in your answers.`;

  return prompt;
}

/**
 * Generate a fallback response based on pattern matching
 * @param {string} message - The normalized user message
 * @param {Object} attendee - The attendee object
 * @returns {Object} - The response with text and quick replies
 */
async function generateFallbackResponse(message, attendee) {
  // Get all sessions for searching
  const sessions = await getSessions();
  
  // Pattern matching for common questions
  
  // Sessions related questions
  if (message.includes('session') || message.includes('talk') || message.includes('workshop')) {
    // Search for specific session by keyword
    const searchTerms = message.split(' ');
    const matchedSessions = sessions.filter(session => {
      return searchTerms.some(term => 
        term.length > 3 && (
          session.title.toLowerCase().includes(term) ||
          session.description.toLowerCase().includes(term) ||
          session.tags.some(tag => tag.toLowerCase().includes(term))
        )
      );
    });
    
    if (matchedSessions.length > 0) {
      // Sort by popularity
      matchedSessions.sort((a, b) => b.popularity - a.popularity);
      
      // Take top 2
      const topSessions = matchedSessions.slice(0, 2);
      let response = "I found these sessions that might interest you:\n\n";
      
      topSessions.forEach(session => {
        const startTime = new Date(session.start_time).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit'
        });
        response += `📅 "${session.title}" by ${session.speaker}\n`;
        response += `🕒 ${startTime} at ${session.location}\n\n`;
      });
      
      if (matchedSessions.length > 2) {
        response += `There are ${matchedSessions.length - 2} more sessions matching your query.`;
      }
      
      return {
        text: response,
        quickReplies: [
          { text: "Show all matching sessions", action: "show_search_results" },
          { text: "Bookmark these sessions", action: "bookmark_suggestion" },
          ...QUICK_REPLIES.slice(0, 2)
        ],
        isLLMResponse: false
      };
    }
  }
  
  // Speaker related questions
  if (message.includes('speaker') || message.includes('presenter') || message.includes('who is')) {
    // Extract potential speaker name
    const potentialSpeakers = sessions.map(s => s.speaker);
    const matchedSpeaker = potentialSpeakers.find(speaker => 
      message.toLowerCase().includes(speaker.toLowerCase())
    );
    
    if (matchedSpeaker) {
      const speakerSessions = sessions.filter(s => 
        s.speaker.toLowerCase() === matchedSpeaker.toLowerCase()
      );
      
      // Get the speaker bio from the first session
      const speakerBio = speakerSessions[0]?.speaker_bio || "No additional information available.";
      
      let response = `${matchedSpeaker} is a speaker at the event. ${speakerBio}\n\n`;
      response += `They will present:\n`;
      
      speakerSessions.forEach(session => {
        const startTime = new Date(session.start_time).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        response += `- "${session.title}" at ${startTime}, ${session.location}\n`;
      });
      
      return {
        text: response,
        quickReplies: [
          { text: `View ${matchedSpeaker}'s sessions`, action: "show_speaker_sessions" },
          ...QUICK_REPLIES.slice(0, 3)
        ],
        isLLMResponse: false
      };
    }
  }
  
  // Venue information
  if (message.includes('venue') || message.includes('location') || message.includes('where is') || message.includes('building')) {
    return {
      text: "The event is taking place at the SAP Campus, Building 1. The main entrance has registration counters where you can check in with your QR code or registration ID. Parking is available in the visitor lot adjacent to the main building.",
      quickReplies: [
        { text: "Show map", action: "show_venue_map" },
        { text: "How to check in?", action: "checkin_info" },
        ...QUICK_REPLIES.slice(0, 2)
      ],
      isLLMResponse: false
    };
  }
  
  // Check-in help
  if (message.includes('check in') || message.includes('check-in') || message.includes('registration')) {
    return {
      text: "To check in at the event, present your QR code from the registration confirmation to the staff at the registration desk. They will scan it and provide you with your badge. If you don't have your QR code, you can also check in with your registration ID or email address.",
      quickReplies: [
        { text: "Show my QR code", action: "show_qr" },
        { text: "Registration desk location", action: "show_registration_location" },
        ...QUICK_REPLIES.slice(0, 2)
      ],
      isLLMResponse: false
    };
  }
  
  // Show bookmarked sessions
  if (message.includes('bookmark') || message.includes('saved') || message.includes('my sessions')) {
    if (attendee && attendee.bookmarked_sessions && attendee.bookmarked_sessions.length > 0) {
      const bookmarked = attendee.bookmarked_sessions;
      const bookmarkedSessions = sessions.filter(s => bookmarked.includes(s.id));
      
      let response = `You have bookmarked ${bookmarkedSessions.length} sessions:\n\n`;
      
      bookmarkedSessions.forEach(session => {
        const startTime = new Date(session.start_time).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        response += `📅 "${session.title}"\n`;
        response += `🕒 ${startTime} at ${session.location}\n\n`;
      });
      
      return {
        text: response,
        quickReplies: [
          { text: "Add to Google Calendar", action: "add_to_calendar" },
          { text: "Export as ICS", action: "export_ics" },
          ...QUICK_REPLIES.slice(0, 2)
        ],
        isLLMResponse: false
      };
    } else {
      return {
        text: "You don't have any bookmarked sessions yet. Browse the schedule and bookmark sessions you're interested in to build your personal agenda.",
        quickReplies: [
          { text: "See recommendations", action: "show_recommendations" },
          { text: "Browse all sessions", action: "browse_sessions" },
          ...QUICK_REPLIES.slice(0, 2)
        ],
        isLLMResponse: false
      };
    }
  }
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    const greeting = attendee 
      ? `Hello ${attendee.full_name}! How can I assist you today?` 
      : "Hello there! I'm the SIT Concierge. How can I help you today?";
      
    return {
      text: greeting,
      quickReplies: QUICK_REPLIES,
      isLLMResponse: false
    };
  }
  
  // Default response
  return {
    text: "I'm here to help you with information about the event, sessions, speakers, and venue. What would you like to know?",
    quickReplies: QUICK_REPLIES,
    isLLMResponse: false
  };
}

/**
 * Get contextual quick replies based on the conversation context
 * @param {string} message - The user's message
 * @param {Object} attendee - The attendee object
 * @returns {Array} - Array of quick reply objects
 */
function getContextualQuickReplies(message, attendee) {
  // Base quick replies
  const replies = [...QUICK_REPLIES];
  
  // Add contextual quick replies based on the message content
  if (message.includes('session') || message.includes('talk')) {
    replies.unshift({ text: "Browse all sessions", action: "browse_sessions" });
  }
  
  if (message.includes('speaker') || message.includes('presenter')) {
    replies.unshift({ text: "View all speakers", action: "view_speakers" });
  }
  
  if (attendee && attendee.bookmarked_sessions && attendee.bookmarked_sessions.length > 0) {
    replies.unshift({ text: "Show my bookmarks", action: "show_bookmarks" });
  }
  
  // Limit to 4 quick replies
  return replies.slice(0, 4);
}

export default {
  generateChatResponse,
  QUICK_REPLIES
};