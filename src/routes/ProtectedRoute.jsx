import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './routes';

/**
 * ProtectedRoute — Guards private routes requiring user authentication.
 * Redirects unauthenticated visitors to /signin while preserving their target location.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-lab-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lab-accent animate-ping" />
          <span>Restoring session…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
