import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

interface AuthRouteProps {
  children: ReactNode;
}

export const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {
    // Если пользователь пришел со страницы профиля, вернем его туда
    const from = location.state?.from?.pathname;
    if (from?.startsWith('/profile')) {
      return <Navigate to={from} replace />;
    }
    // Иначе отправляем на главную
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
