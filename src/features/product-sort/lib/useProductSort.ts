'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'default';

export function useProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSort = (searchParams?.get('sort') || 'default') as SortOption;

  const setSort = useCallback(
    (sort: SortOption) => {
      if (!searchParams) return;
      const params = new URLSearchParams(searchParams.toString());

      if (sort === 'default') {
        params.delete('sort');
      } else {
        params.set('sort', sort);
      }

      // Сбрасываем страницу при смене сортировки
      params.set('page', '1');

      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return {
    selectedSort,
    setSort,
  };
}
