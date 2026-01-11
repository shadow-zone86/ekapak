'use client';

import { useQuery } from '@tanstack/react-query';
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from './tokens';
import GetProductBySlugService from './getProductBySlugService';
import { mapProductApiToUi } from '../model/dto/mappers';
import type { IProductUiDto } from '../model/dto/types';

export function useProductBySlug(slug: string) {
  const service = resolveOr(
    PRODUCT_TOKENS.GetProductBySlugService,
    () => new GetProductBySlugService()
  );

  return useQuery<IProductUiDto>({
    queryKey: ['product', 'slug', slug],
    queryFn: async () => {
      const response = await service.getProductBySlug(slug);
      // API может возвращать { data: Product } или просто Product
      const product = (response as { data?: unknown }).data || response;
      return mapProductApiToUi(product as Parameters<typeof mapProductApiToUi>[0]);
    },
    enabled: slug.length > 0,
  });
}
