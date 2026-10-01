import { Navigate, useLocation } from 'react-router-dom';
import { getStoredSession } from '../supabaseClient';

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const session = getStoredSession();

  // If not logged in, redirect to login with destination and requested role
  if (!session) {
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname);
    if (role) searchParams.set('role', role);
    return <Navigate to={`/login?${searchParams.toString()}`} replace />;
  }

  // If logged in, allow access
  return children;
}
