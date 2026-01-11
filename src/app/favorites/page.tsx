import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CartSidebar } from '@/widgets/cart-sidebar';
import { FavoritesCatalog } from '@/widgets/favorites-catalog';
import { ContactBar } from '@/widgets/contact-bar';
import { NavigationBar } from '@/widgets/navigation-bar';

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
    <div className="min-h-screen bg-background animate-page-fade-in">
      <div className="container mx-auto px-4 pt-5">
        <header className="bg-white border-stroke rounded-lg overflow-hidden mb-5">
          <ContactBar />
          <NavigationBar />
        </header>
      </div>
      <main className="container mx-auto px-4 pb-8">
        <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
          <FavoritesCatalog />
        </Suspense>
      </main>
      <CartSidebar />
    </div>
  );
}
