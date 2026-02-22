import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Home simply redirects to /dashboard (if logged in) or /login.
 */
export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    navigate(token ? '/dashboard' : '/login', { replace: true });
  }, [navigate]);

  return null;
}
