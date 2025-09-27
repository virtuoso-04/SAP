# SIT Concierge Chatbot Setup Guide

This guide explains how to set up and customize the SIT Concierge chatbot in your EventMate installation.

## Overview

The SIT Concierge is an AI-powered chatbot that assists event attendees with:
- Finding relevant sessions and information
- Getting answers to common event questions
- Navigating the venue
- Connecting with other attendees
- Managing their personal schedule

## Setup Steps

### 1. Configure the Gemini API Key

1. Sign up for a Google Gemini API key at [Google AI Studio](https://makersuite.google.com/)
2. Create a `.env` file in the `backend` directory if it doesn't exist
3. Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Restart the backend server to apply the changes

### 2. Customize Chatbot Responses

You can customize the chatbot's responses by modifying the `chatbotService.js` files:

1. **Backend Responses**: Edit `backend/services/chatbotService.js` to modify the AI prompt and rule-based responses
2. **Frontend Fallbacks**: Edit `frontend/src/services/chatbotService.js` to update client-side fallback responses

### 3. Integrate with Event Data

The chatbot can provide personalized responses using event data:

1. Make sure your sessions data is properly formatted in the database
2. Update the `buildContextPrompt` function in `backend/services/chatbotService.js` to include relevant data
3. Link attendee profiles to enable personalized recommendations

### 4. Test the Chatbot

1. Start both frontend and backend servers
2. Open the application in your browser
3. Click the chatbot icon in the bottom right corner
4. Test with common questions like:
   - "What sessions are available tomorrow?"
   - "Where is the main hall located?"
   - "How do I check in at the event?"
   - "Tell me about the networking opportunities"

## Troubleshooting

### API Connection Issues
- Check if the `.env` file contains the correct API key
- Verify the backend server is running
- Check browser console for API errors

### Response Quality
- The quality of responses depends on the Gemini API model
- Ensure your prompts in `buildContextPrompt` provide enough context
- Add more rule-based responses for common questions

### Offline Mode
- The chatbot will automatically fall back to rule-based responses when offline
- Test the offline mode by temporarily removing the API key

## Advanced Customization

### UI Appearance
The chatbot UI can be customized in `frontend/src/components/SITConcierge.js`:
- Change colors to match your brand
- Modify animations and transitions
- Add custom icons or images

### Response Processing
You can enhance response processing in `backend/services/chatbotService.js`:
- Add sentiment analysis for user messages
- Implement multi-language support
- Create specialized handlers for different types of questions

## Next Steps

After basic setup, consider these enhancements:
1. Add conversation history to provide context for follow-up questions
2. Implement user feedback mechanism for responses
3. Create analytics to track common questions and improve responses
4. Develop specialized features like session booking directly via chat