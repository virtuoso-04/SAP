import React from 'react';
import { motion } from 'framer-motion';

/**
 * Versatile Card component with Apple-inspired design and animation options
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Card variant (default, glass, neumorphism)
 * @param {boolean} props.interactive - Add hover effects
 * @param {boolean} props.withBorder - Add border to card
 * @param {boolean} props.withShadow - Add shadow to card
 * @param {Function} props.onClick - Click handler (makes card clickable)
 */
const Card = ({
  children,
  className = '',
  variant = 'default',
  interactive = true,
  withBorder = false,
  withShadow = true,
  animated = true,
  onClick,
  delay = 0,
  ...props
}) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: delay * 0.1
      }
    },
    hover: interactive ? { 
      y: -5,
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      }
    } : {},
    tap: interactive ? { scale: 0.98 } : {}
  };
  
  // Determine card classes based on variant
  let variantClasses = '';
  
  switch(variant) {
    case 'glass':
      variantClasses = 'bg-white bg-opacity-70 backdrop-blur-sm border border-gray-100';
      break;
    case 'neumorphism':
      variantClasses = 'bg-apple-bg shadow-neumorphism border-0';
      break;
    case 'dark':
      variantClasses = 'bg-gray-800 text-white';
      break;
    case 'sap':
      variantClasses = 'bg-sap-blue text-white';
      break;
    default:
      variantClasses = 'bg-white';
  }
  
  const borderClass = withBorder ? 'border border-gray-100' : '';
  const shadowClass = withShadow ? 'shadow-card' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <motion.div
      className={`rounded-apple p-6 ${variantClasses} ${shadowClass} ${borderClass} ${cursorClass} ${className}`}
      variants={animated ? cardVariants : {}}
      initial={animated ? "hidden" : false}
      animate={animated ? "visible" : false}
      whileHover={animated ? "hover" : false}
      whileTap={onClick && animated ? "tap" : false}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Card Header component
 */
Card.Header = ({ children, className = '' }) => (
  <div className={`mb-4 pb-3 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

/**
 * Card Content component
 */
Card.Content = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

/**
 * Card Footer component
 */
Card.Footer = ({ children, className = '' }) => (
  <div className={`mt-4 pt-3 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

/**
 * Card with Badge
 */
Card.WithBadge = ({ children, badgeText, badgeVariant = 'blue', badgePosition = 'top-right', ...props }) => {
  // Badge color classes
  const badgeColors = {
    blue: 'bg-sap-blue text-white',
    green: 'bg-apple-green text-white',
    red: 'bg-apple-red text-white',
    orange: 'bg-apple-orange text-white',
    gray: 'bg-gray-500 text-white',
  };
  
  // Badge position classes
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };
  
  return (
    <Card {...props}>
      <div className="relative">
        {children}
        <div className={`absolute ${positions[badgePosition]} badge-apple ${badgeColors[badgeVariant]}`}>
          {badgeText}
        </div>
      </div>
    </Card>
  );
};

export default Card;