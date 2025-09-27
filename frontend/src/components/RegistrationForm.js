import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/api';

const INTERESTS = [
  'AI', 'Analytics', 'Automation', 'Beginner', 'BI', 
  'Blockchain', 'CI/CD', 'Cloud', 'Compliance', 'Data Visualization',
  'Design', 'Development', 'DevOps', 'Enterprise', 'Fiori', 
  'Frontend', 'Governance', 'Implementation', 'Innovation', 'Integration',
  'Machine Learning', 'Platform', 'Risk Management', 'S/4HANA', 
  'SAP', 'Security', 'Technical', 'UI5', 'UX'
];

// Define constants
const TOTAL_STEPS = 3;

// Define animation variants for form elements
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: custom => ({
    opacity: 1, 
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  focus: {
    scale: 1.02,
    boxShadow: "0 0 0 3px rgba(15, 76, 129, 0.3)",
    transition: { duration: 0.2 }
  },
  blur: {
    scale: 1,
    boxShadow: "none",
    transition: { duration: 0.2 }
  }
};

const RegistrationForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    category: 'Professional', // Default to Professional
    company: '',
    designation: '',
    college: '',
    education_level: 'UG',
    year: 1,
    food_choice: 'Vegetarian',
    country: '',
    gender: '',
    blood_group: '',
    emergency_contact: '',
    interests: [],
    consent: false
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [focusedField, setFocusedField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  // Handle interest selection
  const handleInterestToggle = (interest) => {
    const updatedInterests = [...formData.interests];
    
    if (updatedInterests.includes(interest.toLowerCase())) {
      // Remove interest
      const index = updatedInterests.indexOf(interest.toLowerCase());
      updatedInterests.splice(index, 1);
    } else {
      // Add interest
      updatedInterests.push(interest.toLowerCase());
    }
    
    setFormData({ ...formData, interests: updatedInterests });
    
    // Clear error for interests
    if (errors.interests) {
      setErrors({ ...errors, interests: null });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.blood_group) {
      newErrors.blood_group = 'Blood group is required';
    }
    
    if (!formData.emergency_contact.trim()) {
      newErrors.emergency_contact = 'Emergency contact is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.emergency_contact)) {
      newErrors.emergency_contact = 'Invalid emergency contact number';
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Select at least one interest';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'You must agree to the terms';
    }
    
    // Category-specific validations
    if (formData.category === 'Professional') {
      if (!formData.company.trim()) {
        newErrors.company = 'Company name is required';
      }
      if (!formData.designation.trim()) {
        newErrors.designation = 'Designation is required';
      }
    } else if (formData.category === 'Student') {
      if (!formData.college.trim()) {
        newErrors.college = 'College name is required';
      }
    }
    
    return newErrors;
  };
  
  // Calculate form progress
  useEffect(() => {
    const calculateProgress = () => {
      // Define required fields for each step
      const step1Fields = ['full_name', 'email', 'mobile', 'category'];
      const step2Fields = formData.category === 'Professional' 
        ? ['company', 'designation', 'country', 'gender'] 
        : ['college', 'education_level', 'year', 'country', 'gender'];
      const step3Fields = ['interests', 'consent'];
      
      // Count filled fields in each step
      const step1Filled = step1Fields.filter(field => formData[field]).length;
      const step2Filled = step2Fields.filter(field => formData[field]).length;
      const step3Filled = step3Fields.filter(field => {
        if (field === 'interests') return formData.interests.length > 0;
        return formData[field];
      }).length;
      
      // Calculate total progress
      const totalFields = step1Fields.length + step2Fields.length + step3Fields.length;
      const filledFields = step1Filled + step2Filled + step3Filled;
      
      return Math.floor((filledFields / totalFields) * 100);
    };
    
    setFormProgress(calculateProgress());
  }, [formData]);

  // Handle form step navigation
  const handleNextStep = () => {
    const stepsValidation = {
      1: ['full_name', 'email', 'mobile'],
      2: formData.category === 'Professional' 
        ? ['company', 'designation', 'country', 'gender'] 
        : ['college', 'country', 'gender']
    };
    
    const currentStepFields = stepsValidation[currentStep] || [];
    const stepErrors = {};
    
    // Validate only current step fields
    currentStepFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        stepErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    
    // Specific validations
    if (currentStep === 1 && formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      stepErrors.email = 'Invalid email address';
    }
    
    if (currentStep === 1 && formData.mobile && !/^\+?[0-9]{10,15}$/.test(formData.mobile)) {
      stepErrors.mobile = 'Invalid mobile number';
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      
      // Highlight first error field
      const firstErrorField = document.getElementById(Object.keys(stepErrors)[0]);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      
      return;
    }
    
    // Clear errors and proceed to next step
    setErrors({});
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Highlight first error field
      const firstErrorField = document.getElementById(Object.keys(newErrors)[0]);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Show loading toast
      const loadingToastId = toast.loading("Processing your registration...");
      
      // Make API call to register attendee
      const response = await apiService.registerAttendee(formData);
      
      // Update toast
      toast.update(loadingToastId, {
        render: "Registration successful!",
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
      
      // Store registration data in localStorage for success page
      localStorage.setItem('registrationData', JSON.stringify({
        attendee: response.attendee,
        qr: response.qr,
        timestamp: new Date().toISOString()
      }));
      
      // Redirect to success page with animation delay
      setTimeout(() => {
        navigate('/success');
      }, 1000);
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle API validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.param] = err.msg;
        });
        setErrors(apiErrors);
        
        // Highlight first error field
        const firstErrorField = document.getElementById(Object.keys(apiErrors)[0]);
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorField.focus();
        }
        
        toast.error('Please fix the errors in the form.');
      } else {
        // Generic error
        toast.error('Registration failed. Please try again.');
      }
      
      setIsSubmitting(false);
    }
  };
  
  // Handle input focus state for animation
  const handleInputFocus = (name) => setFocusedField(name);
  const handleInputBlur = () => setFocusedField(null);
  
  // Get form step title
  const getStepTitle = () => {
    switch(currentStep) {
      case 1:
        return 'Basic Information';
      case 2:
        return `${formData.category} Details`;
      case 3:
        return 'Preferences & Interests';
      default:
        return 'Registration Form';
    }
  };
  
  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-gradient-to-r from-sap-blue to-sap-light-blue p-6 text-white">
        <h2 className="text-3xl font-semibold tracking-tight mb-2">Join Vibeathon 2025</h2>
        <p className="text-white/80 text-lg font-light">Register for SAP's premier hackathon and unlock your intelligent participant experience.</p>
      </div>

      {/* Step indicators - Apple + SAP style */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center mb-6">
          <div className="flex-1">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Step {currentStep} of {TOTAL_STEPS}</span>
            <h3 className="text-xl font-medium mt-1">{getStepTitle()}</h3>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3].map(step => (
              <motion.div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                  ${step === currentStep 
                    ? 'border-sap-blue bg-sap-blue text-white' 
                    : step < currentStep 
                      ? 'border-sap-blue bg-white text-sap-blue'
                      : 'border-gray-200 bg-white text-gray-400'
                  }`}
                animate={step === currentStep ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {step < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-sap-blue to-sap-light-blue"
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Registration Type heading section */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sap-blue mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-800">Registration Type</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <motion.div 
                    className={`border-2 p-8 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center ${
                      formData.category === 'Student' 
                        ? 'bg-sap-blue/5 border-sap-blue shadow-md' 
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChange({ target: { name: 'category', value: 'Student' } })}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
                      formData.category === 'Student' ? 'bg-sap-blue text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <label className="flex flex-col items-center cursor-pointer">
                      <span className={`text-lg font-semibold mb-1 ${formData.category === 'Student' ? 'text-sap-blue' : 'text-gray-700'}`}>
                        Student
                      </span>
                      <span className="text-sm text-gray-500 text-center">
                        For students and researchers
                      </span>
                      <input
                        type="radio"
                        name="category"
                        value="Student"
                        checked={formData.category === 'Student'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>
                  </motion.div>
                  
                  <motion.div 
                    className={`border-2 p-8 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center ${
                      formData.category === 'Professional' 
                        ? 'bg-sap-blue/5 border-sap-blue shadow-md' 
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChange({ target: { name: 'category', value: 'Professional' } })}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
                      formData.category === 'Professional' ? 'bg-sap-blue text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <label className="flex flex-col items-center cursor-pointer">
                      <span className={`text-lg font-semibold mb-1 ${formData.category === 'Professional' ? 'text-sap-blue' : 'text-gray-700'}`}>
                        Professional
                      </span>
                      <span className="text-sm text-gray-500 text-center">
                        For industry experts
                      </span>
                      <input
                        type="radio"
                        name="category"
                        value="Professional"
                        checked={formData.category === 'Professional'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>
                  </motion.div>
                </div>
              </div>
              
              {/* Personal Information */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-sap-blue/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    whileHover="hover"
                  >
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="first_name">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                        onFocus={() => handleInputFocus('first_name')}
                        onBlur={handleInputBlur}
                        className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 
                          ${focusedField === 'first_name' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : 'border-gray-200'} 
                          focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        required
                        placeholder="John"
                      />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    whileHover="hover"
                  >
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="last_name">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                        onFocus={() => handleInputFocus('last_name')}
                        onBlur={handleInputBlur}
                        className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 
                          ${focusedField === 'last_name' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : 'border-gray-200'} 
                          focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        required
                        placeholder="Doe"
                      />
                    </motion.div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mt-5"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleInputFocus('email')}
                        onBlur={handleInputBlur}
                        className={`w-full pl-11 pr-4 py-3 bg-white rounded-xl text-base border-2
                          ${focusedField === 'email' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.email ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                          focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        placeholder="you@example.com"
                        required
                      />
                    </motion.div>
                  </div>
                  {errors.email && (
                    <motion.p 
                      className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div 
                  className="mt-5"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="mobile">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        onFocus={() => handleInputFocus('mobile')}
                        onBlur={handleInputBlur}
                        className={`w-full pl-11 pr-4 py-3 bg-white rounded-xl text-base border-2
                          ${focusedField === 'mobile' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.mobile ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                          focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        placeholder="+1234567890"
                        required
                      />
                    </motion.div>
                  </div>
                  {errors.mobile && (
                    <motion.p 
                      className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.mobile}
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Professional-specific fields */}
              {formData.category === 'Professional' && (
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-sap-blue/10 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">Professional Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                      whileHover="hover"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="company">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('company')}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 
                            ${focusedField === 'company' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.company ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                            focus:outline-none focus:border-sap-blue transition-all duration-200`}
                          placeholder="SAP SE"
                          required
                        />
                      </motion.div>
                      {errors.company && (
                        <motion.p 
                          className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.company}
                        </motion.p>
                      )}
                    </motion.div>
                    
                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      custom={1}
                      whileHover="hover"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="designation">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <input
                          type="text"
                          id="designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('designation')}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 
                            ${focusedField === 'designation' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.designation ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                            focus:outline-none focus:border-sap-blue transition-all duration-200`}
                          placeholder="Software Engineer"
                          required
                        />
                      </motion.div>
                      {errors.designation && (
                        <motion.p 
                          className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.designation}
                        </motion.p>
                      )}
                    </motion.div>
                    
                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      custom={2}
                      whileHover="hover"
                      className="col-span-1 md:col-span-2"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="department">
                        Department
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <select
                          id="department"
                          name="department"
                          value={formData.department || ''}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('department')}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 appearance-none
                            ${focusedField === 'department' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : 'border-gray-200'} 
                            focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        >
                          <option value="">Select Department</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Product">Product Management</option>
                          <option value="Design">Design</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="Operations">Operations</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}
              
              {/* Student-specific fields */}
              {formData.category === 'Student' && (
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-sap-blue/10 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">Academic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                      whileHover="hover"
                      className="col-span-1 md:col-span-2"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="college">
                        University <span className="text-red-500">*</span>
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <input
                          type="text"
                          id="college"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('college')}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 
                            ${focusedField === 'college' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.college ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                            focus:outline-none focus:border-sap-blue transition-all duration-200`}
                          placeholder="University of Technology"
                          required
                        />
                      </motion.div>
                      {errors.college && (
                        <motion.p 
                          className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.college}
                        </motion.p>
                      )}
                    </motion.div>
                    
                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      custom={1}
                      whileHover="hover"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="major">
                        Major <span className="text-red-500">*</span>
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <input
                          type="text"
                          id="major"
                          name="major"
                          value={formData.major || ''}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('major')}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 
                            ${focusedField === 'major' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : 'border-gray-200'} 
                            focus:outline-none focus:border-sap-blue transition-all duration-200`}
                          placeholder="Computer Science"
                          required
                        />
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      custom={2}
                      whileHover="hover"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="graduation_year">
                        Graduation Year <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <motion.div
                          whileFocus={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <select
                            id="graduation_year"
                            name="graduation_year"
                            value={formData.graduation_year || ''}
                            onChange={handleChange}
                            onFocus={() => handleInputFocus('graduation_year')}
                            onBlur={handleInputBlur}
                            className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 appearance-none
                              ${focusedField === 'graduation_year' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : 'border-gray-200'} 
                              focus:outline-none focus:border-sap-blue transition-all duration-200`}
                            required
                          >
                            <option value="" disabled>Select year</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                          </select>
                        </motion.div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      custom={3}
                      whileHover="hover"
                      className="col-span-1 md:col-span-2"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="education_level">
                        Degree Level <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {['Bachelor\'s', 'Master\'s', 'PhD', 'Other'].map((level) => (
                          <motion.div
                            key={level}
                            className={`px-4 py-3 border-2 rounded-xl text-center cursor-pointer transition-all
                              ${formData.education_level === level 
                                ? 'border-sap-blue bg-sap-blue/5 text-sap-blue font-medium shadow-sm' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleChange({ target: { name: 'education_level', value: level } })}
                          >
                            {level}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              
              {/* Common details for step 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-4">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-sap-blue/10 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">Location & Personal Details</h3>
                  </div>
                </div>
                
                <motion.div
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                  whileHover="hover"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="country"
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onFocus={() => handleInputFocus('country')}
                        onBlur={handleInputBlur}
                        className={`w-full pl-11 pr-4 py-3 bg-white rounded-xl text-base border-2
                          ${focusedField === 'country' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.country ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                          focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        placeholder="United States"
                        required
                      />
                    </div>
                  </motion.div>
                  {errors.country && (
                    <motion.p 
                      className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.country}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                  whileHover="hover"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        onFocus={() => handleInputFocus('gender')}
                        onBlur={handleInputBlur}
                        className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 appearance-none
                          ${focusedField === 'gender' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.gender ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                          focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </motion.div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {errors.gender && (
                    <motion.p 
                      className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.gender}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                  whileHover="hover"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="emergency_contact">
                    Emergency Contact <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        id="emergency_contact"
                        type="text"
                        name="emergency_contact"
                        value={formData.emergency_contact}
                        onChange={handleChange}
                        onFocus={() => handleInputFocus('emergency_contact')}
                        onBlur={handleInputBlur}
                        className={`w-full pl-11 pr-4 py-3 bg-white rounded-xl text-base border-2
                          ${focusedField === 'emergency_contact' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.emergency_contact ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                          focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        placeholder="+1234567890"
                        required
                      />
                    </motion.div>
                  </div>
                  {errors.emergency_contact && (
                    <motion.p 
                      className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.emergency_contact}
                    </motion.p>
                  )}
                </motion.div>
                
                <div className="grid grid-cols-2 gap-x-4">
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    custom={6}
                    whileHover="hover"
                  >
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="blood_group">
                      Blood Group <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <select
                          id="blood_group"
                          name="blood_group"
                          value={formData.blood_group}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('blood_group')}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 appearance-none
                            ${focusedField === 'blood_group' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : errors.blood_group ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'} 
                            focus:outline-none focus:border-sap-blue transition-all duration-200`}
                          required
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </motion.div>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                        <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors.blood_group && (
                      <motion.p 
                        className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.blood_group}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    custom={7}
                    whileHover="hover"
                  >
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-0.5" htmlFor="food_choice">
                      Food Preference
                    </label>
                    <div className="relative">
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <select
                          id="food_choice"
                          name="food_choice"
                          value={formData.food_choice}
                          onChange={handleChange}
                          onFocus={() => handleInputFocus('food_choice')}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 bg-white rounded-xl text-base border-2 appearance-none
                            ${focusedField === 'food_choice' ? 'border-sap-blue shadow-sm ring-2 ring-sap-blue/20' : 'border-gray-200'} 
                            focus:outline-none focus:border-sap-blue transition-all duration-200`}
                        >
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Non-vegetarian">Non-vegetarian</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Halal">Halal</option>
                        </select>
                      </motion.div>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                        <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  custom={8}
                  className="col-span-1 md:col-span-2 mt-1"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      Your personal information is secure and will only be used for event communications and emergency purposes.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Areas of Interest */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-sap-blue/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 01-1-1v-.5a1.5 1.5 0 010-3H3a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5a1.5 1.5 0 013 0v.5a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800">Areas of Interest <span className="text-red-500">*</span></h3>
                </div>
                
                <p className="text-base text-gray-500 mb-6 ml-0.5">
                  Select topics you're interested in to get personalized session recommendations
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {['AI & Machine Learning', 'Cloud Computing', 'Mobile Development', 
                    'Web Development', 'Security', 'DevOps',
                    'Data Science', 'Blockchain', 'IoT',
                    'Sustainability', 'UI/UX Design', 'Product Management'].map((interest) => (
                    <motion.div
                      key={interest}
                      className={`px-4 py-3 border-2 rounded-xl text-center cursor-pointer transition-all
                        ${formData.interests.includes(interest.toLowerCase()) 
                          ? 'border-sap-blue bg-sap-blue/5 text-sap-blue font-medium shadow-sm' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </motion.div>
                  ))}
                </div>
                
                {errors.interests && (
                  <motion.p 
                    className="mt-1.5 text-sm text-red-500 ml-0.5 flex items-center"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.interests}
                  </motion.p>
                )}
              </div>
              
              {/* Terms & Conditions */}
              <div className="mb-8">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <motion.label 
                    className="flex items-start space-x-3 cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className={`w-5 h-5 rounded border ${formData.consent ? 'bg-sap-blue border-sap-blue' : 'border-gray-400'} flex items-center justify-center transition-colors`}>
                        {formData.consent && (
                          <motion.svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-3.5 w-3.5 text-white" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                        )}
                      </span>
                    </span>
                    <span className="text-base text-gray-700 leading-tight">
                      I agree to the event <span className="text-sap-blue font-medium">terms and conditions</span>. By registering, I consent to receive updates about this event and related opportunities from SAP.
                    </span>
                  </motion.label>
                  {errors.consent && (
                    <motion.p 
                      className="mt-2.5 text-sm text-red-500 ml-8 flex items-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.consent}
                    </motion.p>
                  )}
                </div>
              </div>
              
              {/* Complete Registration Button */}
              <div className="mt-8">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-sap-blue to-sap-light-blue text-white text-lg font-semibold rounded-xl hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(15, 76, 129, 0.35)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : "Complete Registration"}
                </motion.button>
                <p className="mt-3 text-center text-sm text-gray-500">
                  We're excited to see you at Vibeathon 2025!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Form navigation buttons */}
        {/* Navigation buttons - only show if not on step 3, as step 3 has its own submit button */}
        {currentStep < 3 && (
          <div className="flex justify-between mt-8 px-1">
            {currentStep > 1 ? (
              <motion.button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center px-6 py-3 border-2 border-gray-200 text-sap-blue font-medium rounded-xl hover:bg-gray-50 transition-all focus:outline-none"
                whileHover={{ x: -5, borderColor: "#0F4C81" }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </motion.button>
            ) : (
              <div>{/* Empty div to maintain flex layout */}</div>
            )}
            
            <motion.button
              type="button"
              onClick={handleNextStep}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-sap-blue to-sap-light-blue text-white font-medium rounded-xl hover:shadow-md transition-all focus:outline-none"
              whileHover={{ x: 5, boxShadow: "0 8px 20px rgba(15, 76, 129, 0.25)" }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default RegistrationForm;