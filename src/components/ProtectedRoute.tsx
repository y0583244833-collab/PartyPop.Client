import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../api/types';
import { Loading } from './Loading';

/** עמודים שדורשים התחברות (ואופציונלית תפקיד מסוים). */
export function ProtectedRoute({ role }: { role?: Role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) return <div className="alert alert-error">אין לך הרשאה לעמוד הזה</div>;
  return <Outlet />;
}
