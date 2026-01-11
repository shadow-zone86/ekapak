import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoritesState } from './types';

const initialState: FavoritesState = {
  productUuids: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.productUuids.indexOf(action.payload);
      if (index > -1) {
        state.productUuids.splice(index, 1);
      } else {
        state.productUuids.push(action.payload);
      }
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.productUuids.includes(action.payload)) {
        state.productUuids.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.productUuids = state.productUuids.filter((uuid) => uuid !== action.payload);
    },
  },
});

export const { toggleFavorite, addFavorite, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
