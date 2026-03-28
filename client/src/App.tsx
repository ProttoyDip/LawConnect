import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import BaseLayout from './views/BaseLayout';
import Home from './views/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './views/ForgotPassword';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import ReportCrime from './views/ReportCrime';
import ReportList from './views/ReportList';
import InvestigatorDashboard from './views/InvestigatorDashboard';

import CaseDetails from './pages/Cases/CaseDetails';
import UserProfile from './pages/Profile/UserProfile';
import NotFound from './pages/Errors/NotFound';
import ServerError from './pages/Errors/ServerError';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import { Toaster } from 'react-hot-toast';

/**
 * Route guard — redirects to /login when no auth token is stored.
 */
function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

/**
 * Route guard with legacy top layout for non-dashboard protected pages.
 */
function ProtectedLayoutRoute() {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
}

function getStoredRole(): 'citizen' | 'police' | 'admin' | null {
  const rawUser = localStorage.getItem('user');
  if (!rawUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as { role?: string };
    if (parsedUser.role === 'citizen' || parsedUser.role === 'police' || parsedUser.role === 'admin') {
      return parsedUser.role;
    }
  } catch {
    localStorage.removeItem('user');
  }

  return null;
}

function DashboardEntryRoute() {
  const token = localStorage.getItem('token');
  const role = getStoredRole();

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'police') {
    return <Navigate to="/police" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Dashboard />;
}

function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: Array<'citizen' | 'police' | 'admin'>;
  children: ReactNode;
}) {
  const token = localStorage.getItem('token');
  const role = getStoredRole();

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();

  // Check if current route is a public page that needs navbar
  const showNavbar = ['/', '/login', '/register', '/forgot-password'].includes(
    location.pathname
  );

  return (
    <ErrorBoundary>
      <>
        {/* Show Navbar on public pages */}
        {showNavbar && <Navbar />}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes — require token */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardEntryRoute />} />
              <Route
                path="/admin"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/police"
                element={
                  <RoleRoute allowedRoles={['police']}>
                    <InvestigatorDashboard />
                  </RoleRoute>
                }
              />

            </Route>

            {/* Protected legacy pages using top layout */}
            <Route element={<ProtectedLayoutRoute />}>
              <Route path="/report-crime" element={<ReportCrime />} />
              <Route path="/my-reports" element={<ReportList myReports />} />
              <Route path="/reports" element={<ReportList />} />

              {/* New routes */}
              <Route path="/cases/:caseId" element={<CaseDetails />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>

            {/* Error routes */}
            <Route path="/error" element={<ServerError />} />
            <Route path="/404" element={<NotFound />} />

            {/* Default: redirect everything else to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>

        <Toaster
          position="top-center"
          toastOptions={{
            error: { duration: 5000 },
          }}
        />
      </>
    </ErrorBoundary>
  );
}

export default App;

