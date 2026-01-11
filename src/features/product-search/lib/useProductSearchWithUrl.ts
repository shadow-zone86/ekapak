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
      const params = new URLSearchParams(searchParams?.toString() || '');
      
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      } else {
        params.delete('search');
      }
      
      // Сбрасываем страницу при поиске
      params.delete('page');
      
      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      
      // Переходим только если URL изменился
      const currentUrl = searchParams?.toString() || '';
      const newUrl = queryString;
      
      if (currentUrl !== newUrl) {
        router.push(url, { scroll: false });
      }
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
