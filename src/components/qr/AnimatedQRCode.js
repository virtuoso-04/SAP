import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared';

/**
 * Animated QR Code display component
 * @param {Object} props - Component props
 * @param {string} props.qrData - The QR code data URL
 * @param {string} props.attendeeId - Attendee ID
 * @param {string} props.registrationId - Registration ID to display
 * @param {string} props.attendeeName - Name of the attendee
 * @param {Function} props.onRefresh - Function to call when refreshing the QR code
 * @param {boolean} props.showRefreshButton - Whether to show the refresh button
 */
const AnimatedQRCode = ({ 
  qrData, 
  attendeeId,
  registrationId,
  attendeeName,
  onRefresh,
  showRefreshButton = true
}) => {
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };
  
  const qrVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.2
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6
      }
    }
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    if (onRefresh && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setTimeout(() => setRefreshing(false), 1000);
    }
  };
  
  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-6 md:p-8 mx-auto max-w-md flex flex-col items-center">
        <motion.div
          className="relative"
          variants={qrVariants}
        >
          {/* QR Code */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 relative overflow-hidden">
            {qrData ? (
              <img 
                src={qrData} 
                alt="QR Code" 
                className="w-64 h-64 object-contain"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 text-gray-400">
                QR Code loading...
              </div>
            )}
            
            {/* SAP Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="text-sap-blue">
                <svg width="80" height="80" viewBox="0 0 50 50" fill="currentColor">
                  <path d="M25 10c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 27c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12z" />
                  <path d="M25 15c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                  <circle cx="25" cy="25" r="4" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Refresh button */}
          {showRefreshButton && (
            <motion.button
              className="absolute -right-3 -bottom-3 bg-sap-blue text-white p-2 rounded-full shadow-lg"
              onClick={handleRefresh}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={refreshing}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} 
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
          )}
        </motion.div>
        
        {/* Registration details */}
        <motion.div 
          className="mt-6 text-center"
          variants={textVariants}
        >
          {attendeeName && (
            <h3 className="text-lg font-medium text-gray-900">
              {attendeeName}
            </h3>
          )}
          
          {registrationId && (
            <div className="mt-1">
              <span className="text-sm text-gray-500">Registration ID</span>
              <p className="text-sap-blue font-mono font-medium tracking-wider">{registrationId}</p>
            </div>
          )}
        </motion.div>
        
        <motion.p 
          className="mt-6 text-xs text-gray-500 text-center"
          variants={textVariants}
        >
          Present this QR code at the registration desk to check in.
          <br/>
          This code is unique to you and cannot be transferred.
        </motion.p>
      </Card>
    </motion.div>
  );
};

export default AnimatedQRCode;