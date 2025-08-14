import { FC, ReactNode, useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/auth-slice';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(getUser());
    }
  }, [dispatch]);

  return <>{children}</>;
};
