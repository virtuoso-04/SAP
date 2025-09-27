import React, { useState, useEffect } from 'react';
import SessionCard from './SessionCard';

const ForYouCarousel = ({ recommendations, loading = false, error = null }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  
  // Handle previous slide
  const handlePrevSlide = () => {
    if (recommendations && recommendations.length > 0) {
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
      );
    }
  };
  
  // Handle next slide
  const handleNextSlide = () => {
    if (recommendations && recommendations.length > 0) {
      setActiveIndex((prevIndex) => 
        prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    if (!touchStart) {
      return;
    }
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left
        handleNextSlide();
      } else {
        // Swipe right
        handlePrevSlide();
      }
      setTouchStart(0);
    }
  };
  
  // Auto-advance carousel every 10 seconds
  useEffect(() => {
    if (!loading && recommendations && recommendations.length > 0) {
      const timer = setInterval(() => {
        handleNextSlide();
      }, 10000);
      
      return () => clearInterval(timer);
    }
  }, [loading, recommendations, activeIndex, handleNextSlide]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-sap shadow-card p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-sap-light-grey rounded w-1/3"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 rounded-full bg-sap-light-grey"></div>
            <div className="h-8 w-8 rounded-full bg-sap-light-grey"></div>
          </div>
        </div>
        <div className="h-64 bg-sap-light-grey rounded-sap"></div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-sap shadow-card p-6">
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-sap-dark-blue mb-2">Unable to load recommendations</h3>
            <p className="text-sm text-sap-grey">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Show empty state
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-sap shadow-card p-6">
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-sap-blue mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-sap-dark-blue mb-2">No recommendations yet</h3>
            <p className="text-sm text-sap-grey">Add more interests to get personalized session recommendations.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-sap shadow-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-sap-blue">For You</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevSlide}
            className="p-2 rounded-full hover:bg-sap-bg text-sap-grey"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleNextSlide}
            className="p-2 rounded-full hover:bg-sap-bg text-sap-grey"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {recommendations.map((session, index) => (
            <div 
              key={session.id} 
              className="w-full flex-shrink-0"
              style={{ display: index === activeIndex ? 'block' : 'none' }}
            >
              <SessionCard 
                session={session} 
                isRecommended={true} 
                reason={session.reason}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicators */}
      {recommendations.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {recommendations.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-sap-blue' : 'bg-sap-light-grey'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForYouCarousel;