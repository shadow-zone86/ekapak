'use client';

import { H2, Price, Description } from '@/shared/ui/typography';

export interface CartTotalProps {
  finalTotal: number;
  currencySymbol: string;
  vatPercent: number;
}

export function CartTotal({ finalTotal, currencySymbol, vatPercent }: CartTotalProps) {
  return (
    <div className="cart-total border-t border-stroke pt-4">
      <div className="cart-total__row flex items-center justify-between">
        <H2 className="cart-total__label text-black text-[18px]">Всего:</H2>
        <Price className="cart-total__value text-blue-600 text-[24px]">
          {finalTotal.toFixed(2)} {currencySymbol}
        </Price>
      </div>
      <Description className="cart-total__vat text-gray-600 text-[12px]">
        В том числе НДС {vatPercent}%
      </Description>
    </div>
  );
}
