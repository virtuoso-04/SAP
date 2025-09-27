import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import SessionCard from '../components/sessions/SessionCard';

const SessionsListPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getSessions();
        setSessions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load sessions', e);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-900">All Sessions</h1>
        <p className="text-sap-grey mt-2">Browse the complete list of sessions at VIBE 2025.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-sap shadow-card p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-apple border border-red-200 bg-red-50 text-red-700 p-3">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-apple border border-gray-100 p-6 text-center text-sap-grey">No sessions available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session, idx) => (
            <SessionCard key={session.id} session={session} isBookmarked={false} showReason={false} delay={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsListPage;
