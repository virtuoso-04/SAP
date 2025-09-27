/**
 * EventMate UI Components Library
 * A collection of reusable UI components with Apple and SAP inspired design
 */

// Export all components
export { default as EventMateLogo } from './EventMateLogo';
export { default as AnimatedButton } from './AnimatedButton';
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as ToggleSwitch } from './ToggleSwitch';
export { default as Card } from './Card';
export { default as Modal } from './Modal';
export { default as Avatar } from './Avatar';
export { ToastProvider, useToast } from './Toast';

/**
 * UI Component Library Documentation
 * 
 * EventMateLogo:
 * - Animated logo with interactive effects
 * - Props: size (sm, md, lg, xl), animated (boolean), className (string)
 * 
 * AnimatedButton:
 * - Stylish button component with spring animations
 * - Props: variant (primary, success, danger, ghost), pill (boolean), disabled (boolean), etc.
 * 
 * Input:
 * - Form input with floating labels and focus animations
 * - Props: label, type, id, name, value, onChange, error, required, etc.
 * 
 * Select:
 * - Dropdown select with custom styling
 * - Props: label, id, name, options, value, onChange, error, required, etc.
 * 
 * ToggleSwitch:
 * - iOS-style toggle switch
 * - Props: isOn, onToggle, label, name, id, disabled, etc.
 * 
 * Card:
 * - Versatile card component with multiple variants
 * - Props: variant (default, glass, neumorphism), interactive, withBorder, withShadow, etc.
 * - Sub-components: Card.Header, Card.Content, Card.Footer, Card.WithBadge
 * 
 * Modal:
 * - Dialog with backdrop and animations
 * - Props: isOpen, onClose, title, showCloseButton, size (sm, md, lg, xl)
 * - Sub-components: Modal.Body, Modal.Footer
 * 
 * Avatar:
 * - Profile image component with fallback to initials
 * - Props: src, alt, initials, size, status, shape, etc.
 * - Sub-components: Avatar.Group
 * 
 * Toast:
 * - Notification system
 * - Usage: wrap app with <ToastProvider>
 * - Access with useToast() hook: { success, error, warning, info }
 */