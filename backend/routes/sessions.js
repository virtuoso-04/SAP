import express from 'express';
import { getSessions, getSessionById } from '../utils/dbUtils.js';
import { generateICSForSession, generateGoogleCalendarURL } from '../services/calendarService.js';

const router = express.Router();

// GET /api/sessions - Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await getSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/sessions/:id - Get a specific session
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await getSessionById(id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// GET /api/sessions/today - Get sessions happening today
router.get('/filter/today', async (req, res) => {
  try {
    const allSessions = await getSessions();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of next day
    
    // Filter sessions that start today
    const todaySessions = allSessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= today && sessionDate < tomorrow;
    }).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    
    res.json(todaySessions);
  } catch (error) {
    console.error('Error fetching today\'s sessions:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s sessions' });
  }
});

// GET /api/sessions/popular - Get most popular sessions
router.get('/filter/popular', async (req, res) => {
  try {
    const allSessions = await getSessions();
    const limit = parseInt(req.query.limit) || 5;
    
    // Sort by combination of bookmarks and popularity
    const popularSessions = allSessions
      .sort((a, b) => {
        const scoreA = (a.bookmarks * 1.5) + a.popularity;
        const scoreB = (b.bookmarks * 1.5) + b.popularity;
        return scoreB - scoreA;
      })
      .slice(0, limit);
    
    res.json(popularSessions);
  } catch (error) {
    console.error('Error fetching popular sessions:', error);
    res.status(500).json({ error: 'Failed to fetch popular sessions' });
  }
});

// GET /api/sessions/:id/calendar/ics - Generate ICS for a session
router.get('/:id/calendar/ics', async (req, res) => {
  try {
    const { id } = req.params;
    const icsContent = await generateICSForSession(id);
    
    // Send as file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=session-${id}.ics`);
    res.send(icsContent);
  } catch (error) {
    console.error('Error generating ICS:', error);
    res.status(500).json({ error: 'Failed to generate calendar event' });
  }
});

// GET /api/sessions/:id/calendar/google - Generate Google Calendar link
router.get('/:id/calendar/google', async (req, res) => {
  try {
    const { id } = req.params;
    const gcalUrl = await generateGoogleCalendarURL(id);
    
    res.json({ url: gcalUrl });
  } catch (error) {
    console.error('Error generating Google Calendar URL:', error);
    res.status(500).json({ error: 'Failed to generate Google Calendar link' });
  }
});

// GET /api/sessions/search - Search sessions by query
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const allSessions = await getSessions();
    const searchTerms = q.toLowerCase().split(' ');
    
    // Search in title, description, speaker name, and tags
    const matchedSessions = allSessions.filter(session => {
      const title = session.title.toLowerCase();
      const description = session.description.toLowerCase();
      const speaker = session.speaker.toLowerCase();
      const tags = session.tags.map(tag => tag.toLowerCase());
      
      return searchTerms.some(term => 
        term.length > 2 && (
          title.includes(term) ||
          description.includes(term) ||
          speaker.includes(term) ||
          tags.some(tag => tag.includes(term))
        )
      );
    });
    
    // Sort by relevance (simple algorithm: count matches in title with higher weight)
    matchedSessions.sort((a, b) => {
      const titleMatchesA = searchTerms.filter(term => 
        a.title.toLowerCase().includes(term)
      ).length * 3;
      
      const titleMatchesB = searchTerms.filter(term => 
        b.title.toLowerCase().includes(term)
      ).length * 3;
      
      const speakerMatchA = searchTerms.filter(term => 
        a.speaker.toLowerCase().includes(term)
      ).length * 2;
      
      const speakerMatchB = searchTerms.filter(term => 
        b.speaker.toLowerCase().includes(term)
      ).length * 2;
      
      const scoreA = titleMatchesA + speakerMatchA + a.popularity;
      const scoreB = titleMatchesB + speakerMatchB + b.popularity;
      
      return scoreB - scoreA;
    });
    
    res.json(matchedSessions);
  } catch (error) {
    console.error('Error searching sessions:', error);
    res.status(500).json({ error: 'Failed to search sessions' });
  }
});

export default router;