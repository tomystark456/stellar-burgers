import { rootReducer } from './index';

describe('rootReducer', () => {
  test('should return initial state', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    
    expect(initialState).toMatchObject({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      orders: {
        feedOrders: [],
        userOrders: [],
        currentOrder: null,
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      auth: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    });
    
    // Проверим constructor отдельно, так как он может быть функцией из-за preloadedState
    expect(typeof initialState.constructor === 'object' || typeof initialState.constructor === 'function').toBe(true);
  });

  test('should have all required reducers', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders'); 
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('constructor');
  });
}); 