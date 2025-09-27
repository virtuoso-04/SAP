import React from 'react';
import { Link } from 'react-router-dom';

const SupportPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Support</h1>
        <p className="text-sap-grey mt-2">We’re here to help. Reach out for assistance with registration, check-in, or sessions.</p>
      </div>
      <div className="bg-white rounded-sap shadow-card p-6">
        <ul className="space-y-3 text-sm">
          <li>Email: <a href="mailto:support@eventmate.local" className="text-sap-blue hover:underline">support@eventmate.local</a></li>
          <li>FAQs: Coming soon</li>
        </ul>
        <div className="mt-6">
          <Link to="/" className="text-sap-blue hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
