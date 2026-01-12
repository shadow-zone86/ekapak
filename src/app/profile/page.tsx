import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { H1 } from '@/shared/ui/typography';
import { NavigationBar } from '@/widgets/navigation-bar';
import { ContactBar } from '@/widgets/contact-bar';
import { ProfileContent } from '@/widgets/profile-content';

export const metadata: Metadata = {
  title: 'Профиль - EKAPAK | Интернет-магазин гибкой пластиковой упаковки',
  description: 'Личный кабинет пользователя EKAPAK. Управление профилем, заказами и персональными данными.',
  keywords: 'профиль, личный кабинет, EKAPAK, управление данными',
  openGraph: {
    title: 'Профиль - EKAPAK',
    description: 'Личный кабинет пользователя EKAPAK',
    type: 'website',
  },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background animate-page-fade-in">
      <div className="container mx-auto px-4 pt-5">
        <header className="bg-white border-stroke rounded-lg overflow-hidden mb-5">
          <ContactBar />
          <NavigationBar />
        </header>
      </div>
      <div className="container mx-auto px-4 pb-8">
        {/* Хлебные крошки */}
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Профиль', active: true },
          ]}
          className="mb-4"
        />

        {/* Заголовок страницы с кнопкой возврата */}
        <div className="profile-page-header mb-6 grid grid-cols-1 items-center gap-4 md:grid-cols-[auto_1fr_auto]">
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
          <H1 className="profile-page-header__title text-center text-2xl font-bold">Профиль</H1>
          <div className="hidden md:block"></div>
        </div>

        <ProfileContent />
      </div>
    </div>
  );
}
