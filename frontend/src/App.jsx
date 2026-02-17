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
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [user, setUser] = useState(null);

  // Protected Layout Wrapper
  const ProtectedLayout = ({ allowedRoles }) => {
    if (!user) return <Navigate to="/" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;

    return (
      <DashboardLayout user={user} setUser={setUser}>
        <Outlet />
      </DashboardLayout>
    );
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen font-sans text-slate-900">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedLayout allowedRoles={['patient', 'doctor']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<ReportView />} />

              {/* Doctor Only */}
              <Route
                path="/record"
                element={
                  user?.role === 'doctor'
                    ? <RecordConsultation user={user} />
                    : <Navigate to="/dashboard" replace />
                }
              />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
