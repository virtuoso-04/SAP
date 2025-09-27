import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { createGoogleCalendarUrl, createOutlookCalendarUrl } from '../utils/calendar';

const Success = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState(null);
  
  useEffect(() => {
    // Get registration data from localStorage
    const data = localStorage.getItem('registrationData');
    
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setRegistrationData(parsedData);
      } catch (error) {
        console.error('Failed to parse registration data:', error);
      }
    } else {
      // If no registration data is found, redirect to registration page
      navigate('/register');
    }
  }, [navigate]);
  
  // Handle add to Google Calendar
  const handleAddToGoogle = () => {
    // This would normally use actual event data
    const eventUrl = createGoogleCalendarUrl({
      title: 'VIBE 2025',
      description: 'SAP Intelligent Participant Experience Hub Event',
      location: 'Innovation Center, 123 Tech Boulevard',
      start_time: '2025-10-01T09:00:00Z',
      end_time: '2025-10-02T17:30:00Z'
    });
    
    window.open(eventUrl, '_blank');
  };
  
  // Handle add to Outlook Calendar
  const handleAddToOutlook = () => {
    // This would normally use actual event data
    const eventUrl = createOutlookCalendarUrl({
      title: 'VIBE 2025',
      description: 'SAP Intelligent Participant Experience Hub Event',
      location: 'Innovation Center, 123 Tech Boulevard',
      start_time: '2025-10-01T09:00:00Z',
      end_time: '2025-10-02T17:30:00Z'
    });
    
    window.open(eventUrl, '_blank');
  };
  
  // Show loading state
  if (!registrationData) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse w-full max-w-md">
          <div className="bg-white rounded-sap shadow-card p-8">
            <div className="h-8 bg-sap-light-grey rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-64 bg-sap-light-grey rounded-sap mx-auto mb-6"></div>
            <div className="h-6 bg-sap-light-grey rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-sap-light-grey rounded w-3/4 mx-auto mb-8"></div>
            <div className="h-10 bg-sap-light-grey rounded w-full mb-4"></div>
            <div className="h-10 bg-sap-light-grey rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-sap shadow-card max-w-lg mx-auto p-8 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-sap-dark-blue mb-2">Registration Successful!</h1>
          <p className="text-sap-grey">
            Thank you for registering for VIBE 2025. Your registration is confirmed.
          </p>
        </div>
        
        <div className="mb-8">
          <QRCodeDisplay 
            qrDataUrl={registrationData.qr}
            registrationId={registrationData.attendee.registration_id}
            attendeeName={registrationData.attendee.full_name}
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-sap-dark-blue mb-2">Add to Calendar</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleAddToGoogle}
              className="btn btn-secondary flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.5 8l-3 3-1.5-1.5V16H9V9.5l1.5 1.5 3-3H13L9.5 4.5 6 8h2l3-3 1.5 1.5V2h4v5.5L15 6l-3 3h2l3.5-3.5L21 9h-2l-3-3-1.5 1.5V2H7v6.5L8.5 7l3 3h-2L6 6.5 2 11h2l3-3 1.5 1.5V18h6v-6.5l-1.5-1.5-3 3h-2l3.5-3.5L7 9h2l3 3 1.5-1.5V4.5z" />
              </svg>
              Google Calendar
            </button>
            <button
              onClick={handleAddToOutlook}
              className="btn btn-secondary flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 5v14c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h20c1.1 0 2 .9 2 2zm-2 0H2v14h20V5zm-9 1l8 2v8l-8 2V6zm-3 5H4v2h6v-2z" />
              </svg>
              Outlook Calendar
            </button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link to="/dashboard" className="btn btn-primary text-center">
            Go to Dashboard
          </Link>
          <Link to="/" className="text-sap-blue text-center hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;