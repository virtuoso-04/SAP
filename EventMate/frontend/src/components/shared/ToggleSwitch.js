import React from 'react';
import { motion } from 'framer-motion';

/**
 * iOS-style toggle switch component
 * @param {Object} props - Component props
 * @param {boolean} props.isOn - Toggle state
 * @param {Function} props.onToggle - Toggle handler
 * @param {string} props.label - Label text
 * @param {string} props.name - Input name attribute
 * @param {string} props.id - Input ID
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disable toggle
 */
const ToggleSwitch = ({
  isOn,
  onToggle,
  label,
  name,
  id,
  className = '',
  disabled = false,
  animated = true,
  delay = 0
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: delay * 0.1
      }
    }
  };
  
  // Spring transition for the toggle
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30
  };
  
  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      variants={animated ? containerVariants : {}}
      initial={animated ? "hidden" : false}
      animate={animated ? "visible" : false}
    >
      <div
        role="switch"
        aria-checked={isOn}
        onClick={disabled ? null : onToggle}
        className={`toggle-apple relative ${isOn ? 'bg-apple-green' : 'bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="checkbox"
          name={name}
          id={id}
          checked={isOn}
          onChange={onToggle}
          className="sr-only"
          disabled={disabled}
        />
        <motion.div
          className={`bg-white rounded-full shadow-md absolute left-0.5 top-0.5 w-5 h-5`}
          animate={{ translateX: isOn ? 20 : 0 }}
          transition={spring}
        />
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium text-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
        </label>
      )}
    </motion.div>
  );
};

export default ToggleSwitch;