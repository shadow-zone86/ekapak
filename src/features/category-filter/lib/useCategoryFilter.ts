'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams?.get('category') || undefined;

  const selectCategory = (categoryUuid: string | undefined) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryUuid) {
      params.set('category', categoryUuid);
    } else {
      params.delete('category');
    }
    
    // Сбрасываем страницу при смене категории
    params.set('page', '1');
    
    router.push(`/?${params.toString()}`);
  };

  return {
    selectedCategory,
    selectCategory,
  };
}
