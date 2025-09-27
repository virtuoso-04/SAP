import { body } from 'express-validator';

// Validation rules for registration
export const registerValidation = [
  body('full_name')
    .notEmpty().withMessage('Full name is required')
    .isString().withMessage('Full name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[+]?[\d\s-]{7,15}$/).withMessage('Invalid mobile number format'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Student', 'Professional']).withMessage('Category must be either Student or Professional'),
  
  // Conditional validation based on category
  body('company')
    .if(body('category').equals('Professional'))
    .notEmpty().withMessage('Company name is required for professionals'),
  
  body('designation')
    .if(body('category').equals('Professional'))
    .notEmpty().withMessage('Designation is required for professionals'),
  
  body('college')
    .if(body('category').equals('Student'))
    .notEmpty().withMessage('College name is required for students'),
  
  body('education_level')
    .if(body('category').equals('Student'))
    .notEmpty().withMessage('Education level is required for students')
    .isIn(['UG', 'PG', 'PhD']).withMessage('Education level must be UG, PG, or PhD'),
  
  body('food_choice')
    .notEmpty().withMessage('Food choice is required')
    .isIn(['Vegetarian', 'Non-vegetarian', 'Vegan', 'Halal']).withMessage('Invalid food choice'),
  
  body('interests')
    .isArray().withMessage('Interests must be an array')
    .notEmpty().withMessage('At least one interest is required'),
  
  body('interests.*')
    .isString().withMessage('Each interest must be a string'),
  
  body('country')
    .notEmpty().withMessage('Country is required')
    .isString().withMessage('Country must be a string'),
  
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid gender')
];

// Validation rules for checking in
export const checkInValidation = [
  body()
    .custom((value, { req }) => {
      if (!req.body.qrString && !req.body.registration_id) {
        throw new Error('Either QR code data or registration ID is required');
      }
      return true;
    })
];

// Validation for recommendation requests
export const recommendationValidation = [
  body('attendeeId')
    .notEmpty().withMessage('Attendee ID is required')
];

// Validation for session bookmarking
export const bookmarkValidation = [
  body('attendeeId')
    .notEmpty().withMessage('Attendee ID is required'),
  
  body('sessionId')
    .notEmpty().withMessage('Session ID is required')
];