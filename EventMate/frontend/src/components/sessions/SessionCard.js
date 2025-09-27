import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../shared';

/**
 * Session card component for displaying event sessions
 * @param {Object} props - Component props
 * @param {Object} props.session - Session data object
 * @param {boolean} props.isBookmarked - Whether the session is bookmarked by the user
 * @param {Function} props.onBookmarkToggle - Function to call when toggling bookmark
 * @param {boolean} props.showReason - Whether to show recommendation reason
 * @param {number} props.delay - Animation delay for staggered entries
 */
const SessionCard = ({ 
  session, 
  isBookmarked = false, 
  onBookmarkToggle,
  showReason = false,
  delay = 0
}) => {
  if (!session) return null;
  
  // Format session time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format session date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
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
        damping: 30,
        delay: delay * 0.1
      }
    },
    hover: { 
      y: -5,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      }
    }
  };
  
  // Tag colors based on category
  const getTagColor = (tag) => {
    const lowerTag = tag.toLowerCase();
    
    if (lowerTag.includes('beginner') || lowerTag === 'ux' || lowerTag.includes('design')) {
      return 'bg-green-100 text-green-800';
    } else if (lowerTag.includes('advanced') || lowerTag === 'technical' || lowerTag.includes('development')) {
      return 'bg-purple-100 text-purple-800';
    } else if (lowerTag.includes('ai') || lowerTag.includes('ml') || lowerTag.includes('innovation')) {
      return 'bg-blue-100 text-blue-800';
    } else if (lowerTag.includes('cloud') || lowerTag.includes('platform') || lowerTag.includes('sap')) {
      return 'bg-sap-blue bg-opacity-10 text-sap-blue';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="h-full"
    >
      <Card 
        className="h-full flex flex-col"
        withShadow={true}
        interactive={false}
        animated={false}
      >
        {/* Session header with time and bookmark button */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              {formatDate(session.start_time)}
            </p>
            <div className="flex items-center mt-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-sap-blue mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="text-sm font-medium">
                {formatTime(session.start_time)} - {formatTime(session.end_time)}
              </span>
            </div>
          </div>
          
          {/* Bookmark button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onBookmarkToggle) onBookmarkToggle(session.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-400 hover:text-sap-blue focus:outline-none"
            aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            {isBookmarked ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-sap-blue" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" 
                  clipRule="evenodd" 
                />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                />
              </svg>
            )}
          </motion.button>
        </div>
        
        {/* Session title and content */}
        <Link 
          to={`/session/${session.id}`} 
          className="flex-grow flex flex-col"
        >
          <h3 className="text-lg font-medium mb-2">
            {session.title}
          </h3>
          
          <div className="mb-3">
            <span className="flex items-center text-sm text-gray-600">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              {session.speaker}
            </span>
            
            <span className="flex items-center text-sm text-gray-600 mt-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              {session.location}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
            {session.description}
          </p>
          
          {/* Recommendation reason */}
          {showReason && session.reason && (
            <div className="mt-auto mb-3 p-2 bg-sap-blue bg-opacity-5 rounded-lg text-xs text-gray-700 italic">
              {session.reason}
            </div>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {session.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
            {session.tags.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                +{session.tags.length - 3}
              </span>
            )}
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default SessionCard;