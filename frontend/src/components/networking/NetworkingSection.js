import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NetworkCard from './NetworkCard';
import { AnimatedButton } from '../shared';

/**
 * NetworkingSection component for displaying networking recommendations
 * @param {Object} props - Component props
 * @param {Array} props.recommendations - Array of networking recommendations
 * @param {Function} props.onConnect - Function to call when connect button is clicked
 * @param {Function} props.onViewProfile - Function to call when view profile button is clicked
 * @param {Function} props.onRefresh - Function to call when refresh button is clicked
 */
const NetworkingSection = ({
  recommendations = [],
  onConnect,
  onViewProfile,
  onRefresh
}) => {
  const [filterActive, setFilterActive] = useState('all');
  
  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    ) },
    { id: 'highMatch', label: 'High Match', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    ) },
    { id: 'sameInterests', label: 'Same Interests', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ) },
    { id: 'sameSessions', label: 'Same Sessions', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ) }
  ];
  
  // Filter and sort recommendations
  const filteredRecommendations = recommendations
    .filter(rec => {
      if (filterActive === 'all') return true;
      if (filterActive === 'highMatch') return rec.matchScore >= 70;
      if (filterActive === 'sameInterests') return rec.commonInterests?.length > 0;
      if (filterActive === 'sameSessions') return rec.commonSessions?.length > 0;
      return true;
    })
    .sort((a, b) => {
      // Sort by match score (descending)
      return b.matchScore - a.matchScore;
    });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };
  
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  return (
    <motion.div
      className="networking-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with refresh button */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
      >
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">Networking</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-sap-blue" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
              clipRule="evenodd" 
            />
          </svg>
        </h2>
        
        <motion.button
          onClick={onRefresh}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-sap-blue hover:text-white transition-colors"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </motion.button>
      </motion.div>
      
      {/* Filter tabs */}
      <motion.div 
        className="flex space-x-2 mb-6 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filterOptions.map(option => (
          <motion.button
            key={option.id}
            onClick={() => setFilterActive(option.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
              filterActive === option.id
                ? 'bg-sap-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option.icon}
            {option.label}
            {filterActive === option.id && (
              <span className="ml-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Recommendations grid */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecommendations.map((rec, index) => (
            <NetworkCard
              key={rec.attendee.id}
              attendee={rec.attendee}
              matchScore={rec.matchScore}
              commonInterests={rec.commonInterests || []}
              commonSessions={rec.commonSessions || []}
              onConnect={onConnect}
              onViewProfile={onViewProfile}
              delay={0.1 * index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="bg-white rounded-apple p-8 text-center border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">No networking recommendations available.</p>
          <AnimatedButton onClick={onRefresh} variant="primary">
            Find Connections
          </AnimatedButton>
        </motion.div>
      )}
      
      {/* View all button - only show if there are recommendations */}
      {filteredRecommendations.length > 0 && (
        <div className="mt-6 text-center">
          <AnimatedButton
            variant="ghost"
            className="border border-gray-200"
            pill={true}
          >
            View All Connections
          </AnimatedButton>
        </div>
      )}
    </motion.div>
  );
};

export default NetworkingSection;