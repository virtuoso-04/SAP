import React from 'react';
import { motion } from 'framer-motion';

/**
 * EventMate Logo Component with animated effects
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the logo (sm, md, lg, xl)
 * @param {boolean} props.animated - Whether the logo should be animated
 * @param {string} props.className - Additional CSS classes
 */
const EventMateLogo = ({ size = 'md', animated = true, className = '' }) => {
  // Size mapping
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
    xl: 'h-24'
  };
  
  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    },
    hover: { 
      scale: 1.05,
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }),
    hover: (i) => ({ 
      y: [0, -5, 0],
      color: i % 2 === 0 ? '#0F4C81' : '#3A75C4', // Alternating SAP blue shades
      transition: { 
        delay: i * 0.05,
        duration: 0.5,
        repeat: 0,
        type: 'spring'
      }
    })
  };
  
  const iconPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        delay: 0.2,
        duration: 1.5,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Logo text animation wrapper
  const LogoText = () => {
    const letters = "EventMate".split("");
    
    return (
      <div className="flex items-center">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            className={`font-bold ${i === 0 || i === 5 ? 'text-sap-blue' : 'text-gray-800'}`}
            style={{ display: 'inline-block', position: 'relative' }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    );
  };
  
  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      variants={animated ? logoVariants : {}}
      initial={animated ? "hidden" : false}
      animate={animated ? "visible" : false}
      whileHover={animated ? "hover" : false}
    >
      {/* Logo Icon */}
      <motion.div 
        className="relative"
        variants={animated ? {} : {}}
      >
        <svg 
          viewBox="0 0 60 60" 
          className={`${sizeClasses[size]} text-sap-blue`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M30 5C16.215 5 5 16.215 5 30s11.215 25 25 25 25-11.215 25-25S43.785 5 30 5zm0 45c-11.046 0-20-8.954-20-20s8.954-20 20-20 20 8.954 20 20-8.954 20-20 20z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            variants={animated ? iconPathVariants : {}}
          />
          <motion.path
            d="M40 30h-5v-5a5 5 0 00-10 0v5h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={animated ? iconPathVariants : {}}
          />
          <motion.path
            d="M30 35v5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            variants={animated ? iconPathVariants : {}}
          />
          {/* SAP blue accent at the top */}
          <motion.circle
            cx="30"
            cy="15"
            r="3"
            fill="#3A75C4"
            variants={animated ? {
              hidden: { opacity: 0, scale: 0 },
              visible: { 
                opacity: 1, 
                scale: 1,
                transition: { delay: 1, duration: 0.3 }
              },
              hover: {
                scale: [1, 1.5, 1],
                transition: { 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }
              }
            } : {}}
          />
        </svg>
        
        {/* Highlight effect for Apple-like shine */}
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0"
          animate={animated ? {
            opacity: [0, 0.4, 0],
            x: ['0%', '100%'],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 5
            }
          } : {}}
        />
      </motion.div>

      {/* Logo Text */}
      <div className={`text-${size === 'sm' ? 'lg' : 'xl'} tracking-wide`}>
        {animated ? <LogoText /> : (
          <div className="font-bold">
            <span className="text-sap-blue">E</span>vent<span className="text-sap-blue">M</span>ate
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventMateLogo;