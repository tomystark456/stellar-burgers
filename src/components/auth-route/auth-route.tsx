import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

interface AuthRouteProps {
  children: ReactNode;
}

export const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
