import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useProductBySlug } from './useProductBySlug';
import GetProductBySlugService from './getProductBySlugService';
import type { Product } from '../model/types';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';

// Мокаем зависимости
jest.mock('@/shared/lib/di/container', () => ({
  resolveOr: jest.fn((token, fallbackFactory) => fallbackFactory()),
  createToken: jest.fn((name: string) => Symbol(name)),
}));

jest.mock('@/entities/product/model/dto/mappers', () => ({
  mapProductApiToUi: jest.fn((apiDto: Product) => ({
    uuid: apiDto.uuid,
    name: apiDto.name,
    slug: apiDto.slug,
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

// Мокаем GetProductBySlugService
jest.mock('./getProductBySlugService');

describe('useProductBySlug', () => {
  let queryClient: QueryClient;
  let mockGetProductBySlugService: jest.Mocked<GetProductBySlugService>;

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
    mockGetProductBySlugService = {
      getProductBySlug: jest.fn(),
    } as unknown as jest.Mocked<GetProductBySlugService>;

    (GetProductBySlugService as unknown as jest.Mock).mockImplementation(() => mockGetProductBySlugService);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it('should fetch product by slug', async () => {
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

    mockGetProductBySlugService.getProductBySlug.mockResolvedValueOnce(mockProduct);

    const { result } = renderHook(() => useProductBySlug('test-product'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetProductBySlugService.getProductBySlug).toHaveBeenCalledWith('test-product');
    expect(result.current.data).toBeDefined();
    expect(mapProductApiToUi).toHaveBeenCalledWith(mockProduct);
  });

  it('should handle product with data wrapper', async () => {
    const mockProduct: Product = {
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

    const mockResponse = { data: mockProduct };
    mockGetProductBySlugService.getProductBySlug.mockResolvedValueOnce(mockResponse as unknown as Product);

    const { result } = renderHook(() => useProductBySlug('test-product-2'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetProductBySlugService.getProductBySlug).toHaveBeenCalledWith('test-product-2');
    expect(mapProductApiToUi).toHaveBeenCalledWith(mockProduct);
  });

  it('should handle error when service fails', async () => {
    const error = new Error('Failed to fetch product');
    mockGetProductBySlugService.getProductBySlug.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useProductBySlug('test-product'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should use correct query key', async () => {
    const mockProduct: Product = {
      uuid: 'product-3',
      name: 'Test Product 3',
      slug: 'test-product-3',
      offers: [],
    };

    mockGetProductBySlugService.getProductBySlug.mockResolvedValueOnce(mockProduct);

    const { result } = renderHook(() => useProductBySlug('test-product-3'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем, что данные кэшированы с правильным ключом
    const cachedData = queryClient.getQueryData(['product', 'slug', 'test-product-3']);
    expect(cachedData).toBeDefined();
  });

  it('should be disabled when slug is empty', () => {
    const { result } = renderHook(() => useProductBySlug(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockGetProductBySlugService.getProductBySlug).not.toHaveBeenCalled();
  });

  it('should map product using mapProductApiToUi', async () => {
    const mockProduct: Product = {
      uuid: 'product-4',
      name: 'Test Product 4',
      slug: 'test-product-4',
      article: 'ART-456',
      description: 'Test description',
      images: [
        {
          original_url: 'https://example.com/image.jpg',
          card_url: 'https://example.com/image-card.jpg',
        },
      ],
      offers: [
        {
          uuid: 'offer-4',
          price: '300.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 25,
        },
      ],
    };

    mockGetProductBySlugService.getProductBySlug.mockResolvedValueOnce(mockProduct);

    const { result } = renderHook(() => useProductBySlug('test-product-4'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mapProductApiToUi).toHaveBeenCalledWith(mockProduct);
  });
});
