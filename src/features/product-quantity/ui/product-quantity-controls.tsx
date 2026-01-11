'use client';

import { useMemo } from 'react';
import { Description } from '@/shared/ui/typography';
import { useProductQuantityContext } from '../lib/useProductQuantityContext';
import type { IOfferUiDto } from '@/entities/product/model/dto/types';
import { cn } from '@/shared/lib/utils';

interface ProductQuantityControlsProps {
  defaultOffer: IOfferUiDto;
  withBorder?: boolean;
}

export function ProductQuantityControls({
  defaultOffer,
  withBorder = false,
}: ProductQuantityControlsProps) {
  const { quantity, setQuantity } = useProductQuantityContext();
  const minPurchase = defaultOffer.minPurchase ?? 100;

  const totalPrice = useMemo(
    () => defaultOffer.price * quantity,
    [defaultOffer.price, quantity]
  );

  const handleDecrease = () => {
    setQuantity(Math.max(minPurchase, quantity - 1));
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className={cn('product-quantity-controls', 'flex items-center gap-2', withBorder && 'product-quantity-controls--bordered rounded border border-stroke p-1')}>
            <button
              onClick={handleDecrease}
              className="product-quantity-controls__button product-quantity-controls__button--decrease cursor-pointer w-7 h-7 rounded border border-stroke bg-white hover:bg-gray-50 hover:border-blue-600 flex items-center justify-center text-gray font-bold text-sm transition-smooth active:scale-95"
              aria-label="Уменьшить количество"
            >
              -
            </button>
      <div className="product-quantity-controls__info flex-1 flex flex-col items-center">
        <span className="product-quantity-controls__quantity text-black font-medium text-sm">
          {quantity} {defaultOffer.unit}
        </span>
        <Description className="product-quantity-controls__price text-gray text-xs">
          на {totalPrice.toFixed(2)} {defaultOffer.currencySymbol}
        </Description>
      </div>
            <button
              onClick={handleIncrease}
              className="product-quantity-controls__button product-quantity-controls__button--increase cursor-pointer w-7 h-7 rounded border border-stroke bg-white hover:bg-gray-50 hover:border-blue-600 flex items-center justify-center text-gray font-bold text-sm transition-smooth active:scale-95"
              aria-label="Увеличить количество"
            >
              +
            </button>
    </div>
  );
}
