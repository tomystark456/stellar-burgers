import { FC, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { clearCurrentOrder } from '../../services/slices/orders-slice';
import { Modal } from '../modal';

interface ModalRouteProps {
  title: string;
  children: ReactNode;
}

export const ModalRoute: FC<ModalRouteProps> = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleClose = () => {
    // Очищаем состояние заказа при закрытии модального окна
    dispatch(clearCurrentOrder());

    // Если есть background в state, возвращаемся туда
    if (location.state?.background) {
      navigate(
        location.state.background.pathname + location.state.background.search,
        { replace: true }
      );
    } else {
      // Если это прямой переход по URL, возвращаемся на главную
      navigate('/', { replace: true });
    }
  };

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};
