'use client';

import { useAppDispatch } from '@/shared/config/store-hooks';
import { removeItem } from '@/entities/cart/model/cartState';

interface UseRemoveFromCartProps {
  cartItemId: string;
}

export function useRemoveFromCart({ cartItemId }: UseRemoveFromCartProps) {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeItem(cartItemId));
  };

  return {
    handleRemove,
  };
}
