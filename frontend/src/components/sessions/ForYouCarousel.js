import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SessionCard from './SessionCard';
import { AnimatedButton } from '../shared';

/**
 * For You Carousel component for recommended sessions
 * @param {Object} props - Component props
 * @param {Array} props.sessions - Array of session objects
 * @param {Array} props.bookmarkedSessions - Array of bookmarked session IDs
 * @param {Function} props.onBookmarkToggle - Function to call when toggling bookmark
 */
const ForYouCarousel = ({ 
  sessions = [], 
  bookmarkedSessions = [], 
  onBookmarkToggle 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  
  // Check if session is bookmarked
  const isBookmarked = (sessionId) => {
    return bookmarkedSessions.includes(sessionId);
  };
  
  // Handle next/prev navigation
  const goToNext = () => {
    if (currentIndex < sessions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to the start
    }
  };
  
  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(sessions.length - 1); // Loop to the end
    }
  };
  
  // Auto-scroll carousel every 10 seconds
  useEffect(() => {
    if (sessions.length <= 1) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [currentIndex, sessions.length]);
  
  // Skip rendering if no sessions
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-apple p-8 text-center">
        <p className="text-gray-500">No recommended sessions available.</p>
      </div>
    );
  }
  
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
      className="relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      ref={carouselRef}
    >
      <motion.div className="mb-4 flex justify-between items-center" variants={headerVariants}>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">For You</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-sap-blue" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" 
            />
          </svg>
        </h2>
        
        {/* Navigation controls */}
        <div className="flex space-x-2">
          <motion.button
            onClick={goToPrev}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-sap-blue hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={sessions.length <= 1}
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
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </motion.button>
          <motion.button
            onClick={goToNext}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-sap-blue hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={sessions.length <= 1}
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
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Carousel */}
      <div className="relative">
        <motion.div 
          className="carousel-container"
          animate={{
            x: `calc(-${currentIndex * 100}%)`
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          style={{
            display: 'flex',
            width: `${sessions.length * 100}%`
          }}
        >
          {sessions.map((session, index) => (
            <div 
              key={session.id} 
              className="px-2"
              style={{ width: `${100 / sessions.length}%` }}
            >
              <SessionCard 
                session={session} 
                isBookmarked={isBookmarked(session.id)} 
                onBookmarkToggle={onBookmarkToggle}
                showReason={true}
                delay={index * 0.2}
              />
            </div>
          ))}
        </motion.div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {sessions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentIndex === index ? 'bg-sap-blue w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* View all recommendations button */}
      <div className="mt-6 text-center">
        <AnimatedButton
          variant="ghost"
          className="border border-gray-200"
          pill={true}
        >
          View All Recommendations
        </AnimatedButton>
      </div>
    </motion.div>
  );
};

export default ForYouCarousel;