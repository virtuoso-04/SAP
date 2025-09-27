import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Landing from './pages/Landing';
import Register from './pages/Register';
import Success from './pages/Success';
import Dashboard from './pages/Dashboard';
import SessionDetailPage from './pages/SessionDetailPage';
import SessionsListPage from './pages/SessionsListPage';
import ProfilePage from './pages/ProfilePage';
import StaffCheckinPage from './pages/StaffCheckinPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import NetworkingPage from './pages/Networking';
import SupportPage from './pages/SupportPage';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import SITConcierge from './components/SITConcierge';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-sap-bg">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/networking" element={<NetworkingPage />} />
          <Route path="/sessions" element={<SessionsListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/session/:id" element={<SessionDetailPage />} />
          <Route path="/staff-checkin" element={<StaffCheckinPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Add SIT Concierge Chatbot */}
      <SITConcierge />
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;