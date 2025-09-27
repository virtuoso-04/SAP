import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-sap-blue flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            EventMate
          </Link>
          <span className="ml-2 text-xs font-medium text-sap-grey rounded-full bg-sap-light-grey px-2 py-0.5">
            IPX Hub
          </span>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-sap-grey hover:text-sap-blue transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-sap-grey hover:text-sap-blue transition-colors">
                Register
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-sap-grey hover:text-sap-blue transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <button 
                onClick={() => navigate('/staff-checkin')} 
                className="text-sap-blue font-medium hover:underline"
              >
                Staff Portal
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;