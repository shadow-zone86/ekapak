'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useProductSort, type SortOption } from '../lib/useProductSort';
import { cn } from '@/shared/lib/utils';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'name-asc', label: 'По имени (А-Я)' },
  { value: 'name-desc', label: 'По имени (Я-А)' },
  { value: 'price-asc', label: 'По цене (возрастание)' },
  { value: 'price-desc', label: 'По цене (убывание)' },
];

export function ProductSort() {
  const { selectedSort, setSort } = useProductSort();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sortOptions.find((option) => option.value === selectedSort) || sortOptions[0];

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: SortOption) => {
    setSort(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm',
          'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent',
          'transition-all cursor-pointer'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Image
          src="/arrow.svg"
          alt="Sort"
          width={16}
          height={16}
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
        <span className="text-black">{selectedOption.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-stroke bg-white shadow-lg z-50">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm transition-colors',
                  'hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
                  selectedSort === option.value && 'bg-blue-50 text-blue-600 font-medium'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
