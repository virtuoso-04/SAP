import React from 'react';
import RegistrationForm from '../components/RegistrationForm';

const Register = () => {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      <div className="text-center mb-6 lg:mb-8">
        <h1 className="text-3xl font-bold text-sap-dark-blue mb-2">Register for VIBE 2025</h1>
        <p className="text-sap-grey">Complete the form below to secure your spot at the event</p>
      </div>
      
      <RegistrationForm />
    </div>
  );
};

export default Register;