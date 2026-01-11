import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useCategories } from './useCategories';
import GetCategoriesService from './getCategoriesService';
import type { Category } from '../model/types';
import { mapCategoryApiToUi } from '../model/dto/mappers';

// Мокаем зависимости
jest.mock('@/shared/lib/di/container', () => ({
  resolveOr: jest.fn((token, fallbackFactory) => fallbackFactory()),
  createToken: jest.fn((name: string) => Symbol(name)),
}));

jest.mock('../model/dto/mappers', () => ({
  mapCategoryApiToUi: jest.fn((apiDto: Category) => ({
    uuid: apiDto.uuid,
    name: apiDto.name,
    slug: apiDto.slug,
    description: apiDto.description ?? undefined,
    children: apiDto.children?.map((child: Category) => ({
      uuid: child.uuid,
      name: child.name,
      slug: child.slug,
      description: child.description ?? undefined,
    })),
  })),
}));

// Мокаем GetCategoriesService
jest.mock('./getCategoriesService');

describe('useCategories', () => {
  let queryClient: QueryClient;
  let mockGetCategoriesService: jest.Mocked<GetCategoriesService>;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    const QueryWrapper = ({ children }: { children: ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    QueryWrapper.displayName = 'QueryWrapper';

    return QueryWrapper;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCategoriesService = {
      getCategories: jest.fn(),
    } as unknown as jest.Mocked<GetCategoriesService>;

    (GetCategoriesService as unknown as jest.Mock).mockImplementation(() => mockGetCategoriesService);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it('should fetch categories with default parameters', async () => {
    const mockResponse: Category[] = [
      {
        uuid: 'category-1',
        name: 'Test Category 1',
        slug: 'test-category-1',
        description: 'Description 1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
      {
        uuid: 'category-2',
        name: 'Test Category 2',
        slug: 'test-category-2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
    ];

    mockGetCategoriesService.getCategories.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetCategoriesService.getCategories).toHaveBeenCalledTimes(1);
    expect(mockGetCategoriesService.getCategories).toHaveBeenCalledWith();

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveLength(2);
  });

  it('should handle empty categories list', async () => {
    const mockResponse: Category[] = [];

    mockGetCategoriesService.getCategories.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(0);
  });

  it('should handle error when service fails', async () => {
    const error = new Error('Failed to fetch categories');
    mockGetCategoriesService.getCategories.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should use correct query key', async () => {
    const mockResponse: Category[] = [];

    mockGetCategoriesService.getCategories.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем, что данные кэшированы с правильным ключом
    const cachedData = queryClient.getQueryData(['categories']);
    expect(cachedData).toBeDefined();
  });

  it('should map categories using mapCategoryApiToUi', async () => {
    const mockResponse: Category[] = [
      {
        uuid: 'category-3',
        name: 'Test Category 3',
        slug: 'test-category-3',
        description: 'Description 3',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        children: [
          {
            uuid: 'child-1',
            name: 'Child Category',
            slug: 'child-category',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
      },
    ];

    mockGetCategoriesService.getCategories.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // mapCategoryApiToUi вызывается только для элементов массива (1 раз для parent)
    // children маппятся рекурсивно внутри маппера
    expect(mapCategoryApiToUi).toHaveBeenCalledTimes(1);
    expect(mapCategoryApiToUi).toHaveBeenCalledWith(
      mockResponse[0],
      expect.anything(),
      expect.anything()
    );
  });

  it('should handle categories with nested children', async () => {
    const mockResponse: Category[] = [
      {
        uuid: 'parent-1',
        name: 'Parent Category',
        slug: 'parent-category',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        children: [
          {
            uuid: 'child-1',
            name: 'Child Category 1',
            slug: 'child-category-1',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
          {
            uuid: 'child-2',
            name: 'Child Category 2',
            slug: 'child-category-2',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
      },
    ];

    mockGetCategoriesService.getCategories.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // mapCategoryApiToUi вызывается только для элементов массива (1 раз для parent)
    // children маппятся рекурсивно внутри маппера
    expect(mapCategoryApiToUi).toHaveBeenCalledTimes(1);
  });
});
