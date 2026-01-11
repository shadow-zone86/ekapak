import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/entities/cart/model/cartState';
import favoritesReducer from '@/entities/favorites/model/favoritesState';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      favorites: favoritesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
