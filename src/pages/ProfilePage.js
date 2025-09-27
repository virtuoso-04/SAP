import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  let attendee = null;
  try {
    const raw = localStorage.getItem('registrationData');
    if (raw) attendee = JSON.parse(raw).attendee;
  } catch (_) {}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sap-blue hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-sap-grey mt-2">View and update your basic information and interests.</p>
      </div>

      <div className="bg-white rounded-sap shadow-card p-6">
        {attendee ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sap-grey text-sm">Full Name</p>
                <p className="font-medium">{attendee.full_name}</p>
              </div>
              <div>
                <p className="text-sap-grey text-sm">Email</p>
                <p className="font-medium">{attendee.email}</p>
              </div>
              <div>
                <p className="text-sap-grey text-sm">Category</p>
                <p className="font-medium">{attendee.category}</p>
              </div>
              <div>
                <p className="text-sap-grey text-sm">Registration ID</p>
                <p className="font-medium">{attendee.registration_id}</p>
              </div>
            </div>
            {Array.isArray(attendee.interests) && attendee.interests.length > 0 && (
              <div className="mt-6">
                <p className="text-sap-grey text-sm mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {attendee.interests.map((x) => (
                    <span key={x} className="inline-block bg-sap-bg text-sm font-medium text-sap-blue px-3 py-1 rounded-full">{x}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sap-grey">No profile loaded. Please register or log in.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
