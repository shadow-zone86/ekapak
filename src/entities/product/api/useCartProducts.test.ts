import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useCartProducts } from './useCartProducts';
import GetProductByUuidService from './getProductByUuidService';
import { useAppSelector } from '@/shared/config/store-hooks';
import type { Product } from '../model/types';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';
import type { CartItem } from '@/entities/cart/model/types';
import { getCurrencySymbol } from '@/shared/lib/currency';

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

describe('useCartProducts', () => {
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

  it('should return empty products when cart is empty', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: {
          items: [],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useCartProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.productsMap.size).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.errors).toEqual([]);
  });

  it('should fetch products for cart items with unique UUIDs', async () => {
    const mockCartItems: CartItem[] = [
      {
        id: 'cart-item-1',
        productUuid: 'product-1',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        quantity: 2,
        price: 100,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product 1',
        productImage: 'image1.jpg',
        article: 'ART-1',
      },
      {
        id: 'cart-item-2',
        productUuid: 'product-1', // Дубликат UUID
        offerUuid: 'offer-2',
        offerName: 'Offer 2',
        quantity: 3,
        price: 150,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product 1',
        productImage: 'image1.jpg',
        article: 'ART-1',
      },
      {
        id: 'cart-item-3',
        productUuid: 'product-2',
        offerUuid: 'offer-3',
        offerName: 'Offer 3',
        quantity: 1,
        price: 200,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product 2',
        productImage: 'image2.jpg',
        article: 'ART-2',
      },
    ];

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
          uuid: 'offer-3',
          price: '200.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 50,
        },
      ],
    };

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: {
          items: mockCartItems,
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid
      .mockResolvedValueOnce({ data: mockProduct1 } as unknown as Product)
      .mockResolvedValueOnce({ data: mockProduct2 } as unknown as Product);

    const { result } = renderHook(() => useCartProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Должно быть только 2 запроса (уникальные UUIDs)
    expect(mockGetProductByUuidService.getProductByUuid).toHaveBeenCalledTimes(2);
    expect(mockGetProductByUuidService.getProductByUuid).toHaveBeenCalledWith('product-1');
    expect(mockGetProductByUuidService.getProductByUuid).toHaveBeenCalledWith('product-2');
    expect(result.current.products).toHaveLength(2);
    expect(result.current.productsMap.size).toBe(2);
    expect(result.current.productsMap.has('product-1')).toBe(true);
    expect(result.current.productsMap.has('product-2')).toBe(true);
  });

  it('should create productsMap correctly', async () => {
    const mockCartItems: CartItem[] = [
      {
        id: 'cart-item-1',
        productUuid: 'product-1',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        quantity: 1,
        price: 100,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product 1',
        productImage: 'image1.jpg',
        article: 'ART-1',
      },
    ];

    const mockProduct: Product = {
      uuid: 'product-1',
      name: 'Test Product 1',
      slug: 'test-product-1',
      offers: [],
    };

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: {
          items: mockCartItems,
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid.mockResolvedValueOnce({ data: mockProduct } as unknown as Product);

    const { result } = renderHook(() => useCartProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.productsMap.size).toBe(1);
    expect(result.current.productsMap.get('product-1')).toBeDefined();
    expect(result.current.productsMap.get('product-1')?.uuid).toBe('product-1');
  });

  it('should handle error when fetching products', async () => {
    const error = new Error('Failed to fetch product');

    const mockCartItems: CartItem[] = [
      {
        id: 'cart-item-1',
        productUuid: 'product-1',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        quantity: 1,
        price: 100,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product',
        productImage: 'image.jpg',
        article: 'ART-1',
      },
    ];

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: {
          items: mockCartItems,
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCartProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.productsMap.size).toBe(0);
    expect(result.current.errors).toHaveLength(1);
  });

  it('should filter out undefined products', async () => {
    const mockCartItems: CartItem[] = [
      {
        id: 'cart-item-1',
        productUuid: 'product-1',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        quantity: 1,
        price: 100,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product',
        productImage: 'image.jpg',
        article: 'ART-1',
      },
      {
        id: 'cart-item-2',
        productUuid: 'product-2',
        offerUuid: 'offer-2',
        offerName: 'Offer 2',
        quantity: 1,
        price: 200,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product 2',
        productImage: 'image2.jpg',
        article: 'ART-2',
      },
    ];

    const mockProduct: Product = {
      uuid: 'product-1',
      name: 'Test Product',
      slug: 'test-product',
      offers: [],
    };

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: {
          items: mockCartItems,
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid
      .mockResolvedValueOnce({ data: mockProduct } as unknown as Product)
      .mockResolvedValueOnce({ data: null } as unknown as Product);

    const { result } = renderHook(() => useCartProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].uuid).toBe('product-1');
    expect(result.current.productsMap.size).toBe(1);
  });

  it('should handle mixed success and error queries', async () => {
    const mockCartItems: CartItem[] = [
      {
        id: 'cart-item-1',
        productUuid: 'product-1',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        quantity: 1,
        price: 100,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product',
        productImage: 'image.jpg',
        article: 'ART-1',
      },
      {
        id: 'cart-item-2',
        productUuid: 'product-2',
        offerUuid: 'offer-2',
        offerName: 'Offer 2',
        quantity: 1,
        price: 200,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product 2',
        productImage: 'image2.jpg',
        article: 'ART-2',
      },
    ];

    const mockProduct: Product = {
      uuid: 'product-1',
      name: 'Test Product',
      slug: 'test-product',
      offers: [],
    };

    const error = new Error('Failed to fetch product-2');

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        cart: {
          items: mockCartItems,
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid
      .mockResolvedValueOnce({ data: mockProduct } as unknown as Product)
      .mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCartProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.products).toHaveLength(1);
    expect(result.current.productsMap.size).toBe(1);
    expect(result.current.errors).toHaveLength(1);
  });

  it('should map products using mapProductApiToUi', async () => {
    const mockCartItems: CartItem[] = [
      {
        id: 'cart-item-1',
        productUuid: 'product-1',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        quantity: 1,
        price: 100,
        currency: 'RUB',
        currencySymbol: getCurrencySymbol('RUB'),
        unit: 'шт.',
        productName: 'Test Product',
        productImage: 'image.jpg',
        article: 'ART-1',
      },
    ];

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
        cart: {
          items: mockCartItems,
        },
      };
      return selector(state);
    });

    mockGetProductByUuidService.getProductByUuid.mockResolvedValueOnce({ data: mockProduct } as unknown as Product);

    const { result } = renderHook(() => useCartProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mapProductApiToUi).toHaveBeenCalledWith(mockProduct);
  });
});
