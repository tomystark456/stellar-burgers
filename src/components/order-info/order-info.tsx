import { FC, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrderByNumber,
  clearCurrentOrder
} from '../../services/slices/orders-slice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams<{ number: string }>();
  const { currentOrder, loading, error } = useSelector((state) => state.orders);
  const { ingredients } = useSelector((state) => state.ingredients);

  useEffect(() => {
    // Загружаем заказ только если его нет или номер не совпадает
    if (number && (!currentOrder || currentOrder.number !== parseInt(number))) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number, currentOrder]);

  useEffect(() => {
    if (error) {
      dispatch(clearCurrentOrder());
      // Если есть background, значит мы в модальном окне и нужно вернуться назад
      if (location.state?.background) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  }, [error, navigate, location.state, dispatch]);

  /* Готовим данные для отображения */
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
      // Создаем объект с информацией об ингредиентах и их количестве
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

      // Проверяем, что все ингредиенты найдены
      if (
        Object.keys(ingredientsInfo).length !== currentOrder.ingredients.length
      ) {
        console.error('Some ingredients not found:', {
          orderIngredients: currentOrder.ingredients,
          foundIngredients: Object.keys(ingredientsInfo)
        });
      }

      // Подсчитываем общую стоимость
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

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
