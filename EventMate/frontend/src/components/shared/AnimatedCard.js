import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for the card
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: 0.2
    }
  },
  hover: { 
    y: -5,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20 
    }
  },
  tap: { 
    scale: 0.98,
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  }
};

/**
 * AnimatedCard component with Apple-inspired design and smooth animations
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.glass - Apply glassmorphism effect
 * @param {boolean} props.noHover - Disable hover animation
 * @param {Function} props.onClick - Click handler
 */
const AnimatedCard = ({ 
  children, 
  className = '', 
  glass = false, 
  noHover = false,
  onClick = null,
  delay = 0,
  ...rest
}) => {
  // Base classes for the card
  const baseClass = glass 
    ? 'card-glass' 
    : 'card-apple';
  
  return (
    <motion.div
      className={`${baseClass} ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={noHover ? {} : "hover"}
      whileTap={onClick ? "tap" : {}}
      onClick={onClick}
      custom={delay}
      transition={{
        delay: delay * 0.1,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;