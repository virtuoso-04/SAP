import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ForYouCarousel from '../components/ForYouCarousel';
import SessionCard from '../components/SessionCard';
import QRCodeDisplay from '../components/QRCodeDisplay';
import SITConcierge from '../components/SITConcierge';
import apiService from '../services/api';
import { formatDate } from '../utils/calendar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [todaySessions, setTodaySessions] = useState(null);
  const [loading, setLoading] = useState({
    attendee: true,
    recommendations: true,
    sessions: true
  });
  const [error, setError] = useState({
    attendee: null,
    recommendations: null,
    sessions: null
  });
  
  useEffect(() => {
    // Load attendee data from localStorage
    const registrationData = localStorage.getItem('registrationData');
    
    if (!registrationData) {
      // If not logged in, redirect to registration
      toast.info('Please register or enter your registration ID to view your dashboard');
      navigate('/register');
      return;
    }
    
    try {
      const { attendee } = JSON.parse(registrationData);
      loadAttendeeData(attendee.id);
    } catch (error) {
      console.error('Failed to parse registration data:', error);
      setError(prev => ({ ...prev, attendee: 'Invalid registration data' }));
      setLoading(prev => ({ ...prev, attendee: false }));
    }
  }, [navigate]);
  
  // Load attendee data from API
  const loadAttendeeData = async (attendeeId) => {
    try {
      // Get latest attendee data
      const attendeeData = await apiService.getAttendee(attendeeId);
      setAttendee(attendeeData);
      setLoading(prev => ({ ...prev, attendee: false }));
      
      // Get recommendations
      loadRecommendations(attendeeId);
      
      // Get today's sessions
      loadTodaySessions();
    } catch (error) {
      console.error('Failed to load attendee data:', error);
      setError(prev => ({ ...prev, attendee: 'Failed to load your profile' }));
      setLoading(prev => ({ ...prev, attendee: false }));
    }
  };
  
  // Load recommendations
  const loadRecommendations = async (attendeeId) => {
    try {
      const recommendationsData = await apiService.getRecommendations(attendeeId);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setError(prev => ({ ...prev, recommendations: 'Failed to load recommendations' }));
    } finally {
      setLoading(prev => ({ ...prev, recommendations: false }));
    }
  };
  
  // Load today's sessions
  const loadTodaySessions = async () => {
    try {
      // Get all sessions
      const sessions = await apiService.getSessions();
      
      // Filter for today's date (in a real app, this would use actual current date)
      const today = new Date('2025-10-01'); // Mocking first day of the event
      
      // Filter sessions for today
      const todayFiltered = sessions.filter(session => {
        const sessionDate = new Date(session.start_time);
        return sessionDate.toDateString() === today.toDateString();
      });
      
      // Sort by start time
      todayFiltered.sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
      );
      
      setTodaySessions(todayFiltered);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setError(prev => ({ ...prev, sessions: 'Failed to load today\'s sessions' }));
    } finally {
      setLoading(prev => ({ ...prev, sessions: false }));
    }
  };
  
  // Get registration data with QR from localStorage
  const getStoredQR = () => {
    try {
      const registrationData = localStorage.getItem('registrationData');
      if (registrationData) {
        const { qr, attendee } = JSON.parse(registrationData);
        return { qr, registrationId: attendee.registration_id, fullName: attendee.full_name };
      }
    } catch (error) {
      console.error('Failed to get QR from storage:', error);
    }
    return null;
  };
  
  // QR code data for display
  const qrData = getStoredQR();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Attendee Info & QR */}
        <div>
          {/* Welcome Card */}
          <div className="bg-white rounded-sap shadow-card p-6 mb-6">
            {loading.attendee ? (
              <div className="animate-pulse">
                <div className="h-6 bg-sap-light-grey rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-sap-light-grey rounded w-1/2 mb-6"></div>
                <div className="h-20 bg-sap-light-grey rounded w-full"></div>
              </div>
            ) : error.attendee ? (
              <div className="text-center p-4">
                <p className="text-red-500">{error.attendee}</p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-2 text-sap-blue hover:underline"
                >
                  Go to Registration
                </button>
              </div>
            ) : attendee && (
              <div>
                <h2 className="text-xl font-bold text-sap-dark-blue mb-1">
                  Welcome, {attendee.full_name}!
                </h2>
                <p className="text-sap-grey mb-4">
                  {attendee.checked_in ? 'You are checked in' : 'Please use your QR code to check in at the event'}
                </p>
                
                <div className="flex items-center space-x-2 p-3 bg-sap-bg rounded-sap mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Your ID: <span className="font-medium">{attendee.registration_id}</span></span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-sap-grey">Category</p>
                    <p className="font-medium">{attendee.category}</p>
                  </div>
                  <div>
                    <p className="text-sap-grey">Food Choice</p>
                    <p className="font-medium">{attendee.food_choice}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* QR Code Card */}
          <div className="bg-white rounded-sap shadow-card p-6 mb-6">
            <h2 className="text-xl font-bold text-sap-dark-blue mb-4">Your Check-in QR Code</h2>
            
            {qrData ? (
              <QRCodeDisplay 
                qrDataUrl={qrData.qr}
                registrationId={qrData.registrationId}
                attendeeName={qrData.fullName}
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-sap-grey">QR code not available</p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-2 text-sap-blue hover:underline"
                >
                  Register to get your QR code
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Middle Column - Recommendations */}
        <div>
          {/* For You Carousel */}
          <div className="mb-6">
            <ForYouCarousel 
              recommendations={recommendations}
              loading={loading.recommendations}
              error={error.recommendations}
            />
          </div>
          
          {/* Interests Card */}
          {attendee && (
            <div className="bg-white rounded-sap shadow-card p-6">
              <h2 className="text-xl font-bold text-sap-dark-blue mb-4">Your Interests</h2>
              
              <div className="flex flex-wrap gap-2">
                {attendee.interests.map(interest => (
                  <span 
                    key={interest} 
                    className="inline-block bg-sap-bg text-sm font-medium text-sap-blue px-3 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-sap-light-grey">
                <p className="text-sm text-sap-grey mb-3">
                  Your session recommendations are personalized based on these interests.
                </p>
                <Link to="/profile" className="text-sm text-sap-blue hover:underline">
                  Update your interests
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Today's Schedule */}
        <div>
          <div className="bg-white rounded-sap shadow-card p-6">
            <h2 className="text-xl font-bold text-sap-dark-blue mb-4">
              Today's Schedule
            </h2>
            
            {loading.sessions ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-sap-light-grey rounded-sap"></div>
                ))}
              </div>
            ) : error.sessions ? (
              <div className="text-center p-4">
                <p className="text-red-500">{error.sessions}</p>
                <button
                  onClick={loadTodaySessions}
                  className="mt-2 text-sap-blue hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : todaySessions && todaySessions.length > 0 ? (
              <div className="space-y-4">
                {todaySessions.slice(0, 3).map(session => (
                  <div key={session.id} className="bg-sap-bg p-3 rounded-sap">
                    <Link to={`/session/${session.id}`} className="block">
                      <p className="font-medium text-sap-dark-blue mb-1">
                        {session.title}
                      </p>
                      <div className="flex justify-between text-xs text-sap-grey">
                        <span>{formatDate(session.start_time)}</span>
                        <span>{session.location}</span>
                      </div>
                    </Link>
                  </div>
                ))}
                
                <Link to="/sessions" className="block text-center text-sm text-sap-blue hover:underline">
                  View All Sessions
                </Link>
              </div>
            ) : (
              <p className="text-center text-sap-grey p-4">
                No sessions scheduled for today
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Chatbot */}
      <SITConcierge />
    </div>
  );
};

export default Dashboard;