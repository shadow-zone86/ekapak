'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/shared/config/store-hooks';
import { useFormatBadge } from '@/shared/lib/hooks';
import { MobileMenuProvider } from '@/features/mobile-menu-provider';
import { MobileMenuButton } from '@/features/mobile-menu-button';
import { MobileMenu } from '@/features/mobile-menu';
import { OrderSampleModal } from '@/entities/orders/ui/order-sample-modal';
import { OrderSampleForm } from '@/features/order-sample-form';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Search } from '@/shared/ui/search';
import { Logo } from '@/shared/ui/logo';
import { NavIcon } from '@/shared/ui/nav-icon';
import { useProductSearchWithUrl } from '@/features/product-search/lib/useProductSearchWithUrl';

export function NavigationBar() {
  return (
    <Suspense fallback={
      <div className="navigation-bar navigation-bar--loading h-16 bg-white border-b border-stroke">
        <div className="container mx-auto px-4 py-3">
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    }>
      <NavigationBarContent />
    </Suspense>
  );
}

function NavigationBarContent() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.length;
  const favoritesCount = useAppSelector((state) => state.favorites.productUuids.length);
  const [isOrderSampleModalOpen, setIsOrderSampleModalOpen] = useState(false);

  const { searchQuery, handleSearchChange } = useProductSearchWithUrl();

  const favoritesBadge = useFormatBadge(favoritesCount);
  const cartBadge = useFormatBadge(cartItemsCount);

  return (
    <MobileMenuProvider>
      <Card variant="outlined" className="navigation-bar rounded-none border-x-0 border-t-0 border-b-0 p-0">
        <div className="navigation-bar__content px-4 py-3">
        {/* Mobile: Logo + Icons */}
        <div className="navigation-bar__mobile-header flex items-center justify-between gap-4 mb-3 md:hidden">
          <Logo />

          <div className="navigation-bar__mobile-actions flex items-center gap-4 flex-shrink-0">
            <button className="navigation-bar__mobile-action-button p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-smooth cursor-pointer active:scale-95">
              <Image src="/mail.svg" alt="Email" width={20} height={20} className="opacity-70" />
            </button>
            <button className="navigation-bar__mobile-action-button p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-smooth cursor-pointer active:scale-95">
              <Image src="/phone.svg" alt="Phone" width={20} height={20} className="opacity-70" />
            </button>
            <MobileMenuButton />
          </div>
        </div>

        {/* Desktop: Main navigation */}
        <div className="navigation-bar__desktop hidden md:block">
          <div className="navigation-bar__desktop-container flex flex-col gap-3 min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-0">
            {/* Левая группа: Logo, Каталог, Поиск */}
            <div className="navigation-bar__desktop-left flex items-center gap-4 min-[1024px]:gap-[30px] flex-1 min-[1024px]:flex-initial">
              <Logo />
              <Link href="/" className="navigation-bar__catalog-link">
                <Button variant="outline" className="flex items-center gap-2 flex-shrink-0 bg-gray-100 hover:bg-gray-200 border-0">
                  <Image src="/filter-outline.svg" alt="Menu" width={20} height={20} />
                  <span>Каталог</span>
                </Button>
              </Link>
              <Search
                value={searchQuery}
                placeholder="Поиск"
                className="flex-1 max-w-md"
                onSearch={handleSearchChange}
              />
            </div>

            {/* Правая группа: Профиль, Избранное, Корзина, Заказать образец */}
            <div className="navigation-bar__desktop-right flex items-center justify-between gap-6 min-[1024px]:justify-end min-[1024px]:gap-[30px] flex-shrink-0">
              {/* Иконки - обернуты только для планшета, чтобы justify-between работал */}
              <div className="navigation-bar__desktop-icons flex items-center gap-6 min-[1024px]:contents flex-shrink-0">
                         <NavIcon icon="/profile.svg" label="Профиль" href="/profile" />
                <NavIcon icon="/favorites.svg" label="Избранное" href="/favorites" badge={favoritesBadge} />
                <NavIcon icon="/cart.svg" label="Корзина" href="/cart" badge={cartBadge} />
              </div>
              <Button
                variant="primary"
                className="flex-shrink-0"
                onClick={() => setIsOrderSampleModalOpen(true)}
              >
                Заказать образец
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile: Search */}
        <div className="navigation-bar__mobile-search mb-3 md:hidden">
          <Search
            value={searchQuery}
            placeholder="Поиск"
            className="w-full"
            onSearch={handleSearchChange}
          />
        </div>

        {/* Mobile: Menu */}
        <MobileMenu />
        </div>
      </Card>
      <OrderSampleModal
        isOpen={isOrderSampleModalOpen}
        onClose={() => setIsOrderSampleModalOpen(false)}
        form={(props) => <OrderSampleForm {...props} />}
      />
    </MobileMenuProvider>
  );
}
