import { getAttendeeById, getSessions } from '../utils/dbUtils.js';
import { generateRecommendationReason } from '../utils/securityUtils.js';

/**
 * Generate session recommendations for an attendee
 * @param {string} attendeeId - ID of the attendee
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Promise<Array>} - Recommended sessions
 */
export async function generateRecommendations(attendeeId, limit = 5) {
  // Get attendee and sessions data
  const attendee = await getAttendeeById(attendeeId);
  if (!attendee) {
    throw new Error('Attendee not found');
  }
  
  const sessions = await getSessions();
  
  // Calculate scores for each session based on interests and popularity
  const scoredSessions = sessions.map(session => {
    // Count matching tags (case insensitive)
    const tagMatches = session.tags.filter(tag => 
      attendee.interests.some(interest => 
        interest.toLowerCase() === tag.toLowerCase()
      )
    ).length;
    
    // Calculate score: tag matches have high weight, plus popularity
    const score = (tagMatches * 10) + session.popularity;
    
    // Generate personalized recommendation reason
    const reason = generateRecommendationReason(session, attendee);
    
    return {
      ...session,
      score,
      reason
    };
  });
  
  // Group sessions by time slot to avoid conflicts
  const timeSlots = {};
  
  scoredSessions.forEach(session => {
    const timeSlot = `${session.start_time}-${session.end_time}`;
    
    // If this is the first session for this time slot or has a higher score
    // than the current session in this slot, replace it
    if (!timeSlots[timeSlot] || timeSlots[timeSlot].score < session.score) {
      timeSlots[timeSlot] = session;
    }
  });
  
  // Convert time slot map to array, sort by score, and take top 'limit' sessions
  return Object.values(timeSlots)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get most popular sessions based on bookmarks and popularity score
 * @param {number} limit - Maximum number of sessions to return
 * @returns {Promise<Array>} - Popular sessions
 */
export async function getPopularSessions(limit = 3) {
  const sessions = await getSessions();
  
  // Sort by combination of bookmarks and popularity
  return sessions
    .sort((a, b) => {
      const scoreA = (a.bookmarks * 1.5) + a.popularity;
      const scoreB = (b.bookmarks * 1.5) + b.popularity;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Get sessions happening today
 * @returns {Promise<Array>} - Today's sessions
 */
export async function getTodaySessions() {
  const sessions = await getSessions();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of day
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Start of next day
  
  // Filter sessions that start today
  return sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    return sessionDate >= today && sessionDate < tomorrow;
  }).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
}

/**
 * Generate networking recommendations for an attendee
 * @param {string} attendeeId - ID of the attendee
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Promise<Array>} - Recommended attendees to network with
 */
export async function generateNetworkingRecommendations(attendeeId, limit = 3) {
  // Get attendee and all other attendees
  const attendee = await getAttendeeById(attendeeId);
  if (!attendee) {
    throw new Error('Attendee not found');
  }
  
  const allAttendees = await getAttendeeById();
  
  // Calculate compatibility score with other attendees
  const otherAttendees = allAttendees
    .filter(other => other.id !== attendee.id)
    .map(other => {
      // Count matching interests
      const sharedInterests = attendee.interests.filter(interest =>
        other.interests.includes(interest)
      );
      
      // Check for complementary roles
      let roleMatch = 0;
      
      // For example, designers match well with developers
      if (
        (attendee.designation?.toLowerCase().includes('designer') && 
         other.designation?.toLowerCase().includes('developer')) ||
        (attendee.designation?.toLowerCase().includes('developer') && 
         other.designation?.toLowerCase().includes('designer'))
      ) {
        roleMatch = 10;
      }
      
      // Students and professionals can learn from each other
      if (attendee.category !== other.category) {
        roleMatch += 5;
      }
      
      // Calculate total match score
      const score = (sharedInterests.length * 10) + roleMatch;
      
      // Generate match reason
      const reasons = [];
      
      if (sharedInterests.length > 0) {
        reasons.push(`You both share interests in ${sharedInterests.join(', ')}`);
      }
      
      if (attendee.category !== other.category) {
        reasons.push(`Connect with a ${other.category.toLowerCase()} to gain new perspectives`);
      }
      
      if (roleMatch > 5) {
        reasons.push(`Your skills complement each other`);
      }
      
      // Final reason text
      const matchReason = reasons.length > 0 
        ? reasons[Math.floor(Math.random() * reasons.length)]
        : 'You might find their perspective interesting';
      
      return {
        ...other,
        score,
        matchReason
      };
    });
  
  // Sort by score and return top matches
  return otherAttendees
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export default {
  generateRecommendations,
  getPopularSessions,
  getTodaySessions,
  generateNetworkingRecommendations
};