import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Stylish animated input component with Apple-inspired design
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.id - Input ID (also used for associating label)
 * @param {string} props.name - Input name attribute
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.inputProps - Additional props for input element
 */
const Input = forwardRef(({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  inputProps = {},
  animated = true,
  delay = 0,
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
  
  // Determine if we should show the placeholder or floating label
  const hasValue = value && value.toString().length > 0;
  
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
            (isFocused || hasValue) ? 'text-sap-blue' : ''
          }`}
        >
          {label}
          {required && <span className="text-apple-red ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`form-input-apple transition-all duration-300 ${
            error ? 'ring-2 ring-apple-red' : ''
          } ${isFocused ? 'ring-2 ring-sap-blue bg-white shadow-none' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...inputProps}
        />
        
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

export default Input;