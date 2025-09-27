import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <svg className="mx-auto h-20 w-20 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-sap-dark-blue mb-3">
          Page Not Found
        </h1>
        
        <p className="text-sap-grey mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/"
            className="block w-full bg-sap-blue text-white py-3 rounded-sap font-medium hover:bg-sap-dark-blue transition-colors"
          >
            Back to Home Page
          </Link>
          
          <Link 
            to="/dashboard"
            className="block w-full bg-sap-bg text-sap-dark-blue py-3 rounded-sap font-medium hover:bg-sap-light-grey transition-colors"
          >
            Go to Dashboard
          </Link>
          
          <div className="pt-4">
            <p className="text-sm text-sap-grey">
              Need help? <Link to="/support" className="text-sap-blue hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;