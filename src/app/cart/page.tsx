'use client';

import Link from 'next/link';
import { CartSidebar } from '@/widgets/cart-sidebar';
import { ContactBar } from '@/widgets/contact-bar';
import { NavigationBar } from '@/widgets/navigation-bar';
import { useAppSelector } from '@/shared/config/store-hooks';
import { useCartProducts } from '@/entities/product/api/useCartProducts';
import { H1, PText } from '@/shared/ui/typography';
import { CartItem } from '@/widgets/cart-item';
import { OrderSummary } from '@/widgets/order-summary';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';

export default function CartPageRoute() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { productsMap, isLoading, isError, errors } = useCartProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background animate-page-fade-in">
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
      <div className="min-h-screen bg-background animate-page-fade-in">
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
    <div className="min-h-screen bg-background animate-page-fade-in">
      <div className="container mx-auto px-4 pt-5">
        <header className="bg-white border-stroke rounded-lg overflow-hidden mb-5">
          <ContactBar />
          <NavigationBar />
        </header>
      </div>
      <div className="container mx-auto px-4 pb-8">
        {cartItems.length > 0 && (
          <>
            {/* Хлебные крошки */}
            <Breadcrumbs
              items={[
                { label: 'Главная', href: '/' },
                { label: 'Корзина', active: true },
              ]}
              className="mb-4"
            />

            {/* Заголовок страницы с кнопкой возврата */}
            <div className="cart-page-header mb-6 grid grid-cols-1 items-center gap-4 md:grid-cols-[auto_1fr_auto]">
              <Link
                href="/"
                className="back-button hidden items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-gray-700 text-sm transition-smooth hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] md:inline-flex"
              >
                <svg
                  className="back-button__icon h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="back-button__text">Вернуться к покупкам</span>
              </Link>
              <H1 className="cart-page-header__title text-center text-2xl font-bold">Корзина</H1>
              <div className="hidden md:block"></div>
            </div>
          </>
        )}
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
