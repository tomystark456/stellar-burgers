import { FC, ReactNode, useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/auth-slice';
import { getCookie } from '../../utils/cookie';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      dispatch(getUser());
    }
  }, [dispatch]);

  return <>{children}</>;
};
