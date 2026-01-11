'use client';

import { useQuery } from '@tanstack/react-query';
import { resolveOr } from '@/shared/lib/di/container';
import { CATEGORY_TOKENS } from './tokens';
import GetCategoriesService from './getCategoriesService';
import type { ICategoryUiDto } from '../model/dto/types';
import { mapCategoryApiToUi } from '../model/dto/mappers';

export function useCategories() {
  // Получаем сервис через DI, с fallback на новый экземпляр
  const service = resolveOr(
    CATEGORY_TOKENS.GetCategoriesService,
    () => new GetCategoriesService()
  );

  return useQuery<ICategoryUiDto[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await service.getCategories();
      // Преобразуем данные через мапперы API → UI
      return response.map(mapCategoryApiToUi);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
