import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook<AppDispatch>;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
