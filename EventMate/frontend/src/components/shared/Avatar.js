import React from 'react';
import { motion } from 'framer-motion';

/**
 * Versatile Avatar component with Apple-inspired design
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.initials - Initials to display when image is not available
 * @param {string} props.size - Avatar size (xs, sm, md, lg, xl)
 * @param {string} props.status - User status (online, away, busy, offline)
 * @param {string} props.shape - Avatar shape (circle, square, rounded)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.borderColor - Border color
 * @param {boolean} props.animated - Whether avatar should be animated
 */
const Avatar = ({
  src,
  alt,
  initials,
  size = 'md',
  status,
  shape = 'circle',
  className = '',
  borderColor,
  animated = true,
  delay = 0,
  onClick
}) => {
  // Size mapping
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl'
  };
  
  // Shape mapping
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-md',
    rounded: 'rounded-xl'
  };
  
  // Status colors
  const statusColors = {
    online: 'bg-apple-green',
    away: 'bg-apple-orange',
    busy: 'bg-apple-red',
    offline: 'bg-gray-400'
  };
  
  // Border color with default
  const borderClass = borderColor ? `border-2 border-${borderColor}` : '';
  
  // Random background colors for initials avatars
  const randomColors = [
    'bg-sap-blue text-white',
    'bg-sap-light-blue text-white',
    'bg-apple-green text-white',
    'bg-apple-orange text-white',
    'bg-purple-500 text-white',
    'bg-pink-500 text-white',
    'bg-indigo-500 text-white',
  ];
  
  // Animation variants
  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        delay: delay * 0.1
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      }
    }
  };
  
  // Determine background color for initials based on the initials
  const getBackgroundClass = () => {
    if (!initials) return randomColors[0];
    
    // Use character code of first letter to select a color
    const charCode = initials.charCodeAt(0);
    const colorIndex = charCode % randomColors.length;
    return randomColors[colorIndex];
  };
  
  // Get initials from string
  const getInitials = () => {
    if (!initials) return '';
    
    // For "John Doe", return "JD"
    return initials
      .split(' ')
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  const cursorClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${shapeClasses[shape]} ${borderClass} overflow-hidden ${cursorClass} ${className}`}
      variants={animated ? avatarVariants : {}}
      initial={animated ? "hidden" : false}
      animate={animated ? "visible" : false}
      whileHover={onClick && animated ? "hover" : false}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt || initials || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`flex items-center justify-center w-full h-full ${getBackgroundClass()}`}>
          {getInitials()}
        </div>
      )}
      
      {/* Status indicator */}
      {status && (
        <motion.span
          className={`absolute block ${statusColors[status]} rounded-full ring-2 ring-white`}
          style={{
            width: size === 'xs' ? '8px' : '10px',
            height: size === 'xs' ? '8px' : '10px',
            right: '0',
            bottom: '0'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay * 0.1 + 0.2, type: 'spring', stiffness: 500 }}
        />
      )}
    </motion.div>
  );
};

/**
 * Avatar Group Component for displaying multiple avatars
 */
Avatar.Group = ({ children, max = 3, size = 'md', className = '' }) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const hiddenCount = childrenArray.length - max;
  
  return (
    <div className={`flex items-center ${className}`}>
      {visibleAvatars.map((child, index) => (
        <div 
          key={index} 
          className={`${index !== 0 ? '-ml-2' : ''} relative`}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {React.cloneElement(child, { 
            size: child.props.size || size,
            animated: true,
            delay: index * 0.5,
            className: `${child.props.className || ''} border-2 border-white`
          })}
        </div>
      ))}
      
      {hiddenCount > 0 && (
        <motion.div
          className={`relative -ml-2 bg-gray-200 flex items-center justify-center rounded-full border-2 border-white overflow-hidden`}
          style={{ 
            zIndex: 0,
            width: size === 'xs' ? '1.5rem' : 
                   size === 'sm' ? '2rem' : 
                   size === 'md' ? '2.5rem' : 
                   size === 'lg' ? '3.5rem' : '5rem',
            height: size === 'xs' ? '1.5rem' : 
                    size === 'sm' ? '2rem' : 
                    size === 'md' ? '2.5rem' : 
                    size === 'lg' ? '3.5rem' : '5rem'
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: visibleAvatars.length * 0.1, type: 'spring' }}
        >
          <span className={`text-${size === 'xs' ? 'xs' : 'sm'} text-gray-600 font-medium`}>
            +{hiddenCount}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default Avatar;