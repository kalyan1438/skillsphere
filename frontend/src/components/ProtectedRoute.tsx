import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin } = useAuth();
  return admin ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
