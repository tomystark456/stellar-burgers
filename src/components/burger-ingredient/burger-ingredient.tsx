import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructor-slice';
import { v4 as uuidv4 } from 'uuid';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { TConstructorIngredient } from '../../utils/types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = useCallback(() => {
      try {
        const constructorIngredient: TConstructorIngredient = {
          ...ingredient,
          id: uuidv4()
        };

        if (!constructorIngredient.type || !constructorIngredient.id) {
          return;
        }

        dispatch(addIngredient(constructorIngredient));
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error in handleAdd:', error);
        }
      }
    }, [ingredient, dispatch]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
