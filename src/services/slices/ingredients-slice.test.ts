import ingredientsReducer, {
  fetchIngredients,
  IngredientsState,
  initialState
} from './ingredients-slice';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '60666c42cc7b410027a1a9b1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  },
  {
    _id: '60666c42cc7b410027a1a9b5',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png'
  }
];

describe('ingredients reducer', () => {
  test('should return the initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    test('should handle pending action', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('should handle pending action when error existed', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('should handle fulfilled action', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(loadingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
    });

    test('should handle fulfilled action with empty array', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: []
      };
      const state = ingredientsReducer(loadingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('should handle rejected action with error message', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      };
      const state = ingredientsReducer(loadingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.ingredients).toEqual([]);
    });

    test('should handle rejected action without error message', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(loadingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
      expect(state.ingredients).toEqual([]);
    });

    test('should preserve existing ingredients on error', () => {
      const stateWithIngredients = {
        ...initialState,
        loading: true,
        ingredients: mockIngredients
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      };
      const state = ingredientsReducer(stateWithIngredients, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });

  describe('state transitions', () => {
    test('should handle complete loading cycle - success', () => {
      // Pending
      let state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      // Fulfilled
      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('should handle complete loading cycle - failure', () => {
      // Pending
      let state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      // Rejected
      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        error: { message: 'API Error' }
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('API Error');
      expect(state.ingredients).toEqual([]);
    });
  });
});
