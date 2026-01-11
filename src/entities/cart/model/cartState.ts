import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from './types';

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'id' | 'quantity'>>) => {
      // Проверяем по productUuid и offerUuid, чтобы можно было добавить один товар с разными офферами
      const existingItem = state.items.find(
        (item) => item.productUuid === action.payload.productUuid &&
                  item.offerUuid === action.payload.offerUuid
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newItem: CartItem = {
          ...action.payload,
          id: `${Date.now()}-${Math.random()}`,
          quantity: 1,
        };
        state.items.push(newItem);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter((item) => item.id !== action.payload.id);
        }
      }
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  toggleCart,
  openCart,
  closeCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
