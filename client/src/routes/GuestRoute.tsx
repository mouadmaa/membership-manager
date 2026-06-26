import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from 'src/context/AuthContext';
import Spinner from 'src/views/spinner/Spinner';

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (user) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default GuestRoute;
