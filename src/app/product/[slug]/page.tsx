import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProductCard } from '@/widgets/product-card';
import { ProductPageHeader } from './product-page-header';
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from '@/entities/product/api/tokens';
import GetProductBySlugService from '@/entities/product/api/getProductBySlugService';
import { makeQueryClient } from '@/shared/config/query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';

interface ProductPageRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageRouteProps): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const service = resolveOr(
      PRODUCT_TOKENS.GetProductBySlugService,
      () => new GetProductBySlugService()
    );
    const response = await service.getProductBySlug(resolvedParams.slug);
    const product = (response as { data?: unknown }).data || response;
    const productUi = mapProductApiToUi(product as Parameters<typeof mapProductApiToUi>[0]);

    return {
      title: `${productUi.name} - EKAPAK | Интернет-магазин гибкой пластиковой упаковки`,
      description: productUi.description || productUi.name,
      keywords: `${productUi.name}, пластиковая упаковка, гибкая упаковка, EKAPAK`,
      openGraph: {
        title: productUi.name,
        description: productUi.description || productUi.name,
        images: productUi.image ? [productUi.image] : [],
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Товар - EKAPAK',
      description: 'Страница товара',
    };
  }
}

export default async function ProductPageRoute({ params }: ProductPageRouteProps) {
  const resolvedParams = await params;
  const queryClient = makeQueryClient();

  // Prefetch product data for SSR
  await queryClient.prefetchQuery({
    queryKey: ['product', 'slug', resolvedParams.slug],
    queryFn: async () => {
      const service = resolveOr(
        PRODUCT_TOKENS.GetProductBySlugService,
        () => new GetProductBySlugService()
      );
      const response = await service.getProductBySlug(resolvedParams.slug);
      const product = (response as { data?: unknown }).data || response;
      return mapProductApiToUi(product as Parameters<typeof mapProductApiToUi>[0]);
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="container mx-auto px-4 pb-8 animate-page-fade-in">
        <Suspense fallback={<div className="text-center py-12">Загрузка товара...</div>}>
          <ProductPageHeader slug={resolvedParams.slug} />
          <ProductCard slug={resolvedParams.slug} />
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
