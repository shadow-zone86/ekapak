import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/entities/cart/model/cartState';
import favoritesReducer from '@/entities/favorites/model/favoritesState';
import profileReducer from '@/entities/profile/model/profileState';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      favorites: favoritesReducer,
      profile: profileReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
