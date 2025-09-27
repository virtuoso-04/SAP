// Validation middleware for registration endpoints
import { body } from 'express-validator';

// Common validation rules for both Professional and Student registrations
const commonValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^\+?[0-9]{10,15}$/).withMessage('Please provide a valid mobile number'),
  body('food_choice')
    .notEmpty().withMessage('Food choice is required')
    .isIn(['Vegetarian', 'Non-vegetarian', 'Vegan', 'Halal']).withMessage('Invalid food choice'),
  body('country').notEmpty().withMessage('Country is required'),
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid gender'),
  body('blood_group')
    .notEmpty().withMessage('Blood group is required')
    .matches(/^(A|B|AB|O)[+-]$/).withMessage('Invalid blood group format'),
  body('emergency_contact')
    .notEmpty().withMessage('Emergency contact is required')
    .matches(/^\+?[0-9]{10,15}$/).withMessage('Please provide a valid emergency contact number'),
  body('interests')
    .isArray().withMessage('Interests must be an array')
    .notEmpty().withMessage('At least one interest is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Professional', 'Student']).withMessage('Category must be either Professional or Student')
];

// Professional-specific validation rules
const professionalValidation = [
  body('company').notEmpty().withMessage('Company name is required'),
  body('designation').notEmpty().withMessage('Designation is required')
];

// Student-specific validation rules
const studentValidation = [
  body('college').notEmpty().withMessage('College name is required'),
  body('education_level')
    .notEmpty().withMessage('Education level is required')
    .isIn(['UG', 'PG']).withMessage('Education level must be either UG or PG'),
  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1, max: 5 }).withMessage('Year must be between 1 and 5')
];

// Combined validation middleware for registration
export const registerValidation = [
  ...commonValidation,
  // Conditional validation based on category
  (req, res, next) => {
    const { category } = req.body;
    
    if (category === 'Professional') {
      // Apply professional validation
      return Promise.all(professionalValidation.map(validation => validation.run(req)))
        .then(() => next())
        .catch(err => next(err));
    } 
    else if (category === 'Student') {
      // Apply student validation
      return Promise.all(studentValidation.map(validation => validation.run(req)))
        .then(() => next())
        .catch(err => next(err));
    } 
    else {
      // Invalid category
      return res.status(400).json({ error: 'Invalid category' });
    }
  }
];