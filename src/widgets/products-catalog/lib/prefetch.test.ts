import { QueryClient } from '@tanstack/react-query';
import { prefetchProducts, prefetchCategories, prefetchProductsCatalogData } from './prefetch';
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from '@/entities/product/api/tokens';
import { CATEGORY_TOKENS } from '@/entities/category/api/tokens';
import GetProductsService from '@/entities/product/api/getProductsService';
import GetCategoriesService from '@/entities/category/api/getCategoriesService';
import { mapProductApiToUi } from '@/entities/product/model/dto/mappers';
import { mapCategoryApiToUi } from '@/entities/category/model/dto/mappers';

// Мокаем зависимости
jest.mock('@/shared/lib/di/container', () => ({
  resolveOr: jest.fn(),
  createToken: jest.fn((name: string) => Symbol(name)),
}));

jest.mock('@/entities/product/api/getProductsService');
jest.mock('@/entities/category/api/getCategoriesService');
jest.mock('@/entities/product/model/dto/mappers', () => ({
  mapProductApiToUi: jest.fn((product) => ({
    ...product,
    mapped: true,
  })),
}));
jest.mock('@/entities/category/model/dto/mappers', () => ({
  mapCategoryApiToUi: jest.fn((category) => ({
    ...category,
    mapped: true,
  })),
}));

