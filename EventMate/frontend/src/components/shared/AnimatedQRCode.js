import React from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';

// Animation variants
const qrContainerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      delay: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut'
  }
};

/**
 * Enhanced QR Code Display with Apple-inspired design and animations
 */
const AnimatedQRCode = ({
  qrDataUrl,
  registrationId,
  attendeeName,
  size = 200
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center"
      variants={qrContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* QR Code with neumorphic effect */}
      <motion.div 
        className="p-4 bg-white rounded-2xl shadow-lg relative"
        whileHover={{ scale: 1.02 }}
        animate={pulseAnimation}
      >
        {/* If we have a data URL, use it; otherwise generate QR code */}
        {qrDataUrl ? (
          <motion.img 
            src={qrDataUrl}
            alt="Registration QR Code"
            width={size}
            height={size}
            className="rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        ) : (
          <QRCode 
            value={registrationId || "https://eventmate.example.com"}
            size={size}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/logo192.png",
              excavate: true,
              height: 30,
              width: 30
            }}
          />
        )}
        
        {/* Apple-style SAP-colored border accent */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sap-light-blue to-sap-blue rounded-t-2xl"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        />
      </motion.div>
      
      {/* Registration ID display with animation */}
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.p 
          className="text-xs text-gray-500 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Registration ID
        </motion.p>
        <motion.h3 
          className="text-xl font-bold text-sap-dark-blue tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {registrationId}
        </motion.h3>
        {attendeeName && (
          <motion.p 
            className="mt-1 text-sm text-sap-grey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {attendeeName}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedQRCode;