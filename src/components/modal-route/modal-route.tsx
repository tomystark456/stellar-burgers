import { FC, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '../modal';

interface ModalRouteProps {
  title: string;
  children: ReactNode;
}

export const ModalRoute: FC<ModalRouteProps> = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    // Если есть background в state, возвращаемся туда
    if (location.state?.background) {
      navigate(
        location.state.background.pathname + location.state.background.search
      );
    } else {
      // Если это прямой переход по URL, возвращаемся на главную
      navigate('/');
    }
  };

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};
