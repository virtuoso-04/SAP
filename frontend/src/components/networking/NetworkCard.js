import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '../shared';

/**
 * NetworkCard component for displaying attendee networking recommendations
 * @param {Object} props - Component props
 * @param {Object} props.attendee - Attendee data
 * @param {number} props.matchScore - Networking match score (0-100)
 * @param {Array} props.commonInterests - Array of common interests
 * @param {Array} props.commonSessions - Array of common sessions
 * @param {Function} props.onConnect - Function to call when connect button is clicked
 * @param {Function} props.onViewProfile - Function to call when view profile button is clicked
 * @param {number} props.delay - Animation delay in seconds
 */
const NetworkCard = ({
  attendee,
  matchScore = 0,
  commonInterests = [],
  commonSessions = [],
  onConnect,
  onViewProfile,
  delay = 0
}) => {
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
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay
      }
    },
    hover: {
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  // If no attendee data, return null
  if (!attendee) return null;
  
  const {
    id,
    name,
    title,
    company,
    profileImage,
    skills = [],
  } = attendee;
  
  // Determine recommendation reason
  const getRecommendationReason = () => {
    if (commonInterests.length > 0 && commonSessions.length > 0) {
      return "Common interests & sessions";
    } else if (commonInterests.length > 0) {
      return "Similar interests";
    } else if (commonSessions.length > 0) {
      return "Attending same sessions";
    }
    return "Recommended for you";
  };
  
  return (
    <motion.div
      className="bg-white rounded-apple p-6 border border-gray-100 shadow-sm"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Match score indicator */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div 
            className={`${getMatchColor(formattedMatchScore)} w-2 h-2 rounded-full mr-2`}
          ></div>
          <span className="text-sm font-semibold">
            {formattedMatchScore}% Match
          </span>
        </div>
        
        {/* Connection status */}
        <div className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-full">
          {getRecommendationReason()}
        </div>
      </div>
      
      {/* Profile section */}
      <div className="flex items-center mb-4">
        <div className="relative mr-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sap-blue text-white text-xl font-bold">
                {name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Common session count badge */}
          {commonSessions.length > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-sap-blue text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
              {commonSessions.length}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-bold text-lg text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{title}</p>
          {company && (
            <p className="text-xs text-gray-500">{company}</p>
          )}
        </div>
      </div>
      
      {/* Common interests */}
      {commonInterests.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs text-gray-500 uppercase font-semibold mb-2">
            Common Interests
          </h4>
          <div className="flex flex-wrap gap-1">
            {commonInterests.slice(0, 3).map((interest, index) => (
              <span 
                key={index}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
              >
                {interest}
              </span>
            ))}
            {commonInterests.length > 3 && (
              <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full">
                +{commonInterests.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs text-gray-500 uppercase font-semibold mb-2">
            Skills
          </h4>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((skill, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Common sessions preview */}
      {commonSessions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs text-gray-500 uppercase font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Common Sessions
          </h4>
          
          <div className="text-xs text-gray-600">
            Both attending {commonSessions.length} session{commonSessions.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex mt-auto">
        <AnimatedButton
          variant="primary"
          className="flex-1"
          onClick={() => onConnect(id)}
        >
          Connect
        </AnimatedButton>
        
        <AnimatedButton
          variant="ghost"
          className="ml-2 border border-gray-200"
          onClick={() => onViewProfile(id)}
        >
          View Profile
        </AnimatedButton>
      </div>
    </motion.div>
  );
};

export default NetworkCard;