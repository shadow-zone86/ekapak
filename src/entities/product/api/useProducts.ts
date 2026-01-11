'use client';

import { useQuery } from '@tanstack/react-query';
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from './tokens';
import GetProductsService from './getProductsService';
import type { IProductsUiResponseDto } from '../model/dto/types';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';

export function useProducts(
  page: number = 1,
  perPage: number = 20,
  categoryUuid?: string
) {
  // Получаем сервис через DI, с fallback на новый экземпляр
  const service = resolveOr(
    PRODUCT_TOKENS.GetProductsService,
    () => new GetProductsService()
  );

  return useQuery<IProductsUiResponseDto>({
    queryKey: ['products', page, perPage, categoryUuid],
    queryFn: async () => {
      const response = await service.getProducts({ page, per_page: perPage, category: categoryUuid });
      // Преобразуем данные через мапперы API → UI
      return {
        data: response.data.map(mapProductApiToUi),
        meta: response.meta,
      };
    },
    staleTime: 60 * 1000,
  });
}
