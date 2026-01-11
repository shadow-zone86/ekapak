import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePagination } from './usePagination';

// Мокаем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('usePagination', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should return correct initial values', () => {
    const mockSearchParams = new URLSearchParams('page=1&category=test');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: 5,
      })
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.canGoPrevious).toBe(false);
    expect(result.current.canGoNext).toBe(true);
  });

  it('should return canGoPrevious as false when on first page', () => {
    const mockSearchParams = new URLSearchParams('page=1');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: 5,
      })
    );

    expect(result.current.canGoPrevious).toBe(false);
  });

  it('should return canGoPrevious as true when not on first page', () => {
    const mockSearchParams = new URLSearchParams('page=2');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() =>
      usePagination({
        currentPage: 2,
        totalPages: 5,
      })
    );

    expect(result.current.canGoPrevious).toBe(true);
  });

  it('should return canGoNext as false when on last page', () => {
    const mockSearchParams = new URLSearchParams('page=5');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() =>
      usePagination({
        currentPage: 5,
        totalPages: 5,
      })
    );

    expect(result.current.canGoNext).toBe(false);
  });

  it('should return canGoNext as true when not on last page', () => {
    const mockSearchParams = new URLSearchParams('page=3');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() =>
      usePagination({
        currentPage: 3,
        totalPages: 5,
      })
    );

    expect(result.current.canGoNext).toBe(true);
  });

  describe('handlePageChange', () => {
    it('should navigate to correct page with default basePath', () => {
      const mockSearchParams = new URLSearchParams('page=1&category=test');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.handlePageChange(3);
      });

      expect(mockPush).toHaveBeenCalledWith('/?page=3&category=test');
    });

    it('should navigate to correct page with custom basePath', () => {
      const mockSearchParams = new URLSearchParams('page=1&category=test');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 5,
          basePath: '/products',
        })
      );

      act(() => {
        result.current.handlePageChange(3);
      });

      expect(mockPush).toHaveBeenCalledWith('/products?page=3&category=test');
    });

    it('should preserve existing query parameters', () => {
      const mockSearchParams = new URLSearchParams('page=1&category=electronics&sort=price');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(mockPush).toHaveBeenCalledWith('/?page=2&category=electronics&sort=price');
    });

    it('should not navigate if searchParams is null', () => {
      (useSearchParams as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('goToPreviousPage', () => {
    it('should navigate to previous page when not on first page', () => {
      const mockSearchParams = new URLSearchParams('page=3&category=test');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 3,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.goToPreviousPage();
      });

      expect(mockPush).toHaveBeenCalledWith('/?page=2&category=test');
    });

    it('should not navigate when on first page', () => {
      const mockSearchParams = new URLSearchParams('page=1&category=test');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.goToPreviousPage();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('goToNextPage', () => {
    it('should navigate to next page when not on last page', () => {
      const mockSearchParams = new URLSearchParams('page=3&category=test');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 3,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.goToNextPage();
      });

      expect(mockPush).toHaveBeenCalledWith('/?page=4&category=test');
    });

    it('should not navigate when on last page', () => {
      const mockSearchParams = new URLSearchParams('page=5&category=test');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 5,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.goToNextPage();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle single page correctly', () => {
      const mockSearchParams = new URLSearchParams('page=1');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 1,
        })
      );

      expect(result.current.canGoPrevious).toBe(false);
      expect(result.current.canGoNext).toBe(false);
    });

    it('should handle empty query parameters', () => {
      const mockSearchParams = new URLSearchParams('');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(mockPush).toHaveBeenCalledWith('/?page=2');
    });

    it('should use default basePath when not provided', () => {
      const mockSearchParams = new URLSearchParams('page=1');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() =>
        usePagination({
          currentPage: 1,
          totalPages: 5,
        })
      );

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(mockPush).toHaveBeenCalledWith('/?page=2');
    });
  });
});
