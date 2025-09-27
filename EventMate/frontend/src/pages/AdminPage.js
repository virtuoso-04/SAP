import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminTable from '../components/AdminTable';
import apiService from '../services/api';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState({
    type: 'all',
    search: '',
    sortBy: 'name',
    sortDirection: 'asc'
  });
  const [stats, setStats] = useState({
    totalAttendees: 0,
    checkedIn: 0,
    totalSessions: 0,
    categoryCounts: {}
  });
  
  // Admin authentication
  const handleAuthentication = async (e) => {
    e.preventDefault();
    
    if (!adminCode.trim()) {
      toast.error('Please enter admin access code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be a proper authentication endpoint
      // For this prototype, we're using a simple code check
      if (adminCode === 'ADMIN2025') { // Hard-coded for prototype
        // Store authentication in session storage (not localStorage for security)
        sessionStorage.setItem('adminAuthenticated', 'true');
        setIsAuthenticated(true);
        toast.success('Admin access granted');
        
        // Load initial data
        await Promise.all([loadAttendees(), loadSessions()]);
        
      } else {
        toast.error('Invalid admin access code');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if admin is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
      
      if (isAuth) {
        setIsAuthenticated(true);
        await Promise.all([loadAttendees(), loadSessions()]);
      }
    };
    
    checkAuth();
  }, []);
  
  // Load attendees data
  const loadAttendees = async () => {
    try {
      const attendeesData = await apiService.getAttendees();
      setAttendees(attendeesData);
      
      // Calculate stats
      const totalAttendees = attendeesData.length;
      const checkedIn = attendeesData.filter(a => a.checked_in).length;
      
      // Count by category
      const categoryCounts = attendeesData.reduce((acc, attendee) => {
        const category = attendee.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
      
      setStats(prev => ({
        ...prev,
        totalAttendees,
        checkedIn,
        categoryCounts
      }));
      
    } catch (error) {
      console.error('Failed to load attendees:', error);
      toast.error('Failed to load attendee data');
    }
  };
  
  // Load sessions data
  const loadSessions = async () => {
    try {
      const sessionsData = await apiService.getSessions();
      setSessions(sessionsData);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalSessions: sessionsData.length
      }));
      
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load session data');
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get filtered and sorted attendees
  const getFilteredAttendees = () => {
    let filtered = [...attendees];
    
    // Apply type filter
    if (filter.type === 'checked-in') {
      filtered = filtered.filter(a => a.checked_in);
    } else if (filter.type === 'not-checked-in') {
      filtered = filtered.filter(a => !a.checked_in);
    }
    
    // Apply search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.full_name.toLowerCase().includes(searchLower) || 
        a.email.toLowerCase().includes(searchLower) ||
        a.registration_id.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (filter.sortBy) {
        case 'name':
          valueA = a.full_name.toLowerCase();
          valueB = b.full_name.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'category':
          valueA = a.category.toLowerCase();
          valueB = b.category.toLowerCase();
          break;
        case 'registration_id':
          valueA = a.registration_id.toLowerCase();
          valueB = b.registration_id.toLowerCase();
          break;
        default:
          valueA = a.full_name.toLowerCase();
          valueB = b.full_name.toLowerCase();
      }
      
      if (filter.sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
    
    return filtered;
  };
  
  // Handle admin logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    toast.info('Admin logged out');
  };
  
  // Export attendee data as CSV
  const handleExport = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers
      csvContent += "Registration ID,Full Name,Email,Category,Food Choice,Checked In\n";
      
      // Add data rows
      attendees.forEach(attendee => {
        csvContent += `${attendee.registration_id},${attendee.full_name},${attendee.email},${attendee.category},${attendee.food_choice},${attendee.checked_in ? "Yes" : "No"}\n`;
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "EventMate_Attendees.csv");
      document.body.appendChild(link);
      
      // Download file
      link.click();
      document.body.removeChild(link);
      
      toast.success('Attendee data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export attendee data');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-sap-dark-blue">Admin Dashboard</h1>
        
        {isAuthenticated && (
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-sap-light-grey rounded-sap text-sm font-medium text-sap-blue hover:bg-sap-bg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-sap-light-grey rounded-sap text-sm font-medium text-sap-grey hover:bg-sap-bg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
      
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-white rounded-sap shadow-card p-6">
          <h2 className="text-xl font-bold text-sap-dark-blue mb-6">Admin Authentication</h2>
          
          <form onSubmit={handleAuthentication}>
            <div className="mb-4">
              <label htmlFor="adminCode" className="block text-sm font-medium text-sap-grey mb-1">
                Admin Access Code
              </label>
              <input
                type="password"
                id="adminCode"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter admin access code"
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
              Use the prototype code: <strong>ADMIN2025</strong>
            </p>
          </form>
        </div>
      ) : (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-sap shadow-card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-sap-grey">Total Attendees</p>
                  <p className="text-3xl font-bold text-sap-dark-blue">{stats.totalAttendees}</p>
                </div>
                <div className="p-2 bg-sap-bg rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-sap shadow-card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-sap-grey">Checked In</p>
                  <p className="text-3xl font-bold text-sap-blue">{stats.checkedIn}</p>
                  <p className="text-xs text-sap-grey">
                    {stats.totalAttendees > 0 ? Math.round((stats.checkedIn / stats.totalAttendees) * 100) : 0}%
                  </p>
                </div>
                <div className="p-2 bg-sap-bg rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-sap shadow-card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-sap-grey">Total Sessions</p>
                  <p className="text-3xl font-bold text-sap-dark-blue">{stats.totalSessions}</p>
                </div>
                <div className="p-2 bg-sap-bg rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-sap shadow-card p-5">
              <div>
                <p className="text-sm text-sap-grey mb-2">Attendee Categories</p>
                <div className="space-y-2">
                  {Object.entries(stats.categoryCounts).map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-xs text-sap-grey">{category}</span>
                      <span className="text-xs font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="bg-white rounded-sap shadow-card p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="typeFilter" className="block text-xs font-medium text-sap-grey mb-1">
                  Status
                </label>
                <select
                  id="typeFilter"
                  value={filter.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full p-2 border border-sap-light-grey rounded-sap text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
                >
                  <option value="all">All Attendees</option>
                  <option value="checked-in">Checked In</option>
                  <option value="not-checked-in">Not Checked In</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sortBy" className="block text-xs font-medium text-sap-grey mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={filter.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-2 border border-sap-light-grey rounded-sap text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="category">Category</option>
                  <option value="registration_id">Registration ID</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sortDirection" className="block text-xs font-medium text-sap-grey mb-1">
                  Order
                </label>
                <select
                  id="sortDirection"
                  value={filter.sortDirection}
                  onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
                  className="w-full p-2 border border-sap-light-grey rounded-sap text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="search" className="block text-xs font-medium text-sap-grey mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={filter.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by name, email, ID..."
                  className="w-full p-2 border border-sap-light-grey rounded-sap text-sm focus:outline-none focus:ring-2 focus:ring-sap-blue"
                />
              </div>
            </div>
          </div>
          
          {/* Attendee Table */}
          <AdminTable 
            attendees={getFilteredAttendees()} 
            onRefresh={loadAttendees} 
          />
          
          {/* Links to Other Tools */}
          <div className="flex justify-center mt-8">
            <Link to="/staff-checkin" className="text-sap-blue hover:underline">
              Go to Staff Check-in Portal →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;