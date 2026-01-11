import { QueryClient } from '@tanstack/react-query';
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from '@/entities/product/api/tokens';
import { CATEGORY_TOKENS } from '@/entities/category/api/tokens';
import GetProductsService from '@/entities/product/api/getProductsService';
import GetCategoriesService from '@/entities/category/api/getCategoriesService';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';
import { mapCategoryApiToUi } from '@/entities/category/model/dto/mappers';
import type { IProductsUiResponseDto } from '@/entities/product/model/dto/types';
import type { ICategoryUiDto } from '@/entities/category/model/dto/types';

/**
 * Prefetch products data for SSR
 */
export async function prefetchProducts(
  queryClient: QueryClient,
  page: number = 1,
  perPage: number = 20,
  categoryUuid?: string
): Promise<void> {
  const productsService = resolveOr(
    PRODUCT_TOKENS.GetProductsService,
    () => new GetProductsService()
  );

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
}

/**
 * Prefetch categories data for SSR
 */
export async function prefetchCategories(queryClient: QueryClient): Promise<void> {
  const categoriesService = resolveOr(
    CATEGORY_TOKENS.GetCategoriesService,
    () => new GetCategoriesService()
  );

  await queryClient.prefetchQuery<ICategoryUiDto[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesService.getCategories();
      return response.map(mapCategoryApiToUi);
    },
  });
}

/**
 * Prefetch all data for products catalog page
 */
export async function prefetchProductsCatalogData(
  queryClient: QueryClient,
  page: number = 1,
  perPage: number = 20,
  categoryUuid?: string
): Promise<void> {
  await Promise.all([
    prefetchProducts(queryClient, page, perPage, categoryUuid),
    prefetchCategories(queryClient),
  ]);
}
