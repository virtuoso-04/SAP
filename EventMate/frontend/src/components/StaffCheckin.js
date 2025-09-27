import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const StaffCheckin = () => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attendee, setAttendee] = useState(null);
  const [error, setError] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError(null);
    if (attendee) setAttendee(null);
    if (isCheckedIn) setIsCheckedIn(false);
  };

  // Handle form submission - either QR code content or registration ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError('Please enter a registration ID or scan a QR code');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      let checkInData;
      
      // Check if input looks like a JSON string (QR code)
      if (inputValue.startsWith('{') && inputValue.endsWith('}')) {
        try {
          // Parse as QR string
          checkInData = { qrString: inputValue };
        } catch {
          // If parsing fails, treat as registration ID
          checkInData = { registration_id: inputValue };
        }
      } else {
        // Treat as registration ID
        checkInData = { registration_id: inputValue };
      }
      
      // Call check-in API
      const response = await apiService.checkIn(checkInData);
      
      // Display success
      setAttendee(response.attendee);
      setIsCheckedIn(true);
      toast.success(`${response.attendee.full_name} successfully checked in!`);
    } catch (err) {
      // Handle errors
      console.error('Check-in error:', err);
      
      if (err.response && err.response.status === 404) {
        setError('Attendee not found. Please verify the registration ID.');
      } else if (err.response && err.response.status === 401) {
        setError('Invalid QR code. Signature verification failed.');
      } else {
        setError('An error occurred while processing check-in. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle manual check-in
  const handleCheckIn = async () => {
    if (!attendee) return;
    
    setIsProcessing(true);
    
    try {
      // Call check-in API with registration ID
      const response = await apiService.checkIn({ registration_id: attendee.registration_id });
      
      setIsCheckedIn(true);
      toast.success(`${response.attendee.full_name} successfully checked in!`);
    } catch (err) {
      console.error('Manual check-in error:', err);
      toast.error('Failed to check in attendee. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setInputValue('');
    setAttendee(null);
    setError(null);
    setIsCheckedIn(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-sap shadow-card p-6 mb-6">
        <h2 className="text-2xl font-bold text-sap-blue mb-6">Staff Check-in Portal</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Registration ID or QR Code Data</label>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter registration ID (e.g., VIBE-2025-1001) or paste QR code data"
              className="form-input h-24"
              disabled={isProcessing || isCheckedIn}
            />
            {error && <p className="form-error mt-1">{error}</p>}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isProcessing || isCheckedIn || !inputValue.trim()}
              className="btn btn-primary flex-1"
            >
              {isProcessing ? 'Verifying...' : 'Verify'}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      
      {attendee && (
        <div className="bg-white rounded-sap shadow-card p-6 animate-fadeIn">
          <div className="border-b border-sap-light-grey pb-4 mb-4">
            <h3 className="text-xl font-bold text-sap-dark-blue mb-2">
              Attendee Information
            </h3>
            
            {attendee.checked_in || isCheckedIn ? (
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-sap flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Already Checked In</span>
              </div>
            ) : (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-sap flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Not Checked In</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-sap-grey">Registration ID</p>
              <p className="font-medium text-sap-blue">{attendee.registration_id}</p>
            </div>
            <div>
              <p className="text-sm text-sap-grey">Full Name</p>
              <p className="font-medium">{attendee.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-sap-grey">Email</p>
              <p className="font-medium">{attendee.email}</p>
            </div>
            <div>
              <p className="text-sm text-sap-grey">Mobile</p>
              <p className="font-medium">{attendee.mobile}</p>
            </div>
            <div>
              <p className="text-sm text-sap-grey">Category</p>
              <p className="font-medium">{attendee.category}</p>
            </div>
            <div>
              <p className="text-sm text-sap-grey">Food Choice</p>
              <p className="font-medium">{attendee.food_choice}</p>
            </div>
          </div>
          
          {!attendee.checked_in && !isCheckedIn && (
            <button
              onClick={handleCheckIn}
              disabled={isProcessing}
              className="w-full btn btn-success py-4 text-lg flex items-center justify-center"
            >
              {isProcessing ? 'Processing...' : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Check In Attendee
                </>
              )}
            </button>
          )}
        </div>
      )}
      
      <div className="mt-6 text-center text-sm text-sap-grey">
        <p>Need help? Contact the event support team.</p>
      </div>
    </div>
  );
};

export default StaffCheckin;