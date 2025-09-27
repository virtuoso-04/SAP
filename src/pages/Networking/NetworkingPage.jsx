import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NetworkingSection from '../../components/networking/NetworkingSection';
import { getSuggestedConnections, sendConnectionRequest, connectLinkedIn, connectX, getPendingConnectionRequests, respondToConnectionRequest, getLinkedInAuthUrl, getXAuthUrl } from '../../services/networkingService';
import { toast } from 'react-toastify';

/**
 * NetworkingPage (Tailwind-based)
 * Uses our NetworkingSection component and mock networkingService.
 */
const NetworkingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connections, setConnections] = useState([]);
  const [social, setSocial] = useState({ linkedin: false, x: false });
  const [pending, setPending] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [attendeeId, setAttendeeId] = useState(null);

  const loadConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuggestedConnections('interests');
      setConnections(data || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load networking suggestions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  // hydrate social connections from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('socialConnections');
      if (raw) {
        const parsed = JSON.parse(raw);
        setSocial({
          linkedin: !!parsed.linkedin,
          x: !!parsed.x,
        });
      }
      const reg = localStorage.getItem('registrationData');
      if (reg) {
        const parsedReg = JSON.parse(reg);
        setAttendeeId(parsedReg?.attendee?.id || parsedReg?.attendee?.registration_id || null);
      }
    } catch (_) {}
  }, []);

  // load pending requests
  const loadPending = useCallback(async () => {
    setLoadingPending(true);
    try {
      const list = await getPendingConnectionRequests('current-user');
      setPending(list || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  // Map UI5-style mock connection objects into NetworkingSection recommendation shape
  const recommendations = useMemo(() => {
    return (connections || []).map((c) => ({
      attendee: {
        id: c.id,
        name: [c.firstName, c.lastName].filter(Boolean).join(' '),
        title: c.jobTitle,
        company: c.company,
        profileImage: c.avatar || null,
        skills: Array.isArray(c.interests) ? c.interests.slice(0, 6) : [],
      },
      matchScore: typeof c.sessionMatchScore === 'number' ? c.sessionMatchScore : 60,
      commonInterests: Array.isArray(c.interests) ? c.interests.slice(0, 3) : [],
      commonSessions: [],
    }));
  }, [connections]);

  const handleConnect = useCallback(async (toUserId) => {
    try {
      // Use a demo/current user id; integrate with real auth/user state when available
      await sendConnectionRequest('current-user', toUserId);
      toast.success('Connection request sent');
    } catch (e) {
      console.error(e);
      toast.error('Failed to send connection request');
    }
  }, []);

  const handleViewProfile = useCallback((userId) => {
    // Placeholder: wire up a modal or route later
    toast.info(`Profile preview coming soon for ${userId}`);
  }, []);

  const handleConnectLinkedIn = useCallback(async () => {
    try {
      // Try external OAuth URL first
      try {
        const url = await getLinkedInAuthUrl(attendeeId);
        if (url) {
          window.location.href = url;
          return;
        }
      } catch (e) {
        // If not configured (501) or failed, fallback to mock
        if (e?.status && e.status !== 501) throw e;
      }
      // Fallback mock connect
      const res = await connectLinkedIn();
      setSocial((s) => ({ ...s, linkedin: !!res?.connected }));
      localStorage.setItem('socialConnections', JSON.stringify({ ...social, linkedin: true }));
      toast.success('LinkedIn connected (mock)');
    } catch (e) {
      toast.error('Failed to connect LinkedIn');
    }
  }, [social, attendeeId]);

  const handleConnectX = useCallback(async () => {
    try {
      // Try external OAuth URL first
      try {
        const url = await getXAuthUrl(attendeeId);
        if (url) {
          window.location.href = url;
          return;
        }
      } catch (e) {
        if (e?.status && e.status !== 501) throw e;
      }
      // Fallback mock connect
      const res = await connectX();
      setSocial((s) => ({ ...s, x: !!res?.connected }));
      localStorage.setItem('socialConnections', JSON.stringify({ ...social, x: true }));
      toast.success('X connected (mock)');
    } catch (e) {
      toast.error('Failed to connect X');
    }
  }, [social, attendeeId]);

  const handleRespond = useCallback(async (requestId, accept) => {
    try {
      await respondToConnectionRequest(requestId, accept);
      setPending((prev) => prev.filter((r) => r.id !== requestId));
      toast.success(accept ? 'Request accepted' : 'Request rejected');
    } catch (e) {
      toast.error('Action failed');
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Networking Hub</h1>
            <p className="text-gray-600 mt-2">
              Connect with industry professionals. These suggestions are based on interests and sessions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleConnectLinkedIn}
              className={`btn-apple px-4 py-2 ${social.linkedin ? 'bg-green-500 text-white' : 'btn-ghost'}`}
              aria-pressed={social.linkedin}
            >
              {/* LinkedIn icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.84v2.18h.06c.53-1 1.84-2.18 3.8-2.18 4.06 0 4.81 2.67 4.81 6.15V24h-4v-6.89c0-1.64-.03-3.74-2.28-3.74-2.29 0-2.64 1.79-2.64 3.63V24h-4V8z" />
              </svg>
              {social.linkedin ? 'LinkedIn Connected' : 'Connect LinkedIn'}
            </button>
            <button
              onClick={handleConnectX}
              className={`btn-apple px-4 py-2 ${social.x ? 'bg-green-500 text-white' : 'btn-ghost'}`}
              aria-pressed={social.x}
            >
              {/* X icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M18.244 2H21l-6.545 7.48L22 22h-6.22l-4.86-6.36L4.8 22H2l7.01-8.01L2 2h6.3l4.56 5.97L18.244 2Zm-1.09 18h1.17L7.93 4h-1.2l10.424 16Z"/>
              </svg>
              {social.x ? 'X Connected' : 'Connect X'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-apple border border-red-200 bg-red-50 text-red-700 p-3">
          {error}
        </div>
      )}

      {/* Pending Requests */}
      <div className="mb-6 bg-white rounded-apple border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
          <button onClick={loadPending} className="text-sm text-sap-blue hover:underline">Refresh</button>
        </div>
        {loadingPending ? (
          <div className="text-gray-500">Loading…</div>
        ) : pending.length === 0 ? (
          <div className="text-gray-500">No pending requests</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pending.map((req) => (
              <li key={req.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {req.fromUser.firstName} {req.fromUser.lastName}
                  </div>
                  <div className="text-xs text-gray-600">
                    {req.fromUser.jobTitle} @ {req.fromUser.company}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRespond(req.id, true)}
                    className="btn-apple btn-success px-4 py-2 text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(req.id, false)}
                    className="btn-apple btn-ghost px-4 py-2 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-apple p-8 text-center border border-gray-100">
          <div className="mb-3 animate-pulse text-gray-400">Loading suggestions…</div>
          <div className="h-2 w-48 bg-gray-200 rounded mx-auto overflow-hidden">
            <div className="h-full w-1/2 bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <NetworkingSection
          recommendations={recommendations}
          onConnect={handleConnect}
          onViewProfile={handleViewProfile}
          onRefresh={loadConnections}
        />
      )}
    </div>
  );
};

export default NetworkingPage;