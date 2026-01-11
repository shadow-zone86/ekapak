'use client';

import { CartSidebar } from '@/widgets/cart-sidebar';
import { ContactBar } from '@/widgets/contact-bar';
import { NavigationBar } from '@/widgets/navigation-bar';
import { useAppSelector } from '@/shared/config/store-hooks';
import { useCartProducts } from '@/entities/product/api/useCartProducts';
import { H1, PText } from '@/shared/ui/typography';
import { CartItem } from '@/widgets/cart-item';
import { OrderSummary } from '@/widgets/order-summary';

export default function CartPageRoute() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { productsMap, isLoading, isError, errors } = useCartProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-5">
          <header className="bg-white border-stroke rounded-lg overflow-hidden mb-5">
            <ContactBar />
            <NavigationBar />
          </header>
        </div>
        <div className="container mx-auto px-4 pb-8">
          <div className="text-center py-12">Загрузка товаров корзины...</div>
        </div>
        <CartSidebar />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-5">
          <header className="bg-white border-stroke rounded-lg overflow-hidden mb-5">
            <ContactBar />
            <NavigationBar />
          </header>
        </div>
        <div className="container mx-auto px-4 pb-8">
          <div className="text-center py-12 text-red-600">
            Ошибка загрузки товаров корзины: {errors.map(e => e?.message || String(e)).join(', ')}
          </div>
        </div>
        <CartSidebar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-5">
        <header className="bg-white border-stroke rounded-lg overflow-hidden mb-5">
          <ContactBar />
          <NavigationBar />
        </header>
      </div>
      <div className="container mx-auto px-4 pb-8">
        <H1 className="mb-6 text-2xl font-bold">Корзина</H1>
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <H1 className="mb-2 text-xl font-semibold text-gray-900">Ваша корзина пуста</H1>
            <PText className="text-gray-500">
              Добавляйте товары, чтобы оформить заказ
            </PText>
          </div>
        ) : (
          <div className="flex flex-col gap-[10px] lg:flex-row">
            {/* Список товаров в корзине */}
            <div className="flex-1 rounded-lg border border-stroke bg-white p-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  cartItem={item}
                  product={productsMap.get(item.productUuid)}
                />
              ))}
            </div>

            {/* Сводка заказа */}
            <div className="lg:w-1/3">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
      <CartSidebar />
    </div>
  );
}
