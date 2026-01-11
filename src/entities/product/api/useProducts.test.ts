import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useProducts } from './useProducts';
import GetProductsService from './getProductsService';
import type { IGetProductsResponseDto, IProductApiDto } from '../model/dto/types';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';

// Мокаем зависимости
jest.mock('@/shared/lib/di/container', () => ({
  resolveOr: jest.fn((token, fallbackFactory) => fallbackFactory()),
  createToken: jest.fn((name: string) => Symbol(name)),
}));

jest.mock('@/entities/product/model/dto/mappers', () => ({
  mapProductApiToUi: jest.fn((apiDto: IProductApiDto) => ({
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

// Мокаем GetProductsService
jest.mock('./getProductsService');

describe('useProducts', () => {
  let queryClient: QueryClient;
  let mockGetProductsService: jest.Mocked<GetProductsService>;

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
    mockGetProductsService = {
      getProducts: jest.fn(),
    } as unknown as jest.Mocked<GetProductsService>;

    (GetProductsService as unknown as jest.Mock).mockImplementation(() => mockGetProductsService);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it('should fetch products with default parameters', async () => {
    const mockResponse: IGetProductsResponseDto = {
      data: [
        {
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
        },
      ],
      meta: {
        total: 1,
        page: 1,
        per_page: 20,
        last_page: 1,
      },
    };

    mockGetProductsService.getProducts.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetProductsService.getProducts).toHaveBeenCalledWith({
      page: 1,
      per_page: 20,
      category: undefined,
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.meta).toEqual(mockResponse.meta);
  });

  it('should fetch products with custom parameters', async () => {
    const mockResponse: IGetProductsResponseDto = {
      data: [
        {
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
        },
      ],
      meta: {
        total: 1,
        page: 2,
        per_page: 50,
        last_page: 1,
      },
    };

    mockGetProductsService.getProducts.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useProducts(2, 50, 'category-uuid-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetProductsService.getProducts).toHaveBeenCalledWith({
      page: 2,
      per_page: 50,
      category: 'category-uuid-123',
    });

    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.meta?.page).toBe(2);
    expect(result.current.data?.meta?.per_page).toBe(50);
  });

  it('should handle empty products list', async () => {
    const mockResponse: IGetProductsResponseDto = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        per_page: 20,
        last_page: 1,
      },
    };

    mockGetProductsService.getProducts.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(0);
    expect(result.current.data?.meta?.total).toBe(0);
  });

  it('should handle error when service fails', async () => {
    const error = new Error('Failed to fetch products');
    mockGetProductsService.getProducts.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should use correct query key', async () => {
    const mockResponse: IGetProductsResponseDto = {
      data: [],
      meta: {},
    };

    mockGetProductsService.getProducts.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useProducts(3, 30, 'cat-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Проверяем, что данные кэшированы с правильным ключом
    const cachedData = queryClient.getQueryData(['products', 3, 30, 'cat-123']);
    expect(cachedData).toBeDefined();
  });

  it('should map products using mapProductApiToUi', async () => {

    const mockResponse: IGetProductsResponseDto = {
      data: [
        {
          uuid: 'product-3',
          name: 'Test Product 3',
          slug: 'test-product-3',
          article: 'ART-123',
          offers: [
            {
              uuid: 'offer-3',
              price: '300.00',
              currency: 'RUB',
              unit: 'шт.',
              quantity: 25,
            },
          ],
          images: [
            {
              original_url: 'https://example.com/image.jpg',
              card_url: 'https://example.com/image-card.jpg',
            },
          ],
        },
      ],
      meta: {},
    };

    mockGetProductsService.getProducts.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mapProductApiToUi).toHaveBeenCalledTimes(1);
    // map передает (element, index, array), но функция принимает только element
    expect(mapProductApiToUi).toHaveBeenCalledWith(
      mockResponse.data[0],
      expect.anything(),
      expect.anything()
    );
  });
});
