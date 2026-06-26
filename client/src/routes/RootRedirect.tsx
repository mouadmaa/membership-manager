import { Navigate } from 'react-router';
import { useAuth } from 'src/context/AuthContext';
import Spinner from 'src/views/spinner/Spinner';

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Navigate
      to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
      replace
    />
  );
};

export default RootRedirect;