describe('prefetch', () => {
  let queryClient: QueryClient;
  let mockGetProductsService: jest.Mocked<GetProductsService>;
  let mockGetCategoriesService: jest.Mocked<GetCategoriesService>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    mockGetProductsService = {
      getProducts: jest.fn(),
    } as unknown as jest.Mocked<GetProductsService>;

    mockGetCategoriesService = {
      getCategories: jest.fn(),
    } as unknown as jest.Mocked<GetCategoriesService>;

    (resolveOr as jest.Mock).mockImplementation((token, fallback) => {
      if (token === PRODUCT_TOKENS.GetProductsService) {
        return mockGetProductsService;
      }
      if (token === CATEGORY_TOKENS.GetCategoriesService) {
        return mockGetCategoriesService;
      }
      return fallback();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('prefetchProducts', () => {
    it('should prefetch products with default parameters', async () => {
      const mockResponse = {
        data: [
          {
            uuid: '1',
            name: 'Product 1',
            slug: 'product-1',
            offers: [],
          },
        ],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 1,
        },
      };

      mockGetProductsService.getProducts = jest.fn().mockResolvedValue(mockResponse);

      await prefetchProducts(queryClient);

      expect(mockGetProductsService.getProducts).toHaveBeenCalledWith({
        page: 1,
        per_page: 20,
        category: undefined,
      });
      expect(mapProductApiToUi).toHaveBeenCalledTimes(1);
    });

    it('should prefetch products with custom parameters', async () => {
      const mockResponse = {
        data: [
          {
            uuid: '1',
            name: 'Product 1',
            slug: 'product-1',
            offers: [],
          },
        ],
        meta: {
          current_page: 2,
          last_page: 5,
          per_page: 10,
          total: 50,
        },
      };

      mockGetProductsService.getProducts = jest.fn().mockResolvedValue(mockResponse);

      await prefetchProducts(queryClient, 2, 10, 'category-uuid-123');

      expect(mockGetProductsService.getProducts).toHaveBeenCalledWith({
        page: 2,
        per_page: 10,
        category: 'category-uuid-123',
      });
      expect(mapProductApiToUi).toHaveBeenCalledTimes(1);
    });

    it('should map products using mapProductApiToUi', async () => {
      const mockProducts = [
        {
          uuid: '1',
          name: 'Product 1',
          slug: 'product-1',
          offers: [],
        },
        {
          uuid: '2',
          name: 'Product 2',
          slug: 'product-2',
          offers: [],
        },
      ];

      const mockResponse = {
        data: mockProducts,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 2,
        },
      };

      mockGetProductsService.getProducts = jest.fn().mockResolvedValue(mockResponse);

      await prefetchProducts(queryClient);

      expect(mapProductApiToUi).toHaveBeenCalledTimes(2);
      expect(mapProductApiToUi).toHaveBeenCalledWith(mockProducts[0], expect.anything(), expect.anything());
      expect(mapProductApiToUi).toHaveBeenCalledWith(mockProducts[1], expect.anything(), expect.anything());
    });

    it('should cache prefetched products in queryClient', async () => {
      const mockResponse = {
        data: [
          {
            uuid: '1',
            name: 'Product 1',
            slug: 'product-1',
            offers: [],
          },
        ],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 1,
        },
      };

      mockGetProductsService.getProducts = jest.fn().mockResolvedValue(mockResponse);

      await prefetchProducts(queryClient, 1, 20, 'category-123');

      const cachedData = queryClient.getQueryData(['products', 1, 20, 'category-123']);
      expect(cachedData).toBeDefined();
      expect(cachedData).toHaveProperty('data');
      expect(cachedData).toHaveProperty('meta');
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Failed to fetch products');
      mockGetProductsService.getProducts = jest.fn().mockRejectedValue(error);

      // prefetchQuery не пробрасывает ошибки, но мы можем проверить, что сервис был вызван
      await prefetchProducts(queryClient).catch(() => {
        // Ошибка обрабатывается внутри React Query
      });

      expect(mockGetProductsService.getProducts).toHaveBeenCalled();
    });
  });

  describe('prefetchCategories', () => {
    it('should prefetch categories', async () => {
      const mockCategories = [
        {
          uuid: '1',
          name: 'Category 1',
          slug: 'category-1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        {
          uuid: '2',
          name: 'Category 2',
          slug: 'category-2',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      mockGetCategoriesService.getCategories = jest.fn().mockResolvedValue(mockCategories);

      await prefetchCategories(queryClient);

      expect(mockGetCategoriesService.getCategories).toHaveBeenCalledTimes(1);
      expect(mapCategoryApiToUi).toHaveBeenCalledTimes(2);
    });

    it('should map categories using mapCategoryApiToUi', async () => {
      const mockCategories = [
        {
          uuid: '1',
          name: 'Category 1',
          slug: 'category-1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      mockGetCategoriesService.getCategories = jest.fn().mockResolvedValue(mockCategories);

      await prefetchCategories(queryClient);

      expect(mapCategoryApiToUi).toHaveBeenCalledWith(mockCategories[0], expect.anything(), expect.anything());
    });

    it('should cache prefetched categories in queryClient', async () => {
      const mockCategories = [
        {
          uuid: '1',
          name: 'Category 1',
          slug: 'category-1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      mockGetCategoriesService.getCategories = jest.fn().mockResolvedValue(mockCategories);

      await prefetchCategories(queryClient);

      const cachedData = queryClient.getQueryData(['categories']);
      expect(cachedData).toBeDefined();
      expect(Array.isArray(cachedData)).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Failed to fetch categories');
      mockGetCategoriesService.getCategories = jest.fn().mockRejectedValue(error);

      // prefetchQuery не пробрасывает ошибки, но мы можем проверить, что сервис был вызван
      await prefetchCategories(queryClient).catch(() => {
        // Ошибка обрабатывается внутри React Query
      });

      expect(mockGetCategoriesService.getCategories).toHaveBeenCalled();
    });
  });

  describe('prefetchProductsCatalogData', () => {
    it('should prefetch both products and categories', async () => {
      const mockProductsResponse = {
        data: [
          {
            uuid: '1',
            name: 'Product 1',
            slug: 'product-1',
            offers: [],
          },
        ],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 1,
        },
      };

      const mockCategories = [
        {
          uuid: '1',
          name: 'Category 1',
          slug: 'category-1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      mockGetProductsService.getProducts = jest.fn().mockResolvedValue(mockProductsResponse);
      mockGetCategoriesService.getCategories = jest.fn().mockResolvedValue(mockCategories);

      await prefetchProductsCatalogData(queryClient);

      expect(mockGetProductsService.getProducts).toHaveBeenCalledTimes(1);
      expect(mockGetCategoriesService.getCategories).toHaveBeenCalledTimes(1);
    });

    it('should prefetch with custom parameters', async () => {
      const mockProductsResponse = {
        data: [],
        meta: {
          current_page: 2,
          last_page: 5,
          per_page: 10,
          total: 50,
        },
      };

      const mockCategories = [];

      mockGetProductsService.getProducts = jest.fn().mockResolvedValue(mockProductsResponse);
      mockGetCategoriesService.getCategories = jest.fn().mockResolvedValue(mockCategories);

      await prefetchProductsCatalogData(queryClient, 2, 10, 'category-uuid-123');

      expect(mockGetProductsService.getProducts).toHaveBeenCalledWith({
        page: 2,
        per_page: 10,
        category: 'category-uuid-123',
      });
    });

    it('should handle errors from products prefetch', async () => {
      const error = new Error('Failed to fetch products');
      mockGetProductsService.getProducts = jest.fn().mockRejectedValue(error);
      mockGetCategoriesService.getCategories = jest.fn().mockResolvedValue([]);

      // prefetchQuery не пробрасывает ошибки, но мы можем проверить, что оба сервиса были вызваны
      await prefetchProductsCatalogData(queryClient).catch(() => {
        // Ошибка обрабатывается внутри React Query
      });

      expect(mockGetProductsService.getProducts).toHaveBeenCalled();
      expect(mockGetCategoriesService.getCategories).toHaveBeenCalled();
    });

    it('should handle errors from categories prefetch', async () => {
      const mockProductsResponse = {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
        },
      };

      const error = new Error('Failed to fetch categories');
      mockGetProductsService.getProducts = jest.fn().mockResolvedValue(mockProductsResponse);
      mockGetCategoriesService.getCategories = jest.fn().mockRejectedValue(error);

      // prefetchQuery не пробрасывает ошибки, но мы можем проверить, что оба сервиса были вызваны
      await prefetchProductsCatalogData(queryClient).catch(() => {
        // Ошибка обрабатывается внутри React Query
      });

      expect(mockGetProductsService.getProducts).toHaveBeenCalled();
      expect(mockGetCategoriesService.getCategories).toHaveBeenCalled();
    });

    it('should cache both products and categories', async () => {
      const mockProductsResponse = {
        data: [
          {
            uuid: '1',
            name: 'Product 1',
            slug: 'product-1',
            offers: [],
          },
        ],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 1,
        },
      };

      const mockCategories = [
        {
          uuid: '1',
          name: 'Category 1',
          slug: 'category-1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      mockGetProductsService.getProducts = jest.fn().mockResolvedValue(mockProductsResponse);
      mockGetCategoriesService.getCategories = jest.fn().mockResolvedValue(mockCategories);

      await prefetchProductsCatalogData(queryClient, 1, 20, 'category-123');

      const productsData = queryClient.getQueryData(['products', 1, 20, 'category-123']);
      const categoriesData = queryClient.getQueryData(['categories']);

      expect(productsData).toBeDefined();
      expect(categoriesData).toBeDefined();
    });
  });
});
