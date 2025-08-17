import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './app';
import rootReducer from '../../services/slices';

// Мокаем useInView, так как он может не работать в тестовой среде
jest.mock('react-intersection-observer', () => ({
  useInView: () => [null, true] // [ref, inView]
}));

// Мокаем API, чтобы предотвратить реальные запросы
jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn(() => Promise.resolve([])),
  getUserApi: jest.fn(() => Promise.resolve({ user: null })),
  refreshToken: jest.fn(() => Promise.resolve()),
}));

describe('App', () => {
  // Подавляем предупреждения в консоли для чистого вывода тестов
  const originalError = console.error;
  const originalWarn = console.warn;
  
  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn((message) => {
      // Пропускаем только React Router Future Flag предупреждения
      if (message && typeof message === 'string' && 
          message.includes('React Router Future Flag Warning')) {
        return;
      }
      originalWarn(message);
    });
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  test('renders without crashing', () => {
    // Создаем изолированный store для теста
    const testStore = configureStore({
      reducer: rootReducer,
      preloadedState: {
        constructor: { bun: null, ingredients: [] },
        ingredients: { ingredients: [], loading: false, error: null },
        auth: { user: null, isAuthenticated: false, loading: false, error: null },
        orders: {
          feedOrders: [],
          userOrders: [],
          currentOrder: null,
          total: 0,
          totalToday: 0,
          loading: false,
          error: null
        }
      }
    });

         const { container } = render(
       <Provider store={testStore}>
         <App />
       </Provider>
     );

    // Проверяем, что приложение отрендерилось
    expect(container.firstChild).toBeTruthy();
  });
});
