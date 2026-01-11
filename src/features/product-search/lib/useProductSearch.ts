'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseProductSearchProps {
  debounceMs?: number;
  onSearch?: (query: string) => void;
}

export function useProductSearch({ debounceMs = 300, onSearch }: UseProductSearchProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchQuery);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, debounceMs, onSearch]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return {
    searchQuery,
    handleSearchChange,
  };
}
