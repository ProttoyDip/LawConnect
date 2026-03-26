import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import PageTransition from '../PageTransition';
import ParticlesBackground from '../ParticlesBackground';

interface LayoutProps {
  children?: ReactNode;
  requireAuth?: boolean;
}

export default function Layout({ children, requireAuth = false }: LayoutProps) {
  // If auth is required and user is not authenticated, redirect to login
  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  }

  return (
    <div className="layout-container">
      {children || <Outlet />}
    </div>
  );
}

export function PublicLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="public-layout">
      {children}
    </div>
  );
}

export function ProtectedLayout({ children }: { children?: ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="protected-layout">
      {children || <Outlet />}
    </div>
  );
}

// Re-export components for convenience
export { Navbar, PageTransition, ParticlesBackground as BackgroundAnimation };
