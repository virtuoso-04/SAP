import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
  <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center mb-14 lg:mb-16">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold text-sap-dark-blue mb-4">
            EventMate
            <span className="block text-sap-blue">Intelligent Participant Experience Hub</span>
          </h1>
          
          <p className="text-lg text-sap-grey mb-8">
            Experience the future of event management with our AI-powered platform that delivers personalized recommendations, seamless check-ins, and a complete event companion.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="btn-apple btn-primary px-8 py-3">
              Register Now
            </Link>
            <Link to="/dashboard" className="btn-apple btn-ghost px-8 py-3">
              View Dashboard
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-sap-bg rounded-sap overflow-hidden shadow-xl">
            <div className="relative pb-3/4">
              {/* This would be an image in production */}
              <div className="absolute inset-0 bg-gradient-to-br from-sap-blue to-sap-dark-blue flex items-center justify-center text-white p-8">
                <div className="text-center">
                  <div className="mb-6 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">VIBE 2025</h3>
                  <p className="text-blue-100">October 1-2, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="mb-14 lg:mb-16">
        <h2 className="text-2xl font-bold text-sap-blue text-center mb-10 lg:mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card-apple">
            <div className="rounded-full bg-sap-blue/10 w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-sap-dark-blue mb-2">Smart Recommendations</h3>
            <p className="text-sap-grey mb-4">
              Get personalized session recommendations based on your interests and preferences.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="card-apple">
            <div className="rounded-full bg-sap-blue/10 w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-sap-dark-blue mb-2">QR Check-in</h3>
            <p className="text-sap-grey mb-4">
              Secure and fast check-in process with encrypted QR codes for seamless event entry.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="card-apple">
            <div className="rounded-full bg-sap-blue/10 w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sap-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-sap-dark-blue mb-2">Calendar Integration</h3>
            <p className="text-sap-grey mb-4">
              Easily add sessions to your calendar and never miss important events.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
  <section className="bg-sap-blue text-white rounded-sap p-8 lg:p-10 text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Experience the Future of Events?</h2>
        <p className="mb-6">Join us at VIBE 2025 and be part of the innovation revolution.</p>
        <Link to="/register" className="btn-apple bg-white text-sap-blue hover:bg-sap-bg px-8 py-3 font-medium">
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default Landing;