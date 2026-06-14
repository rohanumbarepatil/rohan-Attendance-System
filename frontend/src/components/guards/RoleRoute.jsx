import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/** Restricts nested routes to the given roles (RBAC route guard). */
export default function RoleRoute({ roles }) {
  const { profile } = useSelector((s) => s.auth);
  if (!profile || !roles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
