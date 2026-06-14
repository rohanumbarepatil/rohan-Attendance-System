import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/** Blocks all routes for unauthenticated or deactivated users. */
export default function ProtectedRoute() {
  const { user, profile } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!user || !profile || profile.active === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
