import { getSessions, getSessionById } from '../../utils/dbUtils.js';
import { generateICSForSession, generateGoogleCalendarURL } from '../../services/calendarService.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { path } = req.query;

      // GET /api/sessions - Get all sessions
      if (!path || path.length === 0) {
        const sessions = await getSessions();
        return res.status(200).json(sessions);
      }

      const [endpoint, ...params] = path;

      // GET /api/sessions/:id - Get a specific session
      if (params.length === 0) {
        const session = await getSessionById(endpoint);
        if (!session) {
          return res.status(404).json({ error: 'Session not found' });
        }
        return res.status(200).json(session);
      }

      // Handle sub-routes
      if (endpoint === 'filter') {
        if (params[0] === 'today') {
          return await handleTodaySessions(res);
        } else if (params[0] === 'popular') {
          return await handlePopularSessions(req, res);
        }
      } else if (endpoint === 'search' && params[0] === 'query') {
        return await handleSearchSessions(req, res);
      } else {
        // Handle calendar routes: /api/sessions/:id/calendar/:type
        const sessionId = endpoint;
        if (params[0] === 'calendar') {
          if (params[1] === 'ics') {
            return await handleICSCalendar(sessionId, res);
          } else if (params[1] === 'google') {
            return await handleGoogleCalendar(sessionId, res);
          }
        }
      }

      return res.status(404).json({ error: 'Endpoint not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleTodaySessions(res) {
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
}

async function handlePopularSessions(req, res) {
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
}

async function handleICSCalendar(sessionId, res) {
  try {
    const icsContent = await generateICSForSession(sessionId);

    // Send as file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=session-${sessionId}.ics`);
    res.send(icsContent);
  } catch (error) {
    console.error('Error generating ICS:', error);
    res.status(500).json({ error: 'Failed to generate calendar event' });
  }
}

async function handleGoogleCalendar(sessionId, res) {
  try {
    const gcalUrl = await generateGoogleCalendarURL(sessionId);

    res.json({ url: gcalUrl });
  } catch (error) {
    console.error('Error generating Google Calendar URL:', error);
    res.status(500).json({ error: 'Failed to generate Google Calendar link' });
  }
}

async function handleSearchSessions(req, res) {
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
}