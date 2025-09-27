import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '../shared';

/**
 * AttendeeProfile component to display detailed attendee information
 * @param {Object} props - Component props
 * @param {Object} props.attendee - Attendee data
 * @param {number} props.matchScore - Match score for networking (0-100)
 * @param {Array} props.commonInterests - Array of common interests
 * @param {Array} props.commonSessions - Array of common sessions
 * @param {Function} props.onConnect - Function to call when connect button is clicked
 * @param {Function} props.onMessage - Function to call when message button is clicked
 * @param {Function} props.onClose - Function to call when close button is clicked
 */
const AttendeeProfile = ({
  attendee,
  matchScore = 0,
  commonInterests = [],
  commonSessions = [],
  onConnect,
  onMessage,
  onClose
}) => {
  if (!attendee) return null;
  
  const {
    id,
    name,
    title,
    company,
    bio,
    profileImage,
    skills = [],
    interests = [],
    socialLinks = {}
  } = attendee;
  
  // Format match score as percentage
  const formattedMatchScore = Math.min(100, Math.max(0, matchScore));
  
  // Define color based on match score
  const getMatchColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };
  
  // Animation variants
  const profileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  return (
    <motion.div
      className="bg-white rounded-apple shadow-lg border border-gray-100 max-w-md w-full mx-auto"
      variants={profileVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">Attendee Profile</h3>
        <motion.button 
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>
      
      {/* Profile header with image and basic info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex mb-6">
          {/* Profile image */}
          <div className="mr-4 flex-shrink-0">
            <div className="w-24 h-24 rounded-apple-lg overflow-hidden bg-gray-100">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sap-blue text-white text-3xl font-bold">
                  {name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Match score indicator */}
            {matchScore > 0 && (
              <div className="flex items-center justify-center mt-2">
                <div 
                  className={`${getMatchColor(formattedMatchScore)} w-2 h-2 rounded-full mr-2`}
                ></div>
                <span className="text-sm font-semibold">
                  {formattedMatchScore}% Match
                </span>
              </div>
            )}
          </div>
          
          {/* Basic info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <p className="text-gray-600 mb-1">{title}</p>
            {company && (
              <p className="text-gray-500 mb-3">{company}</p>
            )}
            
            {/* Social links */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="flex space-x-3">
                {socialLinks.linkedin && (
                  <a 
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-.139 9.237c.209 4.617-3.234 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.08-4.03 3.199-4.03.943 0 1.797.398 2.395 1.037.748-.147 1.451-.42 2.086-.796-.246.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.439.656-.996 1.234-1.639 1.697z" />
                    </svg>
                  </a>
                )}
                {socialLinks.github && (
                  <a 
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Bio */}
        {bio && (
          <div>
            <h4 className="text-sm uppercase font-semibold text-gray-500 mb-2">Bio</h4>
            <p className="text-gray-700">{bio}</p>
          </div>
        )}
      </div>
      
      {/* Common interests section */}
      {commonInterests.length > 0 && (
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
            Common Interests
          </h4>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map((interest, index) => (
              <span 
                key={index}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills section */}
      {skills.length > 0 && (
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
            Skills & Expertise
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* All interests section */}
      {interests.length > 0 && commonInterests.length < interests.length && (
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
            All Interests
          </h4>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span 
                key={index}
                className={`text-sm px-3 py-1 rounded-full ${
                  commonInterests.includes(interest)
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-gray-50 text-gray-600'
                }`}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Common sessions section */}
      {commonSessions && commonSessions.length > 0 && (
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">
            Common Sessions
          </h4>
          <div className="space-y-3">
            {commonSessions.map((session, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-apple-sm">
                <p className="font-medium text-gray-800">{session.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {session.time} • {session.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="p-6 flex space-x-3">
        <AnimatedButton
          variant="primary"
          className="flex-1"
          onClick={() => onConnect(id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Connect
        </AnimatedButton>
        
        <AnimatedButton
          variant="secondary"
          className="flex-1"
          onClick={() => onMessage(id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          Message
        </AnimatedButton>
      </div>
    </motion.div>
  );
};

export default AttendeeProfile;