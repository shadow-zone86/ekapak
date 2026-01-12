'use client';

import { PText, Price, Description } from '@/shared/ui/typography';

export interface CartItemsSummaryProps {
  totalQuantity: number;
  subtotal: number;
  totalVolume: number;
  totalWeight: number;
  currencySymbol: string;
}

export function CartItemsSummary({
  totalQuantity,
  subtotal,
  totalVolume,
  totalWeight,
  currencySymbol,
}: CartItemsSummaryProps) {
  return (
    <div className="cart-items-summary border-t border-stroke pt-4">
      <div className="cart-items-summary__row flex items-center justify-between">
        <PText className="cart-items-summary__count text-black">{totalQuantity} товара</PText>
        <Price className="cart-items-summary__total text-black">
          {subtotal.toFixed(2)} {currencySymbol}
        </Price>
      </div>
      <Description className="cart-items-summary__dimensions text-gray-600 text-[12px]">
        ({totalVolume.toFixed(4)} м³ / {totalWeight.toFixed(2)} кг)
      </Description>
    </div>
  );
}
