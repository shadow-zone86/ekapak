import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FavoritesCatalog } from '@/widgets/favorites-catalog';
import { FavoritesPageHeader } from './favorites-page-header';

export const metadata: Metadata = {
  title: 'Избранное - EKAPAK | Интернет-магазин гибкой пластиковой упаковки',
  description: 'Ваши избранные товары от EKAPAK. Производство гибкой пластиковой упаковки по индивидуальным размерам. Вернитесь к понравившимся товарам и оформите заказ.',
  keywords: 'избранное, избранные товары, EKAPAK, пластиковая упаковка, гибкая упаковка',
  openGraph: {
    title: 'Избранное - EKAPAK',
    description: 'Ваши избранные товары от EKAPAK',
    type: 'website',
  },
};

export default function FavoritesPage() {
  return (
    <main className="container mx-auto px-4 pb-8 animate-page-fade-in">
      <FavoritesPageHeader />
      <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
        <FavoritesCatalog />
      </Suspense>
    </main>
  );
}
