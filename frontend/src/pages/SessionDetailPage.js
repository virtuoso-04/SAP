import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SessionDetail from '../components/SessionDetail';
import apiService from '../services/api';
import { downloadICSFile, createGoogleCalendarUrl, createOutlookCalendarUrl } from '../utils/calendar';

const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [attendee, setAttendee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Get attendee ID from localStorage
  const getAttendeeId = () => {
    try {
      const registrationData = localStorage.getItem('registrationData');
      if (registrationData) {
        const { attendee } = JSON.parse(registrationData);
        return attendee.id;
      }
    } catch (error) {
      console.error('Failed to get attendee ID:', error);
    }
    return null;
  };
  
  // Load session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // Fetch session details
        const sessionData = await apiService.getSession(id);
        setSession(sessionData);
        
        // Check if user is registered
        const attendeeId = getAttendeeId();
        if (attendeeId) {
          const attendeeData = await apiService.getAttendee(attendeeId);
          setAttendee(attendeeData);
          
          // Check if this session is in attendee's registered_sessions
          setIsRegistered(
            attendeeData.registered_sessions && 
            attendeeData.registered_sessions.includes(parseInt(id))
          );
        }
      } catch (error) {
        console.error('Error loading session details:', error);
        setError('Failed to load session details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionData();
  }, [id]);
  
  // Handle session registration
  const handleRegisterSession = async () => {
    // Check if user is logged in
    const attendeeId = getAttendeeId();
    if (!attendeeId) {
      toast.info('Please register or log in first');
      navigate('/register');
      return;
    }
    
    try {
      setLoading(true);
      
      // Register for session
      await apiService.registerForSession(attendeeId, parseInt(id));
      
      // Update local state
      setIsRegistered(true);
      
      // Update attendee data in state
      const updatedAttendee = await apiService.getAttendee(attendeeId);
      setAttendee(updatedAttendee);
      
      // Update localStorage
      const registrationData = localStorage.getItem('registrationData');
      if (registrationData) {
        const data = JSON.parse(registrationData);
        data.attendee = updatedAttendee;
        localStorage.setItem('registrationData', JSON.stringify(data));
      }
      
      toast.success('Successfully registered for this session!');
    } catch (error) {
      console.error('Failed to register for session:', error);
      toast.error('Failed to register for this session. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle session unregistration
  const handleUnregisterSession = async () => {
    const attendeeId = getAttendeeId();
    if (!attendeeId) return;
    
    try {
      setLoading(true);
      
      // Unregister from session
      await apiService.unregisterFromSession(attendeeId, parseInt(id));
      
      // Update local state
      setIsRegistered(false);
      
      // Update attendee data in state
      const updatedAttendee = await apiService.getAttendee(attendeeId);
      setAttendee(updatedAttendee);
      
      // Update localStorage
      const registrationData = localStorage.getItem('registrationData');
      if (registrationData) {
        const data = JSON.parse(registrationData);
        data.attendee = updatedAttendee;
        localStorage.setItem('registrationData', JSON.stringify(data));
      }
      
      toast.info('You are no longer registered for this session');
    } catch (error) {
      console.error('Failed to unregister from session:', error);
      toast.error('Failed to unregister from this session. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding to calendar
  const handleAddToCalendar = (type) => {
    if (session) {
      const sessionData = {
        title: session.title,
        description: session.description,
        location: session.location,
        start_time: session.start_time,
        end_time: session.end_time
      };
      
      try {
        switch (type) {
          case 'ics':
            downloadICSFile(sessionData);
            toast.success('Calendar file downloaded');
            break;
          case 'google':
            window.open(createGoogleCalendarUrl(sessionData), '_blank');
            toast.success('Opening Google Calendar');
            break;
          case 'outlook':
            window.open(createOutlookCalendarUrl(sessionData), '_blank');
            toast.success('Opening Outlook Calendar');
            break;
          default:
            console.error('Unsupported calendar type:', type);
        }
      } catch (error) {
        console.error('Calendar integration error:', error);
        toast.error('Failed to add event to calendar. Please try again.');
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to sessions link */}
      <div className="mb-4">
        <Link to="/dashboard" className="inline-flex items-center text-sap-blue hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-sap-light-grey rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-sap-light-grey rounded w-1/2 mb-6"></div>
          <div className="h-32 bg-sap-light-grey rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-sap-light-grey rounded"></div>
            <div className="h-20 bg-sap-light-grey rounded"></div>
            <div className="h-20 bg-sap-light-grey rounded"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-sap">
          <h3 className="text-lg font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-sap-blue hover:underline"
          >
            Go Back to Dashboard
          </button>
        </div>
      ) : session && (
        <>
          <SessionDetail session={session} />
          
          {/* Action buttons */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            {/* Registration button */}
            <div className="flex-1">
              <button
                onClick={isRegistered ? handleUnregisterSession : handleRegisterSession}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-sap text-center font-medium ${
                  isRegistered
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    : 'bg-sap-blue text-white hover:bg-sap-dark-blue'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isRegistered ? (
                  'Cancel Registration'
                ) : (
                  'Register for this Session'
                )}
              </button>
            </div>
            
            {/* Add to calendar buttons */}
            <div className="flex-1">
              <div className="bg-white border border-sap-light-grey rounded-sap overflow-hidden">
                <div className="px-4 py-2 bg-sap-bg border-b border-sap-light-grey">
                  <p className="text-sm font-medium">Add to Calendar</p>
                </div>
                <div className="grid grid-cols-3 divide-x divide-sap-light-grey">
                  <button 
                    onClick={() => handleAddToCalendar('ics')}
                    className="py-2 text-sm text-sap-blue hover:bg-sap-bg"
                  >
                    iCalendar
                  </button>
                  <button 
                    onClick={() => handleAddToCalendar('google')}
                    className="py-2 text-sm text-sap-blue hover:bg-sap-bg"
                  >
                    Google
                  </button>
                  <button 
                    onClick={() => handleAddToCalendar('outlook')}
                    className="py-2 text-sm text-sap-blue hover:bg-sap-bg"
                  >
                    Outlook
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Session capacity / registration status */}
          <div className="mt-6 p-4 bg-sap-bg rounded-sap">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-sap-grey">
                  Session Capacity: <span className="font-medium text-sap-dark-blue">{session.capacity} attendees</span>
                </p>
              </div>
              <div>
                {isRegistered && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="-ml-0.5 mr-1 h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Registered
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SessionDetailPage;