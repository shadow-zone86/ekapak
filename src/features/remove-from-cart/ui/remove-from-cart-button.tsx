'use client';

import Image from 'next/image';
import { useRemoveFromCart } from '../lib/useRemoveFromCart';

interface RemoveFromCartButtonProps {
  cartItemId: string;
}

export function RemoveFromCartButton({ cartItemId }: RemoveFromCartButtonProps) {
  const { handleRemove } = useRemoveFromCart({ cartItemId });

  return (
    <button
      onClick={handleRemove}
      className="cursor-pointer flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-smooth active:scale-95"
      aria-label="Удалить из корзины"
    >
      <Image src="/trash.svg" alt="Удалить" width={12} height={12} />
    </button>
  );
}
