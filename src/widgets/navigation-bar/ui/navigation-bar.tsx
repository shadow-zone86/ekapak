'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/shared/config/store-hooks';
import { openCart } from '@/entities/cart/model/cartState';
import { MobileMenuProvider } from '@/features/mobile-menu-provider';
import { MobileMenuButton } from '@/features/mobile-menu-button';
import { MobileMenu } from '@/features/mobile-menu';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Search } from '@/shared/ui/search';
import { Logo } from '@/shared/ui/logo';
import { NavIcon } from '@/shared/ui/nav-icon';

export function NavigationBar() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = useAppSelector((state) => state.favorites.productUuids.length);

  const formatBadge = (count: number): number | string | undefined => {
    if (count <= 0) return undefined;
    return count > 99 ? '99+' : count;
  };

  const favoritesBadge = formatBadge(favoritesCount);
  const cartBadge = formatBadge(cartItemsCount);

  return (
    <MobileMenuProvider>
      <Card variant="outlined" className="rounded-none border-x-0 border-t-0 border-b-0 p-0">
        <div className="px-4 py-3">
        {/* Mobile: Logo + Icons */}
        <div className="flex items-center justify-between gap-4 mb-3 md:hidden">
          <Logo />

          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <Image src="/mail.svg" alt="Email" width={20} height={20} className="opacity-70" />
            </button>
            <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <Image src="/phone.svg" alt="Phone" width={20} height={20} className="opacity-70" />
            </button>
            <MobileMenuButton />
          </div>
        </div>

        {/* Desktop: Main navigation */}
        <div className="hidden md:block">
          {/* До 1023px - две строки */}
          <div className="flex flex-col gap-3 max-[1023px]:flex min-[1024px]:hidden">
            <div className="flex items-center gap-4">
              <Logo />
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2 flex-shrink-0 bg-gray-100 hover:bg-gray-200 border-0">
                  <Image src="/filter-outline.svg" alt="Menu" width={20} height={20} />
                  <span>Каталог</span>
                </Button>
              </Link>
              <Search placeholder="Поиск" className="flex-1 max-w-md" />
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6 flex-shrink-0">
                <NavIcon icon="/profile.svg" label="Профиль" href="#" />
                <NavIcon icon="/favorites.svg" label="Избранное" href="/favorites" badge={favoritesBadge} />
                <NavIcon icon="/cart.svg" label="Корзина" onClick={() => dispatch(openCart())} badge={cartBadge} />
              </div>
              <Button variant="primary" className="flex-shrink-0">Заказать образец</Button>
            </div>
          </div>

          {/* От 1024px - одна строка */}
          <div className="hidden min-[1024px]:flex items-center w-full">
            <Logo />
            <Link href="/" className="ml-[30px] mr-[10px]">
              <Button variant="outline" className="flex items-center gap-2 flex-shrink-0 bg-gray-100 hover:bg-gray-200 border-0">
                <Image src="/filter-outline.svg" alt="Menu" width={20} height={20} />
                <span>Каталог</span>
              </Button>
            </Link>
            <Search placeholder="Поиск" className="flex-1 max-w-md" />
            <NavIcon icon="/profile.svg" label="Профиль" href="#" className="ml-[34px]" />
            <NavIcon icon="/favorites.svg" label="Избранное" href="/favorites" badge={favoritesBadge} className="ml-[30px]" />
            <NavIcon icon="/cart.svg" label="Корзина" href="/cart" badge={cartBadge} className="ml-[30px]" />
            <Button variant="primary" className="flex-shrink-0 ml-[30px]">Заказать образец</Button>
          </div>
        </div>

        {/* Mobile: Search */}
        <div className="mb-3 md:hidden">
          <Search placeholder="Поиск" className="w-full" />
        </div>

        {/* Mobile: Menu */}
        <MobileMenu />
        </div>
      </Card>
    </MobileMenuProvider>
  );
}
