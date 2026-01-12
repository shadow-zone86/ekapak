'use client';

import { PText, Description } from '@/shared/ui/typography';

export interface CartDiscountInfoProps {
  discountPercent: number;
  remainingAmount: number;
  currencySymbol: string;
}

export function CartDiscountInfo({
  discountPercent,
  remainingAmount,
  currencySymbol,
}: CartDiscountInfoProps) {
  return (
    <div className="cart-discount-info flex items-center justify-between rounded-lg bg-gray-100 p-3">
      <div className="cart-discount-info__text flex flex-col">
        <PText className="cart-discount-info__label text-black">
          До скидки <span className="text-blue-600 font-semibold">{discountPercent}%</span>
        </PText>
        <Description className="cart-discount-info__amount text-black text-sm">
          Осталось {remainingAmount} {currencySymbol}
        </Description>
      </div>
      <div className="cart-discount-info__icon-wrapper flex-shrink-0">
        <div className="cart-discount-info__icon flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
          <span className="text-white text-lg font-semibold">%</span>
        </div>
      </div>
    </div>
  );
}
