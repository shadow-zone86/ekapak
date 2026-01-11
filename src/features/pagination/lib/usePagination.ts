'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface UsePaginationOptions {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function usePagination({ currentPage, totalPages, basePath = '/' }: UsePaginationOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${basePath}?${params.toString()}`);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    handlePageChange,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
}
