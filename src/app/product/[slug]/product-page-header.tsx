'use client';

import Link from 'next/link';
import { useProductBySlug } from '@/entities/product/api/useProductBySlug';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { H1 } from '@/shared/ui/typography';

interface ProductPageHeaderProps {
  slug: string;
}

export function ProductPageHeader({ slug }: ProductPageHeaderProps) {
  const { data: product } = useProductBySlug(slug);

  return (
    <>
      {/* Хлебные крошки */}
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: product?.name || 'Товар', active: true },
        ]}
        className="mb-4"
      />

      {/* Заголовок страницы с кнопкой возврата */}
      <div className="product-page-header mb-6 grid grid-cols-1 items-center gap-4 md:grid-cols-[auto_1fr_auto]">
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
        <H1 className="product-page-header__title text-center text-2xl font-bold">
          {product?.name || 'Загрузка...'}
        </H1>
        <div className="hidden md:block"></div>
      </div>
    </>
  );
}
