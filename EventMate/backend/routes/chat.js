import express from 'express';
import { generateChatResponse } from '../services/chatbotService.js';

const router = express.Router();

// POST /api/chat - Process a chat message
router.post('/', async (req, res) => {
  try {
    const { message, attendeeId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await generateChatResponse(message, attendeeId);
    
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      text: "I'm having trouble processing your request right now. Please try again in a moment.",
      isLLMResponse: false 
    });
  }
});

export default router;