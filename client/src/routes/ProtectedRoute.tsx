import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from 'src/context/AuthContext';
import Spinner from 'src/views/spinner/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'member';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
