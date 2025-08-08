import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../../utils/types';

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      // Убеждаемся, что state.ingredients всегда существует
      if (!Array.isArray(state.ingredients)) {
        console.warn('state.ingredients is not an array, initializing...');
        state.ingredients = [];
      }

      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      // Убеждаемся, что state.ingredients всегда существует
      if (!Array.isArray(state.ingredients)) {
        console.warn(
          'state.ingredients is not an array in removeIngredient, initializing...'
        );
        state.ingredients = [];
      } else {
        state.ingredients = state.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
      }
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      // Убеждаемся, что state.ingredients всегда существует
      if (!Array.isArray(state.ingredients)) {
        console.warn(
          'state.ingredients is not an array in moveIngredient, initializing...'
        );
        state.ingredients = [];
      } else {
        const { dragIndex, hoverIndex } = action.payload;

        // Проверяем валидность индексов
        if (
          dragIndex >= 0 &&
          dragIndex < state.ingredients.length &&
          hoverIndex >= 0 &&
          hoverIndex < state.ingredients.length
        ) {
          const draggedIngredient = state.ingredients[dragIndex];
          state.ingredients.splice(dragIndex, 1);
          state.ingredients.splice(hoverIndex, 0, draggedIngredient);
        }
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
