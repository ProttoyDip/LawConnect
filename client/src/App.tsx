import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BaseLayout from './views/BaseLayout';
import Home from './views/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './views/ForgotPassword';
import Dashboard from './views/Dashboard';
import ReportCrime from './views/ReportCrime';
import ReportList from './views/ReportList';
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
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
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
              {/* Unified role-based dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Dashboard />} />
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

