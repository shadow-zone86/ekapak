'use client';

import { Search } from '@/shared/ui/search';
import { useProductSearch } from '../lib/useProductSearch';

interface ProductSearchProps {
  placeholder?: string;
  debounceMs?: number;
  onSearch?: (query: string) => void;
  className?: string;
}

export function ProductSearch({
  placeholder = 'Поиск по названию товара...',
  debounceMs = 300,
  onSearch,
  className,
}: ProductSearchProps) {
  const { searchQuery, handleSearchChange } = useProductSearch({
    debounceMs,
    onSearch,
  });

  return (
    <Search
      value={searchQuery}
      placeholder={placeholder}
      onSearch={handleSearchChange}
      className={className}
    />
  );
}
