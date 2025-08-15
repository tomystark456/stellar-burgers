import { FC, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrderByNumber,
  clearCurrentOrder
} from '../../services/slices/orders-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams<{ number: string }>();
  const {
    currentOrder,
    loading: orderLoading,
    error
  } = useSelector((state) => state.orders);
  const { ingredients, loading: ingredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (number && (!currentOrder || currentOrder.number !== parseInt(number))) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number, currentOrder]);

  useEffect(() => {
    if (error) {
      dispatch(clearCurrentOrder());
      if (location.state?.background) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  }, [error, navigate, location.state, dispatch]);

  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;
    if (!currentOrder.ingredients || !Array.isArray(currentOrder.ingredients)) {
      console.error('Invalid order ingredients:', currentOrder);
      return null;
    }

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    try {
      const ingredientsInfo = currentOrder.ingredients.reduce(
        (acc: TIngredientsWithCount, item) => {
          if (!acc[item]) {
            const ingredient = ingredients.find((ing) => ing._id === item);
            if (ingredient) {
              acc[item] = {
                ...ingredient,
                count: 1
              };
            }
          } else {
            acc[item].count++;
          }
          return acc;
        },
        {}
      );

      const total = Object.values(ingredientsInfo).reduce(
        (acc, item) => acc + item.price * item.count,
        0
      );

      return {
        ...currentOrder,
        ingredientsInfo,
        date,
        total
      };
    } catch (error) {
      console.error('Error processing order info:', error);
      return null;
    }
  }, [currentOrder, ingredients]);

  if (orderLoading || ingredientsLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return null;
  }

  return (
    <>
      <h2 className='text text_type_digits-default mb-10'>
        #{String(orderInfo.number).padStart(6, '0')}
      </h2>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
