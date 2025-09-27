/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'sap-blue': '#0f4c81',
        'sap-light-blue': '#3a75c4',
        'sap-dark-blue': '#0b3558',
        'sap-grey': '#6B7280',
        'sap-light-grey': '#E5E7EB',
        
        // Background colors
        'apple-white': '#FFFFFF',
        'apple-bg': '#F5F5F7',
        'sap-bg': '#F5F5F7',
        
        // Accent colors
        'apple-green': '#34C759',
        'apple-red': '#FF3B30',
        'apple-blue': '#007AFF',
        'apple-orange': '#FF9500',
        
        // Glassmorphism
        'glass': 'rgba(255, 255, 255, 0.8)',
        'glass-dark': 'rgba(15, 76, 129, 0.8)',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro Text"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', 'SFMono-Regular', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'neumorphism': '10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'button': '0 4px 6px rgba(15, 76, 129, 0.25)',
      },
      borderRadius: {
        'sap': '0.5rem',
        'apple': '1rem',
        'apple-xl': '1.25rem',
        'pill': '9999px',
      },
      backdropFilter: {
        'blur': 'blur(20px)',
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'scale': 'scale 0.3s ease-in-out',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slideUp': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slideIn': {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'scale': {
          '0%': { transform: 'scale(0.95)' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-effect': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        },
        '.glass-effect-dark': {
          backgroundColor: 'rgba(15, 76, 129, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        },
        '.text-gradient': {
          background: 'linear-gradient(90deg, #0f4c81 0%, #3a75c4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}