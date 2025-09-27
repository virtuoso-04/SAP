import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-6 mt-12 border-t border-sap-light-grey">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-sap-grey">
              &copy; {new Date().getFullYear()} EventMate - Intelligent Participant Experience Hub
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* SAP Logo */}
            <div className="text-sap-grey text-xs flex items-center">
              <span className="mr-2">Powered by</span>
              <svg 
                width="40" 
                height="20" 
                viewBox="0 0 80 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M40 0C17.9086 0 0 8.95431 0 20C0 31.0457 17.9086 40 40 40C62.0914 40 80 31.0457 80 20C80 8.95431 62.0914 0 40 0ZM26.6667 28.3333H20V15H26.6667C31.269 15 35 17.7909 35 21.6667C35 25.5425 31.269 28.3333 26.6667 28.3333ZM45 28.3333H40V15H45C49.6023 15 53.3333 17.7909 53.3333 21.6667C53.3333 25.5425 49.6023 28.3333 45 28.3333ZM60 15V18.3333H65V21.6667H60V25H66.6667V28.3333H56.6667V15H60Z" 
                  fill="#0f4c81"
                />
              </svg>
            </div>
            
            {/* GitHub Logo */}
            <div className="text-sap-grey text-xs flex items-center">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-sap-blue transition-colors"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;