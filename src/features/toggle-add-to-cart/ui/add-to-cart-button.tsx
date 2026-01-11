'use client';

import { Button } from '@/shared/ui/button';
import { useAddToCart } from '../lib/useAddToCart';
import { useProductQuantityContext } from '@/features/product-quantity/lib/useProductQuantityContext';
import type { IProductUiDto } from '@/entities/product/model/dto/types';

interface AddToCartButtonProps {
  product: IProductUiDto;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { quantity } = useProductQuantityContext();
  const { handleAddToCart, isDisabled } = useAddToCart({ product, quantity });

  return (
    <Button
      variant="primary"
      size="md"
      onClick={handleAddToCart}
      disabled={isDisabled}
      className="w-full text-sm"
    >
      Добавить в корзину
    </Button>
  );
}
