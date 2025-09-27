import React, { useState } from 'react';
import { formatTime, formatDate, downloadICSFile } from '../utils/calendar';

const SessionDetail = ({ session }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you'd call the API to update bookmarks
  };

  // Handle calendar download
  const handleAddToCalendar = async () => {
    try {
      await downloadICSFile(session);
    } catch (error) {
      console.error('Failed to create calendar file:', error);
    }
  };

  if (!session) {
    return (
      <div className="bg-white rounded-sap shadow-card p-6 animate-pulse">
        <div className="h-8 bg-sap-light-grey rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-sap-light-grey rounded w-1/4 mb-6"></div>
        <div className="h-24 bg-sap-light-grey rounded w-full mb-4"></div>
        <div className="space-y-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-sap-light-grey rounded w-full"></div>
          ))}
        </div>
        <div className="h-10 bg-sap-light-grey rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sap shadow-card">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-sap-dark-blue mb-2">{session.title}</h1>
            <p className="text-sap-grey">
              {formatDate(session.start_time)} | {formatTime(session.start_time)} - {formatTime(session.end_time)}
            </p>
          </div>
          
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked ? 'bg-sap-blue text-white' : 'bg-sap-bg text-sap-grey hover:bg-sap-light-grey'
            }`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-sap-bg flex items-center space-x-4 text-sap-grey">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{session.location}</span>
        </div>
        
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Capacity: {session.capacity}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-lg font-semibold text-sap-dark-blue mb-2">About this session</h2>
        <p className="text-sap-grey mb-6">{session.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {session.tags.map((tag) => (
            <span 
              key={tag} 
              className="inline-block bg-sap-bg text-xs font-medium text-sap-blue px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="border-t border-sap-light-grey pt-6 mb-6">
          <h2 className="text-lg font-semibold text-sap-dark-blue mb-3">Speaker</h2>
          <div className="flex items-center">
            <div className="bg-sap-bg rounded-full h-12 w-12 flex items-center justify-center text-sap-blue mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sap-dark-blue">{session.speaker}</p>
              <p className="text-sm text-sap-grey">{session.speaker_bio}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleAddToCalendar}
            className="btn btn-primary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Calendar
          </button>
          
          <button 
            onClick={handleBookmarkToggle}
            className="btn btn-secondary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isBookmarked ? 'Remove Bookmark' : 'Bookmark Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;