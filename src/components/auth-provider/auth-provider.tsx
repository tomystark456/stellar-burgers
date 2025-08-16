import { FC, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../services/slices/auth-slice';
import { getCookie } from '../../utils/cookie';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken && !user && !loading) {
      dispatch(getUser());
    }
  }, []); // Убираем все зависимости, чтобы загрузить только один раз

  return <>{children}</>;
};
