import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import BaseLayout from './views/BaseLayout';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import ReportCrime from './views/ReportCrime';
import ReportList from './views/ReportList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes (no layout chrome) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes wrapped in BaseLayout */}
          <Route
            element={
              <BaseLayout>
                <Outlet />
              </BaseLayout>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report-crime" element={<ReportCrime />} />
            <Route path="/my-reports" element={<ReportList myReports />} />
            <Route path="/reports" element={<ReportList />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="top-center"
        toastOptions={{
          error: { duration: 5000 },
        }}
      />
    </>
  );
}

export default App;
