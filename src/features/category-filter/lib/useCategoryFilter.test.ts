import { renderHook, act } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCategoryFilter } from './useCategoryFilter';

// Мокаем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('useCategoryFilter', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  it('should return undefined selectedCategory when no category in search params', () => {
    const mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useCategoryFilter());

    expect(result.current.selectedCategory).toBeUndefined();
  });

  it('should return category from search params', () => {
    const mockSearchParams = new URLSearchParams('category=cat-123');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useCategoryFilter());

    expect(result.current.selectedCategory).toBe('cat-123');
  });

  it('should handle selectCategory by pushing new URL', () => {
    const mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useCategoryFilter());

    act(() => {
      result.current.selectCategory('new-category-uuid');
    });

    expect(mockPush).toHaveBeenCalled();
    const url = mockPush.mock.calls[0][0];
    const urlParams = new URLSearchParams(url.split('?')[1]);
    expect(urlParams.get('page')).toBe('1');
    expect(urlParams.get('category')).toBe('new-category-uuid');
  });

  it('should preserve other search params when changing category and reset page to 1', () => {
    const mockSearchParams = new URLSearchParams('page=2&sort=price');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useCategoryFilter());

    act(() => {
      result.current.selectCategory('cat-456');
    });

    // Проверяем, что был вызван push
    expect(mockPush).toHaveBeenCalled();
    const url = mockPush.mock.calls[0][0];
    const urlParams = new URLSearchParams(url.split('?')[1]);
    expect(urlParams.get('page')).toBe('1'); // Страница сбрасывается на 1
    expect(urlParams.get('sort')).toBe('price');
    expect(urlParams.get('category')).toBe('cat-456');
  });

  it('should remove category param when undefined is passed', () => {
    const mockSearchParams = new URLSearchParams('category=cat-123&page=2');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useCategoryFilter());

    act(() => {
      result.current.selectCategory(undefined);
    });

    const url = mockPush.mock.calls[0][0];
    const urlParams = new URLSearchParams(url.split('?')[1]);
    expect(urlParams.get('category')).toBeNull();
    expect(urlParams.get('page')).toBe('1'); // Страница сбрасывается на 1
  });

  it('should handle category change when no other params exist', () => {
    const mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useCategoryFilter());

    act(() => {
      result.current.selectCategory('cat-789');
    });

    expect(mockPush).toHaveBeenCalled();
    const url = mockPush.mock.calls[0][0];
    const urlParams = new URLSearchParams(url.split('?')[1]);
    expect(urlParams.get('page')).toBe('1');
    expect(urlParams.get('category')).toBe('cat-789');
  });

  it('should update selectedCategory when search params change', () => {
    const mockSearchParams1 = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams1);

    const { result, rerender } = renderHook(() => useCategoryFilter());

    expect(result.current.selectedCategory).toBeUndefined();

    const mockSearchParams2 = new URLSearchParams('category=cat-updated');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams2);

    rerender();

    expect(result.current.selectedCategory).toBe('cat-updated');
  });

  it('should handle multiple category changes', () => {
    const mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useCategoryFilter());

    act(() => {
      result.current.selectCategory('cat-1');
    });

    expect(mockPush).toHaveBeenCalled();
    const url1 = mockPush.mock.calls[0][0];
    const urlParams1 = new URLSearchParams(url1.split('?')[1]);
    expect(urlParams1.get('page')).toBe('1');
    expect(urlParams1.get('category')).toBe('cat-1');

    act(() => {
      result.current.selectCategory('cat-2');
    });

    expect(mockPush).toHaveBeenCalledTimes(2);
    const url2 = mockPush.mock.calls[1][0];
    const urlParams2 = new URLSearchParams(url2.split('?')[1]);
    expect(urlParams2.get('page')).toBe('1');
    expect(urlParams2.get('category')).toBe('cat-2');
  });

  it('should handle category with special characters in uuid', () => {
    const mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { result } = renderHook(() => useCategoryFilter());

    act(() => {
      result.current.selectCategory('cat-123-abc-def');
    });

    expect(mockPush).toHaveBeenCalled();
    const url = mockPush.mock.calls[0][0];
    const urlParams = new URLSearchParams(url.split('?')[1]);
    expect(urlParams.get('page')).toBe('1');
    expect(urlParams.get('category')).toBe('cat-123-abc-def');
  });

  it('should not call router.push when searchParams is null', () => {
    (useSearchParams as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useCategoryFilter());

    act(() => {
      result.current.selectCategory('cat-123');
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
