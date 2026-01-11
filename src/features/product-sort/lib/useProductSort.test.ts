import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductSort } from './useProductSort';

// Мокаем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('useProductSort', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should return default sort when no sort param in search params', () => {
    const mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useProductSort());

    expect(result.current.selectedSort).toBe('default');
  });

  it('should return sort from search params', () => {
    const mockSearchParams = new URLSearchParams('sort=price-asc');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useProductSort());

    expect(result.current.selectedSort).toBe('price-asc');
  });

  it('should handle name-asc sort option', () => {
    const mockSearchParams = new URLSearchParams('sort=name-asc');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useProductSort());

    expect(result.current.selectedSort).toBe('name-asc');
  });

  it('should handle name-desc sort option', () => {
    const mockSearchParams = new URLSearchParams('sort=name-desc');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useProductSort());

    expect(result.current.selectedSort).toBe('name-desc');
  });

  it('should handle price-asc sort option', () => {
    const mockSearchParams = new URLSearchParams('sort=price-asc');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useProductSort());

    expect(result.current.selectedSort).toBe('price-asc');
  });

  it('should handle price-desc sort option', () => {
    const mockSearchParams = new URLSearchParams('sort=price-desc');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useProductSort());

    expect(result.current.selectedSort).toBe('price-desc');
  });

  describe('setSort', () => {
    it('should set sort param and reset page to 1', () => {
      const mockSearchParams = new URLSearchParams('page=3&category=test');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useProductSort());

      act(() => {
        result.current.setSort('price-asc');
      });

      expect(mockPush).toHaveBeenCalled();
      const url = mockPush.mock.calls[0][0];
      const urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('sort')).toBe('price-asc');
      expect(urlParams.get('page')).toBe('1');
      expect(urlParams.get('category')).toBe('test');
    });

    it('should remove sort param when setting to default', () => {
      const mockSearchParams = new URLSearchParams('sort=price-asc&page=2&category=test');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useProductSort());

      act(() => {
        result.current.setSort('default');
      });

      const url = mockPush.mock.calls[0][0];
      const urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('sort')).toBeNull();
      expect(urlParams.get('page')).toBe('1');
      expect(urlParams.get('category')).toBe('test');
    });

    it('should preserve other search params when changing sort', () => {
      const mockSearchParams = new URLSearchParams('page=2&category=cat-123&search=query');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useProductSort());

      act(() => {
        result.current.setSort('name-desc');
      });

      const url = mockPush.mock.calls[0][0];
      const urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('sort')).toBe('name-desc');
      expect(urlParams.get('page')).toBe('1');
      expect(urlParams.get('category')).toBe('cat-123');
      expect(urlParams.get('search')).toBe('query');
    });

    it('should reset page to 1 when changing sort', () => {
      const mockSearchParams = new URLSearchParams('page=5&sort=price-asc');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useProductSort());

      act(() => {
        result.current.setSort('price-desc');
      });

      const url = mockPush.mock.calls[0][0];
      const urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('page')).toBe('1');
      expect(urlParams.get('sort')).toBe('price-desc');
    });

    it('should not call router.push when searchParams is null', () => {
      (useSearchParams as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useProductSort());

      act(() => {
        result.current.setSort('price-asc');
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should handle setting sort when no params exist', () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useProductSort());

      act(() => {
        result.current.setSort('name-asc');
      });

      expect(mockPush).toHaveBeenCalled();
      const url = mockPush.mock.calls[0][0];
      const urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('sort')).toBe('name-asc');
      expect(urlParams.get('page')).toBe('1');
    });

    it('should handle multiple sort changes', () => {
      const mockSearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

      const { result } = renderHook(() => useProductSort());

      act(() => {
        result.current.setSort('price-asc');
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      let url = mockPush.mock.calls[0][0];
      let urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('sort')).toBe('price-asc');

      act(() => {
        result.current.setSort('price-desc');
      });

      expect(mockPush).toHaveBeenCalledTimes(2);
      url = mockPush.mock.calls[1][0];
      urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('sort')).toBe('price-desc');
    });

    it('should update selectedSort when search params change', () => {
      const mockSearchParams1 = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams1);

      const { result, rerender } = renderHook(() => useProductSort());

      expect(result.current.selectedSort).toBe('default');

      const mockSearchParams2 = new URLSearchParams('sort=price-asc');
      (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams2);

      rerender();

      expect(result.current.selectedSort).toBe('price-asc');
    });

    it('should handle all sort options', () => {
      const sortOptions = ['name-asc', 'name-desc', 'price-asc', 'price-desc', 'default'] as const;

      sortOptions.forEach((sortOption) => {
        const mockSearchParams = new URLSearchParams();
        (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

        const { result } = renderHook(() => useProductSort());

        act(() => {
          result.current.setSort(sortOption);
        });

        expect(mockPush).toHaveBeenCalled();
        const url = mockPush.mock.calls[mockPush.mock.calls.length - 1][0];
        const urlParams = new URLSearchParams(url.split('?')[1]);

        if (sortOption === 'default') {
          expect(urlParams.get('sort')).toBeNull();
        } else {
          expect(urlParams.get('sort')).toBe(sortOption);
        }
        expect(urlParams.get('page')).toBe('1');
      });
    });
  });
});
