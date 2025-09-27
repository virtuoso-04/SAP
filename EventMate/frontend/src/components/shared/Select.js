import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Stylish animated select component with Apple-inspired design
 * @param {Object} props - Component props
 * @param {string} props.label - Select label
 * @param {string} props.id - Select ID (also used for associating label)
 * @param {string} props.name - Select name attribute
 * @param {Array} props.options - Array of options: [{value: 'value1', label: 'Label 1'}]
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether select is required
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.selectProps - Additional props for select element
 */
const Select = forwardRef(({
  label,
  id,
  name,
  options = [],
  value,
  onChange,
  error,
  required = false,
  className = '',
  selectProps = {},
  animated = true,
  delay = 0,
  placeholder = 'Select an option',
}, ref) => {
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

  // Handle floating label and focus animations
  const [isFocused, setIsFocused] = React.useState(false);
  
  return (
    <motion.div 
      className={`mb-4 ${className}`}
      variants={animated ? containerVariants : {}}
      initial={animated ? "hidden" : false}
      animate={animated ? "visible" : false}
    >
      {label && (
        <label 
          htmlFor={id} 
          className={`form-label-apple transition-all duration-200 ${
            isFocused ? 'text-sap-blue' : ''
          }`}
        >
          {label}
          {required && <span className="text-apple-red ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`form-input-apple transition-all duration-300 appearance-none pr-10 ${
            error ? 'ring-2 ring-apple-red' : ''
          } ${isFocused ? 'ring-2 ring-sap-blue bg-white shadow-none' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...selectProps}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
        
        {/* Animated focus ring */}
        {isFocused && (
          <motion.div 
            className="absolute inset-0 pointer-events-none rounded-apple"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: '0 0 0 2px rgba(15, 76, 129, 0.3)'
            }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
      
      {/* Error message with animation */}
      {error && (
        <motion.p 
          className="mt-1 text-apple-red text-sm"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

export default Select;