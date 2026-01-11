'use client';

import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAppSelector } from '@/shared/config/store-hooks';
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from './tokens';
import GetProductByUuidService from './getProductByUuidService';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';
import type { IProductUiDto } from '../model/dto/types';

export function useFavoriteProducts() {
  const favoriteUuids = useAppSelector((state) => state.favorites.productUuids);

  const queries = useQueries({
    queries: useMemo(
      () =>
        favoriteUuids.map((uuid) => ({
          queryKey: ['product', uuid] as const,
          queryFn: async () => {
            const service = resolveOr(
              PRODUCT_TOKENS.GetProductByUuidService,
              () => new GetProductByUuidService()
            );
            const response = await service.getProductByUuid(uuid);
            // API возвращает { data: Product }, извлекаем data
            const product = (response as { data?: unknown }).data || response;
            return mapProductApiToUi(product as Parameters<typeof mapProductApiToUi>[0]);
          },
          enabled: uuid.length > 0,
          staleTime: 60 * 1000,
        })),
      [favoriteUuids]
    ),
  });

  const products = useMemo(
    () =>
      queries
        .map((query) => query.data)
        .filter((product): product is IProductUiDto => product !== undefined),
    [queries]
  );

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const errors = queries.filter((query) => query.error).map((query) => query.error);

  return {
    products,
    isLoading,
    isError,
    errors,
  };
}
