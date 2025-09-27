import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StaffCheckin from '../components/StaffCheckin';
import apiService from '../services/api';

const StaffCheckinPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [staffCode, setStaffCode] = useState('');
  const [checkins, setCheckins] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0
  });
  
  // Staff authentication
  const handleAuthentication = async (e) => {
    e.preventDefault();
    
    if (!staffCode.trim()) {
      toast.error('Please enter staff access code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be a proper authentication endpoint
      // For this prototype, we're using a simple code check
      if (staffCode === 'SAP2025') { // Hard-coded for prototype
        // Store authentication in session storage (not localStorage for security)
        sessionStorage.setItem('staffAuthenticated', 'true');
        setIsAuthenticated(true);
        toast.success('Staff access granted');
        
        // Load initial data
        await loadAttendeeStats();
        
      } else {
        toast.error('Invalid staff access code');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if staff is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = sessionStorage.getItem('staffAuthenticated') === 'true';
      
      if (isAuth) {
        setIsAuthenticated(true);
        await loadAttendeeStats();
      }
    };
    
    checkAuth();
  }, []);
  
  // Load attendee stats
  const loadAttendeeStats = async () => {
    try {
      const attendees = await apiService.getAttendees();
      
      // Calculate stats
      const total = attendees.length;
      const checkedIn = attendees.filter(a => a.checked_in).length;
      
      setStats({
        total,
        checkedIn
      });
      
      // Get last 5 check-ins (sorted by check-in time, newest first)
      const recentCheckins = attendees
        .filter(a => a.checked_in && a.check_in_time)
        .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time))
        .slice(0, 5);
        
      setCheckins(recentCheckins);
      
    } catch (error) {
      console.error('Failed to load attendee stats:', error);
      toast.error('Failed to load attendee statistics');
    }
  };
  
  // Handle check-in success
  const handleCheckinSuccess = async (attendee) => {
    // Add to recent check-ins
    const updatedCheckins = [attendee, ...checkins].slice(0, 5);
    setCheckins(updatedCheckins);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      checkedIn: prev.checkedIn + 1
    }));
    
    toast.success(`${attendee.full_name} checked in successfully!`);
  };
  
  // Handle staff logout
  const handleLogout = () => {
    sessionStorage.removeItem('staffAuthenticated');
    setIsAuthenticated(false);
    toast.info('Staff logged out');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-sap-dark-blue">Staff Check-in Portal</h1>
          
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-sap-light-grey rounded-sap text-sm font-medium text-sap-grey hover:bg-sap-bg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          )}
        </div>
        
        {!isAuthenticated ? (
          <div className="bg-white rounded-sap shadow-card p-6">
            <h2 className="text-xl font-bold text-sap-dark-blue mb-6">Staff Authentication</h2>
            
            <form onSubmit={handleAuthentication} className="max-w-md">
              <div className="mb-4">
                <label htmlFor="staffCode" className="block text-sm font-medium text-sap-grey mb-1">
                  Staff Access Code
                </label>
                <input
                  type="password"
                  id="staffCode"
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  placeholder="Enter staff access code"
                  className="w-full p-3 border border-sap-light-grey rounded-sap focus:outline-none focus:ring-2 focus:ring-sap-blue"
                  autoComplete="off"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sap-blue text-white py-3 rounded-sap font-medium hover:bg-sap-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sap-blue"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Authenticate'
                )}
              </button>
              
              <p className="mt-4 text-sm text-sap-grey">
                Use the prototype code: <strong>SAP2025</strong>
              </p>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Check-in Scanner */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-sap shadow-card p-6">
                <StaffCheckin 
                  onCheckinSuccess={handleCheckinSuccess}
                />
              </div>
            </div>
            
            {/* Right column: Stats & Recent check-ins */}
            <div>
              {/* Stats Card */}
              <div className="bg-white rounded-sap shadow-card p-6 mb-6">
                <h2 className="text-lg font-bold text-sap-dark-blue mb-4">Check-in Stats</h2>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-sap-bg rounded-sap p-4">
                    <p className="text-sm text-sap-grey">Total Attendees</p>
                    <p className="text-2xl font-bold text-sap-dark-blue">{stats.total}</p>
                  </div>
                  
                  <div className="bg-sap-bg rounded-sap p-4">
                    <p className="text-sm text-sap-grey">Checked In</p>
                    <p className="text-2xl font-bold text-sap-blue">{stats.checkedIn}</p>
                    <p className="text-xs text-sap-grey">
                      {stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link to="/admin" className="text-sm text-sap-blue hover:underline">
                    View detailed statistics →
                  </Link>
                </div>
              </div>
              
              {/* Recent Check-ins Card */}
              <div className="bg-white rounded-sap shadow-card p-6">
                <h2 className="text-lg font-bold text-sap-dark-blue mb-4">Recent Check-ins</h2>
                
                {checkins.length > 0 ? (
                  <div className="space-y-3">
                    {checkins.map(attendee => (
                      <div key={attendee.id} className="flex items-start space-x-3 p-3 bg-sap-bg rounded-sap">
                        <div className="bg-sap-blue rounded-full p-1.5 text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sap-dark-blue truncate">
                            {attendee.full_name}
                          </p>
                          <p className="text-xs text-sap-grey">
                            {attendee.category} | {new Date(attendee.check_in_time).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sap-grey py-4">
                    No check-ins yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffCheckinPage;