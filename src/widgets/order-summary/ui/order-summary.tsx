'use client';

import { useAppSelector } from '@/shared/config/store-hooks';
import { Button } from '@/shared/ui/button';
import { H2 } from '@/shared/ui/typography';
import { useState } from 'react';
import { CartDiscountInfo } from '@/entities/cart/ui/cart-discount-info';
import { CartUrgentOrder } from '@/entities/cart/ui/cart-urgent-order';
import { CartItemsSummary } from '@/entities/cart/ui/cart-items-summary';
import { CartDiscount } from '@/entities/cart/ui/cart-discount';
import { CartTotal } from '@/entities/cart/ui/cart-total';
import { CartTerms } from '@/entities/cart/ui/cart-terms';

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

  const currencySymbol = cartItems[0]?.currency.trim().toUpperCase() === 'RUB' ? '₽' : cartItems[0]?.currency || '';

  return (
    <div className="order-summary rounded-lg border border-stroke bg-white p-6 shadow-sm">
      {/* Заголовок */}
      <H2 className="order-summary__title mb-4 text-black text-xl font-bold">Ваш заказ</H2>

      {/* До скидки 5% */}
      <div className="order-summary__discount-info mb-4">
        <CartDiscountInfo discountPercent={5} remainingAmount={3250} currencySymbol={currencySymbol} />
      </div>

      {/* Срочный заказ */}
      <div className="order-summary__urgent mb-4">
        <CartUrgentOrder isUrgent={isUrgent} onUrgentChange={setIsUrgent} />
      </div>

      {/* Итоги по товарам */}
      <div className="order-summary__items-summary mb-4">
        <CartItemsSummary
          totalQuantity={totalQuantity}
          subtotal={subtotal}
          totalVolume={totalVolume}
          totalWeight={totalWeight}
          currencySymbol={currencySymbol}
        />
      </div>

            {/* Общая скидка */}
            <div className="order-summary__discount mb-4">
              <CartDiscount />
            </div>

            {/* Всего */}
            <div className="order-summary__total mb-6">
              <CartTotal
                finalTotal={finalTotal}
                currencySymbol={currencySymbol}
                vatPercent={20}
              />
            </div>

      {/* Чекбокс согласия */}
      <div className="order-summary__terms mb-6">
        <CartTerms agreedToTerms={agreedToTerms} onTermsChange={setAgreedToTerms} />
      </div>

      {/* Кнопка оформления заказа */}
      <Button variant="primary" size="lg" className="order-summary__checkout-button w-full" disabled={!agreedToTerms}>
        Оформить заказ
      </Button>
    </div>
  );
}
