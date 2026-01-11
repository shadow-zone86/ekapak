import GetProductsService, { type GetProductsRequest } from './getProductsService';
import type { IGetProductsResponseDto } from '../model/dto/types';

// Мокаем global fetch
global.fetch = jest.fn();

describe('GetProductsService', () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;
  let service: GetProductsService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'https://api.ekapak.ru';
    service = new GetProductsService();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  describe('getProducts', () => {
    const mockResponse: IGetProductsResponseDto = {
      data: [
        {
          uuid: 'product-1',
          name: 'Test Product',
          slug: 'test-product',
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

    it('should fetch products with default parameters', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.getProducts({});

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/products',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch products with page and per_page parameters', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request: GetProductsRequest = {
        page: 2,
        per_page: 50,
      };

      const result = await service.getProducts(request);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/products/?page=2&per_page=50',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch products with category parameter', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request: GetProductsRequest = {
        page: 1,
        per_page: 20,
        category: 'category-uuid-123',
      };

      const result = await service.getProducts(request);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/products/?page=1&per_page=20&category=category-uuid-123',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should exclude undefined and null parameters from query string', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request: GetProductsRequest = {
        page: 1,
        per_page: undefined,
        category: null as unknown as string,
      };

      const result = await service.getProducts(request);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/products/?page=1',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(service.getProducts({})).rejects.toThrow(
        '[GetProductsService] GET https://api.ekapak.ru/api/products: 404 Not Found'
      );
    });

    it('should handle empty response data', async () => {
      const emptyResponse: IGetProductsResponseDto = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          per_page: 20,
          last_page: 1,
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      });

      const result = await service.getProducts({});

      expect(result).toEqual(emptyResponse);
      expect(result.data).toHaveLength(0);
    });
  });
});
