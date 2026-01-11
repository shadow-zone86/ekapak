import GetCategoryByUuidService from './getCategoryByUuidService';
import type { Category } from '../model/types';

// Мокаем global fetch
global.fetch = jest.fn();

describe('GetCategoryByUuidService', () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;
  let service: GetCategoryByUuidService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'https://api.ekapak.ru';
    service = new GetCategoryByUuidService();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  describe('getCategoryByUuid', () => {
    const mockCategory: Category = {
      uuid: 'category-123',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test Description',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    it('should fetch category by UUID', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategory,
      });

      const uuid = 'category-123';
      const result = await service.getCategoryByUuid(uuid);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/categories/category-123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockCategory);
    });

    it('should handle category with all fields', async () => {
      const fullCategory: Category = {
        uuid: 'category-456',
        name: 'Full Category',
        slug: 'full-category',
        description: 'Full description',
        parents: [
          {
            uuid: 'parent-1',
            name: 'Parent Category',
            slug: 'parent-category',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
        children: [
          {
            uuid: 'child-1',
            name: 'Child Category',
            slug: 'child-category',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => fullCategory,
      });

      const result = await service.getCategoryByUuid('category-456');

      expect(result).toEqual(fullCategory);
      expect(result.uuid).toBe('category-456');
      expect(result.parents).toHaveLength(1);
      expect(result.children).toHaveLength(1);
    });

    it('should handle category with null description', async () => {
      const categoryWithNullDescription: Category = {
        uuid: 'category-789',
        name: 'Test Category',
        slug: 'test-category',
        description: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => categoryWithNullDescription,
      });

      const result = await service.getCategoryByUuid('category-789');

      expect(result.description).toBeNull();
    });

    it('should throw error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(service.getCategoryByUuid('non-existent-uuid')).rejects.toThrow(
        '[GetCategoryByUuidService] GET https://api.ekapak.ru/api/categories/non-existent-uuid: 404 Not Found'
      );
    });

    it('should handle empty UUID', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategory,
      });

      await service.getCategoryByUuid('');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/categories',
        expect.any(Object)
      );
    });

    it('should handle UUID with dashes', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategory,
      });

      const uuidWithDashes = '550e8400-e29b-41d4-a716-446655440000';
      await service.getCategoryByUuid(uuidWithDashes);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.ekapak.ru/api/categories/${uuidWithDashes}`,
        expect.any(Object)
      );
    });
  });
});
