import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useHealthAdminAuth } from './HealthAdminAuthContext';

export default function RequireHealthAdmin() {
  const { isAuthenticated, loading } = useHealthAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600 text-sm font-semibold">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/healthservices/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
