# Gemini API Integration Guide for EventMate

This guide provides detailed instructions for developers who want to integrate Google's Gemini API with the EventMate application's SIT Concierge chatbot.

## Overview

The SIT Concierge chatbot uses Google's Generative AI (Gemini) to provide intelligent responses to attendee queries. This guide explains how to set up the API, understand the integration architecture, and customize the AI responses for your specific event needs.

## Setting Up Gemini API Access

### 1. Create a Google AI Studio Account

1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Accept the terms of service

### 2. Create an API Key

1. Navigate to the API Keys section
2. Click "Create API Key"
3. Copy your new API key
4. Add security restrictions if needed (e.g., HTTP referrer restrictions)

### 3. Configure the Application

1. In the backend directory, locate or create the `.env` file
2. Add your API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Make sure the `.env` file is listed in `.gitignore` to prevent committing sensitive keys

## Understanding the Integration Architecture

```
┌─────────────┐    ┌─────────────┐    ┌───────────────┐    ┌──────────────┐
│ React UI    │    │ Backend API │    │ Chatbot       │    │ Gemini API   │
│ SITConcierge│───>│ /api/chat   │───>│ Service       │───>│ generateText │
└─────────────┘    └─────────────┘    └───────────────┘    └──────────────┘
       │                                      │                   │
       │                                      │                   │
       ▼                                      ▼                   ▼
┌─────────────┐            ┌───────────────────────┐    ┌──────────────────┐
│ UI Fallback │            │ Rule-based Fallback   │    │ AI Response      │
│ Responses   │◄───────────│ If API Unavailable    │◄───│ Processing       │
└─────────────┘            └───────────────────────┘    └──────────────────┘
```

The system follows these steps:
1. User sends a message through the UI
2. The frontend sends the message to the backend API
3. The backend chatbot service processes the message
4. If the Gemini API is available, it sends the message with context
5. The API response is processed and enhanced with quick replies
6. If the API is unavailable, the system falls back to rule-based responses
7. The response is sent back to the UI

## Code Integration Details

### 1. Backend Integration

The main integration is in `backend/services/chatbotService.js`:

```javascript
async function callGeminiAPI(message, attendee) {
  // Get sessions for context
  const sessions = await getSessions();
  
  // Build prompt with context
  const contextPrompt = buildContextPrompt(sessions, attendee);
  const userPrompt = message;
  
  try {
    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
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
```

### 2. Prompt Engineering

The quality of AI responses depends on the context provided. The `buildContextPrompt` function constructs a detailed prompt with event information:

```javascript
function buildContextPrompt(sessions, attendee) {
  // Base system prompt
  let prompt = `You are SIT Concierge, a helpful assistant for the SAP Intelligent Technologies (SIT) conference. 
Your purpose is to help attendees find information about sessions, speakers, venues, and answer frequently asked questions.
Keep your answers concise but friendly and helpful.

Here is the schedule of sessions:
`;

  // Add session information
  sessions.forEach(session => {
    // Format session details for the prompt
  });

  // Add attendee context if available
  if (attendee) {
    // Add personalized information
  }

  // Add instructions for response format
  prompt += `\n\nWhen asked about sessions, provide relevant details including time, location, and speaker.
If asked about a speaker, provide their bio and sessions.
When asked about the venue, explain it's at the SAP Campus, Building 1, with registration at the main entrance.
Be concise but friendly in your answers.`;

  return prompt;
}
```

## Customizing AI Behavior

### 1. Modifying the System Prompt

To change how the AI responds, modify the `buildContextPrompt` function:

- **Personality**: Adjust the first paragraph to change the chatbot's tone and style
- **Information**: Update session details, venue information, etc.
- **Instructions**: Change the response guidelines for specific query types

### 2. Adding Custom Context

You can enhance the AI's knowledge by adding more context:

```javascript
// Add event-specific information
prompt += `\n\nImportant event details:
- Wi-Fi: Network "SAP-Event", Password "VIBE2025IPX"
- Lunch is served from 12:00-1:30 PM in the Atrium
- Technical support is available at the Help Desk in the main lobby
- The keynote speech starts at 9:00 AM in the Grand Hall`;
```

### 3. Implementing Personalization

Make responses more relevant to individual attendees:

```javascript
if (attendee) {
  prompt += `\nThe attendee I'm talking to is ${attendee.full_name}.`;
  prompt += `\nTheir role is ${attendee.title} at ${attendee.company}.`;
  prompt += `\nTheir interests include: ${attendee.interests.join(', ')}.`;
  
  // Add personalized recommendations
  prompt += `\nBased on their interests, suggest sessions about ${attendee.interests[0]} and ${attendee.interests[1]}.`;
}
```

## Handling API Limitations

### 1. Rate Limiting

The Gemini API has rate limits that may affect your application:

- Implement request throttling to avoid exceeding limits
- Add retry logic with exponential backoff for failed requests
- Monitor API usage to stay within quotas

### 2. Response Time Optimization

To improve perceived performance:

- Show typing indicators while waiting for AI responses
- Pre-fetch common responses during idle time
- Cache frequently requested information

### 3. Fallback Strategy

When the API is unavailable or returns errors:

- Maintain a comprehensive set of rule-based responses
- Use a decision tree for common questions
- Provide clear messaging when falling back to non-AI responses

## Security Considerations

When integrating with the Gemini API:

1. Never expose API keys in client-side code
2. Implement proper input validation to prevent prompt injection
3. Filter out sensitive information from both prompts and responses
4. Consider implementing content moderation for user inputs

## Testing Your Integration

1. Start by testing basic queries to ensure connectivity
2. Test with various event-specific questions to verify context handling
3. Test the fallback system by temporarily disabling API access
4. Check response quality across different question types

## Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Check if the API key is correct and not expired
2. **429 Too Many Requests**: You've hit rate limits, implement throttling
3. **Empty Responses**: Review your prompt structure for potential issues
4. **Slow Responses**: Optimize prompt length and implement caching

### Debugging Steps:

1. Enable verbose logging for API calls
2. Use postman or curl to test API requests directly
3. Check network requests in browser developer tools
4. Verify environment variables are loaded correctly

## Next Steps

After basic integration, consider these advanced features:

1. Implement conversation history for contextual follow-up questions
2. Add specialized handling for different query types (events, speakers, etc.)
3. Create analytics to track common questions and improve responses
4. Implement multi-language support using Gemini's translation capabilities