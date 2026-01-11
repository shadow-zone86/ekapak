'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/shared/config/store-hooks';
import { Button } from '@/shared/ui/button';
import { H2, PText, Price, Description } from '@/shared/ui/typography';
import { Tooltip } from '@/shared/ui/tooltip';
import { useState } from 'react';

export function OrderSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // Placeholder for actual volume/weight calculation
  const totalVolume = 0.002; // Example value
  const totalWeight = 4.04; // Example value
  const totalDiscount = 80.00; // Example value
  const totalWithDiscount = subtotal - totalDiscount;
  const vatAmount = totalWithDiscount * 0.20; // 20% VAT
  const finalTotal = totalWithDiscount + vatAmount;

  const [isUrgent, setIsUrgent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const currencySymbol = cartItems[0]?.currency === 'RUB' ? '₽' : cartItems[0]?.currency || '';

  return (
    <div className="order-summary rounded-lg border border-stroke bg-white p-6 shadow-sm">
      {/* До скидки 5% */}
      <div className="order-summary__discount-info mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-3">
        <div className="order-summary__discount-label flex items-center gap-2">
          <Image src="/percent.svg" alt="Скидка" width={20} height={20} className="order-summary__discount-icon" />
          <PText className="text-blue-700">До скидки 5%</PText>
        </div>
        <Description className="order-summary__discount-amount text-blue-700">Осталось 3250 {currencySymbol}</Description>
      </div>

      {/* Срочный заказ */}
      <div className="order-summary__urgent mb-4 flex items-center justify-between">
        <div className="order-summary__urgent-label flex items-center gap-2">
          <PText className="text-black">Срочный заказ:</PText>
          <Tooltip text="Срочный заказ может быть выполнен быстрее, но может повлечь дополнительные расходы.">
            <Image
              src="/question.svg"
              alt="Информация о срочном заказе"
              width={13}
              height={13}
              className="order-summary__urgent-hint cursor-pointer"
            />
          </Tooltip>
        </div>
        <label className="order-summary__urgent-toggle relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            className="peer sr-only"
            checked={isUrgent}
            onChange={() => setIsUrgent(!isUrgent)}
          />
          <div className="order-summary__urgent-toggle-slider peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"></div>
        </label>
      </div>

      {/* Итоги по товарам */}
      <div className="order-summary__items-summary mb-4 border-t border-stroke pt-4">
        <div className="order-summary__items-summary-row flex items-center justify-between">
          <PText className="order-summary__items-count text-black">{totalQuantity} товара</PText>
          <Price className="order-summary__items-total text-black">
            {subtotal.toFixed(2)} {currencySymbol}
          </Price>
        </div>
        <Description className="order-summary__items-dimensions text-gray-600">
          ({totalVolume.toFixed(4)} м³ / {totalWeight.toFixed(2)} кг)
        </Description>
      </div>

      {/* Общая скидка */}
      <div className="order-summary__discount mb-4 flex items-center justify-between">
        <div className="order-summary__discount-label-wrapper flex items-center gap-2">
          <PText className="text-black">Общая скидка:</PText>
          <Link href="#" className="order-summary__discount-link text-blue-600 text-sm hover:underline">
            Подробнее
          </Link>
        </div>
        <Price className="order-summary__discount-value text-blue-600">
          -{totalDiscount.toFixed(2)} {currencySymbol}
        </Price>
      </div>

      {/* Всего */}
      <div className="order-summary__total mb-6 border-t border-stroke pt-4">
        <div className="order-summary__total-row flex items-center justify-between">
          <H2 className="order-summary__total-label text-black">Всего:</H2>
          <Price className="order-summary__total-value text-blue-600 text-2xl">
            {finalTotal.toFixed(2)} {currencySymbol}
          </Price>
        </div>
        <Description className="order-summary__total-vat text-gray-600">
          В том числе НДС 20%
        </Description>
      </div>

      {/* Чекбокс согласия */}
      <div className="order-summary__terms mb-6 flex items-start">
        <input
          id="terms-checkbox"
          type="checkbox"
          className="order-summary__terms-checkbox mt-1 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          checked={agreedToTerms}
          onChange={() => setAgreedToTerms(!agreedToTerms)}
        />
        <label htmlFor="terms-checkbox" className="order-summary__terms-label ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Я согласен на обработку персональных данных в соответствии с{' '}
          <Link href="#" className="order-summary__terms-link text-blue-600 hover:underline">
            политикой обработки персональных данных компании
          </Link>
        </label>
      </div>

      {/* Кнопка оформления заказа */}
      <Button variant="primary" size="lg" className="order-summary__checkout-button w-full" disabled={!agreedToTerms}>
        Оформить заказ
      </Button>
    </div>
  );
}
