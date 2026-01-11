'use client';

import { Button } from '@/shared/ui/button';
import { usePagination } from '../lib/usePagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = '/' }: PaginationProps) {
  const { goToPreviousPage, goToNextPage, canGoPrevious, canGoNext } = usePagination({
    currentPage,
    totalPages,
    basePath,
  });

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button variant="outline" onClick={goToPreviousPage} disabled={!canGoPrevious}>
        Назад
      </Button>
      <span className="px-4 text-description text-gray-600">
        Страница {currentPage} из {totalPages}
      </span>
      <Button variant="outline" onClick={goToNextPage} disabled={!canGoNext}>
        Вперед
      </Button>
    </div>
  );
}
