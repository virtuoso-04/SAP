import React, { useState } from 'react';
import apiService from '../services/api';

const AdminTable = ({ attendees, loading, error, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'full_name',
    direction: 'ascending'
  });

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (key) => {
    let direction = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Export attendees as CSV
  const handleExportCSV = async () => {
    try {
      // Get category filter, or null for all
      const categoryFilter = selectedCategory !== 'All' ? selectedCategory : null;
      
      // Call API to download CSV
      await apiService.downloadAttendeesCSV(categoryFilter);
    } catch (error) {
      console.error('CSV export error:', error);
    }
  };

  // Filter and sort attendees
  const getFilteredAndSortedAttendees = () => {
    if (!attendees) return [];
    
    // Filter by category
    let filtered = attendees;
    if (selectedCategory !== 'All') {
      filtered = attendees.filter(a => a.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.full_name.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.registration_id.toLowerCase().includes(term)
      );
    }
    
    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    return sorted;
  };

  // Get filtered attendees
  const filteredAttendees = getFilteredAndSortedAttendees();

  // Helper function for sort indicator
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'ascending' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-sap shadow-card p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-sap-light-grey rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-sap-light-grey rounded w-full mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-sap-light-grey rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-sap shadow-card p-6">
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-sap-dark-blue mb-2">Failed to load attendees</h3>
          <p className="text-sap-grey mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sap shadow-card p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-bold text-sap-blue">Attendees List</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          
          <button
            onClick={onRefresh}
            className="btn btn-secondary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0">
        {/* Category Filter */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === 'All' 
                ? 'bg-sap-blue text-white' 
                : 'bg-sap-bg text-sap-grey hover:bg-sap-light-grey'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleCategoryChange('Professional')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === 'Professional' 
                ? 'bg-sap-blue text-white' 
                : 'bg-sap-bg text-sap-grey hover:bg-sap-light-grey'
            }`}
          >
            Professionals
          </button>
          <button
            onClick={() => handleCategoryChange('Student')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === 'Student' 
                ? 'bg-sap-blue text-white' 
                : 'bg-sap-bg text-sap-grey hover:bg-sap-light-grey'
            }`}
          >
            Students
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 pr-3 py-2 border border-sap-light-grey rounded-sap focus:outline-none focus:ring-2 focus:ring-sap-blue focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sap-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Attendees count */}
      <p className="text-sm text-sap-grey mb-4">
        Showing {filteredAttendees.length} attendees
        {selectedCategory !== 'All' ? ` (${selectedCategory})` : ''}
        {searchTerm ? ` matching "${searchTerm}"` : ''}
      </p>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-sap-light-grey">
          <thead className="bg-sap-bg">
            <tr>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-sap-grey uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('registration_id')}
              >
                <div className="flex items-center">
                  <span>ID</span>
                  {getSortIcon('registration_id')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-sap-grey uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('full_name')}
              >
                <div className="flex items-center">
                  <span>Name</span>
                  {getSortIcon('full_name')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-sap-grey uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  <span>Email</span>
                  {getSortIcon('email')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-sap-grey uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  <span>Category</span>
                  {getSortIcon('category')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-sap-grey uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('checked_in')}
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {getSortIcon('checked_in')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sap-light-grey">
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sap-grey">
                  No attendees found matching your criteria
                </td>
              </tr>
            ) : (
              filteredAttendees.map((attendee) => (
                <tr 
                  key={attendee.id}
                  className="hover:bg-sap-bg"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-sap-blue">
                    {attendee.registration_id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-sap-dark-blue">
                    {attendee.full_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-sap-grey">
                    {attendee.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-sap-grey">
                    {attendee.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {attendee.checked_in ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Checked In
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Registered
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;