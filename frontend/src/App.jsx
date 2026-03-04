import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RecordConsultation from './pages/RecordConsultation';
import ReportView from './pages/ReportView';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import Patients from './pages/Patients';
import Settings from './pages/Settings';
import PatientProfile from './pages/PatientProfile';
import DoctorProfile from './pages/DoctorProfile';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [user, setUser] = useState(() => {
    // Persist login across page refreshes
    try {
      const stored = sessionStorage.getItem('medivoice_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('medivoice_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('medivoice_user');
  };

  const ProtectedLayout = ({ allowedRoles }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role))
      return <Navigate to="/dashboard" replace />;
    return (
      <DashboardLayout user={user} setUser={logout}>
        <Outlet />
      </DashboardLayout>
    );
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={!user
              ? <Login setUser={login} />
              : <Navigate to="/dashboard" replace />
            }
          />

          {/* Protected — all logged-in users */}
          <Route element={<ProtectedLayout allowedRoles={['patient', 'doctor']} />}>
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/reports" element={<ReportView user={user} />} />
            <Route path="/profile" element={user.role === 'doctor' ? <DoctorProfile user={user} /> : <PatientProfile user={user} />} />
            <Route path="/settings" element={<Settings />} />

            {/* Doctor-only */}
            <Route path="/patients" element={user?.role === 'doctor' ? <Patients /> : <Navigate to="/dashboard" replace />} />
            <Route path="/record" element={user?.role === 'doctor' ? <RecordConsultation user={user} /> : <Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
