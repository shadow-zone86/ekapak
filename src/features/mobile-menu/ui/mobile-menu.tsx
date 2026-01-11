'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/shared/config/store-hooks';
import { useMobileMenuContext } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/button';
import { PText } from '@/shared/ui/typography';

export function MobileMenu() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = useAppSelector((state) => state.favorites.productUuids.length);
  const { isOpen, close } = useMobileMenuContext();

  const formatBadge = (count: number): number | string | undefined => {
    if (count <= 0) return undefined;
    return count > 99 ? '99+' : count;
  };

  const favoritesBadge = formatBadge(favoritesCount);
  const cartBadge = formatBadge(cartItemsCount);

  if (!isOpen) return null;

  return (
    <div className="border-t border-stroke pt-3 space-y-2 bg-white md:hidden">
      <Link
        href="/"
        onClick={close}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Image src="/filter-outline.svg" alt="Catalog" width={20} height={20} className="opacity-70" />
        <PText className="text-black">Каталог</PText>
      </Link>

      <Link
        href="#"
        onClick={close}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Image src="/profile.svg" alt="Profile" width={20} height={20} className="opacity-70" />
        <PText className="text-black">Профиль</PText>
      </Link>

      <Link
        href="/favorites"
        onClick={close}
        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Image src="/favorites.svg" alt="Favorites" width={20} height={20} className="opacity-70" />
          <PText className="text-black">Избранное</PText>
        </div>
        {favoritesBadge && (
          <span className="rounded-full bg-blue-600 text-white text-xs px-1.5 py-0.5 min-w-[18px] text-center">
            {favoritesBadge}
          </span>
        )}
      </Link>

      <Link
        href="/cart"
        onClick={close}
        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Image src="/cart.svg" alt="Cart" width={20} height={20} className="opacity-70" />
          <PText className="text-black">Корзина</PText>
        </div>
        {cartBadge && (
          <span className="rounded-full bg-blue-600 text-white text-xs px-1.5 py-0.5 min-w-[18px] text-center">
            {cartBadge}
          </span>
        )}
      </Link>

      <div className="pt-2">
        <Button variant="primary" className="w-full" onClick={close}>
          Заказать образец
        </Button>
      </div>
    </div>
  );
}
