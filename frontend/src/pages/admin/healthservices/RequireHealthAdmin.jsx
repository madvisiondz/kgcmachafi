import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useHealthAdminAuth } from './HealthAdminAuthContext';

export default function RequireHealthAdmin() {
  const { isAuthenticated, loading } = useHealthAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="hsvc-admin-root hsvc-admin-bg machafi-subtle-emerald-bg machafi-soft-grid min-h-screen flex items-center justify-center text-slate-300 text-sm font-semibold">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/healthservices/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
