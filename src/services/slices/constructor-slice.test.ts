import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  ConstructorState,
  initialState
} from './constructor-slice';
import { TConstructorIngredient } from '../../utils/types';

const mockBun: TConstructorIngredient = {
  _id: '60666c42cc7b410027a1a9b1',
  id: 'bun-1',
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
};

const mockIngredient: TConstructorIngredient = {
  _id: '60666c42cc7b410027a1a9b5',
  id: 'ingredient-1',
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
};

const mockSauce: TConstructorIngredient = {
  _id: '60666c42cc7b410027a1a9b6',
  id: 'sauce-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'sauce',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
};

describe('constructor reducer', () => {
  test('should return the initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('addIngredient', () => {
    test('should add bun to constructor', () => {
      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    test('should replace bun if already exists', () => {
      const stateWithBun = { ...initialState, bun: mockBun };
      const newBun = { ...mockBun, id: 'bun-2', name: 'Новая булка' };

      const action = addIngredient(newBun);
      const state = constructorReducer(stateWithBun, action);

      expect(state.bun).toEqual(newBun);
    });

    test('should add ingredient to ingredients array', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([mockIngredient]);
    });

    test('should add sauce to ingredients array', () => {
      const action = addIngredient(mockSauce);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([mockSauce]);
    });

    test('should add multiple ingredients', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toEqual([mockIngredient, mockSauce]);
    });
  });

  describe('removeIngredient', () => {
    test('should remove ingredient by id', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient, mockSauce]
      };

      const action = removeIngredient('ingredient-1');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual([mockSauce]);
    });

    test('should not remove ingredient if id not found', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient]
      };

      const action = removeIngredient('nonexistent-id');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual([mockIngredient]);
    });

    test('should handle empty ingredients array', () => {
      const action = removeIngredient('any-id');
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toEqual([]);
    });
  });

  describe('moveIngredient', () => {
    const ingredient1 = { ...mockIngredient, id: 'ing-1' };
    const ingredient2 = { ...mockSauce, id: 'ing-2' };
    const ingredient3 = {
      ...mockIngredient,
      id: 'ing-3',
      name: 'Ingredient 3'
    };

    test('should move ingredient from one position to another', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2, ingredient3]
      };

      const action = moveIngredient({ dragIndex: 0, hoverIndex: 2 });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual([
        ingredient2,
        ingredient3,
        ingredient1
      ]);
    });

    test('should move ingredient forward in array', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2, ingredient3]
      };

      const action = moveIngredient({ dragIndex: 2, hoverIndex: 0 });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual([
        ingredient3,
        ingredient1,
        ingredient2
      ]);
    });

    test('should handle same position move', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };

      const action = moveIngredient({ dragIndex: 1, hoverIndex: 1 });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual([ingredient1, ingredient2]);
    });
  });

  describe('clearConstructor', () => {
    test('should clear all constructor state', () => {
      const stateWithData = {
        bun: mockBun,
        ingredients: [mockIngredient, mockSauce]
      };

      const action = clearConstructor();
      const state = constructorReducer(stateWithData, action);

      expect(state).toEqual(initialState);
    });

    test('should clear already empty constructor', () => {
      const action = clearConstructor();
      const state = constructorReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });
});
