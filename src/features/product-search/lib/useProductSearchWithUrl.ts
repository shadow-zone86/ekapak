'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface UseProductSearchWithUrlProps {
  debounceMs?: number;
}

export function useProductSearchWithUrl({ debounceMs = 300 }: UseProductSearchWithUrlProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearchParam = searchParams?.get('search') || '';
      const newSearchValue = searchQuery.trim();
      
      // Переходим только если поисковый запрос действительно изменился
      if (currentSearchParam === newSearchValue) {
        return;
      }
      
      const params = new URLSearchParams(searchParams?.toString() || '');
      
      if (newSearchValue) {
        params.set('search', newSearchValue);
        // Сбрасываем страницу только при новом поиске
        params.delete('page');
      } else {
        params.delete('search');
        // При очистке поиска НЕ удаляем page
      }
      
      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      
      router.push(url, { scroll: false });
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, debounceMs, router, searchParams, pathname]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return {
    searchQuery,
    handleSearchChange,
  };
}
