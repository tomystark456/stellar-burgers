import { FC, useMemo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  createOrder,
  clearCurrentOrder
} from '../../services/slices/orders-slice';
import { clearConstructor } from '../../services/slices/constructor-slice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { Modal } from '../modal';
import { OrderDetailsUI } from '../ui/order-details';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { bun, ingredients } = useSelector((state) => state.constructor);
  const { loading, currentOrder, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const constructorItems = {
    bun,
    ingredients: ingredients || []
  };

  const orderRequest = loading;

  useEffect(() => {
    if (error) {
      setIsOrderModalOpen(false);
      dispatch(clearCurrentOrder());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (currentOrder && currentOrder.number && !isOrderModalOpen) {
      setIsOrderModalOpen(true);
    }
  }, [currentOrder, isOrderModalOpen]);

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    dispatch(clearCurrentOrder());
    dispatch(clearConstructor());
    navigate(-1);
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (
      !constructorItems.bun._id ||
      !constructorItems.ingredients.every((ing) => ing._id)
    ) {
      console.error('Invalid ingredients data:', constructorItems);
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds) as any);
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = Array.isArray(constructorItems.ingredients)
      ? constructorItems.ingredients.reduce(
          (s: number, v: TConstructorIngredient) => s + v.price,
          0
        )
      : 0;
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        onOrderClick={onOrderClick}
      />
      {isOrderModalOpen && currentOrder && (
        <Modal title='' onClose={handleCloseOrderModal}>
          <OrderDetailsUI orderNumber={currentOrder.number} />
        </Modal>
      )}
    </>
  );
};
