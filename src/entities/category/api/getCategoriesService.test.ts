import GetCategoriesService from './getCategoriesService';
import type { Category } from '../model/types';

// Мокаем global fetch
global.fetch = jest.fn();

describe('GetCategoriesService', () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;
  let service: GetCategoriesService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'https://api.ekapak.ru';
    service = new GetCategoriesService();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  describe('getCategories', () => {
    const mockCategories: Category[] = [
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

    it('should fetch categories when API returns array directly', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const result = await service.getCategories();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/categories',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockCategories);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch categories when API returns object with data property', async () => {
      const responseWithData = { data: mockCategories };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithData,
      });

      const result = await service.getCategories();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCategories);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch categories when API returns object with items property', async () => {
      const responseWithItems = { items: mockCategories };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithItems,
      });

      const result = await service.getCategories();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCategories);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when API returns invalid format', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      });

      const result = await service.getCategories();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when API returns null', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      const result = await service.getCategories();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle categories with nested children', async () => {
      const categoriesWithChildren: Category[] = [
        {
          uuid: 'parent-1',
          name: 'Parent Category',
          slug: 'parent-category',
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

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => categoriesWithChildren,
      });

      const result = await service.getCategories();

      expect(result).toEqual(categoriesWithChildren);
      expect(result[0].children).toBeDefined();
      expect(result[0].children).toHaveLength(1);
    });

    it('should handle categories with parents', async () => {
      const categoriesWithParents: Category[] = [
        {
          uuid: 'child-1',
          name: 'Child Category',
          slug: 'child-category',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          parents: [
            {
              uuid: 'parent-1',
              name: 'Parent Category',
              slug: 'parent-category',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-02T00:00:00Z',
            },
          ],
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => categoriesWithParents,
      });

      const result = await service.getCategories();

      expect(result).toEqual(categoriesWithParents);
      expect(result[0].parents).toBeDefined();
      expect(result[0].parents).toHaveLength(1);
    });

    it('should handle empty categories array', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await service.getCategories();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(service.getCategories()).rejects.toThrow(
        '[GetCategoriesService] GET https://api.ekapak.ru/api/categories: 404 Not Found'
      );
    });

    it('should handle object with data property that is not an array', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'not an array' }),
      });

      const result = await service.getCategories();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle object with items property that is not an array', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: 'not an array' }),
      });

      const result = await service.getCategories();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
