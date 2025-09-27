import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const INTERESTS = [
  'AI', 'Analytics', 'Automation', 'Beginner', 'BI', 
  'Blockchain', 'CI/CD', 'Cloud', 'Compliance', 'Data Visualization',
  'Design', 'Development', 'DevOps', 'Enterprise', 'Fiori', 
  'Frontend', 'Governance', 'Implementation', 'Innovation', 'Integration',
  'Machine Learning', 'Platform', 'Risk Management', 'S/4HANA', 
  'SAP', 'Security', 'Technical', 'UI5', 'UX'
];

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
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Make API call to register attendee
      const response = await apiService.registerAttendee(formData);
      
      // Store registration data in localStorage for success page
      localStorage.setItem('registrationData', JSON.stringify({
        attendee: response.attendee,
        qr: response.qr,
        timestamp: new Date().toISOString()
      }));
      
      // Redirect to success page
      navigate('/success');
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle API validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.param] = err.msg;
        });
        setErrors(apiErrors);
      } else {
        // Generic error
        toast.error('Registration failed. Please try again.');
      }
      
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-sap shadow-card animate-fadeIn">
      <h2 className="text-2xl font-bold text-sap-blue mb-6">Registration Form</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Category Selection */}
        <div className="mb-6">
          <label className="form-label">Registration Category</label>
          <div className="flex mt-2 space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="Professional"
                checked={formData.category === 'Professional'}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-sap-blue"
              />
              <span className="ml-2 text-sap-grey">Professional</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="Student"
                checked={formData.category === 'Student'}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-sap-blue"
              />
              <span className="ml-2 text-sap-grey">Student</span>
            </label>
          </div>
        </div>
      
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`form-input ${errors.full_name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
            />
            {errors.full_name && <p className="form-error">{errors.full_name}</p>}
          </div>
          
          <div>
            <label className="form-label">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="johndoe@example.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          
          <div>
            <label className="form-label">Mobile Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={`form-input ${errors.mobile ? 'border-red-500' : ''}`}
              placeholder="+1234567890"
            />
            {errors.mobile && <p className="form-error">{errors.mobile}</p>}
          </div>
          
          <div>
            <label className="form-label">Country <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`form-input ${errors.country ? 'border-red-500' : ''}`}
              placeholder="United States"
            />
            {errors.country && <p className="form-error">{errors.country}</p>}
          </div>
          
          <div>
            <label className="form-label">Gender <span className="text-red-500">*</span></label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`form-input ${errors.gender ? 'border-red-500' : ''}`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && <p className="form-error">{errors.gender}</p>}
          </div>
          
          <div>
            <label className="form-label">Blood Group <span className="text-red-500">*</span></label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              className={`form-input ${errors.blood_group ? 'border-red-500' : ''}`}
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
            {errors.blood_group && <p className="form-error">{errors.blood_group}</p>}
          </div>
          
          <div>
            <label className="form-label">Food Choice <span className="text-red-500">*</span></label>
            <select
              name="food_choice"
              value={formData.food_choice}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-vegetarian">Non-vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Halal">Halal</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Emergency Contact <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              className={`form-input ${errors.emergency_contact ? 'border-red-500' : ''}`}
              placeholder="+1234567890"
            />
            {errors.emergency_contact && <p className="form-error">{errors.emergency_contact}</p>}
          </div>
        </div>
        
        {/* Professional-specific fields */}
        {formData.category === 'Professional' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="form-label">Company <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`form-input ${errors.company ? 'border-red-500' : ''}`}
                placeholder="Acme Inc."
              />
              {errors.company && <p className="form-error">{errors.company}</p>}
            </div>
            
            <div>
              <label className="form-label">Designation <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={`form-input ${errors.designation ? 'border-red-500' : ''}`}
                placeholder="Software Engineer"
              />
              {errors.designation && <p className="form-error">{errors.designation}</p>}
            </div>
          </div>
        )}
        
        {/* Student-specific fields */}
        {formData.category === 'Student' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="form-label">College/University <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className={`form-input ${errors.college ? 'border-red-500' : ''}`}
                placeholder="University of Technology"
              />
              {errors.college && <p className="form-error">{errors.college}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Education Level <span className="text-red-500">*</span></label>
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="UG">Undergraduate</option>
                  <option value="PG">Postgraduate</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Year <span className="text-red-500">*</span></label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Interests */}
        <div className="mb-6">
          <label className="form-label">Areas of Interest <span className="text-red-500">*</span></label>
          <p className="text-sm text-sap-grey mb-2">Select all that apply</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {INTERESTS.map(interest => (
              <label key={interest} className="flex items-center p-2 border rounded-sap hover:bg-sap-bg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest.toLowerCase())}
                  onChange={() => handleInterestToggle(interest)}
                  className="form-checkbox h-4 w-4 text-sap-blue"
                />
                <span className="ml-2 text-sm">{interest}</span>
              </label>
            ))}
          </div>
          
          {errors.interests && <p className="form-error mt-2">{errors.interests}</p>}
        </div>
        
        {/* Consent */}
        <div className="mb-8">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-sap-blue mt-0.5"
            />
            <span className="ml-2 text-sm text-sap-grey">
              I agree to the processing of my personal information in accordance with the privacy policy.
              I also consent to receive updates about the event via email or SMS.
            </span>
          </label>
          {errors.consent && <p className="form-error mt-1">{errors.consent}</p>}
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;