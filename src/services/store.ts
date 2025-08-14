import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'ingredients/fetchIngredients/pending',
          'ingredients/fetchIngredients/fulfilled',
          'ingredients/fetchIngredients/rejected'
        ],
        ignoredPaths: ['constructor.bun', 'constructor.ingredients']
      }
    }),
  preloadedState: {
    constructor: {
      bun: null,
      ingredients: []
    }
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook<AppDispatch>;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
