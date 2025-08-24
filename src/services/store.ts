import { combineReducers, configureStore } from '@reduxjs/toolkit';
import burgerConstructorReducer from './slices/burger-constructor-slice';
import ingredientsReducer from './slices/ingredients-slice';
import feedReducer from './slices/feed-slice';
import userReducer from './slices/user-slice';
import authReducer from './slices/auth-slice';
import orderReducer from './slices/order-slice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  user: userReducer,
  auth: authReducer,
  order: orderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
