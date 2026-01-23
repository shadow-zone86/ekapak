import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useFavoriteProducts } from './useFavoriteProducts';
import GetProductByUuidService from './getProductByUuidService';
import { useAppSelector } from '@/shared/config/store-hooks';
import type { Product } from '../model/types';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';

// Мокаем зависимости
jest.mock('@/shared/config/store-hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('@/shared/lib/di/container', () => ({
  resolveOr: jest.fn((token, fallbackFactory) => fallbackFactory()),
  createToken: jest.fn((name: string) => Symbol(name)),
}));

jest.mock('@/entities/product/model/dto/mappers', () => ({
  mapProductApiToUi: jest.fn((apiDto: Product) => ({
    uuid: apiDto.uuid,
    name: apiDto.name,
    slug: apiDto.slug || `${apiDto.uuid}-slug`,
    sku: apiDto.article || '',
    description: apiDto.description ?? undefined,
    image: apiDto.images?.[0]?.card_url || apiDto.images?.[0]?.original_url,
    defaultOffer: apiDto.offers[0]
      ? {
          uuid: apiDto.offers[0].uuid,
          price: parseFloat(apiDto.offers[0].price) || 0,
          currency: apiDto.offers[0].currency,
          unit: apiDto.offers[0].unit,
        }
      : undefined,
    offers: apiDto.offers.map((offer) => ({
      uuid: offer.uuid,
      price: parseFloat(offer.price) || 0,
      currency: offer.currency,
      unit: offer.unit,
    })),
    hasMultipleOffers: apiDto.offers.length > 1,
    isInStock: true,
  })),
}));

// Мокаем GetProductByUuidService
jest.mock('./getProductByUuidService');

describe('useFavoriteProducts', () => {
  let queryClient: QueryClient;
  let mockGetProductByUuidService: jest.Mocked<GetProductByUuidService>;

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
    mockGetProductByUuidService = {
      getProductByUuid: jest.fn(),
    } as unknown as jest.Mocked<GetProductByUuidService>;

    (GetProductByUuidService as unknown as jest.Mock).mockImplementation(() => mockGetProductByUuidService);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it('should return empty products when favorites list is empty', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: [],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useFavoriteProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.errors).toEqual([]);
  });

  it('should fetch products for favorite UUIDs', async () => {
    const mockProduct1: Product = {
      uuid: 'product-1',
      name: 'Test Product 1',
      slug: 'test-product-1',
      offers: [
        {
          uuid: 'offer-1',
          price: '100.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 100,
        },
      ],
    };

    const mockProduct2: Product = {
      uuid: 'product-2',
      name: 'Test Product 2',
      slug: 'test-product-2',
      offers: [
        {
          uuid: 'offer-2',
          price: '200.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 50,
        },
      ],
    };

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-1', 'product-2'],
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid
      .mockResolvedValueOnce({ data: mockProduct1 } as unknown as Product)
      .mockResolvedValueOnce({ data: mockProduct2 } as unknown as Product);

    const { result } = renderHook(() => useFavoriteProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetProductByUuidService.getProductByUuid).toHaveBeenCalledTimes(2);
    expect(mockGetProductByUuidService.getProductByUuid).toHaveBeenCalledWith('product-1');
    expect(mockGetProductByUuidService.getProductByUuid).toHaveBeenCalledWith('product-2');
    expect(result.current.products).toHaveLength(2);
  });

  it('should handle error when fetching products', async () => {
    const error = new Error('Failed to fetch product');

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-1'],
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useFavoriteProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.errors).toHaveLength(1);
  });

  it('should filter out undefined products', async () => {
    const mockProduct: Product = {
      uuid: 'product-1',
      name: 'Test Product',
      slug: 'test-product',
      offers: [],
    };

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-1', 'product-2'],
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid
      .mockResolvedValueOnce({ data: mockProduct } as unknown as Product)
      .mockResolvedValueOnce({ data: null } as unknown as Product);

    const { result } = renderHook(() => useFavoriteProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Только один продукт должен быть в результате
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].uuid).toBe('product-1');
  });

  it('should handle mixed success and error queries', async () => {
    const mockProduct: Product = {
      uuid: 'product-1',
      name: 'Test Product',
      slug: 'test-product',
      offers: [],
    };

    const error = new Error('Failed to fetch product-2');

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-1', 'product-2'],
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid
      .mockResolvedValueOnce({ data: mockProduct } as unknown as Product)
      .mockRejectedValueOnce(error);

    const { result } = renderHook(() => useFavoriteProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.products).toHaveLength(1);
    expect(result.current.errors).toHaveLength(1);
  });

  it('should use correct query keys for each product', async () => {
    const mockProduct: Product = {
      uuid: 'product-1',
      name: 'Test Product',
      slug: 'test-product',
      offers: [],
    };

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-1'],
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid.mockResolvedValueOnce({ data: mockProduct } as unknown as Product);

    const { result } = renderHook(() => useFavoriteProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем, что данные кэшированы с правильным ключом
    const cachedData = queryClient.getQueryData(['product', 'product-1']);
    expect(cachedData).toBeDefined();
  });

  it('should map products using mapProductApiToUi', async () => {
    const mockProduct: Product = {
      uuid: 'product-1',
      name: 'Test Product',
      slug: 'test-product',
      article: 'ART-123',
      offers: [
        {
          uuid: 'offer-1',
          price: '100.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 100,
        },
      ],
    };

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-1'],
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid.mockResolvedValueOnce({ data: mockProduct } as unknown as Product);

    const { result } = renderHook(() => useFavoriteProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mapProductApiToUi).toHaveBeenCalledWith(mockProduct);
  });
});
