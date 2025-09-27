import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatTime, downloadICSFile, createGoogleCalendarUrl } from '../utils/calendar';

const SessionCard = ({ session, isRecommended = false, reason = null }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    
    // Show toast notification
    if (!isBookmarked) {
      toast.success('Session added to your bookmarks');
    } else {
      toast.info('Session removed from your bookmarks');
    }
    
    // In a real app, you'd call the API to update bookmarks
  };

  // Handle calendar export
  const handleCalendarExport = (type) => {
    try {
      if (type === 'ics') {
        downloadICSFile(session);
      } else if (type === 'google') {
        window.open(createGoogleCalendarUrl(session), '_blank');
      }
      
      setShowCalendarOptions(false);
      toast.success('Session added to your calendar');
    } catch (error) {
      console.error('Calendar export error:', error);
      toast.error('Failed to add to calendar. Please try again.');
    }
  };

  // Format the session date and time
  const startTime = new Date(session.start_time);
  const endTime = new Date(session.end_time);
  const sessionDate = startTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`card hover-lift ${isRecommended ? 'border-l-4 border-sap-blue' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="inline-block bg-sap-bg text-sap-grey text-xs px-2 py-1 rounded-full mb-2">
            {sessionDate}
          </span>
          <h3 className="text-lg font-semibold text-sap-dark-blue">{session.title}</h3>
        </div>
        
        {/* Bookmark button */}
        <button 
          onClick={handleBookmarkToggle}
          className="text-sap-grey hover:text-sap-blue transition-colors"
          aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {isBookmarked ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-sap-grey mb-2">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(session.start_time)} - {formatTime(session.end_time)}
          </span>
        </p>
        
        <p className="text-sm text-sap-grey mb-2">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {session.location}
          </span>
        </p>
        
        <p className="text-sm text-sap-grey mb-2">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {session.speaker}
          </span>
        </p>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {session.tags.slice(0, 3).map(tag => (
          <span 
            key={tag} 
            className="inline-block bg-sap-bg text-xs font-medium text-sap-blue px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        {session.tags.length > 3 && (
          <span className="inline-block bg-sap-light-grey text-xs font-medium text-sap-grey px-2 py-1 rounded-full">
            +{session.tags.length - 3} more
          </span>
        )}
      </div>
      
      {/* Recommendation reason */}
      {isRecommended && reason && (
        <div className="mb-4 p-2 bg-blue-50 border-l-2 border-sap-blue rounded-r-sap">
          <p className="text-xs text-sap-blue flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{reason}</span>
          </p>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/session/${session.id}`}
          className="text-sap-blue font-medium text-sm hover:underline"
        >
          View Details
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setShowCalendarOptions(!showCalendarOptions)}
            className="btn btn-secondary text-sm py-1"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </span>
          </button>
          
          {/* Calendar options dropdown */}
          {showCalendarOptions && (
            <div className="absolute right-0 bottom-10 bg-white rounded-sap shadow-lg p-2 z-10 min-w-[150px]">
              <button 
                onClick={() => handleCalendarExport('ics')}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-sap-bg rounded-sap"
              >
                Download ICS
              </button>
              <button 
                onClick={() => handleCalendarExport('google')}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-sap-bg rounded-sap"
              >
                Google Calendar
              </button>
              <button 
                onClick={() => setShowCalendarOptions(false)}
                className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-sap"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;