import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProductsCatalog } from '@/widgets/products-catalog';
import { PromoBanner } from '@/widgets/promo-banner';
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from '@/entities/product/api/tokens';
import { CATEGORY_TOKENS } from '@/entities/category/api/tokens';
import GetProductsService from '@/entities/product/api/getProductsService';
import GetCategoriesService from '@/entities/category/api/getCategoriesService';
import { makeQueryClient } from '@/shared/config/query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';
import { mapCategoryApiToUi } from '@/entities/category/model/dto/mappers';
import type { IProductsUiResponseDto } from '@/entities/product/model/dto/types';
import type { ICategoryUiDto } from '@/entities/category/model/dto/types';

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

// Генерируем метаданные для SEO
export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryUuid = params.category;
  const perPage = 20;

  // Получаем сервисы через DI
  const productsService = resolveOr(
    PRODUCT_TOKENS.GetProductsService,
    () => new GetProductsService()
  );

  // Для метаданных нам нужен seo_description, которого нет в UI DTO
  // Получаем данные напрямую из API
  const apiResponse = await productsService.getProducts({ page: 1, per_page: perPage, category: categoryUuid });
  const seoDescription = apiResponse?.data?.[0]?.seo_description;

  return {
    title: 'EKAPAK - Каталог товаров | Интернет-магазин гибкой пластиковой упаковки',
    description: seoDescription || 'Каталог товаров от EKAPAK. Производство гибкой пластиковой упаковки по индивидуальным размерам. Широкий ассортимент упаковочных решений для вашего бизнеса.',
    keywords: 'EKAPAK, пластиковая упаковка, гибкая упаковка, каталог товаров, индивидуальная упаковка, производство упаковки',
    openGraph: {
      title: 'EKAPAK - Каталог товаров',
      description: seoDescription || 'Каталог товаров от EKAPAK. Производство гибкой пластиковой упаковки по индивидуальным размерам.',
      type: 'website',
    },
  };
}

export default async function HomePage({
  searchParams,
}: HomePageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const categoryUuid = params.category;

  const perPage = 20;

  const queryClient = makeQueryClient();

  // Получаем сервисы через DI
  const productsService = resolveOr(
    PRODUCT_TOKENS.GetProductsService,
    () => new GetProductsService()
  );
  const categoriesService = resolveOr(
    CATEGORY_TOKENS.GetCategoriesService,
    () => new GetCategoriesService()
  );

  // Prefetch data for SSR with mappers
  await queryClient.prefetchQuery<IProductsUiResponseDto>({
    queryKey: ['products', page, perPage, categoryUuid],
    queryFn: async () => {
      const response = await productsService.getProducts({ page, per_page: perPage, category: categoryUuid });
      return {
        data: response.data.map(mapProductApiToUi),
        meta: response.meta,
      };
    },
  });

  await queryClient.prefetchQuery<ICategoryUiDto[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesService.getCategories();
      return response.map(mapCategoryApiToUi);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container mx-auto px-4 pb-8 animate-page-fade-in">
        <PromoBanner />
        <div className="mt-[20px]">
          <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
            <ProductsCatalog initialPage={page} initialCategory={categoryUuid} />
          </Suspense>
        </div>
      </main>
    </HydrationBoundary>
  );
}
