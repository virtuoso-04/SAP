import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for the button
const buttonVariants = {
  hover: { 
    y: -3,
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.98,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
  },
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

/**
 * AnimatedButton component with Apple-inspired design and smooth animations
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button variant (primary, success, danger, ghost)
 * @param {boolean} props.pill - Apply pill shape (rounded corners)
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disable button
 */
const AnimatedButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  pill = false,
  onClick,
  disabled = false,
  delay = 0,
  ...rest
}) => {
  // Determine button classes based on variant
  const variantClass = `btn-${variant}`;
  const pillClass = pill ? 'btn-pill' : '';
  
  return (
    <motion.button
      className={`btn-apple ${variantClass} ${pillClass} ${className}`}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "tap"}
      onClick={disabled ? null : onClick}
      disabled={disabled}
      transition={{
        delay: delay * 0.1,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;