import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, isAdmin, adminCheckLoading } = useAuth();
  const location = useLocation();

  if (loading || adminCheckLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <LoadingSpinner text="Verifying session..." />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location, reason: 'not_authorized' }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
