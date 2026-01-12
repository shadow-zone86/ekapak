'use client';

import Link from 'next/link';
import { PText } from '@/shared/ui/typography';

export interface CartDiscountProps {
  discountLinkText?: string;
  discountLinkHref?: string;
}

export function CartDiscount({
  discountLinkText = 'Cсылка на страницу Скидки',
  discountLinkHref = '#',
}: CartDiscountProps) {
  return (
    <div className="cart-discount flex items-center justify-between">
      <div className="cart-discount__label-wrapper flex items-center gap-2">
        <PText className="cart-discount__label text-gray-600 text-[14px]">{discountLinkText}</PText>
      </div>
      <Link href={discountLinkHref} className="cart-discount__link text-blue-600 font-bold text-sm hover:underline">
        Подробнее
      </Link>
    </div>
  );
}
