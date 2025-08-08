import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients-slice';
import ordersReducer from './orders-slice';
import authReducer from './auth-slice';
import constructorReducer from './constructor-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  auth: authReducer,
  constructor: constructorReducer
});

export default rootReducer;
